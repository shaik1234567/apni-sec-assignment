import { z } from 'zod';
import { ValidationError } from '../errors/ValidationError';

export class AuthValidator {
  private registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  });

  private loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  });

  public validateRegister(data: any): void {
    try {
      this.registerSchema.parse(data);
    } catch (error: any) {
      throw new ValidationError(error.errors[0]?.message || 'Validation failed');
    }
  }

  public validateLogin(data: any): void {
    try {
      this.loginSchema.parse(data);
    } catch (error: any) {
      throw new ValidationError(error.errors[0]?.message || 'Validation failed');
    }
  }
}