import {
  listRepoSkills,
  listRepoCommands,
  listRepoAgents,
  listRepoOutputStyles,
} from '@/lib/customization-manager';
import Link from 'next/link';
import LocalSkillsSection from '../components/LocalSkillsSection';
import LocalCommandsSection from '../components/LocalCommandsSection';
import LocalAgentsSection from '../components/LocalAgentsSection';
import LocalOutputStylesSection from '../components/LocalOutputStylesSection';

export default async function Home() {
  const repoSkills = await listRepoSkills();
  const repoCommands = await listRepoCommands();
  const repoAgents = await listRepoAgents();
  const repoOutputStyles = await listRepoOutputStyles();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Agent Helpers
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Browse and manage your Claude Code customizations
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/projects"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              📁 Projects
            </Link>
            <Link
              href="/settings"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md font-medium transition-colors"
            >
              ⚙️ Settings
            </Link>
          </div>
        </header>

        {/* Skills */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Skills
          </h2>
          <LocalSkillsSection />
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                📚 Skills Library
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {repoSkills.length} available
              </span>
            </div>
            {repoSkills.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No skills found in the repository.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repoSkills.map((skill) => (
                  <Link
                    key={skill.name}
                    href={`/skills/${skill.name}`}
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                  >
                    {skill.source && (
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          skill.source === 'base'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : skill.source === 'org'
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {skill.source === 'base' ? 'Base' : skill.source === 'org' ? 'Org' : 'Personal'}
                        </span>
                      </div>
                    )}
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 pr-16">
                      {skill.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {skill.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Commands */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Commands
          </h2>
          <LocalCommandsSection />
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                📚 Commands Library
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {repoCommands.length} available
              </span>
            </div>
            {repoCommands.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No commands found in the repository.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repoCommands.map((command) => (
                  <Link
                    key={command.name}
                    href={`/commands/${command.name}`}
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      /{command.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {command.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Agents */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Agents
          </h2>
          <LocalAgentsSection />
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                📚 Agents Library
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {repoAgents.length} available
              </span>
            </div>
            {repoAgents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No agents found in the repository.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repoAgents.map((agent) => (
                  <Link
                    key={agent.name}
                    href={`/agents/${agent.name}`}
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {agent.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {agent.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Output Styles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Output Styles
          </h2>
          <LocalOutputStylesSection />
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                📚 Output Styles Library
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {repoOutputStyles.length} available
              </span>
            </div>
            {repoOutputStyles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No output styles found in the repository.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repoOutputStyles.map((style) => (
                  <Link
                    key={style.name}
                    href={`/output-styles/${style.name}`}
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {style.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {style.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
