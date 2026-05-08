function luxHeaders(json = true) {
  const token = localStorage.getItem("luxApiToken") || "";
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers["x-lux-token"] = token;
  return headers;
}

async function luxApi(path, options = {}) {
  const res = await fetch(path, {
    headers: { ...luxHeaders(), ...(options.headers || {}) },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function luxToast(message) {
  const host = document.getElementById("toastHost");
  if (!host) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  host.appendChild(node);
  setTimeout(() => node.remove(), 3000);
}

function luxSetThemeFromStorage() {
  const saved = localStorage.getItem("luxTheme") || "theme-cyan";
  document.body.classList.remove("theme-cyan", "theme-blue", "theme-stealth");
  document.body.classList.add(saved);
  const sel = document.getElementById("themeSelect");
  if (sel) {
    sel.value = saved;
    sel.onchange = () => {
      document.body.classList.remove("theme-cyan", "theme-blue", "theme-stealth");
      document.body.classList.add(sel.value);
      localStorage.setItem("luxTheme", sel.value);
    };
  }
}

function luxSaveToken() {
  const input = document.getElementById("tokenInput");
  if (!input) return;
  input.value = localStorage.getItem("luxApiToken") || "";
  const btn = document.getElementById("saveTokenBtn");
  if (btn) {
    btn.onclick = () => {
      localStorage.setItem("luxApiToken", input.value.trim());
      luxToast("Token saved");
    };
  }
}

function luxBindEmergency() {
  const btn = document.getElementById("emergencyBtn");
  if (!btn) return;
  btn.onclick = async () => {
    try {
      const out = await luxApi("/api/emergency-stop", { method: "POST", body: "{}" });
      luxToast(`Emergency queued: ${out.approvalId}`);
    } catch (e) {
      luxToast(e.message);
    }
  };
}
