import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from './PasswordService';
import { JwtService } from './JwtService';
import { EmailService } from './EmailService';
import { AuthValidator } from '../validators/AuthValidator';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';
import { AuthError } from '../errors/AuthError';
import { ValidationError } from '../errors/ValidationError';

export class AuthService {
  private userRepository: UserRepository;
  private passwordService: PasswordService;
  private jwtService: JwtService;
  private emailService: EmailService;
  private authValidator: AuthValidator;

  constructor() {
    this.userRepository = new UserRepository();
    this.passwordService = new PasswordService();
    this.jwtService = new JwtService();
    this.emailService = new EmailService(); // Will throw error if RESEND_API_KEY is missing
    this.authValidator = new AuthValidator();
  }

  public async register(data: RegisterRequest): Promise<AuthResponse> {
    this.authValidator.validateRegister(data);

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hash(data.password);
    
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);

    const token = this.jwtService.generateToken({
      userId: user._id.toString(),
      email: user.email
    });

    // Send welcome email using real Resend service
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.name);
    } catch (emailError: any) {
      console.error('Failed to send welcome email:', emailError.message);
      // Note: We don't throw here to avoid blocking registration, but log the error
    }

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    };
  }

  public async login(data: LoginRequest): Promise<AuthResponse> {
    this.authValidator.validateLogin(data);

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AuthError('Invalid email or password');
    }

    const isPasswordValid = await this.passwordService.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid email or password');
    }

    const token = this.jwtService.generateToken({
      userId: user._id.toString(),
      email: user.email
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    };
  }

  public async verifyToken(token: string): Promise<{ userId: string; email: string }> {
    const payload = this.jwtService.verifyToken(token);
    return {
      userId: payload.userId,
      email: payload.email
    };
  }
}