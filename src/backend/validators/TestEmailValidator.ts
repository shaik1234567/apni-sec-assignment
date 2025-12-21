import { z } from 'zod';
import { ValidationError } from '../errors/ValidationError';

const testEmailSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  type: z.enum(['welcome', 'issue', 'profile'], {
    errorMap: () => ({ message: 'Email type must be one of: welcome, issue, profile' })
  })
});

export class TestEmailValidator {
  public validateTestEmail(data: any): void {
    try {
      testEmailSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(err => err.message).join(', ');
        throw new ValidationError(messages);
      }
      throw error;
    }
  }
}