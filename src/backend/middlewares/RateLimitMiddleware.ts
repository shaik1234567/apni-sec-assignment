import { NextRequest } from 'next/server';
import { RateLimiter } from '../rate-limit/RateLimiter';
import { ApiError } from '../errors/ApiError';

export class RateLimitMiddleware {
  private rateLimiter: RateLimiter;

  constructor() {
    this.rateLimiter = RateLimiter.getInstance();
  }

  /**
   * Check rate limit and return headers
   * @param request - Next.js request object
   * @param endpoint - Optional endpoint path for specific limits
   * @returns Rate limit check result with headers
   */
  public checkRateLimit(request: NextRequest, endpoint?: string): { allowed: boolean; headers: Record<string, string> } {
    const identifier = this.getIdentifier(request);
    const endpointPath = endpoint || this.extractEndpointFromRequest(request);
    
    console.log(`🛡️ Rate limit check for ${identifier} on endpoint: ${endpointPath}`);
    
    const result = this.rateLimiter.checkLimit(identifier, endpointPath);

    // Prepare standard rate limit headers
    const headers: Record<string, string> = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
      'X-RateLimit-Policy': `${result.limit};w=900`, // 900 seconds = 15 minutes
    };

    // Add retry-after header if rate limited
    if (!result.allowed && result.retryAfter) {
      headers['Retry-After'] = result.retryAfter.toString();
      headers['X-RateLimit-Reset-Time'] = new Date(result.resetTime).toISOString();
    }

    if (!result.allowed) {
      console.log(`❌ Rate limit exceeded for ${identifier} on ${endpointPath}. Retry after ${result.retryAfter}s`);
      
      const error = new ApiError(
        `Rate limit exceeded. Too many requests. Please try again in ${result.retryAfter} seconds.`,
        429
      );
      
      // Add rate limit info to error for better debugging
      (error as any).rateLimitInfo = {
        limit: result.limit,
        remaining: result.remaining,
        resetTime: result.resetTime,
        retryAfter: result.retryAfter,
        endpoint: endpointPath
      };
      
      throw error;
    }

    console.log(`✅ Rate limit check passed for ${identifier}. Remaining: ${result.remaining}/${result.limit}`);
    
    return { allowed: true, headers };
  }

  /**
   * Get unique identifier for rate limiting
   * Priority: User ID > IP Address > Fallback
   * @param request - Next.js request object
   * @returns Unique identifier string
   */
  private getIdentifier(request: NextRequest): string {
    // Try to get user ID from JWT token (if available)
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        // Simple JWT decode (just for user ID extraction, not verification)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (payload.userId) {
          return `user:${payload.userId}`;
        }
      } catch (error) {
        // If JWT parsing fails, fall back to IP
        console.log('Failed to extract user ID from JWT, using IP address');
      }
    }

    // Fall back to IP address
    const ip = this.getClientIP(request);
    return `ip:${ip}`;
  }

  /**
   * Extract client IP address from request headers
   * @param request - Next.js request object
   * @returns Client IP address
   */
  private getClientIP(request: NextRequest): string {
    // Check various headers for the real IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
    const xClientIp = request.headers.get('x-client-ip');
    const xForwardedFor = request.headers.get('x-forwarded-for');
    
    // Priority order for IP detection
    let ip = cfConnectingIp || 
             realIp || 
             xClientIp || 
             (forwarded?.split(',')[0]?.trim()) ||
             (xForwardedFor?.split(',')[0]?.trim()) ||
             'unknown';

    // Clean up the IP (remove port if present)
    ip = ip.split(':')[0];
    
    return ip || 'unknown';
  }

  /**
   * Extract endpoint path from request URL
   * @param request - Next.js request object
   * @returns Endpoint path
   */
  private extractEndpointFromRequest(request: NextRequest): string {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Remove /api prefix if present
    if (pathname.startsWith('/api/')) {
      pathname = pathname.substring(5);
    }
    
    // Handle dynamic routes (replace [id] with placeholder)
    pathname = pathname.replace(/\/[^\/]+$/g, (match) => {
      // If it looks like an ID (UUID, ObjectId, or number), replace with [id]
      if (/^\/[a-f0-9]{24}$|^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^\/\d+$/.test(match)) {
        return '/[id]';
      }
      return match;
    });
    
    return pathname.replace(/^\/+|\/+$/g, '') || 'root';
  }

  /**
   * Reset rate limit for specific identifier
   * @param request - Next.js request object
   * @param endpoint - Optional endpoint
   */
  public resetRateLimit(request: NextRequest, endpoint?: string): void {
    const identifier = this.getIdentifier(request);
    const endpointPath = endpoint || this.extractEndpointFromRequest(request);
    
    this.rateLimiter.reset(identifier, endpointPath);
    console.log(`🔄 Rate limit reset for ${identifier} on ${endpointPath}`);
  }

  /**
   * Get current rate limit stats for debugging
   * @param request - Next.js request object
   * @param endpoint - Optional endpoint
   * @returns Current stats or null
   */
  public getStats(request: NextRequest, endpoint?: string): any {
    const identifier = this.getIdentifier(request);
    const endpointPath = endpoint || this.extractEndpointFromRequest(request);
    
    return this.rateLimiter.getStats(identifier, endpointPath);
  }

  /**
   * Create rate limit middleware for specific endpoint
   * @param endpoint - Endpoint path
   * @param maxRequests - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Middleware function
   */
  public static createEndpointMiddleware(endpoint: string, maxRequests: number, windowMs: number = 15 * 60 * 1000) {
    const rateLimiter = RateLimiter.getInstance();
    rateLimiter.setEndpointConfig(endpoint, { maxRequests, windowMs });
    
    return (request: NextRequest) => {
      const middleware = new RateLimitMiddleware();
      return middleware.checkRateLimit(request, endpoint);
    };
  }
}