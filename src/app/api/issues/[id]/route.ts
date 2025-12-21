import { NextRequest } from 'next/server';
import { IssueHandler } from '@/backend/handlers/IssueHandler';

const issueHandler = new IssueHandler();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return issueHandler.getIssueById(request, { params });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return issueHandler.updateIssue(request, { params });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return issueHandler.deleteIssue(request, { params });
}