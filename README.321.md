# Agent Helpers - 321 Fork

This is the 321 organization fork of Agent Helpers. It contains all base customizations plus 321-specific tools and templates.

## What's Different in This Fork?

### 321-Specific Customizations

This fork includes:
- **Skills**: `321-*` prefixed skills for 321's internal tools
- **Commands**: `321-*` prefixed commands for 321's workflows
- **Agents**: `321-*` prefixed agents for 321's processes
- **Standards**: 321 coding standards and conventions

### Base Customizations

All customizations from the base repository (AlexisLaporte/agent-helpers) are also available without modification.

## For 321 Team Members

### Getting Started

1. **Fork this repository** (if you want personal customizations)
   ```bash
   # On GitHub: Fork AlexisLaporte321/agent-helpers
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/agent-helpers.git
   cd agent-helpers
   ```

3. **Set up remotes**
   ```bash
   # Add 321 repo as upstream
   git remote add upstream https://github.com/AlexisLaporte321/agent-helpers.git

   # (Optional) Add base repo for tracking core updates
   git remote add base https://github.com/AlexisLaporte/agent-helpers.git

   # Verify
   git remote -v
   ```

4. **Install and run**
   ```bash
   cd app
   npm install
   npm run dev
   ```

### Getting Updates

**From 321 organization:**
```bash
git fetch upstream
git merge upstream/master
git push origin master
```

**From base repository (for maintainers):**
```bash
git fetch base
git merge base/master
# Resolve conflicts if any
git push origin master
```

## 321 Customizations

### Available Skills

- **321-example-skill**: Example of 321-specific skill

### Available Commands

_(Add 321 commands here as they are created)_

### Available Agents

_(Add 321 agents here as they are created)_

## Creating 321 Customizations

### Naming Convention

All 321-specific customizations **must** use the `321-` prefix:

```bash
# Good
skills/321-deployment-helper/
commands/321-deploy.md
agents/321-security-scanner.md

# Bad - will conflict with base repo
skills/deployment-helper/
commands/deploy.md
```

### Adding a New 321 Skill

1. **Create the skill directory**
   ```bash
   mkdir -p skills/321-my-skill
   ```

2. **Create SKILL.md with frontmatter**
   ```bash
   cat > skills/321-my-skill/SKILL.md <<EOF
   ---
   name: 321 My Skill
   description: Brief description of what this skill does for 321
   ---

   # 321 My Skill

   Detailed documentation here...
   EOF
   ```

3. **Commit and push**
   ```bash
   git add skills/321-my-skill
   git commit -m "feat: add 321-my-skill"
   git push origin master
   ```

4. **Create Pull Request** (if working from personal fork)
   ```bash
   gh pr create --repo AlexisLaporte321/agent-helpers \
     --title "feat: add 321-my-skill" \
     --body "Description of the skill..."
   ```

## Personal Customizations

For personal customizations that you don't want to share:

### Option 1: Use .personal.md suffix (gitignored)
```bash
# These won't be committed
commands/my-shortcuts.personal.md
agents/my-agent.personal.md
```

### Option 2: Use personal/ directories (gitignored)
```bash
# These won't be committed
skills/personal/my-experimental-skill/
```

## Contributing Back to Base Repository

If you create something useful for the wider community:

1. **Remove 321-specific code**
   ```bash
   # Create a branch from base
   git fetch base
   git checkout -b contribute/my-feature base/master

   # Copy and generalize the skill
   cp -r skills/321-my-skill skills/my-skill
   # Edit to remove 321-specific references

   # Commit
   git add skills/my-skill
   git commit -m "feat: add generic my-skill"
   ```

2. **Create PR to base repository**
   ```bash
   gh pr create --repo AlexisLaporte/agent-helpers \
     --title "feat: add generic my-skill" \
     --body "This was developed at 321 and generalized for the community..."
   ```

## Maintainers

### Syncing from Base Repository

Regularly sync with the base repository to get updates:

```bash
# Check for updates
git fetch base

# Review changes
git log HEAD..base/master --oneline

# Merge if safe
git merge base/master

# Resolve conflicts (usually none with proper naming)
git mergetool  # if needed

# Push to 321 fork
git push origin master
```

### Review Process for 321 PRs

1. **Check naming convention** - Must use `321-` prefix
2. **Verify 321-specific** - Should not be generic enough for base repo
3. **Test functionality** - Ensure it works in 321 environment
4. **Review code quality** - Follow 321 standards
5. **Merge if approved**

## Questions?

- **321-specific questions**: Contact team lead
- **General Agent Helpers questions**: See base repository
- **Bug reports**: Open issue in this repository or base repository as appropriate

## Related Repositories

- **Base Repository**: https://github.com/AlexisLaporte/agent-helpers
- **321 Fork**: https://github.com/AlexisLaporte321/agent-helpers (this repo)

## License

MIT (inherited from base repository)
