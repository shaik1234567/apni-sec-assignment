import { NextRequest } from 'next/server';
import { UserHandler } from '@/backend/handlers/UserHandler';

const userHandler = new UserHandler();

export async function GET(request: NextRequest) {
  return userHandler.getProfile(request);
}

export async function PUT(request: NextRequest) {
  return userHandler.updateProfile(request);
}