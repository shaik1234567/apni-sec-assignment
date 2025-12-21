import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RateLimitMiddleware } from '../middlewares/RateLimitMiddleware';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';

export class HealthHandler {
  private rateLimitMiddleware: RateLimitMiddleware;

  constructor() {
    this.rateLimitMiddleware = new RateLimitMiddleware();
  }

  public async checkHealth(request: NextRequest): Promise<NextResponse> {
    try {
      // Apply lenient rate limiting for health checks
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'health');
      
      // Test database connection
      await connectDB();
      
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        rateLimit: {
          limit: rateLimitResult.headers['X-RateLimit-Limit'],
          remaining: rateLimitResult.headers['X-RateLimit-Remaining'],
          reset: rateLimitResult.headers['X-RateLimit-Reset']
        }
      };
      
      const response = ApiResponse.success('System is healthy', healthData);
      const nextResponse = NextResponse.json(response);
      
      // Add rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        nextResponse.headers.set(key, value);
      });
      
      return nextResponse;
      
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): NextResponse {
    if (error instanceof ApiError) {
      const response = ApiResponse.error(error.message);
      const nextResponse = NextResponse.json(response, { status: error.statusCode });
      
      // Add rate limit headers from error info if available
      if (error.statusCode === 429 && (error as any).rateLimitInfo) {
        const rateLimitInfo = (error as any).rateLimitInfo;
        nextResponse.headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString());
        nextResponse.headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
        nextResponse.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitInfo.resetTime / 1000).toString());
        if (rateLimitInfo.retryAfter) {
          nextResponse.headers.set('Retry-After', rateLimitInfo.retryAfter.toString());
        }
      }
      
      return nextResponse;
    }

    console.error('Health check error:', error);
    
    // Database connection failed or other system error
    const healthData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Database connection failed',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    const response = ApiResponse.error('System is unhealthy', JSON.stringify(healthData));
    return NextResponse.json({
      success: false,
      message: 'System is unhealthy',
      data: healthData
    }, { status: 503 });
  }
}