import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/UserService';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { RateLimitMiddleware } from '../middlewares/RateLimitMiddleware';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';

export class UserHandler {
  private userService: UserService;
  private authMiddleware: AuthMiddleware;
  private rateLimitMiddleware: RateLimitMiddleware;

  constructor() {
    this.userService = new UserService();
    this.authMiddleware = new AuthMiddleware();
    this.rateLimitMiddleware = new RateLimitMiddleware();
  }

  public async getProfile(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'users/profile');
      const auth = await this.authMiddleware.authenticate(request);
      
      const profile = await this.userService.getProfile(auth.userId);
      const response = ApiResponse.success('Profile retrieved successfully', profile);
      
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

  public async updateProfile(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'users/profile');
      const auth = await this.authMiddleware.authenticate(request);
      const body = await request.json();
      
      const updatedProfile = await this.userService.updateProfile(auth.userId, body);
      const response = ApiResponse.success('Profile updated successfully', updatedProfile);
      
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