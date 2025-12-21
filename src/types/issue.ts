export enum IssueType {
  CLOUD_SECURITY = 'Cloud Security',
  RETEAM_ASSESSMENT = 'Reteam Assessment',
  VAPT = 'VAPT'
}

export interface IIssue {
  _id: string;
  id?: string; // For frontend compatibility
  title: string;
  description: string;
  type: IssueType;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  type: IssueType;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: 'open' | 'in-progress' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}