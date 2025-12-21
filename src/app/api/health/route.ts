import { NextRequest } from 'next/server';
import { HealthHandler } from '@/backend/handlers/HealthHandler';

const healthHandler = new HealthHandler();

export async function GET(request: NextRequest) {
  return healthHandler.checkHealth(request);
}