const express = require("express");
const dotenv = require("dotenv");
const { Readable } = require("stream");

dotenv.config();

const app = express();

const RELAY_PORT = Number(process.env.RELAY_PORT || 9797);
const RELAY_KEY = process.env.RELAY_KEY || "";
const BRIDGE_BASE_URL = process.env.BRIDGE_BASE_URL || "http://127.0.0.1:8787";
const RELAY_ALLOWLIST = (process.env.RELAY_ALLOWLIST || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const RELAY_RATE_LIMIT_WINDOW_MS = Number(process.env.RELAY_RATE_LIMIT_WINDOW_MS || 60000);
const RELAY_RATE_LIMIT_MAX = Number(process.env.RELAY_RATE_LIMIT_MAX || 120);

const rateMap = new Map();

function getClientIp(req) {
  const fwd = req.header("x-forwarded-for");
  if (fwd) return String(fwd).split(",")[0].trim();
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function isAllowedIp(ip) {
  if (RELAY_ALLOWLIST.length === 0) return true;
  return RELAY_ALLOWLIST.includes(ip);
}

function rateLimitOk(ip) {
  const now = Date.now();
  const current = rateMap.get(ip) || { count: 0, resetAt: now + RELAY_RATE_LIMIT_WINDOW_MS };
  if (now > current.resetAt) {
    current.count = 0;
    current.resetAt = now + RELAY_RATE_LIMIT_WINDOW_MS;
  }
  current.count += 1;
  rateMap.set(ip, current);
  return current.count <= RELAY_RATE_LIMIT_MAX;
}

async function auditRelay(eventType, payload) {
  try {
    await fetch(`${BRIDGE_BASE_URL}/api/audit-relay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, ...payload })
    });
  } catch (_err) {
    // Do not fail relay flow if audit endpoint is unavailable.
  }
}

app.use(express.raw({ type: "*/*", limit: "20mb" }));

app.get("/relay/health", (_req, res) => {
  res.json({
    online: true,
    relayPort: RELAY_PORT,
    bridgeBaseUrl: BRIDGE_BASE_URL,
    authRequired: Boolean(RELAY_KEY)
  });
});

app.all("/relay/*", async (req, res) => {
  const clientIp = getClientIp(req);

  if (!isAllowedIp(clientIp)) {
    await auditRelay("relay_block_ip", { ip: clientIp, path: req.path, method: req.method });
    return res.status(403).json({ error: "IP not allowed" });
  }

  if (!rateLimitOk(clientIp)) {
    await auditRelay("relay_rate_limited", { ip: clientIp, path: req.path, method: req.method });
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  if (RELAY_KEY) {
    const provided = req.header("x-relay-key") || "";
    if (provided !== RELAY_KEY) {
      await auditRelay("relay_block_bad_key", { ip: clientIp, path: req.path, method: req.method });
      return res.status(401).json({ error: "Unauthorized relay key" });
    }
  }

  const upstreamPath = req.path.replace(/^\/relay/, "") || "/";
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  const target = `${BRIDGE_BASE_URL}${upstreamPath}${query}`;

  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!v) continue;
    const key = k.toLowerCase();
    if (["host", "content-length", "x-relay-key"].includes(key)) continue;
    headers[k] = Array.isArray(v) ? v.join(",") : v;
  }

  const isBodyMethod = !["GET", "HEAD"].includes(req.method);

  let upstream;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: isBodyMethod ? req.body : undefined
    });
  } catch (error) {
    await auditRelay("relay_upstream_error", { ip: clientIp, path: req.path, method: req.method, message: error.message });
    return res.status(502).json({ error: "Relay upstream connection failed", detail: error.message });
  }

  await auditRelay("relay_forward", {
    ip: clientIp,
    path: req.path,
    method: req.method,
    upstreamStatus: upstream.status
  });

  res.status(upstream.status);
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    res.setHeader(key, value);
  });

  if (!upstream.body) return res.end();

  const stream = Readable.fromWeb(upstream.body);
  stream.on("error", () => {
    if (!res.headersSent) res.status(500);
    res.end();
  });
  stream.pipe(res);
});

app.listen(RELAY_PORT, () => {
  console.log(`lux relay server running on http://0.0.0.0:${RELAY_PORT}`);
});
