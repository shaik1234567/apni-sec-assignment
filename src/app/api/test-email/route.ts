import { NextRequest } from 'next/server';
import { TestEmailHandler } from '@/backend/handlers/TestEmailHandler';

const testEmailHandler = new TestEmailHandler();

export async function POST(request: NextRequest) {
  return testEmailHandler.sendTestEmail(request);
}