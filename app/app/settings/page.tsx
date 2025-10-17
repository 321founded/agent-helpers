'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Config } from '@/lib/types';

export default function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to load config:', error);
      setMessage('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage('✓ Configuration saved successfully');
      } else {
        setMessage('✗ Failed to save configuration');
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      setMessage('✗ Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-600">Failed to load configuration</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to home
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Configure your local environment
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Claude Code Base Path
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base Path to .claude Directory
            </label>
            <input
              type="text"
              value={config.claudeBasePath}
              onChange={(e) =>
                setConfig({ ...config, claudeBasePath: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="/home/user/.claude"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Base path to your Claude Code directory. Use{' '}
              <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline">
                Projects page
              </Link>{' '}
              to discover and switch projects.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
            Local Paths (Auto-configured from Base Path)
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Local Skills Path
            </label>
            <input
              type="text"
              value={config.localSkillsPath}
              onChange={(e) =>
                setConfig({ ...config, localSkillsPath: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="/home/user/.claude/skills"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Path to your local Claude Code skills directory
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Local Commands Path
            </label>
            <input
              type="text"
              value={config.localCommandsPath}
              onChange={(e) =>
                setConfig({ ...config, localCommandsPath: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="/home/user/.claude/commands"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Path to your local Claude Code commands directory
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Local Agents Path
            </label>
            <input
              type="text"
              value={config.localAgentsPath}
              onChange={(e) =>
                setConfig({ ...config, localAgentsPath: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="/home/user/.claude/agents"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Path to your local Claude Code agents directory
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Local Output Styles Path
            </label>
            <input
              type="text"
              value={config.localOutputStylesPath}
              onChange={(e) =>
                setConfig({ ...config, localOutputStylesPath: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="/home/user/.claude/output-styles"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Path to your local Claude Code output styles directory
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
            Git Repository
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Git Repository URL
            </label>
            <input
              type="text"
              value={config.gitRepoUrl}
              onChange={(e) =>
                setConfig({ ...config, gitRepoUrl: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/you/agent-helpers"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Git repository for customizations library (for future sync)
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.autoSync}
                onChange={(e) =>
                  setConfig({ ...config, autoSync: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-sync on startup
              </span>
            </label>
            <p className="mt-1 ml-6 text-sm text-gray-500 dark:text-gray-400">
              Automatically pull latest skills from repository (coming soon)
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
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
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={fetchConfig}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> Configuration is stored in{' '}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">
              ~/.config/agent-helpers/config.json
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
