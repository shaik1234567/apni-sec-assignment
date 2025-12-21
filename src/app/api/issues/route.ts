import { NextRequest } from 'next/server';
import { IssueHandler } from '@/backend/handlers/IssueHandler';

const issueHandler = new IssueHandler();

export async function GET(request: NextRequest) {
  return issueHandler.getIssues(request);
}

export async function POST(request: NextRequest) {
  return issueHandler.createIssue(request);
}