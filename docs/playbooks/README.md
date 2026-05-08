# Lux AI Playbooks

Playbooks are structured, automated workflows that guide the AI through multi-step processes with human-in-the-loop checkpoints.

---

## Available Playbooks

| Playbook | Category | Description |
|----------|----------|-------------|
| [01-code-review.yaml](01-code-review.yaml) | Quality | Comprehensive code review with linting and security |
| [02-fullstack-dev.yaml](02-fullstack-dev.yaml) | Development | Complete web app from design to deployment |
| [03-security-audit.yaml](03-security-audit.yaml) | Security | Full security audit and vulnerability assessment |
| [04-research.yaml](04-research.yaml) | Research | Deep research with sources and analysis |
| [05-ci-cd.yaml](05-ci-cd.yaml) | DevOps | CI/CD pipeline setup and execution |
| [TEMPLATE.yaml](TEMPLATE.yaml) | - | Template for creating new playbooks |

---

## How to Use Playbooks

### Via API

```bash
# Run a playbook
curl -X POST http://localhost:8787/api/playbooks/run \
  -H "Content-Type: application/json" \
  -d @playbooks/01-code-review.yaml
```

### Via Web Interface

1. Navigate to `/tools-capabilities.html`
2. Select a capability
3. Click "Run"
4. Fill in parameters
5. Execute

---

## Creating Custom Playbooks

### 1. Copy the Template

```bash
cp docs/playbooks/TEMPLATE.yaml docs/playbooks/my-playbook.yaml
```

### 2. Edit the Playbook

Define:
- **Name** - Playbook title
- **Parameters** - User inputs
- **Steps** - Execution pipeline
- **Gates** - Human checkpoints
- **Settings** - Execution options

### 3. Register the Playbook

```bash
# Add to capabilities
curl -X POST http://localhost:8787/api/capabilities \
  -H "Content-Type: application/json" \
  -d '{
    "id": "my-playbook",
    "name": "My Playbook",
    "description": "My custom workflow",
    "steps": ["step1", "step2"]
  }'
```

### 4. Run

```bash
curl -X POST http://localhost:8787/api/capabilities/my-playbook/run \
  -H "Content-Type: application/json" \
  -d '{"param1": "value1"}'
```

---

## Playbook Concepts

### Gates

Human-in-the-loop checkpoints:

| Gate | Behavior |
|------|----------|
| `None` | Auto-continue |
| `Confirm` | Ask yes/no |
| `Review` | Show output, allow edit |
| `Approve` | Full sign-off |

### Dependencies

Steps can depend on other steps:

```yaml
- id: step2
  requires: [step1]  # step1 must complete first
```

### Conditionals

Optional steps:

```yaml
- id: optional-step
  condition: ${enableFeature} == true
```

### Outputs

Steps produce outputs used by later steps:

```yaml
- id: step1
  output: step1_result

- id: step2
  inline-prompt: Use ${step1_result}
```

---

## Best Practices

1. **Start with TEMPLATE.yaml** - Understand the structure
2. **Use appropriate gates** - Don't over-approve safe ops
3. **Keep steps focused** - One clear action per step
4. **Add validation** - Check inputs before execution
5. **Document inline** - Clear prompts = better results
6. **Test thoroughly** - Run playbooks before production

### Gold Standard Checklist

Use this quick checklist before shipping a new playbook:

- [ ] Every step has a clear `id`, `description`, and `output`
- [ ] Risky steps use `Confirm`, `Review`, or `Approve` gates
- [ ] Parameters include `description` and sensible defaults
- [ ] Steps write final artifacts to files (report, summary, patch)
- [ ] Timeout and retry settings match workload complexity
- [ ] At least one explicit validation step checks project context

### Recommended Structure (High Success Rate)

1. **Validate Input** - check project path, branch, toolchain
2. **Analyze** - inspect code/system and collect findings
3. **Plan** - produce actionable tasks ordered by impact
4. **Execute** - run improvements or generate artifacts
5. **Review Gate** - require human sign-off for risky changes
6. **Publish Report** - output markdown summary and next actions

---

## Examples in This Directory

- **Code Review**: Lint → Analyze → Security → Review → Report
- **Full-Stack Dev**: Requirements → Setup → Frontend → Backend → Test → Deploy
- **Security Audit**: Inventory → Scan → Secrets → OWASP → Config → Remediation
- **Research**: Search → Analyze → Synthesize → Expert Review → Report
- **CI/CD**: Setup → CI Config → Test Config → Build Config → Deploy → Test → Docs

---

## API Integration

Playbooks integrate with Lux AI APIs:

```javascript
// In a step's inline-prompt, you can call APIs:
inline-prompt: |
  Run code analysis:
  POST /api/code/analyze with code from ${source}
  
  Get metrics:
  GET /api/enterprise/metrics
  
  Use results in your response.
```

---

## Settings Reference

| Setting | Type | Description |
|----------|------|-------------|
| `allow-destructive` | boolean | Allow file deletions |
| `timeout` | number | Max execution seconds |
| `retry-failed` | boolean | Auto-retry on failure |
| `max-retries` | number | Max retry attempts |

---

*For detailed field descriptions, see [TEMPLATE.yaml](TEMPLATE.yaml)*
