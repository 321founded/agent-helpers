import { promises as fs } from 'fs';
import path from 'path';
import type {
  Skill,
  Command,
  Agent,
  OutputStyle,
  SkillMetadata,
  CommandMetadata,
  AgentMetadata,
  OutputStyleMetadata,
  Customization,
  CustomizationType,
  Settings,
} from './types';
import { getConfig } from './config';

const SKILLS_REPO_PATH = path.join(process.cwd(), '..', 'skills');
const COMMANDS_REPO_PATH = path.join(process.cwd(), '..', 'commands');
const AGENTS_REPO_PATH = path.join(process.cwd(), '..', 'agents');
const OUTPUT_STYLES_REPO_PATH = path.join(process.cwd(), '..', 'output-styles');

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): { metadata: Record<string, any>; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, body: content };
  }

  const frontmatter = match[1];
  const body = match[2];
  const metadata: Record<string, any> = {};

  // Parse YAML-like frontmatter
  const lines = frontmatter.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      metadata[key] = value;
    }
  }

  return { metadata, body };
}

/**
 * Parse SKILL.md frontmatter to extract metadata
 */
function parseSkillMetadata(content: string): SkillMetadata {
  const { metadata } = parseFrontmatter(content);

  return {
    name: metadata.name || 'Unknown',
    description: metadata.description || 'No description available',
  };
}

/**
 * Parse command .md file to extract metadata
 */
function parseCommandMetadata(content: string): CommandMetadata {
  const { metadata } = parseFrontmatter(content);

  return {
    name: metadata.name || 'Unknown',
    description: metadata.description || 'No description available',
    allowedTools: metadata['allowed-tools'],
    argumentHint: metadata['argument-hint'],
    model: metadata.model,
  };
}

/**
 * Parse agent .md file to extract metadata
 */
function parseAgentMetadata(content: string): AgentMetadata {
  const { metadata } = parseFrontmatter(content);

  return {
    name: metadata.name || 'Unknown',
    description: metadata.description || 'No description available',
    tools: metadata.tools ? metadata.tools.split(',').map((t: string) => t.trim()) : undefined,
    model: metadata.model,
  };
}

/**
 * Parse output style .md file to extract metadata
 */
function parseOutputStyleMetadata(content: string): OutputStyleMetadata {
  const { metadata } = parseFrontmatter(content);

  return {
    name: metadata.name || 'Unknown',
    description: metadata.description || 'No description available',
  };
}

/**
 * Determine if a path is a personal customization
 */
function isPersonalPath(filePath: string): boolean {
  const basename = path.basename(filePath);
  const dirname = path.dirname(filePath);

  // Check if filename ends with .personal.md
  if (basename.endsWith('.personal.md')) {
    return true;
  }

  // Check if in a personal/ subdirectory
  if (dirname.includes('/personal') || dirname.includes('\\personal')) {
    return true;
  }

  return false;
}

/**
 * Determine the source of a customization
 */
function getCustomizationSource(name: string, isLocal: boolean): 'base' | 'org' | 'personal' {
  if (isPersonalPath(name)) {
    return 'personal';
  }

  // Check if it has an organization prefix (e.g., 321-)
  if (/^[a-z0-9]+-/.test(name)) {
    return 'org';
  }

  return 'base';
}

/**
 * Read a single skill directory
 */
async function readSkill(skillPath: string, isLocal = false): Promise<Skill | null> {
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  try {
    const content = await fs.readFile(skillMdPath, 'utf-8');
    const metadata = parseSkillMetadata(content);
    const skillName = path.basename(skillPath);
    const isPersonal = isPersonalPath(skillPath);
    const source = getCustomizationSource(skillName, isLocal);

    return {
      type: 'skill',
      name: skillName,
      description: metadata.description,
      path: skillPath,
      content,
      isLocal,
      isArchived: false,
      isPersonal,
      isTemplate: !isLocal,
      source,
    };
  } catch (error) {
    // Silently return null for missing skills (expected behavior)
    return null;
  }
}

/**
 * Read a single command file
 */
async function readCommand(commandPath: string, isLocal = false): Promise<Command | null> {
  try {
    const content = await fs.readFile(commandPath, 'utf-8');
    const metadata = parseCommandMetadata(content);
    const commandName = path.basename(commandPath, '.md');
    const isPersonal = isPersonalPath(commandPath);
    const source = getCustomizationSource(commandName, isLocal);

    return {
      type: 'command',
      name: commandName,
      description: metadata.description,
      path: commandPath,
      content,
      isLocal,
      isArchived: false,
      isPersonal,
      isTemplate: !isLocal,
      source,
      allowedTools: metadata.allowedTools,
      argumentHint: metadata.argumentHint,
      model: metadata.model,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Read a single agent file
 */
async function readAgent(agentPath: string, isLocal = false): Promise<Agent | null> {
  try {
    const content = await fs.readFile(agentPath, 'utf-8');
    const { metadata, body } = parseFrontmatter(content);
    const agentMetadata = parseAgentMetadata(content);
    const agentName = path.basename(agentPath, '.md');
    const isPersonal = isPersonalPath(agentPath);
    const source = getCustomizationSource(agentName, isLocal);

    return {
      type: 'agent',
      name: agentName,
      description: agentMetadata.description,
      path: agentPath,
      content,
      prompt: body.trim(),
      isLocal,
      isArchived: false,
      isPersonal,
      isTemplate: !isLocal,
      source,
      tools: agentMetadata.tools,
      model: agentMetadata.model,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Read a single output style file
 */
async function readOutputStyle(stylePath: string, isLocal = false): Promise<OutputStyle | null> {
  try {
    const content = await fs.readFile(stylePath, 'utf-8');
    const { metadata, body } = parseFrontmatter(content);
    const styleMetadata = parseOutputStyleMetadata(content);
    const styleName = path.basename(stylePath, '.md');
    const isPersonal = isPersonalPath(stylePath);
    const source = getCustomizationSource(styleName, isLocal);

    return {
      type: 'output-style',
      name: styleName,
      description: styleMetadata.description,
      path: stylePath,
      content,
      instructions: body.trim(),
      isLocal,
      isArchived: false,
      isPersonal,
      isTemplate: !isLocal,
      source,
    };
  } catch (error) {
    return null;
  }
}

/**
 * List all skills from the repository
 */
export async function listRepoSkills(): Promise<Skill[]> {
  try {
    const entries = await fs.readdir(SKILLS_REPO_PATH, { withFileTypes: true });
    const skillPromises = entries
      .filter(entry => entry.isDirectory())
      .map(entry => readSkill(path.join(SKILLS_REPO_PATH, entry.name), false));

    const skills = await Promise.all(skillPromises);
    return skills.filter((skill): skill is Skill => skill !== null);
  } catch (error) {
    console.error('Failed to list repo skills:', error);
    return [];
  }
}

/**
 * List all commands from the repository
 */
export async function listRepoCommands(): Promise<Command[]> {
  try {
    const entries = await fs.readdir(COMMANDS_REPO_PATH, { withFileTypes: true });
    const commandPromises = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => readCommand(path.join(COMMANDS_REPO_PATH, entry.name), false));

    const commands = await Promise.all(commandPromises);
    return commands.filter((command): command is Command => command !== null);
  } catch (error) {
    console.error('Failed to list repo commands:', error);
    return [];
  }
}

/**
 * List all agents from the repository
 */
export async function listRepoAgents(): Promise<Agent[]> {
  try {
    const entries = await fs.readdir(AGENTS_REPO_PATH, { withFileTypes: true });
    const agentPromises = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => readAgent(path.join(AGENTS_REPO_PATH, entry.name), false));

    const agents = await Promise.all(agentPromises);
    return agents.filter((agent): agent is Agent => agent !== null);
  } catch (error) {
    console.error('Failed to list repo agents:', error);
    return [];
  }
}

/**
 * List all output styles from the repository
 */
export async function listRepoOutputStyles(): Promise<OutputStyle[]> {
  try {
    const entries = await fs.readdir(OUTPUT_STYLES_REPO_PATH, { withFileTypes: true });
    const stylePromises = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => readOutputStyle(path.join(OUTPUT_STYLES_REPO_PATH, entry.name), false));

    const styles = await Promise.all(stylePromises);
    return styles.filter((style): style is OutputStyle => style !== null);
  } catch (error) {
    console.error('Failed to list repo output styles:', error);
    return [];
  }
}

/**
 * List all local skills (only available server-side)
 */
export async function listLocalSkills(): Promise<Skill[]> {
  const config = await getConfig();
  const localPath = config.localSkillsPath.replace('~', require('os').homedir());

  try {
    const entries = await fs.readdir(localPath, { withFileTypes: true });
    const skillPromises = entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => readSkill(path.join(localPath, entry.name), true));

    const skills = await Promise.all(skillPromises);
    const validSkills = skills.filter((skill): skill is Skill => skill !== null);

    // Mark archived skills
    return validSkills.map(skill => ({
      ...skill,
      isArchived: config.archivedSkills.includes(skill.name),
    }));
  } catch (error) {
    console.error('Failed to list local skills:', error);
    return [];
  }
}

/**
 * List all local commands
 */
export async function listLocalCommands(): Promise<Command[]> {
  const config = await getConfig();
  const localPath = config.localCommandsPath.replace('~', require('os').homedir());

  try {
    const entries = await fs.readdir(localPath, { withFileTypes: true });
    const commandPromises = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => readCommand(path.join(localPath, entry.name), true));

    const commands = await Promise.all(commandPromises);
    const validCommands = commands.filter((command): command is Command => command !== null);

    return validCommands.map(command => ({
      ...command,
      isArchived: config.archivedCommands.includes(command.name),
    }));
  } catch (error) {
    console.error('Failed to list local commands:', error);
    return [];
  }
}

/**
 * List all local agents
 */
export async function listLocalAgents(): Promise<Agent[]> {
  const config = await getConfig();
  const localPath = config.localAgentsPath.replace('~', require('os').homedir());

  try {
    const entries = await fs.readdir(localPath, { withFileTypes: true });
    const agentPromises = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => readAgent(path.join(localPath, entry.name), true));

    const agents = await Promise.all(agentPromises);
    const validAgents = agents.filter((agent): agent is Agent => agent !== null);

    return validAgents.map(agent => ({
      ...agent,
      isArchived: config.archivedAgents.includes(agent.name),
    }));
  } catch (error) {
    console.error('Failed to list local agents:', error);
    return [];
  }
}

/**
 * List all local output styles
 */
export async function listLocalOutputStyles(): Promise<OutputStyle[]> {
  const config = await getConfig();
  const localPath = config.localOutputStylesPath.replace('~', require('os').homedir());

  try {
    const entries = await fs.readdir(localPath, { withFileTypes: true });
    const stylePromises = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => readOutputStyle(path.join(localPath, entry.name), true));

    const styles = await Promise.all(stylePromises);
    const validStyles = styles.filter((style): style is OutputStyle => style !== null);

    return validStyles.map(style => ({
      ...style,
      isArchived: config.archivedOutputStyles.includes(style.name),
    }));
  } catch (error) {
    console.error('Failed to list local output styles:', error);
    return [];
  }
}

/**
 * Get a specific skill by name
 */
export async function getSkill(name: string, isLocal = false): Promise<Skill | null> {
  const config = await getConfig();
  const basePath = isLocal
    ? config.localSkillsPath.replace('~', require('os').homedir())
    : SKILLS_REPO_PATH;

  const skillPath = path.join(basePath, name);
  return readSkill(skillPath, isLocal);
}

/**
 * Get a specific command by name
 */
export async function getCommand(name: string, isLocal = false): Promise<Command | null> {
  const config = await getConfig();
  const basePath = isLocal
    ? config.localCommandsPath.replace('~', require('os').homedir())
    : COMMANDS_REPO_PATH;

  const commandPath = path.join(basePath, `${name}.md`);
  return readCommand(commandPath, isLocal);
}

/**
 * Get a specific agent by name
 */
export async function getAgent(name: string, isLocal = false): Promise<Agent | null> {
  const config = await getConfig();
  const basePath = isLocal
    ? config.localAgentsPath.replace('~', require('os').homedir())
    : AGENTS_REPO_PATH;

  const agentPath = path.join(basePath, `${name}.md`);
  return readAgent(agentPath, isLocal);
}

/**
 * Get a specific output style by name
 */
export async function getOutputStyle(name: string, isLocal = false): Promise<OutputStyle | null> {
  const config = await getConfig();
  const basePath = isLocal
    ? config.localOutputStylesPath.replace('~', require('os').homedir())
    : OUTPUT_STYLES_REPO_PATH;

  const stylePath = path.join(basePath, `${name}.md`);
  return readOutputStyle(stylePath, isLocal);
}

/**
 * Read Claude Code settings.json
 */
export async function readSettings(isLocal = false): Promise<Settings | null> {
  const config = await getConfig();
  const settingsPath = isLocal
    ? path.join(config.localSkillsPath.replace('~', require('os').homedir()), '..', 'settings.json')
    : path.join(process.cwd(), '.claude', 'settings.json');

  try {
    const content = await fs.readFile(settingsPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Write Claude Code settings.json
 */
export async function writeSettings(settings: Settings, isLocal = false): Promise<void> {
  const config = await getConfig();
  const settingsPath = isLocal
    ? path.join(config.localSkillsPath.replace('~', require('os').homedir()), '..', 'settings.json')
    : path.join(process.cwd(), '.claude', 'settings.json');

  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
}
