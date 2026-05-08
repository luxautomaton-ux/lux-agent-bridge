(function () {
  const sidebar = document.querySelector('aside.sidebar');
  if (!sidebar) return;

  const path = window.location.pathname;
  const is = (p) => path === p;
  const ends = (p) => path.endsWith(p);

  const active = {
    command: is('/lux-command-center.html'),
    mission: is('/lux-mission-mode.html'),
    chat: is('/control-chat.html'),
    agents: is('/lux-agent-console.html'),
    skills: is('/tools-skills.html'),
    workflows: is('/tools-capabilities.html'),
    memory: is('/lux-memory.html') || is('/tools-memory.html'),
    mcp: is('/lux-mcp.html') || is('/tools-mcp.html'),
    approvals: is('/lux-approvals.html') || is('/control-approvals.html') || is('/approvals.html'),
    tasks: is('/lux-tasks.html') || is('/control-runner.html') || is('/control-runs.html') || is('/runs.html'),
    settings: is('/lux-settings.html') || is('/tools-enterprise.html'),
    backup: is('/lux-backup.html') || is('/tools-audit-backup.html'),
    guide: is('/docs/GUIDE.html') || ends('/GUIDE.html'),
    whitepaper: is('/docs/WHITEPAPER.html') || ends('/WHITEPAPER.html') || is('/INSTRUCTIONS.html')
    ,luxNative: is('/lux-ai-native.html')
    ,superAgent: is('/super-agent.html')
    ,securityGuard: is('/security-guard.html')
    ,luxAgent: is('/lux-agent.html')
  };

  const link = (href, icon, label, on) =>
    `<a href="${href}" class="nav-link${on ? ' active' : ''}"><span class="icon">${icon}</span> ${label}</a>`;

  sidebar.style.overflowY = 'auto';

  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-icon"><img src="/Photos/logo.png" alt="Lux logo" class="sidebar-logo-image"></div>
      <div class="logo-text">
        <h1>Lux AI Studio</h1>
        <span>Command Center</span>
      </div>
    </div>

    <nav class="nav-section">
      <div class="nav-section-title">Main</div>
      ${link('/lux-command-center.html', '🎛️', 'Command Center', active.command)}
      ${link('/lux-mission-mode.html', '🚀', 'Mission Mode', active.mission)}
      ${link('/control-chat.html', '💬', 'Chat', active.chat)}
      ${link('/lux-agent-console.html', '🤖', 'Agent Console', active.agents)}
    </nav>

    <nav class="nav-section">
      <div class="nav-section-title">Agents</div>
      ${link('/lux-ai-native.html', '⚡', 'Lux AI (Native)', active.luxNative)}
      ${link('/super-agent.html', '🤖', 'Super Agent', active.superAgent)}
      ${link('/security-guard.html', '🛡️', 'Security Guard', active.securityGuard)}
      ${link('/lux-agent.html', '💻', 'Lux Agent', active.luxAgent)}
    </nav>

    <nav class="nav-section">
      <div class="nav-section-title">Workspace</div>
      ${link('/lux-projects.html', '📁', 'Projects', false)}
      ${link('/lux-tasks.html', '📋', 'Task Queue', active.tasks)}
      ${link('/lux-approvals.html', '✓', 'Approvals', active.approvals)}
      ${link('/lux-playbooks.html', '📜', 'Playbooks', false)}
    </nav>

    <nav class="nav-section">
      <div class="nav-section-title">Skills & Swarms</div>
      ${link('/tools-skills.html', '⚡', 'Skills', active.skills)}
      ${link('/lux-swarm.html', '🕸️', 'Agent Swarms', false)}
      ${link('/tools-capabilities.html', '📋', 'Workflows', active.workflows)}
    </nav>

    <nav class="nav-section">
      <div class="nav-section-title">Tools</div>
      ${link('/lux-memory.html', '🧠', 'Memory', active.memory)}
      ${link('/lux-mcp.html', '🔗', 'MCP Tools', active.mcp)}
      ${link('/lux-deployments.html', '☁️', 'Deployments', false)}
    </nav>

    <nav class="nav-section">
      <div class="nav-section-title">System</div>
      ${link('/lux-backup.html', '💾', 'Backup/Restore', active.backup)}
      ${link('/lux-settings.html', '⚙️', 'Settings', active.settings)}
    </nav>

    <nav class="nav-section">
      <div class="nav-section-title">Documentation</div>
      ${link('/docs/WHITEPAPER.html', '📄', 'Whitepaper', active.whitepaper)}
      ${link('/docs/GUIDE.html', '📖', 'User Guide', active.guide)}
      ${link('/USB-SETUP.html', '💾', 'USB Setup', false)}
    </nav>
  `;

  const logoImg = sidebar.querySelector('.sidebar-logo-image');
  if (logoImg) {
    logoImg.style.width = '100%';
    logoImg.style.height = '100%';
    logoImg.style.objectFit = 'cover';
    logoImg.style.display = 'block';
    logoImg.style.borderRadius = '10px';
  }
})();
