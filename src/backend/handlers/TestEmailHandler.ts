import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '../services/EmailService';
import { RateLimitMiddleware } from '../middlewares/RateLimitMiddleware';
import { TestEmailValidator } from '../validators/TestEmailValidator';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';

export class TestEmailHandler {
  private emailService: EmailService;
  private rateLimitMiddleware: RateLimitMiddleware;
  private testEmailValidator: TestEmailValidator;

  constructor() {
    this.emailService = new EmailService();
    this.rateLimitMiddleware = new RateLimitMiddleware();
    this.testEmailValidator = new TestEmailValidator();
  }

  public async sendTestEmail(request: NextRequest): Promise<NextResponse> {
    try {
      // Apply strict rate limiting for test emails
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'test-email');
      
      const body = await request.json();
      
      // Input validation using validator class
      this.testEmailValidator.validateTestEmail(body);
      
      const { email, type } = body;

      // Send email based on type
      switch (type) {
        case 'welcome':
          await this.emailService.sendWelcomeEmail(email, 'Test User');
          break;
        case 'issue':
          await this.emailService.sendIssueCreatedEmail(
            email, 
            'Test Security Issue', 
            'Cloud Security', 
            'This is a test issue description to verify email functionality is working correctly.',
            'high'
          );
          break;
        case 'profile':
          await this.emailService.sendProfileUpdateEmail(email, 'Test User');
          break;
      }

      const response = ApiResponse.success(`${type} email sent successfully to ${email}`, {
        email,
        type,
        timestamp: new Date().toISOString()
      });
      
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

    console.error('Unexpected error in TestEmailHandler:', error);
    const response = ApiResponse.error('Internal server error');
    return NextResponse.json(response, { status: 500 });
  }
}