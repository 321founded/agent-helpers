# Agent Helpers

A web application to browse, manage, and sync Claude Code customizations including skills, commands, agents, and output styles.

## Features

### Current
- 📚 Browse customizations library from Git repository
- 📄 View detailed documentation for all customization types
- 🎨 Clean, responsive UI with dark mode support
- 📂 Manage local customizations
- 🗑️ Delete and archive local customizations
- ⚙️ Configure paths for all customization types

### Customization Types Supported

1. **Skills** - Modular capabilities for Claude Code
2. **Commands** - Custom slash commands for frequent tasks
3. **Agents** - Specialized subagents with custom system prompts
4. **Output Styles** - Custom output formatting and behavior

### Roadmap
- 🔄 Sync customizations from repository to local installation
- 📝 Edit existing customizations
- ➕ Create new customizations from templates
- 🔄 Git pull updates
- 🚀 MCP server for remote management
- 🔧 Hooks management UI

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: Node.js
- **Deployment**: Vercel (planned)

## Quick Start

### Simple Start

```bash
./start.sh
```

Or with npm:
```bash
npm start
```

### Manual Start

```bash
cd /data/dev/agent-helpers/app
npm install
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

### Configuration

Config file location: `~/.config/agent-helpers/config.json`

```json
{
  "localSkillsPath": "/home/user/.claude/skills",
  "localCommandsPath": "/home/user/.claude/commands",
  "localAgentsPath": "/home/user/.claude/agents",
  "localOutputStylesPath": "/home/user/.claude/output-styles",
  "gitRepoUrl": "https://github.com/you/agent-helpers",
  "archivedSkills": [],
  "archivedCommands": [],
  "archivedAgents": [],
  "archivedOutputStyles": [],
  "autoSync": false,
  "theme": "dark"
}
```

Configure paths through the Settings page in the web UI.

## Project Structure

```
agent-helpers/
├── app/                    # Next.js web application
│   ├── app/               # Pages and routes
│   │   ├── page.tsx      # Customizations browser (home)
│   │   ├── skills/       # Skill detail pages
│   │   ├── commands/     # Command detail pages
│   │   ├── agents/       # Agent detail pages
│   │   ├── output-styles/ # Output style detail pages
│   │   ├── settings/     # Settings page
│   │   └── api/          # API routes for CRUD operations
│   ├── lib/              # Core libraries
│   │   ├── config.ts     # Config management
│   │   ├── customization-manager.ts  # All customization operations
│   │   └── types.ts      # TypeScript types
│   ├── components/       # React components
│   └── package.json
│
├── skills/                # Skills library
│   └── conversation-finder/
│       ├── SKILL.md      # Skill documentation
│       └── claude-find   # Skill script
│
├── commands/              # Commands library
│   └── *.md              # Command files
│
├── agents/                # Agents library
│   └── *.md              # Agent files
│
├── output-styles/         # Output styles library
│   └── *.md              # Output style files
│
└── README.md
```

## Adding New Customizations

### Skills

1. Create a new directory in `skills/`:
   ```bash
   mkdir skills/my-skill
   ```

2. Create `SKILL.md` with frontmatter:
   ```markdown
   ---
   name: My Skill
   description: What this skill does
   ---

   # My Skill

   Detailed documentation here...
   ```

3. Add any supporting files (scripts, templates, etc.)

### Commands

Create a `.md` file in `commands/`:

```markdown
---
description: What this command does
allowed-tools: Bash, Read
argument-hint: [filename]
---

Command instructions here. Use $ARGUMENTS or $1, $2 for parameters.
```

### Agents

Create a `.md` file in `agents/`:

```markdown
---
name: agent-name
description: When to use this agent
tools: Read, Write, Bash
model: sonnet
---

System prompt describing the agent's role and behavior.
```

### Output Styles

Create a `.md` file in `output-styles/`:

```markdown
---
name: Style Name
description: Brief description
---

# Custom Style Instructions

Your custom instructions here...
```

## Installing Locally

Currently manual - copy to the appropriate `~/.claude/` directory:

```bash
# Skills
cp -r skills/my-skill ~/.claude/skills/

# Commands
cp commands/my-command.md ~/.claude/commands/

# Agents
cp agents/my-agent.md ~/.claude/agents/

# Output Styles
cp output-styles/my-style.md ~/.claude/output-styles/
```

Automated sync coming in future releases.

## Development

### Adding API Routes

API routes are organized by customization type:

```
app/api/
├── skills/
│   ├── local/route.ts          # List local skills
│   └── [name]/route.ts         # CRUD operations
├── commands/
│   ├── local/route.ts          # List local commands
│   └── [name]/route.ts         # CRUD operations
├── agents/
│   ├── local/route.ts          # List local agents
│   └── [name]/route.ts         # CRUD operations
├── output-styles/
│   ├── local/route.ts          # List local output styles
│   └── [name]/route.ts         # CRUD operations
├── settings/route.ts           # Settings/hooks management
└── config/route.ts             # Config management
```

### Environment Detection

The app detects if it's running locally or deployed:
- **Local**: Full features including file system access
- **Deployed**: Read-only browse of customizations library

## Fork Workflow (For Organizations & Teams)

This repository is designed to support a **3-level fork architecture**:

```
Base Repository (upstream)
    ↓ fork
Organization Repository (321)
    ↓ fork
Individual Employee Repository
```

### Level 1: Base Repository (This Repo)
Contains core templates and the application.

### Level 2: Organization Fork (e.g., 321 Company)
Your organization forks this repo and adds:
- Organization-specific templates (prefix with org name, e.g., `321-`)
- Shared customizations for all team members
- Company standards and conventions

### Level 3: Individual Fork
Each team member forks the organization repo and adds:
- Personal customizations (use `*.personal.md` naming - these are gitignored)
- Individual preferences
- Experimental customizations

### Setup for Team Members

```bash
# 1. Fork the organization repo on GitHub (via UI)

# 2. Clone your fork
git clone https://github.com/yourname/agent-helpers
cd agent-helpers

# 3. Add organization repo as upstream
git remote add upstream https://github.com/321/agent-helpers

# 4. (Optional) Add base repo for tracking core updates
git remote add base https://github.com/original-author/agent-helpers

# 5. Verify remotes
git remote -v
# origin    → your fork (read/write)
# upstream  → organization repo (read-only for you)
# base      → original repo (read-only)
```

### Getting Updates

**From your organization:**
```bash
git fetch upstream
git merge upstream/main
# Resolve any conflicts
git push origin main
```

**From the base repository (for org maintainers):**
```bash
git fetch base
git merge base/main
# Resolve any conflicts
git push origin main
```

### Personal Customizations

Use the `*.personal.md` naming convention for files you don't want to commit:

```bash
# These will be gitignored
commands/my-custom-command.personal.md
agents/my-agent.personal.md
```

Or create in personal subdirectories (also gitignored):
```bash
skills/personal/my-experimental-skill/
```

### Naming Conventions

- **Base templates**: No prefix (e.g., `conversation-finder`)
- **Organization templates**: Prefix with org name (e.g., `321-deploy-helper`)
- **Personal customizations**: Use `.personal.md` suffix or `personal/` directory

### Conflict Resolution

To minimize conflicts:
1. Organization templates use org prefix (`321-*`)
2. Personal customizations use `.personal.md` suffix (gitignored)
3. Never modify base templates directly - copy and customize instead
4. Keep organization customizations in separate files from base

### Example Workflow

```bash
# Want to customize a base template?
cp commands/base-command.md commands/321-custom-command.md
# Edit 321-custom-command.md
git add commands/321-custom-command.md
git commit -m "Add 321 custom command based on base-command"

# Want personal version?
cp commands/base-command.md commands/my-command.personal.md
# Edit my-command.personal.md (this won't be committed due to .gitignore)
```

## Contributing

### To the Base Repository
1. Add customizations to appropriate directory (`skills/`, `commands/`, `agents/`, `output-styles/`)
2. Follow the frontmatter format for each type
3. Test locally with `npm run dev`
4. Submit pull request

### To Your Organization Repository
1. Use organization prefix for templates (e.g., `321-*`)
2. Document organization-specific conventions
3. Review and merge from base repository regularly
4. Share with team members via git

## License

MIT
