import { getSkill } from '@/lib/skills-manager';
import { getConfig } from '@/lib/config';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SkillActions from '../../../components/SkillActions';
import path from 'path';

export default async function SkillPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  // Try to get skill from repo first
  let skill = await getSkill(name, false);
  let isLocal = false;

  // If not found in repo, try local
  if (!skill) {
    skill = await getSkill(name, true);
    isLocal = true;
  }

  if (!skill) {
    notFound();
  }

  // Check if skill is actually in local directory
  if (!isLocal) {
    const config = await getConfig();
    const localPath = config.localSkillsPath.replace('~', require('os').homedir());
    const localSkillPath = path.join(localPath, name);

    try {
      await require('fs').promises.access(localSkillPath);
      isLocal = true;
    } catch {
      // Skill is only in repo
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to skills
        </Link>

        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {skill.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {skill.description}
              </p>
            </div>
            {isLocal && (
              <span className="px-3 py-1 text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Installed
              </span>
            )}
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
              {skill.content}
            </pre>
          </div>

          {/* Show actions only for local skills */}
          <SkillActions skillName={name} isLocal={isLocal} />
        </div>
      </div>
    </div>
  );
}
