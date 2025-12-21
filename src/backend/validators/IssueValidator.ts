import { z } from 'zod';
import { IssueType } from '@/types/issue';
import { ValidationError } from '../errors/ValidationError';

export class IssueValidator {
  private createIssueSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description cannot exceed 1000 characters'),
    type: z.nativeEnum(IssueType, { errorMap: () => ({ message: 'Invalid issue type' }) }),
    priority: z.enum(['low', 'medium', 'high', 'critical'], { errorMap: () => ({ message: 'Invalid priority' }) })
  });

  private updateIssueSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description cannot exceed 1000 characters').optional(),
    type: z.nativeEnum(IssueType, { errorMap: () => ({ message: 'Invalid issue type' }) }).optional(),
    status: z.enum(['open', 'in-progress', 'closed'], { errorMap: () => ({ message: 'Invalid status' }) }).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical'], { errorMap: () => ({ message: 'Invalid priority' }) }).optional()
  });

  public validateCreateIssue(data: any): void {
    try {
      this.createIssueSchema.parse(data);
    } catch (error: any) {
      throw new ValidationError(error.errors[0]?.message || 'Validation failed');
    }
  }

  public validateUpdateIssue(data: any): void {
    try {
      this.updateIssueSchema.parse(data);
    } catch (error: any) {
      throw new ValidationError(error.errors[0]?.message || 'Validation failed');
    }
  }
}