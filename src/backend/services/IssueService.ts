import { IssueRepository } from '../repositories/IssueRepository';
import { UserRepository } from '../repositories/UserRepository';
import { EmailService } from './EmailService';
import { IssueValidator } from '../validators/IssueValidator';
import { CreateIssueRequest, UpdateIssueRequest, IIssue } from '@/types/issue';
import { ApiError } from '../errors/ApiError';

export class IssueService {
  private issueRepository: IssueRepository;
  private userRepository: UserRepository;
  private emailService: EmailService;
  private issueValidator: IssueValidator;

  constructor() {
    this.issueRepository = new IssueRepository();
    this.userRepository = new UserRepository();
    this.emailService = new EmailService(); // Will throw error if RESEND_API_KEY is missing
    this.issueValidator = new IssueValidator();
  }

  public async createIssue(userId: string, data: CreateIssueRequest): Promise<any> {
    this.issueValidator.validateCreateIssue(data);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const issue = await this.issueRepository.create({
      ...data,
      userId
    });

    // Send issue created email using real Resend service
    try {
      await this.emailService.sendIssueCreatedEmail(
        user.email, 
        issue.title, 
        issue.type, 
        issue.description, 
        issue.priority
      );
    } catch (emailError: any) {
      console.error('Failed to send issue created email:', emailError.message);
      // Note: We don't throw here to avoid blocking issue creation, but log the error
    }

    return issue;
  }

  public async getIssues(userId: string, page: number = 1, limit: number = 10): Promise<{ issues: any[]; total: number; page: number; totalPages: number }> {
    const { issues, total } = await this.issueRepository.findByUserId(userId, page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      issues,
      total,
      page,
      totalPages
    };
  }

  public async getIssueById(issueId: string, userId: string): Promise<any> {
    const issue = await this.issueRepository.findByIdAndUserId(issueId, userId);
    if (!issue) {
      throw new ApiError('Issue not found', 404);
    }

    return issue;
  }

  public async updateIssue(issueId: string, userId: string, data: UpdateIssueRequest): Promise<any> {
    this.issueValidator.validateUpdateIssue(data);

    if (Object.keys(data).length === 0) {
      throw new ApiError('At least one field must be provided for update', 400);
    }

    // Check if issue exists and belongs to user
    const existingIssue = await this.issueRepository.findByIdAndUserId(issueId, userId);
    if (!existingIssue) {
      throw new ApiError('Issue not found', 404);
    }

    const updatedIssue = await this.issueRepository.updateById(issueId, data);
    if (!updatedIssue) {
      throw new ApiError('Failed to update issue', 500);
    }

    return updatedIssue;
  }

  public async deleteIssue(issueId: string, userId: string): Promise<void> {
    // Check if issue exists and belongs to user
    const existingIssue = await this.issueRepository.findByIdAndUserId(issueId, userId);
    if (!existingIssue) {
      throw new ApiError('Issue not found', 404);
    }

    const deleted = await this.issueRepository.deleteById(issueId);
    if (!deleted) {
      throw new ApiError('Failed to delete issue', 500);
    }
  }

  public async getAllIssues(page: number = 1, limit: number = 10): Promise<{ issues: any[]; total: number; page: number; totalPages: number }> {
    const { issues, total } = await this.issueRepository.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      issues,
      total,
      page,
      totalPages
    };
  }
}