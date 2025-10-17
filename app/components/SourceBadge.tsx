import type { BaseCustomization } from '@/lib/types';

interface SourceBadgeProps {
  source?: 'base' | 'org' | 'personal';
}

export default function SourceBadge({ source }: SourceBadgeProps) {
  if (!source) return null;

  const badgeConfig = {
    base: {
      label: 'Base',
      className: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    },
    org: {
      label: 'Org',
      className: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    },
    personal: {
      label: 'Personal',
      className: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    },
  };

  const config = badgeConfig[source];

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${config.className}`}>
      {config.label}
    </span>
  );
}
