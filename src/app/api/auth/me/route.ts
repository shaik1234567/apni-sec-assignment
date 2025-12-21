import { NextRequest } from 'next/server';
import { AuthHandler } from '@/backend/handlers/AuthHandler';

const authHandler = new AuthHandler();

export async function GET(request: NextRequest) {
  return authHandler.me(request);
}