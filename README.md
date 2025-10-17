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

This project supports contributions at multiple levels: from individual employees to organizations to the base repository.

### Contributing to the Base Repository (Upstream)

Anyone can contribute improvements, bug fixes, or new generic templates to the base repository:

#### From an Organization Fork

```bash
# In your organization repo (e.g., 321-company/agent-helpers)

# 1. Create a clean branch from the base repository
git fetch base
git checkout -b contribute/my-feature base/master

# 2. Add or modify the customization
# For a new generic skill (remove org-specific prefixes and code):
cp skills/321-api-caller skills/api-helper
vim skills/api-helper/SKILL.md
# Remove all 321-specific references, make it generic

# 3. Commit with clear message
git add skills/api-helper
git commit -m "feat: add generic API helper skill

This skill provides utilities for calling and testing APIs:
- Request formatting
- Response parsing
- Error handling

Originally developed at 321, generalized for community use."

# 4. Push to your organization fork
git push origin contribute/my-feature

# 5. Create Pull Request to base repository
gh pr create --repo AlexisLaporte/agent-helpers \
  --title "feat: add generic API helper skill" \
  --body "Contribution from 321. This skill was developed internally and generalized for the community.

Features:
- REST API interaction
- JSON parsing
- Error handling

All 321-specific code has been removed."
```

#### From an Individual Fork

```bash
# In your personal fork (e.g., john-321/agent-helpers)

# 1. Fix a bug or improve a base template
git fetch base
git checkout -b fix/conversation-finder-bug base/master

# 2. Make your changes
vim skills/conversation-finder/SKILL.md

# 3. Commit
git commit -m "fix: correct date parsing in conversation-finder"

# 4. Push to your fork
git push origin fix/conversation-finder-bug

# 5. Create PR to base repository
gh pr create --repo AlexisLaporte/agent-helpers \
  --title "fix: correct date parsing in conversation-finder" \
  --body "Fixed a bug where dates in YYYY-MM-DD format were not parsed correctly."
```

### Contributing to Your Organization Repository

Team members can propose new organization-specific templates or improvements:

```bash
# In your personal fork

# 1. Create a feature branch
git checkout -b feat/add-deployment-helper

# 2. Add an organization-prefixed customization
mkdir -p skills/321-deployment-helper
echo "---
name: 321 Deployment Helper
description: Automates deployment to 321 infrastructure
---

# 321 Deployment Helper
..." > skills/321-deployment-helper/SKILL.md

# 3. Commit and push
git add skills/321-deployment-helper
git commit -m "feat: add 321 deployment automation skill"
git push origin feat/add-deployment-helper

# 4. Create PR to organization repository
gh pr create --repo 321-company/agent-helpers \
  --title "feat: add 321 deployment automation skill" \
  --body "New skill to automate deployment to our infrastructure.

Features:
- Validates deployment config
- Runs pre-deployment checks
- Automates kubectl commands"
```

### Contribution Guidelines

#### For Base Repository Contributions

**Must be generic and reusable:**
- ✅ Generic API helper that works with any REST API
- ✅ Code review assistant for any language
- ❌ Deployment script specific to one company's infrastructure
- ❌ Tool that requires proprietary APIs

**Must be well-documented:**
- Clear description of what it does
- Usage examples
- Any prerequisites or dependencies

**Must be tested:**
- Test the customization locally
- Verify it works in a clean environment

#### For Organization Repository Contributions

**Can be organization-specific:**
- ✅ Tools for your internal infrastructure
- ✅ Integration with company-specific APIs
- ✅ Custom workflows for your team

**Must use organization prefix:**
- Use `321-` prefix for 321 company templates
- Use your organization's short name/code

**Document internal dependencies:**
- Specify what internal tools/APIs are required
- Include setup instructions for new team members

### Pull Request Template

When contributing to the **base repository**, your PR should answer:

```markdown
## Type of Contribution
- [ ] New customization (skill/command/agent/output-style)
- [ ] Bug fix
- [ ] Enhancement to existing customization
- [ ] Documentation improvement
- [ ] Other (please describe)

## For New Customizations
- [ ] This is generic and reusable (not company-specific)
- [ ] All proprietary/internal references have been removed
- [ ] Documentation is clear and includes examples
- [ ] I have tested this locally

## Description
<!-- Describe what this PR does and why -->

## Testing
<!-- How did you test this? -->

## Additional Context
<!-- Any other relevant information -->
```

### Review Process

**Base Repository (upstream):**
1. Maintainer reviews for generic applicability
2. Checks for code quality and documentation
3. Tests functionality
4. Merges if approved
5. Tags release if significant

**Organization Repository:**
1. Team lead or designated reviewer checks
2. Verifies it follows organization standards
3. Tests in company environment
4. Merges if approved

### Syncing After Merge

**After your PR is merged to base:**

```bash
# Organizations should pull in the update
cd 321-company/agent-helpers
git fetch base
git merge base/master
git push origin master

# Employees can then pull from organization
cd john-321/agent-helpers
git fetch upstream
git merge upstream/master
git push origin master
```

### Common Contribution Scenarios

#### Scenario 1: Employee Improves Base Template

```bash
# John finds a bug in conversation-finder
git fetch base
git checkout -b fix/conv-finder-bug base/master
# Fix the bug
git commit -m "fix: handle empty conversation lists"
# PR to AlexisLaporte/agent-helpers
```

#### Scenario 2: 321 Shares Generic Tool

```bash
# 321 developed a useful generic tool
git checkout -b contribute/json-formatter base/master
# Copy and generalize their 321-json-formatter
mv skills/321-json-formatter skills/json-formatter
# Remove 321-specific code
git commit -m "feat: add JSON formatting skill"
# PR to AlexisLaporte/agent-helpers
```

#### Scenario 3: Employee Adds Company Tool

```bash
# John creates a tool for 321's infrastructure
git checkout -b feat/321-k8s-helper
mkdir -p skills/321-k8s-helper
# Create the skill
git commit -m "feat: add 321 Kubernetes helper"
# PR to 321-company/agent-helpers
```

### Getting Your Contributions Merged

**Tips for successful PRs:**

1. **Start with an issue:** Open an issue first to discuss major changes
2. **Keep it focused:** One feature/fix per PR
3. **Write good commit messages:** Explain the "why", not just the "what"
4. **Test thoroughly:** Include testing details in PR description
5. **Document well:** Update README if adding new features
6. **Be responsive:** Address review comments promptly

### Questions?

- **Base repository issues**: https://github.com/AlexisLaporte/agent-helpers/issues
- **Organization-specific questions**: Contact your team lead
- **General discussion**: Start a GitHub Discussion

## License

MIT
