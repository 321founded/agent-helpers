// Base customization type
export type CustomizationType = 'skill' | 'command' | 'agent' | 'output-style';

// Common interface for all customizations
export interface BaseCustomization {
  name: string;
  description: string;
  path: string;
  content: string;
  type: CustomizationType;
  isLocal?: boolean;
  isArchived?: boolean;
  isPersonal?: boolean; // True if file ends with .personal.md or is in personal/ directory
  isTemplate?: boolean; // True if from repository (not local)
  source?: 'base' | 'org' | 'personal'; // Source of the customization
}

// Skill-specific
export interface Skill extends BaseCustomization {
  type: 'skill';
}

export interface SkillMetadata {
  name: string;
  description: string;
}

// Command-specific
export interface Command extends BaseCustomization {
  type: 'command';
  allowedTools?: string;
  argumentHint?: string;
  model?: string;
}

export interface CommandMetadata {
  name: string;
  description: string;
  allowedTools?: string;
  argumentHint?: string;
  model?: string;
}

// Agent-specific
export interface Agent extends BaseCustomization {
  type: 'agent';
  tools?: string[];
  model?: string;
  prompt: string;
}

export interface AgentMetadata {
  name: string;
  description: string;
  tools?: string[];
  model?: string;
}

// Output Style-specific
export interface OutputStyle extends BaseCustomization {
  type: 'output-style';
  instructions: string;
}

export interface OutputStyleMetadata {
  name: string;
  description: string;
}

// Hook-specific (from settings.json)
export interface Hook {
  matcher?: string;
  type: 'command';
  command: string;
  timeout?: number;
}

export interface HookEvent {
  eventName: string;
  hooks: Hook[];
}

export interface Settings {
  permissions?: {
    allow?: string[];
    deny?: string[];
  };
  hooks?: {
    [eventName: string]: Array<{
      matcher?: string;
      hooks: Hook[];
    }>;
  };
  enabledPlugins?: {
    [key: string]: boolean;
  };
  alwaysThinkingEnabled?: boolean;
}

// Union type for all customizations
export type Customization = Skill | Command | Agent | OutputStyle;

// Config
export interface Config {
  claudeBasePath: string; // Base path to .claude directory (e.g., ~/.claude or /path/to/project/.claude)
  localSkillsPath: string;
  localCommandsPath: string;
  localAgentsPath: string;
  localOutputStylesPath: string;
  gitRepoUrl: string;
  archivedSkills: string[];
  archivedCommands: string[];
  archivedAgents: string[];
  archivedOutputStyles: string[];
  autoSync: boolean;
  theme: string;
}

// Project discovery
export interface ClaudeProject {
  name: string;
  path: string; // Full path to project directory
  claudePath: string; // Path to .claude directory
  lastModified: Date;
  hasSettings: boolean;
  customizationCounts: {
    skills: number;
    commands: number;
    agents: number;
    outputStyles: number;
  };
}
