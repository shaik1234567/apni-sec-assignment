import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '@/types/auth';
import { AuthError } from '../errors/AuthError';

export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'fallback-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  public generateToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
  }

  public verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new AuthError('Invalid or expired token');
    }
  }

  public decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}