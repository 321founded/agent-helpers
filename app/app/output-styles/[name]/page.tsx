import { getOutputStyle } from '@/lib/customization-manager';
import { getConfig } from '@/lib/config';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CustomizationActions from '../../../components/CustomizationActions';
import path from 'path';

export default async function OutputStylePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  // Try to get output style from repo first
  let style = await getOutputStyle(name, false);
  let isLocal = false;

  // If not found in repo, try local
  if (!style) {
    style = await getOutputStyle(name, true);
    isLocal = true;
  }

  if (!style) {
    notFound();
  }

  // Check if style is actually in local directory
  if (!isLocal) {
    const config = await getConfig();
    const localPath = config.localOutputStylesPath.replace('~', require('os').homedir());
    const localStylePath = path.join(localPath, `${name}.md`);

    try {
      await require('fs').promises.access(localStylePath);
      isLocal = true;
    } catch {
      // Style is only in repo
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to customizations
        </Link>

        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {style.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {style.description}
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
              {style.content}
            </pre>
          </div>

          {/* Show actions only for local styles */}
          <CustomizationActions
            name={name}
            type="output-style"
            isLocal={isLocal}
          />
        </div>
      </div>
    </div>
  );
}
