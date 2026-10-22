const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
app.use(express.json({ limit: '2mb' }));

const DATABASE_URL = "postgresql://postgres:fatherofAI%402000@localhost:5432/sintel";
let pool = null;

// Initial admin password — change it from the admin page after first login.
const INITIAL_ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'sintel-admin-2026';

if (DATABASE_URL) {
  pool = new Pool({ connectionString: DATABASE_URL, max: 5 });
  pool.on('error', (e) => console.error('[db] idle client error:', e.message));

  const SALT = crypto.randomBytes(8).toString('hex');
  const initialHash = crypto.scryptSync(INITIAL_ADMIN_PASSWORD, SALT, 32).toString('hex') + ':' + SALT;

  pool.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT,
      inquiry_type TEXT NOT NULL DEFAULT 'general',
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS content_sections (
      section TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      username TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    );
  `).then(() => pool.query(
    `INSERT INTO admin_users (username, password_hash) VALUES ('admin', $1)
     ON CONFLICT (username) DO NOTHING`, [initialHash]
  )).then(() => console.log('[db] schema ready')).catch((e) => console.error('[db] bootstrap failed:', e.message));
} else {
  console.warn('[db] DATABASE_URL not set — persistence disabled');
}

const APP_PREFIX = '/volt/sintel-technologies';

// ---------- helpers ----------
function hashPassword(pw) {
  const salt = crypto.randomBytes(8).toString('hex');
  return crypto.scryptSync(String(pw), salt, 32).toString('hex') + ':' + salt;
}
function verifyPassword(pw, stored) {
  try {
    const [hex, salt] = String(stored).split(':');
    return crypto.scryptSync(String(pw), salt, 32).toString('hex') === hex;
  } catch { return false; }
}
function tokenFrom(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return req.headers['x-admin-token'] || req.query.token || '';
}
async function isAdmin(req) {
  const token = tokenFrom(req);
  if (!token || !pool) return false;
  const { rows } = await pool.query(
    'SELECT 1 FROM admin_sessions WHERE token = $1 AND expires_at > now()', [token]);
  return rows.length > 0;
}
function requireAdmin(handler) {
  return async (req, res) => {
    try {
      if (!(await isAdmin(req))) return res.status(401).json({ ok: false, error: 'not signed in' });
      return handler(req, res);
    } catch {
      res.status(503).json({ ok: false, error: 'database_unavailable' });
    }
  };
}

// ---------- health ----------
app.get(['/api/health', `${APP_PREFIX}/api/health`], async (_req, res) => {
  if (!pool) return res.status(503).json({ ok: false, error: 'database_unavailable' });
  try { await pool.query('SELECT 1'); res.json({ ok: true }); }
  catch { res.status(503).json({ ok: false, error: 'database_unavailable' }); }
});

// ---------- public content API ----------
// Returns the saved site content; the frontend merges it over the built-in defaults.
app.get(['/api/content', `${APP_PREFIX}/api/content`], async (_req, res) => {
  if (!pool) return res.json({ sections: {} });
  try {
    const { rows } = await pool.query(`SELECT data FROM content_sections WHERE section = 'site'`);
    const saved = rows[0] && rows[0].data;
    res.json({ sections: (saved && typeof saved === 'object') ? saved : {} });
  } catch { res.json({ sections: {} }); }
});

// ---------- admin auth ----------
app.post(['/api/admin/login', `${APP_PREFIX}/api/admin/login`], async (req, res) => {
  if (!pool) return res.status(503).json({ ok: false, error: 'database_unavailable' });
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ ok: false, error: 'password required' });
  try {
    const { rows } = await pool.query(`SELECT password_hash FROM admin_users WHERE username = 'admin'`);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ ok: false, error: 'wrong password' });
    }
    const token = crypto.randomBytes(24).toString('hex');
    await pool.query(`INSERT INTO admin_sessions (token, username, expires_at) VALUES ($1, 'admin', now() + interval '7 days')`, [token]);
    await pool.query('DELETE FROM admin_sessions WHERE expires_at < now()');
    res.json({ ok: true, token });
  } catch { res.status(503).json({ ok: false, error: 'database_unavailable' }); }
});

app.post(['/api/admin/logout', `${APP_PREFIX}/api/admin/logout`], async (req, res) => {
  try {
    const token = tokenFrom(req);
    if (token && pool) await pool.query('DELETE FROM admin_sessions WHERE token = $1', [token]);
  } catch { /* ignore */ }
  res.json({ ok: true });
});

app.get(['/api/admin/me', `${APP_PREFIX}/api/admin/me`], async (req, res) => {
  try {
    if (!(await isAdmin(req))) return res.status(401).json({ ok: false, error: 'not signed in' });
    res.json({ ok: true });
  } catch { res.status(503).json({ ok: false, error: 'database_unavailable' }); }
});

// ---------- admin content save/load ----------
app.get(['/api/admin/content', `${APP_PREFIX}/api/admin/content`], requireAdmin(async (_req, res) => {
  const { rows } = await pool.query(`SELECT data FROM content_sections WHERE section = 'site'`);
  const saved = rows[0] && rows[0].data;
  res.json({ ok: true, content: (saved && typeof saved === 'object') ? saved : {} });
}));

app.put(['/api/admin/content', `${APP_PREFIX}/api/admin/content`], requireAdmin(async (req, res) => {
  const content = req.body && req.body.content;
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return res.status(400).json({ ok: false, error: 'content object required' });
  }
  await pool.query(
    `INSERT INTO content_sections (section, data, updated_at) VALUES ('site', $1, now())
     ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [JSON.stringify(content)]);
  res.json({ ok: true });
}));

// ---------- admin password change ----------
app.post(['/api/admin/password', `${APP_PREFIX}/api/admin/password`], requireAdmin(async (req, res) => {
  const { current, next } = req.body || {};
  if (!current || !next) return res.status(400).json({ ok: false, error: 'current and next password required' });
  if (String(next).length < 8) return res.status(400).json({ ok: false, error: 'new password must be at least 8 characters' });
  const { rows } = await pool.query(`SELECT password_hash FROM admin_users WHERE username = 'admin'`);
  if (!rows[0] || !verifyPassword(current, rows[0].password_hash)) {
    return res.status(401).json({ ok: false, error: 'current password is wrong' });
  }
  await pool.query(`UPDATE admin_users SET password_hash = $1 WHERE username = 'admin'`, [hashPassword(next)]);
  res.json({ ok: true });
}));

// ---------- contact form ----------
app.post(['/api/contact', `${APP_PREFIX}/api/contact`], async (req, res) => {
  const { name, email, organization, inquiryType, message } = req.body || {};

  if (!name || !String(name).trim() || !email || !String(email).trim() || !message || !String(message).trim()) {
    return res.status(400).json({ ok: false, error: 'name, email and message are required' });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(email).trim())) {
    return res.status(400).json({ ok: false, error: 'invalid email address' });
  }
  if (!pool) {
    return res.status(503).json({ ok: false, error: 'database_unavailable' });
  }

  const allowedTypes = new Set(['investor', 'grant', 'partner', 'media', 'general']);
  const safeType = allowedTypes.has(inquiryType) ? inquiryType : 'general';

  try {
    await pool.query(
      `INSERT INTO contact_submissions (name, email, organization, inquiry_type, message) VALUES ($1, $2, $3, $4, $5)`,
      [String(name).trim(), String(email).trim(), organization ? String(organization).trim() : null, safeType, String(message).trim()]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[contact] insert failed:', e.message);
    res.status(503).json({ ok: false, error: 'database_unavailable' });
  }
});

// ---------- contact submissions for admin ----------
app.get(['/api/admin/submissions', `${APP_PREFIX}/api/admin/submissions`], requireAdmin(async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT name, email, organization, inquiry_type, message, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 200');
  res.json({ ok: true, submissions: rows });
}));

// ---------- static site ----------
const distDir = path.join(__dirname, 'client', 'dist');
app.use(express.static(distDir));
app.use(APP_PREFIX, express.static(distDir));

app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

const PORT = process.env.PORT || 4031;
app.listen(PORT, '0.0.0.0', () => console.log(`Sintel Technologies listening on ${PORT}`))
  .on('error', (e) => { console.error('listen failed:', e.message); process.exit(1); });
