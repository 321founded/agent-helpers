import { promises as fs } from 'fs';
import path from 'path';
import type { Skill, SkillMetadata } from './types';
import { getConfig } from './config';

const SKILLS_REPO_PATH = path.join(process.cwd(), '..', 'skills');

/**
 * Parse SKILL.md frontmatter to extract metadata
 */
function parseSkillMetadata(content: string): SkillMetadata {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { name: 'Unknown', description: 'No description available' };
  }

  const frontmatter = match[1];
  const nameMatch = frontmatter.match(/name:\s*(.+)/);
  const descMatch = frontmatter.match(/description:\s*(.+)/);

  return {
    name: nameMatch ? nameMatch[1].trim() : 'Unknown',
    description: descMatch ? descMatch[1].trim() : 'No description available',
  };
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

    return {
      name: skillName,
      description: metadata.description,
      path: skillPath,
      content,
      isLocal,
      isArchived: false,
    };
  } catch (error) {
    // Silently return null for missing skills (expected behavior)
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
 * Get a specific skill by name
 */
export async function getSkill(name: string, isLocal = false): Promise<Skill | null> {
  const basePath = isLocal
    ? (await getConfig()).localSkillsPath.replace('~', require('os').homedir())
    : SKILLS_REPO_PATH;

  const skillPath = path.join(basePath, name);
  return readSkill(skillPath, isLocal);
}
