import { z } from 'zod';
import { ValidationError } from '../errors/ValidationError';

export class UserValidator {
  private updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional()
  });

  public validateUpdateProfile(data: any): void {
    try {
      this.updateProfileSchema.parse(data);
    } catch (error: any) {
      throw new ValidationError(error.errors[0]?.message || 'Validation failed');
    }
  }
}