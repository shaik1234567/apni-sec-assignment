'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { IIssue } from '@/types/issue';
import IssueForm from '../components/IssueForm';
import IssueList from '../components/IssueList';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';

export default function DashboardPage() {
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<IIssue | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchIssues();
  }, [user, router]);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/issues', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setIssues(data.data.issues);
      } else {
        setError(data.message || 'Failed to fetch issues');
      }
    } catch (err: any) {
      setError('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (issueData: any) => {
    const token = localStorage.getItem('auth-token');
    const response = await fetch('/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(issueData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create issue');
    }

    setIssues((prev: IIssue[]) => [data.data, ...prev]);
    setShowForm(false);
  };

  const handleUpdateIssue = async (issueData: any) => {
    if (!editingIssue) return;

    const issueId = editingIssue.id || editingIssue._id;
    const token = localStorage.getItem('auth-token');
    const response = await fetch(`/api/issues/${issueId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(issueData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update issue');
    }

    setIssues((prev: IIssue[]) => prev.map((issue: IIssue) => {
      const currentIssueId = issue.id || issue._id;
      const editingIssueId = editingIssue.id || editingIssue._id;
      return currentIssueId === editingIssueId ? data.data : issue;
    }));
    setEditingIssue(null);
  };

  const handleDeleteIssue = async (id: string) => {
    const token = localStorage.getItem('auth-token');
    const response = await fetch(`/api/issues/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete issue');
    }

    setIssues((prev: IIssue[]) => prev.filter((issue: IIssue) => {
      const issueId = issue.id || issue._id;
      return issueId !== id;
    }));
  };

  const handleEditIssue = (issue: IIssue) => {
    setEditingIssue(issue);
    setShowForm(false);
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Manage your security issues and track their progress.
        </p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Issues ({issues.length})
        </h2>
        <div className="space-x-2">
          {editingIssue && (
            <button
              onClick={() => setEditingIssue(null)}
              className="btn-secondary"
            >
              Cancel Edit
            </button>
          )}
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingIssue(null);
            }}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'Create Issue'}
          </button>
        </div>
      </div>

      {(showForm || editingIssue) && (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {editingIssue ? 'Edit Issue' : 'Create New Issue'}
          </h3>
          <IssueForm
            onSubmit={editingIssue ? handleUpdateIssue : handleCreateIssue}
            initialData={editingIssue}
            isEditing={!!editingIssue}
          />
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <IssueList
          issues={issues}
          onEdit={handleEditIssue}
          onDelete={handleDeleteIssue}
        />
      )}
    </div>
  );
}