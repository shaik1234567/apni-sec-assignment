import { ApiError } from './ApiError';

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}