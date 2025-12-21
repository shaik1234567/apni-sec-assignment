import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/AuthService';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { RateLimitMiddleware } from '../middlewares/RateLimitMiddleware';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';

export class AuthHandler {
  private authService: AuthService;
  private authMiddleware: AuthMiddleware;
  private rateLimitMiddleware: RateLimitMiddleware;

  constructor() {
    this.authService = new AuthService();
    this.authMiddleware = new AuthMiddleware();
    this.rateLimitMiddleware = new RateLimitMiddleware();
  }

  public async register(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'auth/register');
      const body = await request.json();
      
      const result = await this.authService.register(body);
      const response = ApiResponse.success('User registered successfully', result);
      
      const nextResponse = NextResponse.json(response, { status: 201 });
      
      // Set rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        nextResponse.headers.set(key, value);
      });

      // Set auth cookie
      nextResponse.cookies.set('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return nextResponse;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async login(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'auth/login');
      const body = await request.json();
      
      const result = await this.authService.login(body);
      const response = ApiResponse.success('Login successful', result);
      
      const nextResponse = NextResponse.json(response);
      
      // Set rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        nextResponse.headers.set(key, value);
      });

      // Set auth cookie
      nextResponse.cookies.set('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return nextResponse;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async logout(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'auth/logout');
      const response = ApiResponse.success('Logout successful');
      const nextResponse = NextResponse.json(response);
      
      // Set rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        nextResponse.headers.set(key, value);
      });
      
      // Clear auth cookie
      nextResponse.cookies.delete('auth-token');
      
      return nextResponse;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async me(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'auth/me');
      const auth = await this.authMiddleware.authenticate(request);
      
      const response = ApiResponse.success('User data retrieved', {
        userId: auth.userId,
        email: auth.email
      });
      
      const nextResponse = NextResponse.json(response);
      
      // Set rate limit headers
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
      return NextResponse.json(response, { status: error.statusCode });
    }

    console.error('Unexpected error:', error);
    const response = ApiResponse.error('Internal server error');
    return NextResponse.json(response, { status: 500 });
  }
}