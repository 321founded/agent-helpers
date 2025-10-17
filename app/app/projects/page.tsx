'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ClaudeProject } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ClaudeProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setSearching(true);
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setMessage('Failed to discover projects');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSelectProject = async (claudePath: string) => {
    setMessage('');
    try {
      const response = await fetch('/api/projects/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claudePath }),
      });

      if (response.ok) {
        setMessage('✓ Project selected successfully. Redirecting...');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage('✗ Failed to select project');
      }
    } catch (error) {
      console.error('Failed to select project:', error);
      setMessage('✗ Failed to select project');
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  const getTotalCustomizations = (counts: ClaudeProject['customizationCounts']) => {
    return counts.skills + counts.commands + counts.agents + counts.outputStyles;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Discovering Claude Code projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to home
        </Link>

        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Claude Code Projects
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover and switch between projects with .claude directories
              </p>
            </div>
            <button
              onClick={fetchProjects}
              disabled={searching}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
            >
              {searching ? 'Searching...' : '🔍 Refresh'}
            </button>
          </div>
        </header>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.startsWith('✓')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }`}
          >
            {message}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No Claude Code projects found.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Searched in: ~/,  /data/dev, ~/projects, ~/workspace, ~/code
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, index) => {
              const totalCustomizations = getTotalCustomizations(project.customizationCounts);
              const isHomeProject = project.path.includes(require('os').homedir()) &&
                                    project.name === 'Home (~/.claude)';

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {project.name}
                        </h2>
                        {isHomeProject && (
                          <span className="px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            User Level
                          </span>
                        )}
                        {project.hasSettings && (
                          <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                            Has Settings
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-mono">
                        {project.path}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                        Last modified: {formatDate(project.lastModified)}
                      </p>

                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Skills:
                          </span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">
                            {project.customizationCounts.skills}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Commands:
                          </span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">
                            {project.customizationCounts.commands}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Agents:
                          </span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">
                            {project.customizationCounts.agents}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Output Styles:
                          </span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">
                            {project.customizationCounts.outputStyles}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectProject(project.claudePath)}
                      className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors whitespace-nowrap"
                    >
                      Select Project
                    </button>
                  </div>

                  {totalCustomizations > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total customizations: <strong>{totalCustomizations}</strong>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> Selecting a project will update your configuration to point to
            that project&apos;s .claude directory. All customization paths will be updated automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
