'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SkillActionsProps {
  skillName: string;
  isLocal: boolean;
}

export default function SkillActions({ skillName, isLocal }: SkillActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  if (!isLocal) {
    return null; // Only show actions for local skills
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${skillName}"?`)) {
      return;
    }

    setDeleting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/skills/${skillName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('✓ Skill deleted successfully');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage('✗ Failed to delete skill');
      }
    } catch (error) {
      console.error('Failed to delete skill:', error);
      setMessage('✗ Failed to delete skill');
    } finally {
      setDeleting(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm(`Archive "${skillName}"? You can restore it later.`)) {
      return;
    }

    setArchiving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/skills/${skillName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' }),
      });

      if (response.ok) {
        setMessage('✓ Skill archived successfully');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage('✗ Failed to archive skill');
      }
    } catch (error) {
      console.error('Failed to archive skill:', error);
      setMessage('✗ Failed to archive skill');
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Actions
      </h3>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.startsWith('✓')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleArchive}
          disabled={archiving || deleting}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
        >
          {archiving ? 'Archiving...' : '📦 Archive'}
        </button>

        <button
          onClick={handleDelete}
          disabled={archiving || deleting}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
        >
          {deleting ? 'Deleting...' : '🗑️ Delete'}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <strong>Archive:</strong> Moves the skill to <code>.archived/</code> (can be restored)
        <br />
        <strong>Delete:</strong> Permanently removes the skill from disk
      </p>
    </div>
  );
}
