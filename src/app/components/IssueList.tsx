'use client';

import { useState } from 'react';
import { IIssue } from '@/types/issue';

interface IssueListProps {
  issues: IIssue[];
  onEdit: (issue: IIssue) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function IssueList({ issues, onEdit, onDelete }: IssueListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this issue?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
        <p className="text-gray-500">Create your first issue to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => {
        const issueId = issue.id || issue._id;
        return (
          <div key={issueId} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {issue.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {issue.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                    {issue.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {issue.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Created: {new Date(issue.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(issue)}
                  className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(issueId)}
                  disabled={deletingId === issueId}
                  className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                >
                  {deletingId === issueId ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}