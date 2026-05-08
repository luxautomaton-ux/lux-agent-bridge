# Skill Template

Use this template to create new skills for Lux AI.

---

## Basic Skill Structure

```json
{
  "id": "skill-unique-id",
  "name": "Skill Name",
  "sourceUrl": "https://github.com/...",
  "description": "What this skill does",
  "capabilities": ["capability1", "capability2"],
  "createdAt": "2026-05-08T00:00:00.000Z"
}
```

---

## Skill Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `name` | string | Yes | Display name |
| `sourceUrl` | string | Yes | GitHub repo or "built-in" |
| `description` | string | Yes | What it does |
| `capabilities` | array | Yes | List of capabilities |
| `createdAt` | string | Yes | ISO timestamp |

---

## Capability Options

| Capability | Description |
|-------------|-------------|
| `code-generation` | Generate code |
| `debugging` | Find and fix bugs |
| `file-operations` | Read/write files |
| `shell-commands` | Run terminal commands |
| `auto-fix` | Automatic error fixing |
| `code-review` | Review code |
| `research` | Deep research |
| `analysis` | Data analysis |
| `planning` | Strategic planning |
| `automation` | Automate tasks |
| `scripting` | Write scripts |
| `deployment` | Deploy applications |
| `ui-repair` | Fix UI issues |
| `security-scan` | Security scanning |
| `documentation` | Generate docs |
| `testing` | Write tests |
| `refactoring` | Code refactoring |
| `migration` | Migrate codebases |

---

## Example: Built-in Skill (Code Review Pro)

```json
{
  "id": "skill-code-review-001",
  "name": "Code Review Pro",
  "sourceUrl": "built-in",
  "description": "Comprehensive code review with linting, best practices, security checks, and performance suggestions.",
  "capabilities": [
    "linting",
    "code-analysis", 
    "best-practices",
    "performance-tips",
    "security-check"
  ],
  "createdAt": "2026-05-08T00:00:00.000Z"
}
```

---

## Example: External Skill (Frontend Fixer)

```json
{
  "id": "skill-frontend-001",
  "name": "Frontend Fixer",
  "sourceUrl": "https://github.com/luxautomaton-ux/lux-agent-bridge.git",
  "description": "UI repair, component cleanup, responsive polish, CSS fixes, and frontend optimization.",
  "capabilities": [
    "ui-repair",
    "css-fix",
    "responsive-design",
    "component-cleanup"
  ],
  "createdAt": "2026-05-08T05:57:10.290Z"
}
```

---

## Example: Custom Skill

```json
{
  "id": "skill-api-docs-001",
  "name": "API Documentation Generator",
  "sourceUrl": "https://github.com/yourusername/api-docs-generator",
  "description": "Generate beautiful API documentation from code comments, OpenAPI specs, or Postman collections.",
  "capabilities": [
    "documentation",
    "api-analysis",
    "markdown-generation"
  ],
  "createdAt": "2026-05-08T12:00:00.000Z"
}
```

---

## Adding a Skill

### Via API

```bash
curl -X POST http://localhost:8787/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Skill",
    "sourceUrl": "https://github.com/...",
    "description": "What it does",
    "capabilities": ["code-generation"]
  }'
```

### Via Web Interface

1. Navigate to `/tools-skills.html`
2. Click "Add Skill"
3. Fill in the form
4. Click "Save"

---

## Bootstrap Common Skills

One-click to add popular skills:

```bash
curl -X POST http://localhost:8787/api/skills/bootstrap
```

This adds skills from:
- luxautomaton-ux/lux-agent-bridge
- Popular GitHub repos
- Community-maintained skills

---

## Skill Discovery

Search for skills on GitHub:

```bash
curl http://localhost:8787/api/skills/discover
```

Returns:
- Popular skill repositories
- Community recommendations
- Compatible skills

---

## Best Practices

1. **Unique ID**: Use UUID or descriptive ID
2. **Clear Description**: What it does, in 1-2 sentences
3. **Accurate Capabilities**: List actual capabilities
4. **Valid Source**: Working GitHub URL or "built-in"
5. **Test Thoroughly**: Verify skill works before adding

---

## Skill Categories

| Category | Example Skills |
|----------|----------------|
| **Development** | Code generation, debugging, refactoring |
| **Quality** | Code review, testing, linting |
| **Security** | Vulnerability scanning, audit |
| **Operations** | Deployment, automation, scripting |
| **Research** | Analysis, planning, investigation |
| **Documentation** | Docs generation, API docs |

---

## Skill Activation

Skills are activated based on:
- Task content (auto-selection)
- Manual selection in chat
- Workflow requirements

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Skill not loading | Check sourceUrl is valid |
| Capabilities not working | Verify skill is enabled |
| Bootstrap fails | Check internet connection |

---

*Last Updated: 2026-05-08*
