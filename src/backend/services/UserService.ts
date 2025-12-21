import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from './PasswordService';
import { EmailService } from './EmailService';
import { UserValidator } from '../validators/UserValidator';
import { UpdateProfileRequest, UserResponse } from '@/types/user';
import { ValidationError } from '../errors/ValidationError';
import { ApiError } from '../errors/ApiError';

export class UserService {
  private userRepository: UserRepository;
  private passwordService: PasswordService;
  private emailService: EmailService;
  private userValidator: UserValidator;

  constructor() {
    this.userRepository = new UserRepository();
    this.passwordService = new PasswordService();
    this.emailService = new EmailService(); // Will throw error if RESEND_API_KEY is missing
    this.userValidator = new UserValidator();
  }

  public async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  public async updateProfile(userId: string, data: UpdateProfileRequest): Promise<UserResponse> {
    this.userValidator.validateUpdateProfile(data);

    if (Object.keys(data).length === 0) {
      throw new ValidationError('At least one field must be provided for update');
    }

    // Check if email is being changed and if it already exists
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ValidationError('Email is already in use by another user');
      }
    }

    // Hash password if provided
    if (data.password) {
      data.password = await this.passwordService.hash(data.password);
    }

    const updatedUser = await this.userRepository.updateById(userId, data);
    if (!updatedUser) {
      throw new ApiError('User not found', 404);
    }

    // Send profile update email using real Resend service
    try {
      await this.emailService.sendProfileUpdateEmail(updatedUser.email, updatedUser.name);
    } catch (emailError: any) {
      console.error('Failed to send profile update email:', emailError.message);
      // Note: We don't throw here to avoid blocking profile update, but log the error
    }

    return {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  }
}