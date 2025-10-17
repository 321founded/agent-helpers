import { promises as fs } from 'fs';
import { homedir } from 'os';
import path from 'path';
import type { Config } from './types';

const CONFIG_DIR = path.join(homedir(), '.config', 'agent-helpers');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function getConfig(): Promise<Config> {
  try {
    const content = await fs.readFile(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(content);

    // Determine base path (either from config or default to home)
    const basePath = (config.claudeBasePath || path.join(homedir(), '.claude')).replace('~', homedir());

    // Provide defaults for any missing fields (for backwards compatibility)
    return {
      claudeBasePath: config.claudeBasePath || path.join(homedir(), '.claude'),
      localSkillsPath: config.localSkillsPath || path.join(basePath, 'skills'),
      localCommandsPath: config.localCommandsPath || path.join(basePath, 'commands'),
      localAgentsPath: config.localAgentsPath || path.join(basePath, 'agents'),
      localOutputStylesPath: config.localOutputStylesPath || path.join(basePath, 'output-styles'),
      gitRepoUrl: config.gitRepoUrl || 'https://github.com/you/agent-helpers',
      archivedSkills: config.archivedSkills || [],
      archivedCommands: config.archivedCommands || [],
      archivedAgents: config.archivedAgents || [],
      archivedOutputStyles: config.archivedOutputStyles || [],
      autoSync: config.autoSync || false,
      theme: config.theme || 'dark',
    };
  } catch (error) {
    // Return default config if file doesn't exist
    const defaultBasePath = path.join(homedir(), '.claude');
    return {
      claudeBasePath: defaultBasePath,
      localSkillsPath: path.join(defaultBasePath, 'skills'),
      localCommandsPath: path.join(defaultBasePath, 'commands'),
      localAgentsPath: path.join(defaultBasePath, 'agents'),
      localOutputStylesPath: path.join(defaultBasePath, 'output-styles'),
      gitRepoUrl: 'https://github.com/you/agent-helpers',
      archivedSkills: [],
      archivedCommands: [],
      archivedAgents: [],
      archivedOutputStyles: [],
      autoSync: false,
      theme: 'dark',
    };
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}
