# Agent Helpers

A web application to browse, manage, and sync Claude Code skills.

## Features

### Current (v0.1)
- 📚 Browse skills library from Git repository
- 📄 View skill details and documentation
- 🎨 Clean, responsive UI with dark mode support

### Roadmap
- 📂 Manage local skills (`~/.claude/skills`)
- 🔄 Sync skills from repository to local installation
- 📝 Edit existing skills
- ➕ Create new skills
- 🗄️ Archive/activate skills
- 🔄 Git pull updates
- 🚀 MCP server for remote skill management

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
  "localSkillsPath": "/home/alexis/.claude/skills",
  "gitRepoUrl": "https://github.com/you/agent-helpers",
  "archivedSkills": [],
  "autoSync": false,
  "theme": "dark"
}
```

## Project Structure

```
agent-helpers/
├── app/                    # Next.js web application
│   ├── app/               # Pages and routes
│   │   ├── page.tsx      # Skills browser (home)
│   │   └── skills/       # Skill detail pages
│   ├── lib/              # Core libraries
│   │   ├── config.ts     # Config management
│   │   ├── skills-manager.ts  # Skills operations
│   │   └── types.ts      # TypeScript types
│   └── package.json
│
├── skills/                # Skills library
│   └── conversation-finder/
│       ├── SKILL.md      # Skill documentation
│       └── claude-find   # Skill script
│
├── cli/                   # CLI tools (future)
├── config/               # Config templates
│   └── config.example.json
└── README.md
```

## Adding New Skills

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

4. The skill will automatically appear in the browser

## Installing Skills Locally

Currently manual - copy to `~/.claude/skills`:
```bash
cp -r skills/my-skill ~/.claude/skills/
```

Automated sync coming in future releases.

## Development

### Adding API Routes for Local Features

For features that need filesystem access (local skills management), add API routes:

```typescript
// app/api/skills/local/route.ts
export async function GET() {
  const skills = await listLocalSkills();
  return Response.json(skills);
}
```

### Environment Detection

The app detects if it's running locally or deployed:
- **Local**: Full features including file system access
- **Deployed**: Read-only browse of skills library

## Contributing

1. Add skills to `skills/` directory
2. Test locally with `npm run dev`
3. Submit pull request

## License

MIT
