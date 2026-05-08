async function api(path, options = {}) {
  const token = localStorage.getItem("luxApiToken") || "";
  const headers = { "Content-Type": "application/json" };
  if (token) headers["x-lux-token"] = token;

  const res = await fetch(path, {
    headers,
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function byId(id) {
  return document.getElementById(id);
}

function isMobileView() {
  return false;
}

function setMobilePanel(target) {
  const panels = document.querySelectorAll(".panel");
  const tabs = document.querySelectorAll(".mobile-tab");

  panels.forEach((panel) => {
    panel.classList.remove("hidden-mobile");
  });

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.target === target);
  });
}

function cycleMobilePanel(direction) {
  const order = ["control", "approvals", "history", "tools"];
  const activeTab = document.querySelector(".mobile-tab.active");
  const current = activeTab ? activeTab.dataset.target : "control";
  const idx = order.indexOf(current);
  const next = order[(idx + direction + order.length) % order.length];
  setMobilePanel(next);
}

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

let lastPendingCount = null;
let lastActiveRuns = null;

function showToast(title, text) {
  const host = byId("toastHost");
  if (!host) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.innerHTML = `<div><b>${title}</b></div><small>${text}</small>`;
  host.appendChild(node);
  setTimeout(() => node.remove(), 4200);
}

function updateHud({ runs = null, approvals = null } = {}) {
  const runsEl = byId("hudRuns");
  const approvalsEl = byId("hudApprovals");
  const themeEl = byId("hudTheme");

  if (runsEl && Array.isArray(runs)) {
    const active = runs.filter((r) => !r.ended).length;
    runsEl.textContent = `Runs: ${active} active`;
  }
  if (approvalsEl && Array.isArray(approvals)) {
    const pending = approvals.filter((a) => a.status === "pending").length;
    approvalsEl.textContent = `Pending: ${pending}`;
  }
  if (themeEl) {
    const cls = document.body.classList.contains("theme-blue")
      ? "Executive Blue"
      : document.body.classList.contains("theme-stealth")
        ? "Stealth Black"
        : "Lux Cyan";
    themeEl.textContent = `Theme: ${cls}`;
  }
}

function appendChatMessage(kind, text) {
  const history = byId("chatHistory");
  if (!history) return;
  const row = document.createElement("div");
  row.className = `chat-msg ${kind === "user" ? "chat-msg-user" : "chat-msg-agent"}`;
  row.textContent = text;
  history.appendChild(row);
  history.scrollTop = history.scrollHeight;
}

async function refreshHealth() {
  const out = byId("healthOut");
  if (!out) return;
  out.textContent = "Loading...";
  try {
    const data = await api("/api/health");
    out.textContent = pretty(data);
  } catch (e) {
    out.textContent = e.message;
  }
}

async function startSimple(path) {
  const out = await api(path, { method: "POST" });
  alert(`Started. runId: ${out.runId || "n/a"}`);
  refreshRuns();
  refreshTimeline();
}

function renderMissionCard(plan) {
  const card = byId("missionCard");
  if (!card || !Array.isArray(plan)) return;
  card.innerHTML = "";
  plan.forEach((step) => {
    const el = document.createElement("div");
    el.className = "mission-step";
    el.innerHTML = `<div><b>${step.step}. ${step.action}</b></div><small>Agent: ${step.agent} | Risk: ${step.risk}</small><div class="progress"><span style="width:12%"></span></div>`;
    card.appendChild(el);
  });
}

async function runTaskGeneric(agent, mode, projectPath, instruction) {
  const body = { agent, mode, projectPath, instruction };
  const out = await api("/api/tasks/run", { method: "POST", body: JSON.stringify(body) });
  if (out.requiresApproval) {
    alert(`Queued for approval: ${out.approvalId}`);
    await refreshApprovals();
    await refreshTimeline();
    return;
  }
  alert(`Started. runId: ${out.runId}`);
  const runInput = byId("runIdInput");
  if (runInput) runInput.value = out.runId || "";
  await refreshRuns();
  await refreshTimeline();
}

async function runTask() {
  try {
    await runTaskGeneric(
      byId("agentSelect").value,
      byId("modeSelect").value,
      byId("projectPathInput").value.trim(),
      byId("instructionInput").value.trim()
    );
  } catch (e) {
    alert(e.message);
  }
}

async function runTaskFromChat() {
  try {
    appendChatMessage("user", byId("chatInstructionInput").value.trim() || "(empty mission)");
    await runTaskGeneric(
      byId("chatAgentSelect").value,
      byId("chatModeSelect").value,
      byId("chatProjectPathInput").value.trim(),
      byId("chatInstructionInput").value.trim()
    );
    appendChatMessage("agent", "Mission received. Execution flow started or queued for approval.");
  } catch (e) {
    appendChatMessage("agent", `Error: ${e.message}`);
    alert(e.message);
  }
}

async function planMissionByInstruction(instruction) {
  if (!instruction) return;
  const out = await api("/api/mission/plan", { method: "POST", body: JSON.stringify({ instruction }) });
  const missionOut = byId("missionOut");
  if (missionOut) missionOut.textContent = pretty(out);
  renderMissionCard(out.plan);
}

async function planMission() {
  try {
    await planMissionByInstruction(byId("missionInput").value.trim());
  } catch (e) {
    alert(e.message);
  }
}

async function planMissionFromChat() {
  try {
    appendChatMessage("user", byId("chatInstructionInput").value.trim() || "(empty mission)");
    await planMissionByInstruction(byId("chatInstructionInput").value.trim());
    appendChatMessage("agent", "Plan generated. Review steps in Mission Control.");
  } catch (e) {
    appendChatMessage("agent", `Error: ${e.message}`);
    alert(e.message);
  }
}

async function refreshApprovals() {
  const box = byId("approvalsOut");
  const drawerBox = byId("approvalsDrawerOut");
  if (!box) return;
  box.innerHTML = "";
  if (drawerBox) drawerBox.innerHTML = "";

  const approvals = await api("/api/approvals");
  const pending = approvals.filter((a) => a.status === "pending").length;
  if (lastPendingCount !== null && pending > lastPendingCount) {
    showToast("New Approval", `${pending} pending action(s)`);
  }
  lastPendingCount = pending;
  const badge = byId("approvalBadge");
  if (badge) badge.textContent = `${pending} pending`;
  updateHud({ approvals });

  function render(target, a) {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div><b>${a.title}</b></div>
      <div>Status: ${a.status} | Risk: ${a.risk}</div>
      <div>Type: ${a.type}</div>
      <div>ID: ${a.id}</div>
      <div class="row">
        <button data-id="${a.id}" data-action="approve">Approve</button>
        <button data-id="${a.id}" data-action="reject">Reject</button>
        <button data-id="${a.id}" data-action="execute">Execute</button>
      </div>
    `;
    target.appendChild(div);
  }

  approvals.forEach((a) => {
    render(box, a);
    if (drawerBox) render(drawerBox, a);
  });

  document.querySelectorAll("#approvalsOut button, #approvalsDrawerOut button").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      try {
        await api(`/api/approvals/${id}/${action}`, { method: "POST", body: "{}" });
      } catch (e) {
        alert(e.message);
      }
      await refreshApprovals();
      await refreshRuns();
      await refreshTimeline();
    };
  });
}

async function refreshRuns() {
  const box = byId("runsOut");
  if (!box) return;
  box.innerHTML = "";
  const runs = await api("/api/runs");
  const activeCount = runs.filter((r) => !r.ended).length;
  if (lastActiveRuns !== null && activeCount < lastActiveRuns) {
    showToast("Run Update", "A run finished. Check timeline.");
  }
  lastActiveRuns = activeCount;
  runs.forEach((r) => {
    const div = document.createElement("div");
    div.className = "item";
    const status = r.ended ? (r.exitCode === 0 ? "completed" : "failed") : "running";
    div.innerHTML = `<div><b>${r.runId}</b> <span class="status-chip">${status}</span></div><div>${r.source} | ${r.command || "n/a"}</div><div>Exit: ${r.exitCode}</div>`;
    box.appendChild(div);
  });
  updateHud({ runs });
}

function setupCommandPalette() {
  const palette = byId("commandPalette");
  const list = byId("paletteList");
  const search = byId("paletteSearch");
  if (!palette || !list || !search) return;

  const commands = [
    { label: "Refresh Health", run: () => refreshHealth() },
    { label: "Refresh Approvals", run: () => refreshApprovals() },
    { label: "Refresh Runs", run: () => refreshRuns() },
    { label: "Refresh Timeline", run: () => refreshTimeline() },
    { label: "Start OpenMonoAgent", run: () => startSimple("/api/agents/openmono/start") },
    { label: "Start OpenManus", run: () => startSimple("/api/agents/openmanus/start") },
    { label: "Start OpenManus Flow", run: () => startSimple("/api/agents/openmanus/flow") },
    { label: "Open Approvals Drawer", run: () => byId("approvalsDrawer")?.classList.add("open") },
    { label: "Open Logs Drawer", run: () => byId("logsDrawer")?.classList.add("open") }
  ];

  function render(filterText = "") {
    list.innerHTML = "";
    const term = filterText.toLowerCase();
    commands
      .filter((c) => c.label.toLowerCase().includes(term))
      .forEach((cmd) => {
        const row = document.createElement("div");
        row.className = "palette-item";
        row.textContent = cmd.label;
        row.onclick = () => {
          cmd.run();
          palette.classList.add("hidden");
        };
        list.appendChild(row);
      });
  }

  render();
  search.oninput = () => render(search.value);

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palette.classList.toggle("hidden");
      if (!palette.classList.contains("hidden")) {
        search.focus();
        search.select();
      }
    }
    if (e.key === "Escape") {
      palette.classList.add("hidden");
    }
  });

  const closeBtn = byId("closePaletteBtn");
  if (closeBtn) closeBtn.onclick = () => palette.classList.add("hidden");
}

function startAutoRefreshLoop() {
  setInterval(() => {
    refreshApprovals();
    refreshRuns();
    refreshTimeline();
  }, 7000);
}

async function refreshTimeline() {
  const box = byId("timelineOut");
  if (!box) return;
  box.innerHTML = "";

  const [runs, approvals] = await Promise.all([api("/api/runs"), api("/api/approvals")]);

  const runEvents = runs.slice(0, 8).map((r) => ({
    when: r.startedAt || "",
    title: `Run ${r.runId}`,
    desc: `${r.source} | ${r.command || "n/a"} | exit: ${r.exitCode}`,
    progress: r.ended ? 100 : 65,
    status: r.ended ? (r.exitCode === 0 ? "completed" : "failed") : "running"
  }));

  const approvalEvents = approvals.slice(-8).reverse().map((a) => ({
    when: a.createdAt || "",
    title: `Approval ${a.status}`,
    desc: `${a.title} (${a.risk})`,
    progress: a.status === "pending" ? 45 : 100,
    status: a.status === "pending" ? "pending" : "completed"
  }));

  const all = [...runEvents, ...approvalEvents]
    .sort((a, b) => String(b.when).localeCompare(String(a.when)))
    .slice(0, 12);

  all.forEach((event) => {
    const item = document.createElement("div");
    item.className = `timeline-item ${event.status || ""}`;
    item.innerHTML = `<div><b>${event.title}</b></div><div>${event.desc}</div><div class="meta">${event.when}</div><div class="progress"><span style="width:${event.progress}%"></span></div>`;
    box.appendChild(item);
  });
}

function setupTheme() {
  const key = "luxTheme";
  const sel = byId("themeSelect");
  if (!sel) return;

  const saved = localStorage.getItem(key) || "theme-cyan";
  document.body.classList.remove("theme-cyan", "theme-blue", "theme-stealth");
  document.body.classList.add(saved);
  sel.value = saved;
  updateHud();

  sel.onchange = () => {
    document.body.classList.remove("theme-cyan", "theme-blue", "theme-stealth");
    document.body.classList.add(sel.value);
    localStorage.setItem(key, sel.value);
    updateHud();
  };
}

async function loadLogs(runIdInputId = "runIdInput", outId = "logsOut") {
  const runId = byId(runIdInputId).value.trim();
  if (!runId) return;
  const out = await api(`/api/runs/${runId}/logs`);
  byId(outId).textContent = pretty(out);
}

function streamLogs(runIdInputId = "runIdInput", outId = "logsOut") {
  const runId = byId(runIdInputId).value.trim();
  if (!runId) return;
  byId(outId).textContent = "";
  const evt = new EventSource(`/api/runs/${runId}/logs?stream=true`);
  evt.onmessage = (e) => {
    byId(outId).textContent += e.data + "\n";
  };
  evt.onerror = () => evt.close();
}

async function addSkill() {
  const body = {
    name: byId("skillNameInput").value.trim(),
    sourceUrl: byId("skillUrlInput").value.trim(),
    description: byId("skillDescInput").value.trim()
  };
  await api("/api/skills", { method: "POST", body: JSON.stringify(body) });
  refreshSkills();
}

async function refreshSkills() {
  const box = byId("skillsOut");
  if (!box) return;
  box.innerHTML = "";
  const skills = await api("/api/skills");
  skills.forEach((s) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<div><b>${s.name}</b></div><div>${s.sourceUrl}</div><div>${s.description || ""}</div><button data-id="${s.id}">Delete</button>`;
    div.querySelector("button").onclick = async () => {
      await api(`/api/skills/${s.id}`, { method: "DELETE" });
      refreshSkills();
    };
    box.appendChild(div);
  });
}

async function bootstrapSkillsAndMcps() {
  await api("/api/skills/bootstrap", { method: "POST", body: "{}" });
  showToast("Installed", "Default skills and MCP catalog installed");
  refreshSkills();
  refreshMcps();
}

async function refreshMcps() {
  const box = byId("mcpsOut");
  if (!box) return;
  box.innerHTML = "";
  const mcps = await api("/api/mcps");
  mcps.forEach((m) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div><b>${m.name}</b> <span class="status-chip">${m.type}</span></div>
      <div>Enabled: ${m.enabled ? "yes" : "no"}</div>
      <div>Env: ${(m.envRequired || []).join(", ") || "none"}</div>
      <div class="row">
        <button data-id="${m.id}" data-action="test">Test</button>
        <button data-id="${m.id}" data-action="enable">Enable</button>
        <button data-id="${m.id}" data-action="disable">Disable</button>
      </div>
      <pre class="terminal" id="mcpResult-${m.id}"></pre>
    `;
    box.appendChild(row);
  });

  box.querySelectorAll("button").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      try {
        if (action === "test") {
          const out = await api(`/api/mcps/${id}/test`, { method: "POST", body: "{}" });
          const p = byId(`mcpResult-${id}`);
          if (p) p.textContent = pretty(out);
          return;
        }
        const enabled = action === "enable";
        await api(`/api/mcps/${id}/toggle`, {
          method: "POST",
          body: JSON.stringify({ enabled })
        });
        refreshMcps();
      } catch (e) {
        alert(e.message);
      }
    };
  });
}

async function refreshMcpHealth() {
  const box = byId("mcpsOut");
  if (!box) return;
  const data = await api("/api/mcps/health");
  const summary = data.summary || {};
  const report = data.report || [];

  const summaryNode = document.createElement("div");
  summaryNode.className = "health-grid";
  summaryNode.innerHTML = `
    <div class="health-pill ok">Ready: ${summary.ready || 0}</div>
    <div class="health-pill warn">Needs Env: ${summary.needsEnv || 0}</div>
    <div class="health-pill bad">Disabled: ${summary.disabled || 0}</div>
    <div class="health-pill">Total: ${summary.total || 0}</div>
  `;
  box.prepend(summaryNode);

  report.forEach((r) => {
    const p = byId(`mcpResult-${r.id}`);
    if (p) p.textContent = pretty({ status: r.status, missingEnv: r.missingEnv });
  });
}

async function refreshCredentials() {
  const box = byId("credsOut");
  if (!box) return;
  const data = await api("/api/credentials/check");
  box.innerHTML = "";
  (data.checks || []).forEach((c) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `<b>${c.key}</b>: <span class="${c.present ? "ok" : "bad"}">${c.present ? "present" : "missing"}</span>`;
    box.appendChild(row);
  });
}

async function addCapability() {
  const name = byId("capNameInput").value.trim();
  const description = byId("capDescInput").value.trim();
  let steps = [];
  try {
    steps = JSON.parse(byId("capStepsInput").value.trim() || "[]");
  } catch (_e) {
    alert("Steps JSON is invalid");
    return;
  }
  await api("/api/capabilities", {
    method: "POST",
    body: JSON.stringify({ name, description, steps })
  });
  refreshCapabilities();
}

async function refreshCapabilities() {
  const box = byId("capsOut");
  if (!box) return;
  box.innerHTML = "";
  const caps = await api("/api/capabilities");
  caps.forEach((c) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div><b>${c.name}</b></div>
      <div>${c.description || ""}</div>
      <div>Steps: ${c.steps?.length || 0}</div>
      <label>Run Project Path <input id="capPath-${c.id}" placeholder="/absolute/path/to/project" /></label>
      <div class="row">
        <button data-id="${c.id}" data-action="run">Run</button>
        <button data-id="${c.id}" data-action="delete">Delete</button>
      </div>
    `;
    box.appendChild(row);
  });

  box.querySelectorAll("button").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      try {
        if (action === "run") {
          const projectPath = byId(`capPath-${id}`)?.value.trim();
          const out = await api(`/api/capabilities/${id}/run`, {
            method: "POST",
            body: JSON.stringify({ projectPath })
          });
          if (out.requiresApproval) {
            showToast("Capability queued", `Approval: ${out.approvalId}`);
            refreshApprovals();
          } else {
            showToast("Capability started", `Run: ${out.runId}`);
            refreshRuns();
          }
          refreshTimeline();
          return;
        }
        await api(`/api/capabilities/${id}`, { method: "DELETE" });
        refreshCapabilities();
      } catch (e) {
        alert(e.message);
      }
    };
  });
}

async function refreshEnterpriseSettings() {
  const out = byId("enterpriseOut");
  if (!out) return;
  const data = await api("/api/enterprise/settings");

  const router = data.modelRouter || {};
  const memory = data.memoryPolicy || {};
  byId("gpuModelInput").value = router.gpuModel || "";
  byId("cpuModelInput").value = router.cpuModel || "";
  byId("routeModeInput").value = router.routeMode || "auto";
  byId("retentionDaysInput").value = memory.sessionRetentionDays ?? 30;
  byId("longTermMemoryInput").checked = Boolean(memory.longTermMemoryEnabled);
  byId("piiRedactionInput").checked = Boolean(memory.piiRedactionEnabled);

  out.textContent = pretty(data);
}

async function saveEnterpriseSettings() {
  const body = {
    modelRouter: {
      gpuModel: byId("gpuModelInput").value.trim(),
      cpuModel: byId("cpuModelInput").value.trim(),
      routeMode: byId("routeModeInput").value
    },
    memoryPolicy: {
      sessionRetentionDays: Number(byId("retentionDaysInput").value || 30),
      longTermMemoryEnabled: byId("longTermMemoryInput").checked,
      piiRedactionEnabled: byId("piiRedactionInput").checked
    },
    businessMode: {
      enabled: true,
      requireApprovalsForAutonomous: true,
      strictAudit: true,
      localhostOnly: true
    }
  };

  await api("/api/enterprise/settings", { method: "POST", body: JSON.stringify(body) });
  showToast("Saved", "Enterprise settings updated");
  refreshEnterpriseSettings();
}

async function toggleBusinessMode(enabled) {
  const out = await api("/api/enterprise/business-mode", {
    method: "POST",
    body: JSON.stringify({ enabled })
  });
  showToast("Business Mode", enabled ? "Enabled" : "Disabled");
  const box = byId("enterpriseOut");
  if (box) box.textContent = pretty(out);
}

async function refreshAudit() {
  const out = byId("auditOut");
  if (!out) return;
  const type = (byId("auditTypeInput")?.value || "").trim();
  const q = type ? `?eventType=${encodeURIComponent(type)}&limit=200` : "?limit=200";
  const data = await api(`/api/audit${q}`);
  out.textContent = pretty(data);
}

async function createBackup() {
  const out = await api("/api/backups/create", { method: "POST", body: "{}" });
  showToast("Backup Created", out.file || "Backup saved");
  refreshBackups();
}

async function refreshBackups() {
  const box = byId("backupsOut");
  if (!box) return;
  box.innerHTML = "";
  const backups = await api("/api/backups");
  backups.forEach((b) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div><b>${b.name}</b></div>
      <div>${b.createdAt} | ${b.size} bytes</div>
      <div class="row">
        <button data-name="${b.name}" data-action="download">Download</button>
        <button data-name="${b.name}" data-action="restore">Restore</button>
        <button data-name="${b.name}" data-action="export">Export to Storage</button>
      </div>
    `;
    box.appendChild(row);
  });

  box.querySelectorAll("button").forEach((btn) => {
    btn.onclick = async () => {
      const name = btn.dataset.name;
      const action = btn.dataset.action;
      if (action === "download") {
        window.open(`/api/backups/${encodeURIComponent(name)}`, "_blank");
        return;
      }
      if (action === "export") {
        const out = await api(`/api/backups/${encodeURIComponent(name)}/export-storage`, { method: "POST", body: "{}" });
        showToast("Backup Exported", out.destination || name);
        return;
      }
      if (!confirm(`Restore from backup ${name}? This overwrites current config data.`)) return;
      await api(`/api/backups/${encodeURIComponent(name)}/restore`, { method: "POST", body: "{}" });
      showToast("Backup Restored", name);
      refreshSkills();
      refreshMcps();
      refreshCapabilities();
      refreshEnterpriseSettings();
    };
  });
}

async function importBackupFromFile(file) {
  if (!file) {
    alert("Choose a .json backup file first");
    return;
  }

  const text = await file.text();
  const out = await api("/api/backups/import", {
    method: "POST",
    body: JSON.stringify({ name: file.name, content: text })
  });
  showToast("Backup Imported", out.file || file.name);
  refreshBackups();
}

function setupBackupDropzone() {
  const zone = byId("backupDropzone");
  const input = byId("backupFileInput");
  const btn = byId("importBackupBtn");
  if (!zone || !input || !btn) return;

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });
  zone.addEventListener("drop", async (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      await importBackupFromFile(file);
    } catch (err) {
      alert(err.message);
    }
  });

  btn.onclick = async () => {
    try {
      await importBackupFromFile(input.files?.[0]);
    } catch (err) {
      alert(err.message);
    }
  };
}

async function refreshStorageStatus() {
  const out = byId("storageOut");
  if (!out) return;
  const data = await api("/api/storage/status");
  const cfg = data.storage || {};
  byId("storageModeInput").value = cfg.mode || "local";
  byId("storageDbInput").value = cfg.databaseOption || "json";
  byId("storageExternalPathInput").value = cfg.externalDrivePath || "";
  byId("storageMemoryPathInput").value = cfg.memoryBackupPath || "";
  byId("storagePerfInput").value = cfg.performanceProfile || "balanced";
  out.textContent = pretty(data);
}

async function saveStorageConfig() {
  const body = {
    mode: byId("storageModeInput").value,
    externalDrivePath: byId("storageExternalPathInput").value.trim(),
    databaseOption: byId("storageDbInput").value,
    memoryBackupPath: byId("storageMemoryPathInput").value.trim(),
    performanceProfile: byId("storagePerfInput").value
  };
  const out = await api("/api/storage/config", { method: "POST", body: JSON.stringify(body) });
  showToast("Storage Saved", out.storage?.mode || "updated");
  refreshStorageStatus();
}

async function analyzeMedia() {
  const filePath = byId("mediaPathInput").value.trim();
  if (!filePath) return;
  await api("/api/media/analyze", { method: "POST", body: JSON.stringify({ filePath }) });
  refreshMedia();
}

async function refreshMedia() {
  const box = byId("mediaOut");
  if (!box) return;
  box.innerHTML = "";
  const list = await api("/api/media");
  list.slice().reverse().forEach((m) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<div><b>${m.fileName}</b> (${m.fileType})</div><div>${m.safePathPreview}</div><div>${m.sizeBytes} bytes</div>`;
    box.appendChild(div);
  });
}

async function runDiff() {
  const beforePath = byId("diffBeforeInput").value.trim();
  const afterPath = byId("diffAfterInput").value.trim();
  const out = await api("/api/diff", { method: "POST", body: JSON.stringify({ beforePath, afterPath }) });
  byId("diffOut").textContent = pretty(out.diff);
}

async function createSnapshot() {
  const projectPath = byId("snapshotProjectInput").value.trim();
  const label = byId("snapshotLabelInput").value.trim();
  await api("/api/snapshots/create", { method: "POST", body: JSON.stringify({ projectPath, label }) });
  refreshSnapshots();
}

async function refreshSnapshots() {
  const box = byId("snapshotsOut");
  if (!box) return;
  box.innerHTML = "";
  const list = await api("/api/snapshots");
  list.slice().reverse().forEach((s) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div><b>${s.label}</b></div>
      <div>${s.sourceProjectPath}</div>
      <div>${s.createdAt}</div>
      <button data-id="${s.id}">Request Rollback</button>
    `;
    div.querySelector("button").onclick = async () => {
      const out = await api(`/api/snapshots/${s.id}/rollback`, { method: "POST" });
      alert(`Rollback queued for approval: ${out.approvalId}`);
      refreshApprovals();
      refreshTimeline();
    };
    box.appendChild(div);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".mobile-tab");
  tabs.forEach((tab) => {
    tab.onclick = () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    };
  });

  window.addEventListener("resize", () => {
    const activeTab = document.querySelector(".mobile-tab.active");
    setMobilePanel(activeTab ? activeTab.dataset.target : "control");
  });

  setMobilePanel("control");
  setupTheme();
  setupCommandPalette();
  startAutoRefreshLoop();
  setupBackupDropzone();

  const root = byId("consoleRoot");
  let touchStartX = null;
  if (root) {
    root.addEventListener("touchstart", (e) => {
      if (!isMobileView()) return;
      touchStartX = e.changedTouches[0].clientX;
    });
    root.addEventListener("touchend", (e) => {
      if (!isMobileView() || touchStartX === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 70) cycleMobilePanel(deltaX < 0 ? 1 : -1);
      touchStartX = null;
    });
  }

  byId("saveTokenBtn").onclick = () => {
    localStorage.setItem("luxApiToken", byId("tokenInput").value.trim());
    alert("Token saved for API calls");
  };
  byId("tokenInput").value = localStorage.getItem("luxApiToken") || "";

  byId("healthBtn").onclick = refreshHealth;
  byId("startOpenmonoBtn").onclick = () => startSimple("/api/agents/openmono/start");
  byId("startOpenmanusBtn").onclick = () => startSimple("/api/agents/openmanus/start");
  byId("startFlowBtn").onclick = () => startSimple("/api/agents/openmanus/flow");
  byId("runTaskBtn").onclick = runTask;
  if (byId("chatSendBtn")) byId("chatSendBtn").onclick = runTaskFromChat;
  if (byId("chatPlanBtn")) byId("chatPlanBtn").onclick = planMissionFromChat;
  if (byId("chatClearBtn")) {
    byId("chatClearBtn").onclick = () => {
      const history = byId("chatHistory");
      if (history) {
        history.innerHTML = "";
        appendChatMessage("agent", "LANA: Chat cleared. Ready for next mission.");
      }
    };
  }
  byId("refreshApprovalsBtn").onclick = refreshApprovals;
  byId("refreshRunsBtn").onclick = refreshRuns;
  if (byId("refreshTimelineBtn")) byId("refreshTimelineBtn").onclick = refreshTimeline;
  byId("loadLogsBtn").onclick = () => loadLogs("runIdInput", "logsOut");
  byId("streamLogsBtn").onclick = () => streamLogs("runIdInput", "logsOut");
  byId("addSkillBtn").onclick = addSkill;
  byId("refreshSkillsBtn").onclick = refreshSkills;
  if (byId("bootstrapSkillsBtn")) byId("bootstrapSkillsBtn").onclick = bootstrapSkillsAndMcps;
  if (byId("refreshMcpsBtn")) byId("refreshMcpsBtn").onclick = refreshMcps;
  if (byId("refreshMcpHealthBtn")) byId("refreshMcpHealthBtn").onclick = refreshMcpHealth;
  if (byId("refreshCredsBtn")) byId("refreshCredsBtn").onclick = refreshCredentials;
  if (byId("addCapBtn")) byId("addCapBtn").onclick = addCapability;
  if (byId("refreshCapsBtn")) byId("refreshCapsBtn").onclick = refreshCapabilities;
  if (byId("refreshEnterpriseBtn")) byId("refreshEnterpriseBtn").onclick = refreshEnterpriseSettings;
  if (byId("saveEnterpriseBtn")) byId("saveEnterpriseBtn").onclick = saveEnterpriseSettings;
  if (byId("enableBusinessModeBtn")) byId("enableBusinessModeBtn").onclick = () => toggleBusinessMode(true);
  if (byId("disableBusinessModeBtn")) byId("disableBusinessModeBtn").onclick = () => toggleBusinessMode(false);
  if (byId("refreshAuditBtn")) byId("refreshAuditBtn").onclick = refreshAudit;
  if (byId("createBackupBtn")) byId("createBackupBtn").onclick = createBackup;
  if (byId("refreshBackupsBtn")) byId("refreshBackupsBtn").onclick = refreshBackups;
  if (byId("refreshStorageBtn")) byId("refreshStorageBtn").onclick = refreshStorageStatus;
  if (byId("saveStorageBtn")) byId("saveStorageBtn").onclick = saveStorageConfig;
  byId("analyzeMediaBtn").onclick = analyzeMedia;
  byId("refreshMediaBtn").onclick = refreshMedia;
  byId("runDiffBtn").onclick = runDiff;
  byId("createSnapshotBtn").onclick = createSnapshot;
  byId("refreshSnapshotsBtn").onclick = refreshSnapshots;
  byId("planMissionBtn").onclick = planMission;
  byId("emergencyBtn").onclick = async () => {
    const out = await api("/api/emergency-stop", { method: "POST" });
    alert(`Emergency stop queued. approvalId: ${out.approvalId}`);
    refreshApprovals();
    refreshTimeline();
  };

  const approvalsDrawer = byId("approvalsDrawer");
  const logsDrawer = byId("logsDrawer");
  if (byId("quickApprovalsBtn") && approvalsDrawer) byId("quickApprovalsBtn").onclick = () => approvalsDrawer.classList.add("open");
  if (byId("closeApprovalsDrawer") && approvalsDrawer) byId("closeApprovalsDrawer").onclick = () => approvalsDrawer.classList.remove("open");
  if (byId("quickLogsBtn") && logsDrawer) byId("quickLogsBtn").onclick = () => logsDrawer.classList.add("open");
  if (byId("closeLogsDrawer") && logsDrawer) byId("closeLogsDrawer").onclick = () => logsDrawer.classList.remove("open");
  if (byId("drawerLoadLogsBtn")) byId("drawerLoadLogsBtn").onclick = () => loadLogs("drawerRunIdInput", "drawerLogsOut");
  if (byId("drawerStreamLogsBtn")) byId("drawerStreamLogsBtn").onclick = () => streamLogs("drawerRunIdInput", "drawerLogsOut");

  refreshHealth();
  refreshApprovals();
  refreshRuns();
  refreshTimeline();
  refreshSkills();
  refreshMcps();
  refreshCredentials();
  refreshCapabilities();
  refreshEnterpriseSettings();
  refreshAudit();
  refreshBackups();
  refreshStorageStatus();
  refreshMedia();
  refreshSnapshots();
});
