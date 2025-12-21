import bcrypt from 'bcryptjs';

export class PasswordService {
  private static readonly SALT_ROUNDS = 12;

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordService.SALT_ROUNDS);
  }

  public async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}