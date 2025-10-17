'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Skill } from '@/lib/types';

export default function LocalSkillsSection() {
  const [localSkills, setLocalSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeployed, setIsDeployed] = useState(false);

  useEffect(() => {
    fetchLocalSkills();
    // Check if we're in a deployed environment
    setIsDeployed(typeof window !== 'undefined' && window.location.hostname !== 'localhost');
  }, []);

  const fetchLocalSkills = async () => {
    try {
      const response = await fetch('/api/skills/local');
      const data = await response.json();
      setLocalSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load local skills:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📂 Local Skills
        </h2>
        {!loading && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {localSkills.length} installed
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Loading local skills...
          </p>
        </div>
      ) : localSkills.length === 0 ? (
        <div className={`rounded-lg p-6 ${
          isDeployed
            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
        }`}>
          <p className={isDeployed ? 'text-blue-800 dark:text-blue-300' : 'text-yellow-800 dark:text-yellow-300'}>
            {isDeployed ? (
              <>
                💡 <strong>Run locally to manage your installed skills.</strong> This online version is a preview library to browse available customizations. Download and run the app locally to sync, install, and manage your Claude Code skills.
              </>
            ) : (
              <>
                No skills found in your local directory. Check your{' '}
                <Link href="/settings" className="underline">
                  settings
                </Link>{' '}
                to configure the correct path.
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localSkills.map((skill) => (
            <div
              key={skill.name}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-green-500 dark:border-green-600"
            >
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                  Installed
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 pr-20">
                {skill.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {skill.description}
              </p>
              <Link
                href={`/skills/${skill.name}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
