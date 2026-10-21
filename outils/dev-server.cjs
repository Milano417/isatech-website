/**
 * Serveur de développement local (Node.js, sans dépendance).
 * Reproduit l'API PHP (api/index.php) pour tester le site sans installer PHP.
 *
 *   node outils/dev-server.cjs   puis ouvrir http://localhost:8080
 *
 * En production, utilisez l'hébergement PHP : ce fichier n'est pas nécessaire.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const UPLOADS = path.join(ROOT, 'uploads');
// Fichier séparé : le format de hachage diffère de celui de PHP.
const AUTH_FILE = path.join(DATA, 'auth.dev.json');
const PORT = Number(process.env.PORT) || 8080;
const COLLECTIONS = ['formations', 'news', 'gallery', 'infos', 'messages'];
const MAX_UPLOAD = 8 * 1024 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

const sessions = new Map();

const readJson = (name, def = []) => {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, name + '.json'), 'utf8')); } catch { return def; }
};
const writeJson = (name, value) => fs.writeFileSync(path.join(DATA, name + '.json'), JSON.stringify(value, null, 2));
const newId = prefix => prefix + crypto.randomBytes(5).toString('hex');
const byDateDesc = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));

function readAuth() {
  try { return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8')); } catch { return {}; }
}
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  return salt + ':' + crypto.scryptSync(pw, salt, 32).toString('hex');
}
function checkPassword(pw, stored) {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(pw, salt, 32);
  return crypto.timingSafeEqual(test, Buffer.from(hash, 'hex'));
}

function getSession(req, res) {
  const match = /(?:^|;\s*)ISATECH_DEV=([a-f0-9]+)/.exec(req.headers.cookie || '');
  if (match && sessions.has(match[1])) return sessions.get(match[1]);
  const id = crypto.randomBytes(16).toString('hex');
  const session = { id };
  sessions.set(id, session);
  res.setHeader('Set-Cookie', `ISATECH_DEV=${id}; HttpOnly; SameSite=Strict; Path=/`);
  return session;
}

function send(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', c => {
      size += c.length;
      if (size > limit) { reject(new Error('Fichier trop lourd (8 Mo maximum).')); req.destroy(); }
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Extrait le premier fichier d'un corps multipart/form-data
function parseMultipartFile(buffer, contentType) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/.exec(contentType || '');
  if (!m) return null;
  const boundary = Buffer.from('--' + (m[1] || m[2]));
  let start = buffer.indexOf(boundary);
  while (start !== -1) {
    const headerEnd = buffer.indexOf('\r\n\r\n', start);
    if (headerEnd === -1) return null;
    const headers = buffer.slice(start, headerEnd).toString();
    const next = buffer.indexOf(boundary, headerEnd);
    if (next === -1) return null;
    if (/filename="/.test(headers)) return buffer.slice(headerEnd + 4, next - 2);
    start = next;
  }
  return null;
}

function imageExt(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpg';
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'webp';
  if (buf.slice(0, 3).toString() === 'GIF') return 'gif';
  return null;
}

async function handleApi(req, res, action) {
  const session = getSession(req, res);
  const isPost = req.method === 'POST';
  const json = async () => {
    try { return JSON.parse((await readBody(req, 1024 * 1024)).toString() || '{}'); } catch { return {}; }
  };
  const requireAdmin = () => {
    if (!isPost) { send(res, 405, { error: 'Méthode non autorisée.' }); return false; }
    if (!session.admin) { send(res, 401, { error: 'Session expirée, veuillez vous reconnecter.' }); return false; }
    if (req.headers['x-csrf-token'] !== session.csrf) { send(res, 403, { error: 'Jeton de sécurité invalide.' }); return false; }
    return true;
  };
  const login = () => {
    session.admin = true;
    session.csrf = crypto.randomBytes(32).toString('hex');
    return session.csrf;
  };

  switch (action) {
    case 'public':
      return send(res, 200, {
        settings: readJson('settings', {}),
        formations: readJson('formations').filter(f => f.published).sort((a, b) => (a.order || 0) - (b.order || 0)),
        news: readJson('news').filter(n => n.published).sort(byDateDesc),
        infos: readJson('infos').filter(i => i.active).sort(byDateDesc),
        gallery: readJson('gallery').sort(byDateDesc)
      });

    case 'contact': {
      if (!isPost) return send(res, 405, { error: 'Méthode non autorisée.' });
      const b = await json();
      if (b.website) return send(res, 200, { ok: true });
      const name = String(b.name || '').trim().slice(0, 120);
      const email = String(b.email || '').trim().slice(0, 160);
      const message = String(b.message || '').trim().slice(0, 5000);
      if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return send(res, 400, { error: 'Veuillez renseigner votre nom, un email valide et votre message.' });
      }
      if (session.lastContact > Date.now() - 30000) return send(res, 429, { error: 'Merci de patienter quelques secondes avant un nouvel envoi.' });
      session.lastContact = Date.now();
      const list = readJson('messages');
      list.unshift({
        id: newId('m'), name, email, phone: String(b.phone || '').trim().slice(0, 40), subject: String(b.subject || '').trim().slice(0, 200),
        message, status: 'nouveau', date: new Date().toISOString()
      });
      writeJson('messages', list.slice(0, 1000));
      return send(res, 200, { ok: true });
    }

    case 'session':
      return send(res, 200, { authenticated: !!session.admin, needsSetup: !readAuth().hash, csrf: session.admin ? session.csrf : null });

    case 'setup': {
      if (!isPost) return send(res, 405, { error: 'Méthode non autorisée.' });
      if (readAuth().hash) return send(res, 403, { error: 'Le mot de passe est déjà configuré.' });
      const { password = '' } = await json();
      if (password.length < 8) return send(res, 400, { error: 'Le mot de passe doit contenir au moins 8 caractères.' });
      fs.writeFileSync(AUTH_FILE, JSON.stringify({ hash: hashPassword(password) }));
      return send(res, 200, { ok: true, csrf: login() });
    }

    case 'login': {
      if (!isPost) return send(res, 405, { error: 'Méthode non autorisée.' });
      session.attempts = (session.attempts || []).filter(t => t > Date.now() - 900000);
      if (session.attempts.length >= 5) return send(res, 429, { error: 'Trop de tentatives. Réessayez dans 15 minutes.' });
      const { password = '' } = await json();
      if (!checkPassword(String(password), readAuth().hash)) {
        session.attempts.push(Date.now());
        return send(res, 401, { error: 'Mot de passe incorrect.' });
      }
      session.attempts = [];
      return send(res, 200, { ok: true, csrf: login() });
    }

    case 'logout':
      sessions.delete(session.id);
      return send(res, 200, { ok: true });

    case 'admin_data': {
      if (!session.admin) return send(res, 401, { error: 'Non autorisé.' });
      const out = { settings: readJson('settings', {}) };
      COLLECTIONS.forEach(c => { out[c] = readJson(c); });
      return send(res, 200, out);
    }

    case 'save': {
      if (!requireAdmin()) return;
      const { collection, item } = await json();
      if (!COLLECTIONS.includes(collection) || collection === 'messages' || !item || typeof item !== 'object') {
        return send(res, 400, { error: 'Requête invalide.' });
      }
      const list = readJson(collection);
      if (!item.id) {
        item.id = newId(collection[0]);
        list.unshift(item);
      } else {
        const i = list.findIndex(x => x.id === item.id);
        if (i >= 0) list[i] = item; else list.unshift(item);
      }
      writeJson(collection, list);
      return send(res, 200, { ok: true, item });
    }

    case 'delete': {
      if (!requireAdmin()) return;
      const { collection, id } = await json();
      if (!COLLECTIONS.includes(collection)) return send(res, 400, { error: 'Requête invalide.' });
      const list = readJson(collection);
      const removed = list.find(x => x.id === id);
      writeJson(collection, list.filter(x => x.id !== id));
      if (collection === 'gallery' && removed && String(removed.url).startsWith('uploads/')) {
        fs.rmSync(path.join(UPLOADS, path.basename(removed.url)), { force: true });
      }
      return send(res, 200, { ok: true });
    }

    case 'message_status': {
      if (!requireAdmin()) return;
      const { id, status } = await json();
      const list = readJson('messages');
      list.forEach(m => { if (m.id === id) m.status = ['nouveau', 'lu', 'traite'].includes(status) ? status : 'lu'; });
      writeJson('messages', list);
      return send(res, 200, { ok: true });
    }

    case 'settings': {
      if (!requireAdmin()) return;
      const { settings } = await json();
      if (!settings || typeof settings !== 'object') return send(res, 400, { error: 'Requête invalide.' });
      writeJson('settings', settings);
      return send(res, 200, { ok: true });
    }

    case 'upload': {
      if (!requireAdmin()) return;
      let body;
      try { body = await readBody(req, MAX_UPLOAD + 64 * 1024); } catch (e) { return send(res, 400, { error: e.message }); }
      const file = parseMultipartFile(body, req.headers['content-type']);
      if (!file || !file.length) return send(res, 400, { error: "Échec de l'envoi du fichier." });
      if (file.length > MAX_UPLOAD) return send(res, 400, { error: 'Image trop lourde (8 Mo maximum).' });
      const ext = imageExt(file);
      if (!ext) return send(res, 400, { error: 'Format non accepté (JPG, PNG, WEBP ou GIF uniquement).' });
      const d = new Date();
      const name = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
      fs.mkdirSync(UPLOADS, { recursive: true });
      fs.writeFileSync(path.join(UPLOADS, name), file);
      return send(res, 200, { ok: true, url: 'uploads/' + name });
    }

    case 'password': {
      if (!requireAdmin()) return;
      const b = await json();
      if (!checkPassword(String(b.current || ''), readAuth().hash)) return send(res, 400, { error: 'Mot de passe actuel incorrect.' });
      if (String(b.new || '').length < 8) return send(res, 400, { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
      fs.writeFileSync(AUTH_FILE, JSON.stringify({ hash: hashPassword(String(b.new)) }));
      return send(res, 200, { ok: true });
    }

    default:
      return send(res, 404, { error: 'Action inconnue.' });
  }
}

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(ROOT, rel));
  const blocked = /^[\\/](data|api)([\\/]|$)/.test(rel) || /\.(php|json|md)$/.test(rel) || path.basename(rel).startsWith('.') || /^[/]outils([/]|$)/.test(rel);
  if (!file.startsWith(ROOT) || blocked || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(ROOT, 'index.html')).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/api/' || url.pathname === '/api/index.php') {
      await handleApi(req, res, url.searchParams.get('action') || '');
    } else {
      serveStatic(req, res, url.pathname);
    }
  } catch (e) {
    console.error(e);
    if (!res.headersSent) send(res, 500, { error: 'Erreur interne.' });
  }
}).listen(PORT, () => {
  console.log(`ISATech — serveur local : http://localhost:${PORT}`);
  console.log(`Administration        : http://localhost:${PORT}/admin/`);
});
