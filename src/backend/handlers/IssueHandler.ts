import { NextRequest, NextResponse } from 'next/server';
import { IssueService } from '../services/IssueService';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { RateLimitMiddleware } from '../middlewares/RateLimitMiddleware';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../errors/ApiError';

export class IssueHandler {
  private issueService: IssueService;
  private authMiddleware: AuthMiddleware;
  private rateLimitMiddleware: RateLimitMiddleware;

  constructor() {
    this.issueService = new IssueService();
    this.authMiddleware = new AuthMiddleware();
    this.rateLimitMiddleware = new RateLimitMiddleware();
  }

  public async getIssues(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'issues');
      const auth = await this.authMiddleware.authenticate(request);
      
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      
      const result = await this.issueService.getIssues(auth.userId, page, limit);
      const response = ApiResponse.success('Issues retrieved successfully', result);
      
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

  public async createIssue(request: NextRequest): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'issues/create');
      const auth = await this.authMiddleware.authenticate(request);
      const body = await request.json();
      
      const issue = await this.issueService.createIssue(auth.userId, body);
      const response = ApiResponse.success('Issue created successfully', issue);
      
      const nextResponse = NextResponse.json(response, { status: 201 });
      
      // Set rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        nextResponse.headers.set(key, value);
      });

      return nextResponse;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async getIssueById(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'issues/[id]');
      const auth = await this.authMiddleware.authenticate(request);
      
      const issue = await this.issueService.getIssueById(params.id, auth.userId);
      const response = ApiResponse.success('Issue retrieved successfully', issue);
      
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

  public async updateIssue(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'issues/[id]');
      const auth = await this.authMiddleware.authenticate(request);
      const body = await request.json();
      
      const issue = await this.issueService.updateIssue(params.id, auth.userId, body);
      const response = ApiResponse.success('Issue updated successfully', issue);
      
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

  public async deleteIssue(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const rateLimitResult = this.rateLimitMiddleware.checkRateLimit(request, 'issues/[id]');
      const auth = await this.authMiddleware.authenticate(request);
      
      await this.issueService.deleteIssue(params.id, auth.userId);
      const response = ApiResponse.success('Issue deleted successfully');
      
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