import { NextRequest } from 'next/server';
import { JwtService } from '../services/JwtService';
import { AuthError } from '../errors/AuthError';

export class AuthMiddleware {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  public async authenticate(request: NextRequest): Promise<{ userId: string; email: string }> {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('Authorization token required');
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = this.jwtService.verifyToken(token);
      return {
        userId: payload.userId,
        email: payload.email
      };
    } catch (error) {
      throw new AuthError('Invalid or expired token');
    }
  }

  public extractTokenFromCookies(request: NextRequest): string | null {
    const token = request.cookies.get('auth-token')?.value;
    return token || null;
  }
}