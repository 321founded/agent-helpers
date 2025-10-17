'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CustomizationType } from '@/lib/types';

interface CustomizationActionsProps {
  name: string;
  type: CustomizationType;
  isLocal: boolean;
}

export default function CustomizationActions({
  name,
  type,
  isLocal,
}: CustomizationActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  if (!isLocal) {
    return null; // Only show actions for local customizations
  }

  const typeName = type === 'output-style' ? 'output style' : type;
  const apiPath = type === 'output-style' ? 'output-styles' : `${type}s`;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    setDeleting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/${apiPath}/${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(`✓ ${typeName.charAt(0).toUpperCase() + typeName.slice(1)} deleted successfully`);
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage(`✗ Failed to delete ${typeName}`);
      }
    } catch (error) {
      console.error(`Failed to delete ${typeName}:`, error);
      setMessage(`✗ Failed to delete ${typeName}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm(`Archive "${name}"? You can restore it later.`)) {
      return;
    }

    setArchiving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/${apiPath}/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' }),
      });

      if (response.ok) {
        setMessage(`✓ ${typeName.charAt(0).toUpperCase() + typeName.slice(1)} archived successfully`);
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage(`✗ Failed to archive ${typeName}`);
      }
    } catch (error) {
      console.error(`Failed to archive ${typeName}:`, error);
      setMessage(`✗ Failed to archive ${typeName}`);
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
        <strong>Archive:</strong> Moves the {typeName} to <code>.archived/</code> (can be restored)
        <br />
        <strong>Delete:</strong> Permanently removes the {typeName} from disk
      </p>
    </div>
  );
}
