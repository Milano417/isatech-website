/* =========================================================
   ISATech — espace administration (100 % HTML/CSS/JS)

   Pas de serveur : le contenu du site est dans data/*.json et
   les photos dans uploads/. L'admin les lit et les enregistre
   directement dans le dépôt GitHub du site grâce à l'API GitHub.
   L'hébergeur (GitHub Pages, Netlify…) republie le site tout
   seul après chaque enregistrement (1 à 2 minutes).
   ========================================================= */
(function () {
  'use strict';

  const DEFAULT_REPO = 'Milano417/isatech-website';
  const DEFAULT_BRANCH = 'main';
  const STORAGE_KEY = 'isatech-admin-github';
  const MAX_IMAGE_SIDE = 1600;
  const FILES = {
    settings: 'data/settings.json',
    formations: 'data/formations.json',
    news: 'data/news.json',
    infos: 'data/infos.json',
    gallery: 'data/gallery.json'
  };

  let gh = null;        // { repo: 'utilisateur/depot', branch, token }
  let data = null;      // contenu chargé depuis le dépôt
  const shas = {};      // version GitHub de chaque fichier (obligatoire pour le modifier)
  const localPreviews = {}; // photos tout juste envoyées, pas encore publiées par l'hébergeur
  let currentTab = 'dashboard';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Les chemins enregistrés sont relatifs à la racine du site ; l'admin est un dossier plus bas.
  function assetUrl(url) {
    const u = String(url || '');
    if (localPreviews[u]) return localPreviews[u];
    if (!u || /^([a-z]+:|\/)/i.test(u)) return u;
    return '../' + u;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
    return isNaN(d) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function newId(prefix) {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function toast(message, isError) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.toggle('error', !!isError);
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), isError ? 6000 : 3200);
  }

  const PUBLISH_DELAY = ' Le site sera à jour dans 1 à 2 minutes.';

  // ---------- Encodage base64 (l'API GitHub transporte les fichiers en base64) ----------
  function bytesToBase64(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  }

  function textToBase64(text) {
    return bytesToBase64(new TextEncoder().encode(text));
  }

  function base64ToText(b64) {
    const binary = atob(String(b64).replace(/\s/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  async function blobToBase64(blob) {
    return bytesToBase64(new Uint8Array(await blob.arrayBuffer()));
  }

  // ---------- API GitHub ----------
  async function github(path, options = {}) {
    let res;
    try {
      res = await fetch('https://api.github.com' + path, {
        cache: 'no-store',
        ...options,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: 'Bearer ' + gh.token,
          'X-GitHub-Api-Version': '2022-11-28',
          ...(options.body ? { 'Content-Type': 'application/json' } : {})
        }
      });
    } catch (e) {
      throw new Error('Connexion à GitHub impossible. Vérifiez votre connexion internet.');
    }
    let json = {};
    try { json = await res.json(); } catch (e) { /* réponse vide */ }
    if (res.ok) return json;
    const detail = json.message ? ` (${json.message})` : '';
    if (res.status === 401) throw new Error('Jeton GitHub invalide ou expiré. Reconnectez-vous avec un nouveau jeton.');
    if (res.status === 403) throw new Error("Ce jeton n'a pas le droit de modifier le dépôt (permission « Contents : Read and write » requise)." + detail);
    if (res.status === 404) throw new Error('Dépôt ou fichier introuvable. Vérifiez le nom du dépôt et les droits du jeton.' + detail);
    if (res.status === 409 || res.status === 422) {
      throw new Error('Le fichier a été modifié ailleurs entre-temps. Rechargez la page (F5) puis recommencez.' + detail);
    }
    throw new Error('Erreur GitHub ' + res.status + detail);
  }

  function contentsUrl(path) {
    return `/repos/${gh.repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  }

  async function readJsonFile(path) {
    const file = await github(contentsUrl(path) + '?ref=' + encodeURIComponent(gh.branch));
    shas[path] = file.sha;
    return JSON.parse(base64ToText(file.content));
  }

  async function writeFile(path, base64, message) {
    const body = { message, content: base64, branch: gh.branch };
    if (shas[path]) body.sha = shas[path];
    const res = await github(contentsUrl(path), { method: 'PUT', body: JSON.stringify(body) });
    shas[path] = res.content.sha;
  }

  async function deleteFile(path, message) {
    if (!shas[path]) {
      const meta = await github(contentsUrl(path) + '?ref=' + encodeURIComponent(gh.branch));
      shas[path] = meta.sha;
    }
    await github(contentsUrl(path), { method: 'DELETE', body: JSON.stringify({ message, sha: shas[path], branch: gh.branch }) });
    delete shas[path];
  }

  // Enregistre une liste (ou les options) dans son fichier JSON
  function saveFile(name, message) {
    return writeFile(FILES[name], textToBase64(JSON.stringify(data[name], null, 2) + '\n'), message);
  }

  async function loadAll() {
    const names = Object.keys(FILES);
    const values = await Promise.all(names.map(n => readJsonFile(FILES[n])));
    data = {};
    names.forEach((n, i) => { data[n] = values[i]; });
  }

  // ---------- Photos ----------
  // Redimensionne et compresse une photo avant l'envoi (plus rapide sur mobile, dépôt plus léger).
  function compressImage(file) {
    return new Promise(resolve => {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return resolve(file);
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.width, img.height));
        if (scale === 1 && file.size < 600 * 1024) return resolve(file);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => resolve(blob && blob.size < file.size ? blob : file), 'image/jpeg', 0.82);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  const IMAGE_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

  async function uploadImage(file) {
    const blob = await compressImage(file);
    const ext = IMAGE_EXT[blob.type];
    if (!ext) throw new Error('Format non accepté (JPG, PNG, WEBP ou GIF uniquement).');
    if (blob.size > 20 * 1024 * 1024) throw new Error('Image trop lourde.');
    const path = `uploads/${today().replace(/-/g, '')}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    await writeFile(path, await blobToBase64(blob), 'Ajout de la photo ' + file.name);
    localPreviews[path] = URL.createObjectURL(blob);
    return path;
  }

  // ---------- Connexion ----------
  function loadConfig() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch (e) { return null; }
  }

  function storeConfig(config) {
    try {
      if (config) localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* stockage indisponible : il faudra se reconnecter à chaque visite */ }
  }

  function showAuth(message) {
    $('#app').hidden = true;
    $('#auth').hidden = false;
    const saved = loadConfig() || {};
    $('#auth-repo').value = saved.repo || DEFAULT_REPO;
    $('#auth-branch').value = saved.branch || DEFAULT_BRANCH;
    $('#auth-error').textContent = message || '';
    $('#auth-token').focus();
  }

  async function connect(config) {
    gh = config;
    const repo = await github(`/repos/${gh.repo}`);
    if (repo.permissions && !repo.permissions.push) {
      throw new Error("Ce jeton peut lire le dépôt mais pas le modifier (permission « Contents : Read and write » requise).");
    }
    await loadAll();
  }

  $('#auth-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const config = {
      token: form.token.value.trim(),
      repo: (form.repo.value.trim() || DEFAULT_REPO).replace(/^https:\/\/github\.com\//, '').replace(/\.git$|\/$/g, ''),
      branch: form.branch.value.trim() || DEFAULT_BRANCH
    };
    const err = $('#auth-error');
    err.textContent = '';
    if (!config.token) { err.textContent = 'Collez le jeton GitHub.'; return; }
    if (!/^[\w.-]+\/[\w.-]+$/.test(config.repo)) { err.textContent = 'Le dépôt doit être au format utilisateur/depot.'; return; }
    const btn = $('#auth-submit');
    btn.disabled = true;
    btn.textContent = 'Connexion…';
    try {
      await connect(config);
      storeConfig(config);
      form.token.value = '';
      startApp();
    } catch (ex) {
      gh = null;
      err.textContent = ex.message;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Se connecter';
    }
  });

  function logout() {
    storeConfig(null);
    gh = null;
    data = null;
    showAuth('Vous êtes déconnecté.');
  }

  $('#logout').addEventListener('click', logout);

  function startApp() {
    $('#auth').hidden = true;
    $('#app').hidden = false;
    const hash = location.hash.slice(1);
    show(VIEWS[hash] ? hash : currentTab);
  }

  // ---------- Navigation ----------
  $('#tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]');
    if (btn) show(btn.dataset.tab);
  });

  function show(tab) {
    currentTab = tab;
    if (location.hash.slice(1) !== tab) history.replaceState(null, '', '#' + tab);
    $$('#tabs [data-tab]').forEach(b => {
      if (b.dataset.tab === tab) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    // Nouveau conteneur à chaque affichage pour ne pas cumuler les écouteurs d'événements
    const view = document.createElement('div');
    view.innerHTML = VIEWS[tab]();
    $('#content').replaceChildren(view);
    if (BIND[tab]) BIND[tab](view);
  }

  function refresh() {
    show(currentTab);
  }

  function pageTitle(title, subtitle, actions) {
    return `<div class="page-title"><div><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${actions || ''}</div>`;
  }

  // ---------- Schémas des formulaires ----------
  const TYPE_LABELS = { info: 'Information', important: 'Important', urgent: 'Urgent' };

  const SCHEMAS = {
    formations: {
      label: 'formation',
      prefix: 'f',
      fields: () => [
        { name: 'code', label: 'Code de la filière', help: 'Ex : IDA, FCGE…', required: true },
        { name: 'category', label: 'Domaine', list: [...new Set(data.formations.map(f => f.category))] },
        { name: 'name', label: 'Nom complet de la formation', required: true, span: true },
        { name: 'shortDescription', label: 'Accroche', help: 'Une phrase affichée sur la carte de la formation.', type: 'textarea', span: true },
        { name: 'description', label: 'Présentation détaillée', type: 'textarea', span: true },
        { name: 'level', label: 'Diplôme / niveau', help: "Ex : BTS d'État (BAC+2)" },
        { name: 'duration', label: 'Durée', help: 'Ex : 2 ans (4 semestres)' },
        { name: 'image', label: 'Photo de la formation', type: 'image', span: true },
        { name: 'objectives', label: 'Objectifs', type: 'lines', help: 'Un objectif par ligne.', span: true },
        { name: 'skills', label: 'Compétences acquises', type: 'lines', help: 'Une compétence par ligne.', span: true },
        { name: 'program', label: 'Programme par semestre', type: 'program', span: true },
        { name: 'opportunities', label: 'Débouchés', type: 'lines', help: 'Un métier par ligne.', span: true },
        { name: 'admissionRequirements', label: "Conditions d'admission", type: 'lines', help: 'Une condition par ligne.', span: true },
        { name: 'order', label: "Ordre d'affichage", type: 'number', help: '1 = affichée en premier.' },
        { name: 'published', label: 'Visible sur le site', type: 'checkbox', default: true }
      ]
    },
    news: {
      label: 'actualité',
      prefix: 'n',
      fields: () => [
        { name: 'title', label: 'Titre', required: true, span: true },
        { name: 'category', label: 'Catégorie', type: 'select', options: data.settings.newsCategories || [] },
        { name: 'date', label: 'Date de publication', type: 'date', default: today() },
        { name: 'image', label: "Photo de l'article", type: 'image', span: true },
        { name: 'excerpt', label: 'Résumé', help: 'Deux phrases maximum, affichées dans la liste des actualités.', type: 'textarea', span: true, required: true },
        { name: 'content', label: 'Texte complet', help: 'Laissez une ligne vide entre les paragraphes. Commencez une ligne par « - » pour faire une liste.', type: 'textarea', tall: true, span: true },
        { name: 'author', label: 'Auteur / service', default: 'Direction ISATech' },
        { name: 'published', label: 'Publiée sur le site', type: 'checkbox', default: true }
      ]
    },
    infos: {
      label: 'information',
      prefix: 'i',
      fields: () => [
        { name: 'title', label: 'Titre', required: true, span: true },
        { name: 'text', label: 'Message', type: 'textarea', span: true },
        { name: 'type', label: 'Importance', type: 'select', options: Object.keys(TYPE_LABELS), labels: TYPE_LABELS, default: 'info' },
        { name: 'date', label: 'Date', type: 'date', default: today() },
        { name: 'link', label: 'Lien (facultatif)', help: 'Adresse d\'un document ou d\'une page (https://…).', span: true },
        { name: 'banner', label: 'Afficher en bandeau en haut du site', type: 'checkbox' },
        { name: 'active', label: 'Visible sur le site', type: 'checkbox', default: true }
      ]
    },
    gallery: {
      label: 'photo',
      prefix: 'g',
      fields: () => [
        { name: 'url', label: 'Photo', type: 'image', span: true, required: true },
        { name: 'title', label: 'Légende', required: true, span: true },
        { name: 'category', label: 'Catégorie', type: 'select', options: data.settings.galleryCategories || [] },
        { name: 'date', label: 'Date', type: 'date', default: today() },
        { name: 'description', label: 'Description (facultatif)', type: 'textarea', span: true }
      ]
    }
  };

  // ---------- Champs de formulaire ----------
  function fieldHtml(f, value) {
    const id = 'f-' + f.name;
    const v = value === undefined ? (f.default !== undefined ? f.default : '') : value;
    const help = f.help ? `<small>${esc(f.help)}</small>` : '';
    const req = f.required ? ' required' : '';
    const wrap = inner => `<div class="field${f.span ? ' span-2' : ''}" data-field="${f.name}" data-type="${f.type || 'text'}">${inner}</div>`;
    switch (f.type) {
      case 'textarea':
        return wrap(`<label for="${id}">${esc(f.label)}${f.required ? ' *' : ''}</label>${help}<textarea id="${id}" name="${f.name}"${f.tall ? ' class="tall"' : ''}${req}>${esc(v)}</textarea>`);
      case 'lines':
        return wrap(`<label for="${id}">${esc(f.label)}</label>${help}<textarea id="${id}" name="${f.name}">${esc((v || []).join('\n'))}</textarea>`);
      case 'select': {
        const opts = [...f.options];
        if (v && !opts.includes(v)) opts.push(v);
        return wrap(`<label for="${id}">${esc(f.label)}</label><select id="${id}" name="${f.name}">${opts.map(o => `<option value="${esc(o)}"${o === v ? ' selected' : ''}>${esc(f.labels ? f.labels[o] : o)}</option>`).join('')}</select>`);
      }
      case 'checkbox':
        return wrap(`<label class="check"><input type="checkbox" name="${f.name}"${v ? ' checked' : ''}> ${esc(f.label)}</label>`);
      case 'date':
      case 'number':
        return wrap(`<label for="${id}">${esc(f.label)}</label>${help}<input id="${id}" type="${f.type}" name="${f.name}" value="${esc(v)}"${req}>`);
      case 'image':
        return wrap(`
          <span>${esc(f.label)}${f.required ? ' *' : ''}</span>
          <div class="image-field">
            <img class="image-preview" src="${esc(assetUrl(v))}" alt=""${v ? '' : ' hidden'}>
            <div class="image-actions">
              <label class="btn btn-primary btn-sm">Choisir une photo<input type="file" accept="image/*" hidden data-image-input></label>
              <span class="upload-state" style="color:var(--muted);font-size:.85rem"></span>
            </div>
            <input type="text" name="${f.name}" value="${esc(v)}" placeholder="ou collez l'adresse d'une image (https://…)" aria-label="Adresse de l'image"${req}>
          </div>`);
      case 'program':
        return wrap(`<span>${esc(f.label)}</span><small>Un module par ligne.</small><div class="program">${(v || []).map(semesterHtml).join('')}</div><button class="btn btn-ghost btn-sm" type="button" data-add-semester>+ Ajouter un semestre</button>`);
      default: {
        const list = f.list ? `<datalist id="${id}-list">${f.list.map(o => `<option value="${esc(o)}">`).join('')}</datalist>` : '';
        return wrap(`<label for="${id}">${esc(f.label)}${f.required ? ' *' : ''}</label>${help}<input id="${id}" name="${f.name}" value="${esc(v)}"${f.list ? ` list="${id}-list"` : ''}${req}>${list}`);
      }
    }
  }

  function semesterHtml(s) {
    s = s || { semester: '', modules: [] };
    return `<div class="semester">
      <div class="semester-head">
        <input class="sem-title" value="${esc(s.semester)}" placeholder="Ex : Semestre 1 — Fondamentaux" aria-label="Titre du semestre">
        <button class="btn btn-danger btn-sm" type="button" data-remove-semester aria-label="Supprimer ce semestre">Supprimer</button>
      </div>
      <textarea class="sem-modules" aria-label="Modules du semestre">${esc((s.modules || []).join('\n'))}</textarea>
    </div>`;
  }

  function bindFields(root) {
    $$('[data-image-input]', root).forEach(input => {
      input.addEventListener('change', async () => {
        const file = input.files[0];
        if (!file) return;
        const field = input.closest('.image-field');
        const state = $('.upload-state', field);
        state.textContent = 'Envoi en cours…';
        try {
          const url = await uploadImage(file);
          $('input[type=text]', field).value = url;
          const img = $('.image-preview', field);
          img.src = assetUrl(url);
          img.hidden = false;
          state.textContent = 'Photo envoyée ✓ — pensez à enregistrer';
        } catch (e) {
          state.textContent = '';
          toast(e.message, true);
        }
        input.value = '';
      });
    });
    $$('.image-field input[type=text]', root).forEach(input => {
      input.addEventListener('change', () => {
        const img = $('.image-preview', input.closest('.image-field'));
        img.src = assetUrl(input.value.trim());
        img.hidden = !input.value.trim();
      });
    });
    root.addEventListener('click', e => {
      if (e.target.closest('[data-add-semester]')) {
        const prog = $('.program', e.target.closest('.field'));
        prog.insertAdjacentHTML('beforeend', semesterHtml());
        $('.semester:last-child .sem-title', prog).focus();
      }
      const rm = e.target.closest('[data-remove-semester]');
      if (rm && confirm('Supprimer ce semestre ?')) rm.closest('.semester').remove();
    });
  }

  function collect(root, fields) {
    const out = {};
    for (const f of fields) {
      const el = $(`[data-field="${f.name}"]`, root);
      if (!el) continue;
      switch (f.type) {
        case 'checkbox': out[f.name] = $('input', el).checked; break;
        case 'number': out[f.name] = Number($('input', el).value) || 0; break;
        case 'lines': out[f.name] = $('textarea', el).value.split('\n').map(s => s.trim()).filter(Boolean); break;
        case 'program':
          out[f.name] = $$('.semester', el).map(s => ({
            semester: $('.sem-title', s).value.trim(),
            modules: $('.sem-modules', s).value.split('\n').map(x => x.trim()).filter(Boolean)
          })).filter(s => s.semester || s.modules.length);
          break;
        case 'image': out[f.name] = $('input[type=text]', el).value.trim(); break;
        default: out[f.name] = $('input, textarea, select', el).value.trim();
      }
      if (f.required && !out[f.name]) throw new Error(`Le champ « ${f.label} » est obligatoire.`);
    }
    return out;
  }

  // ---------- Fenêtre d'édition ----------
  const dialog = $('#editor');
  let onSave = null;
  let editorView = null;

  function openEditor(title, html, saveHandler) {
    $('#editor-title').textContent = title;
    $('#editor-error').textContent = '';
    editorView = document.createElement('div');
    editorView.innerHTML = html;
    $('#editor-body').replaceChildren(editorView);
    onSave = saveHandler;
    bindFields(editorView);
    dialog.showModal();
    $('#editor-body').scrollTop = 0;
  }

  $$('[data-close]', dialog).forEach(b => b.addEventListener('click', () => dialog.close()));

  $('#editor-form').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('#editor-save');
    btn.disabled = true;
    btn.textContent = 'Enregistrement…';
    $('#editor-error').textContent = '';
    try {
      await onSave(editorView);
      dialog.close();
      refresh();
    } catch (ex) {
      $('#editor-error').textContent = ex.message;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enregistrer';
    }
  });

  function editItem(collection, item) {
    const schema = SCHEMAS[collection];
    const fields = schema.fields();
    const isNew = !item;
    const html = `<div class="form-grid cols-2">${fields.map(f => fieldHtml(f, item ? item[f.name] : undefined)).join('')}</div>`;
    openEditor(isNew ? `Ajouter une ${schema.label}` : `Modifier la ${schema.label}`, html, async root => {
      const values = collect(root, fields);
      const saved = Object.assign({}, item || { id: newId(schema.prefix) }, values);
      await commitChange(collection, list => {
        const i = list.findIndex(x => x.id === saved.id);
        if (i >= 0) list[i] = saved; else list.unshift(saved);
      }, `${isNew ? 'Ajout' : 'Modification'} : ${saved.title || saved.name || saved.code || schema.label}`);
      toast((isNew ? `${capitalize(schema.label)} ajoutée ✓.` : 'Modifications enregistrées ✓.') + PUBLISH_DELAY);
    });
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Applique une modification à une liste puis l'enregistre ; annule localement en cas d'échec.
  async function commitChange(collection, change, message) {
    const before = clone(data[collection]);
    change(data[collection]);
    try {
      await saveFile(collection, message);
    } catch (e) {
      data[collection] = before;
      throw e;
    }
  }

  async function deleteItem(collection, id, label) {
    if (!confirm(`Supprimer définitivement ${label} ?`)) return;
    const item = data[collection].find(x => x.id === id);
    try {
      await commitChange(collection, list => {
        const i = list.findIndex(x => x.id === id);
        if (i >= 0) list.splice(i, 1);
      }, `Suppression : ${label}`);
      // Supprime aussi le fichier d'une photo envoyée depuis l'admin
      if (collection === 'gallery' && item && String(item.url).startsWith('uploads/')) {
        try { await deleteFile(item.url, 'Suppression de la photo ' + item.url); } catch (e) { console.warn(e); }
      }
      toast('Élément supprimé.' + PUBLISH_DELAY);
      refresh();
    } catch (e) {
      toast(e.message, true);
    }
  }

  async function toggle(collection, id, key) {
    const item = data[collection].find(x => x.id === id);
    if (!item) return;
    try {
      await commitChange(collection, list => {
        const target = list.find(x => x.id === id);
        target[key] = !target[key];
      }, `Modification : ${item.title || item.name || item.code}`);
      toast('Enregistré ✓.' + PUBLISH_DELAY);
    } catch (e) {
      toast(e.message, true);
    }
    refresh();
  }

  // Gestion commune des boutons d'action dans les listes
  function bindActions(root, collection, labelOf) {
    root.addEventListener('click', e => {
      const btn = e.target.closest('[data-act]');
      if (!btn || btn.disabled) return;
      const id = btn.dataset.id;
      const item = data[collection].find(x => x.id === id);
      switch (btn.dataset.act) {
        case 'add': editItem(collection, null); break;
        case 'edit': editItem(collection, item); break;
        case 'delete': deleteItem(collection, id, labelOf(item)); break;
        case 'toggle':
          btn.disabled = true;
          toggle(collection, id, btn.dataset.key);
          break;
      }
    });
  }

  // ---------- Vues ----------
  const byDateDesc = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));
  const notice = `<div class="notice">Chaque enregistrement est publié automatiquement : le site public est mis à jour 1 à 2 minutes après.</div>`;

  const VIEWS = {
    dashboard() {
      return pageTitle('Tableau de bord', 'Bienvenue dans l\'espace de gestion du site ISATech.') + notice + `
        <div class="kpis">
          <button class="kpi" data-go="formations"><strong>${data.formations.filter(f => f.published).length}</strong><span>Formations en ligne</span></button>
          <button class="kpi" data-go="news"><strong>${data.news.filter(n => n.published).length}</strong><span>Actualités publiées</span></button>
          <button class="kpi" data-go="gallery"><strong>${data.gallery.length}</strong><span>Photos dans la galerie</span></button>
          <button class="kpi" data-go="infos"><strong>${data.infos.filter(i => i.active).length}</strong><span>Infos en cours</span></button>
        </div>
        <div class="box">
          <h2>Actions rapides</h2>
          <div class="quick">
            <button class="btn btn-primary" data-quick="gallery">+ Ajouter des photos</button>
            <button class="btn btn-primary" data-quick="news">+ Publier une actualité</button>
            <button class="btn btn-primary" data-quick="infos">+ Publier une info</button>
            <button class="btn btn-ghost" data-go="settings">Modifier les options du site</button>
          </div>
        </div>`;
    },

    gallery() {
      const cats = data.settings.galleryCategories || [];
      const photos = [...data.gallery].sort(byDateDesc);
      return pageTitle('Galerie photos', `${photos.length} photo${photos.length > 1 ? 's' : ''} en ligne. Les photos sont automatiquement redimensionnées avant l'envoi.`) + `
        <div class="box">
          <h2>Ajouter des photos</h2>
          <div class="upload-opts">
            <div class="field"><label for="up-cat">Catégorie</label><select id="up-cat">${cats.map(c => `<option>${esc(c)}</option>`).join('')}</select></div>
            <div class="field"><label for="up-date">Date</label><input type="date" id="up-date" value="${today()}"></div>
          </div>
          <label class="dropzone" id="dropzone">
            <input type="file" id="up-files" accept="image/*" multiple hidden>
            <strong>Cliquez ou glissez vos photos ici</strong>
            <p>Plusieurs photos à la fois possible — JPG, PNG ou WEBP. Vous pourrez modifier les légendes ensuite.</p>
          </label>
          <div class="progress" id="up-progress" aria-live="polite"></div>
        </div>
        <div class="box">
          <div class="toolbar">
            <h2 style="margin:0;flex:1">Photos en ligne</h2>
            <select id="g-filter" aria-label="Filtrer par catégorie"><option value="">Toutes les catégories</option>${cats.map(c => `<option>${esc(c)}</option>`).join('')}</select>
          </div>
          <div class="photo-grid" id="photo-grid">${photos.map(photoCard).join('')}</div>
          ${photos.length ? '' : '<div class="empty">Aucune photo. Ajoutez-en ci-dessus.</div>'}
        </div>`;
    },

    formations() {
      const list = [...data.formations].sort((a, b) => (a.order || 0) - (b.order || 0));
      return pageTitle('Formations', 'Modifiez le contenu des filières affichées sur le site.', '<button class="btn btn-primary" data-act="add">+ Ajouter une formation</button>') +
        (list.length ? `<div class="list">${list.map(f => `
          <div class="row">
            <span class="row-code">${esc(f.code)}</span>
            <div>
              <h3>${esc(f.name)}</h3>
              <p>${f.published ? '<span class="pill ok">En ligne</span>' : '<span class="pill off">Masquée</span>'}<span class="pill">${esc(f.category)}</span> Ordre ${esc(f.order || '—')}</p>
            </div>
            <div class="row-actions">
              <button class="btn btn-primary btn-sm" data-act="edit" data-id="${esc(f.id)}">Modifier</button>
              <button class="btn btn-ghost btn-sm" data-act="toggle" data-key="published" data-id="${esc(f.id)}">${f.published ? 'Masquer' : 'Publier'}</button>
              <a class="btn btn-ghost btn-sm" href="../#/formation/${encodeURIComponent(f.id)}" target="_blank" rel="noopener">Voir</a>
              <button class="btn btn-danger btn-sm" data-act="delete" data-id="${esc(f.id)}">Supprimer</button>
            </div>
          </div>`).join('')}</div>` : '<div class="empty">Aucune formation.</div>');
    },

    news() {
      const list = [...data.news].sort(byDateDesc);
      return pageTitle('Actualités scolaires', 'Publiez les nouvelles de l\'école : rentrée, examens, événements, vie étudiante…', '<button class="btn btn-primary" data-act="add">+ Nouvelle actualité</button>') + `
        <div class="toolbar"><input type="search" id="news-search" placeholder="Rechercher une actualité…" aria-label="Rechercher"></div>` +
        (list.length ? `<div class="list" id="news-list">${list.map(n => `
          <div class="row" data-search="${esc((n.title + ' ' + n.category).toLowerCase())}">
            ${n.image ? `<img class="row-thumb" src="${esc(assetUrl(n.image))}" alt="">` : '<span class="row-thumb"></span>'}
            <div>
              <h3>${esc(n.title)}</h3>
              <p>${n.published ? '<span class="pill ok">Publiée</span>' : '<span class="pill off">Brouillon</span>'}<span class="pill">${esc(n.category)}</span> ${formatDate(n.date)}</p>
            </div>
            <div class="row-actions">
              <button class="btn btn-primary btn-sm" data-act="edit" data-id="${esc(n.id)}">Modifier</button>
              <button class="btn btn-ghost btn-sm" data-act="toggle" data-key="published" data-id="${esc(n.id)}">${n.published ? 'Dépublier' : 'Publier'}</button>
              <button class="btn btn-danger btn-sm" data-act="delete" data-id="${esc(n.id)}">Supprimer</button>
            </div>
          </div>`).join('')}</div>` : '<div class="empty">Aucune actualité. Cliquez sur « Nouvelle actualité ».</div>');
    },

    infos() {
      const list = [...data.infos].sort(byDateDesc);
      return pageTitle('Infos & communiqués', 'Messages courts : changement d\'horaire, date d\'examen, réunion de parents… Une info peut aussi s\'afficher en bandeau en haut du site.', '<button class="btn btn-primary" data-act="add">+ Nouvelle info</button>') +
        (list.length ? `<div class="list">${list.map(i => `
          <div class="row" style="grid-template-columns:1fr">
            <div>
              <h3>${esc(i.title)}</h3>
              <p>
                ${i.active ? '<span class="pill ok">Visible</span>' : '<span class="pill off">Masquée</span>'}
                <span class="pill ${i.type === 'urgent' ? 'red' : i.type === 'important' ? 'warn' : ''}">${TYPE_LABELS[i.type] || 'Information'}</span>
                ${i.banner ? '<span class="pill warn">Bandeau</span>' : ''}
                ${formatDate(i.date)}
              </p>
              ${i.text ? `<p style="margin-top:6px">${esc(i.text)}</p>` : ''}
            </div>
            <div class="row-actions">
              <button class="btn btn-primary btn-sm" data-act="edit" data-id="${esc(i.id)}">Modifier</button>
              <button class="btn btn-ghost btn-sm" data-act="toggle" data-key="active" data-id="${esc(i.id)}">${i.active ? 'Masquer' : 'Afficher'}</button>
              <button class="btn btn-ghost btn-sm" data-act="toggle" data-key="banner" data-id="${esc(i.id)}">${i.banner ? 'Retirer du bandeau' : 'Mettre en bandeau'}</button>
              <button class="btn btn-danger btn-sm" data-act="delete" data-id="${esc(i.id)}">Supprimer</button>
            </div>
          </div>`).join('')}</div>` : '<div class="empty">Aucune info. Cliquez sur « Nouvelle info ».</div>');
    },

    settings() {
      const s = data.settings;
      const f = (name, label, opts = {}) => fieldHtml(Object.assign({ name, label }, opts), s[name]);
      return pageTitle('Options du site', 'Coordonnées, textes de la page d\'accueil, inscriptions et catégories.') + `
        <form id="settings-form" novalidate>
          <div class="box"><h2>Identité de l'école</h2><div class="form-grid cols-2">
            ${f('shortName', 'Nom court', { required: true })}
            ${f('schoolName', 'Nom complet', { required: true })}
            ${f('slogan', 'Devise')}
            ${f('foundedDate', 'Date de création', { help: 'Ex : 06 septembre 2001' })}
            ${f('foundedYear', 'Année de création')}
            ${f('graduates', 'Nombre de diplômés', { help: 'Ex : 2000+' })}
          </div></div>
          <div class="box"><h2>Coordonnées</h2><div class="form-grid cols-2">
            ${f('address', 'Adresse')}
            ${f('postalBox', 'Boîte postale')}
            ${f('phones', 'Téléphone(s)', { help: 'Séparez plusieurs numéros par « / ».' })}
            ${f('email', 'Email', { help: 'Les messages du formulaire de contact arrivent à cette adresse.' })}
            ${f('whatsapp', 'Numéro WhatsApp', { help: 'Format international sans espace, ex : 2250707039320. Les messages du formulaire de contact peuvent aussi arriver ici. Laissez vide pour masquer WhatsApp.' })}
            ${f('hours', "Horaires d'ouverture")}
            ${f('facebook', 'Page Facebook (lien)')}
            ${f('mapQuery', 'Recherche Google Maps', { help: 'Texte utilisé pour le plan de la page Contact.' })}
          </div></div>
          <div class="box"><h2>Page d'accueil</h2><div class="form-grid cols-2">
            ${f('heroTitle', 'Grand titre', { span: true })}
            ${f('heroSubtitle', 'Texte sous le titre', { type: 'textarea', span: true })}
            ${f('heroImage', 'Photo principale', { type: 'image', span: true })}
          </div></div>
          <div class="box"><h2>Inscriptions</h2><div class="form-grid cols-2">
            ${f('admissionOpen', 'Inscriptions ouvertes (affiche les boutons « S\'inscrire »)', { type: 'checkbox', span: true })}
            ${f('admissionYear', 'Année académique', { help: 'Ex : 2026-2027' })}
          </div></div>
          <div class="box"><h2>Catégories</h2><div class="form-grid cols-2">
            ${f('galleryCategories', 'Catégories de la galerie', { type: 'lines', help: 'Une par ligne.' })}
            ${f('newsCategories', 'Catégories des actualités', { type: 'lines', help: 'Une par ligne.' })}
          </div></div>
          <div class="box" style="display:flex;justify-content:flex-end;gap:10px;position:sticky;bottom:12px;box-shadow:0 10px 30px -10px rgba(10,21,67,.25)">
            <button class="btn btn-primary" type="submit">Enregistrer les options</button>
          </div>
        </form>`;
    },

    account() {
      return pageTitle('Connexion GitHub', 'L\'admin enregistre le contenu du site dans son dépôt GitHub.') + `
        <div class="box">
          <h2>Connexion actuelle</h2>
          <p>Dépôt : <code>${esc(gh.repo)}</code> — branche <code>${esc(gh.branch)}</code></p>
          <p><a href="https://github.com/${esc(gh.repo)}/commits/${encodeURIComponent(gh.branch)}" target="_blank" rel="noopener">Voir l'historique des modifications ↗</a></p>
          <button class="btn btn-danger" type="button" id="account-logout">Se déconnecter de ce navigateur</button>
        </div>
        <div class="box">
          <h2>Créer un jeton pour un nouvel ordinateur</h2>
          <ol class="steps-list">
            <li>Connectez-vous à GitHub puis ouvrez <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">Settings → Developer settings → Fine-grained tokens → Generate new token</a>.</li>
            <li><strong>Repository access</strong> : « Only select repositories » → <code>${esc(gh.repo)}</code>.</li>
            <li><strong>Permissions</strong> → Repository permissions → <strong>Contents : Read and write</strong>.</li>
            <li>Choisissez une date d'expiration, cliquez sur <strong>Generate token</strong> et copiez le jeton (<code>github_pat_…</code>).</li>
            <li>Collez-le dans l'écran de connexion de l'admin.</li>
          </ol>
          <p style="color:var(--muted);margin-top:12px">Si un jeton est perdu ou volé, supprimez-le dans GitHub (même page) : il ne fonctionnera plus immédiatement.</p>
        </div>`;
    }
  };

  function photoCard(p) {
    return `
      <div class="photo" data-cat="${esc(p.category)}">
        <img src="${esc(assetUrl(p.url))}" alt="" loading="lazy">
        <div class="photo-body">
          <strong>${esc(p.title)}</strong>
          <span><span class="pill">${esc(p.category || 'Sans catégorie')}</span></span>
          <div class="photo-actions">
            <button class="btn btn-ghost btn-sm" data-act="edit" data-id="${esc(p.id)}">Modifier</button>
            <button class="btn btn-danger btn-sm" data-act="delete" data-id="${esc(p.id)}" aria-label="Supprimer la photo">Suppr.</button>
          </div>
        </div>
      </div>`;
  }

  // ---------- Comportements propres à chaque vue ----------
  const BIND = {
    dashboard(root) {
      root.addEventListener('click', e => {
        const go = e.target.closest('[data-go]');
        if (go) show(go.dataset.go);
        const quick = e.target.closest('[data-quick]');
        if (!quick) return;
        if (quick.dataset.quick === 'gallery') { show('gallery'); $('#up-files').click(); }
        else editItem(quick.dataset.quick, null);
      });
    },

    gallery(root) {
      bindActions(root, 'gallery', p => `la photo « ${p.title} »`);
      const input = $('#up-files', root);
      const zone = $('#dropzone', root);
      input.addEventListener('change', () => uploadPhotos(input.files));
      ['dragenter', 'dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag'); }));
      ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('drag'); }));
      zone.addEventListener('drop', e => uploadPhotos(e.dataTransfer.files));
      $('#g-filter', root).addEventListener('change', e => {
        const cat = e.target.value;
        $$('.photo', root).forEach(p => { p.hidden = !!cat && p.dataset.cat !== cat; });
      });
    },

    formations(root) {
      bindActions(root, 'formations', f => `la formation « ${f.code} »`);
    },

    news(root) {
      bindActions(root, 'news', n => `l'actualité « ${n.title} »`);
      const search = $('#news-search', root);
      search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase();
        $$('#news-list .row', root).forEach(r => { r.hidden = !!q && !r.dataset.search.includes(q); });
      });
    },

    infos(root) {
      bindActions(root, 'infos', i => `l'info « ${i.title} »`);
    },

    settings(root) {
      const form = $('#settings-form', root);
      bindFields(form);
      const fields = ['shortName', 'schoolName', 'slogan', 'foundedDate', 'foundedYear', 'graduates', 'address', 'postalBox', 'phones', 'email', 'whatsapp', 'hours', 'facebook', 'mapQuery', 'heroTitle', 'heroSubtitle', 'admissionYear']
        .map(name => ({ name, label: name }))
        .concat([
          { name: 'heroImage', type: 'image' },
          { name: 'admissionOpen', type: 'checkbox' },
          { name: 'galleryCategories', type: 'lines' },
          { name: 'newsCategories', type: 'lines' }
        ]);
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = $('button[type=submit]', form);
        btn.disabled = true;
        const before = data.settings;
        try {
          const values = collect(form, fields);
          if (!values.shortName || !values.schoolName) throw new Error("Le nom de l'école est obligatoire.");
          data.settings = Object.assign({}, data.settings, values);
          await saveFile('settings', 'Modification des options du site');
          toast('Options enregistrées ✓.' + PUBLISH_DELAY);
        } catch (ex) {
          data.settings = before;
          toast(ex.message, true);
        } finally {
          btn.disabled = false;
        }
      });
    },

    account(root) {
      $('#account-logout', root).addEventListener('click', () => {
        if (confirm('Se déconnecter ? Il faudra recoller le jeton GitHub pour revenir.')) logout();
      });
    }
  };

  // Envoie les photos une par une, puis enregistre la galerie en une seule fois.
  async function uploadPhotos(fileList) {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    const progress = $('#up-progress');
    const zone = $('#dropzone');
    const category = $('#up-cat').value;
    const date = $('#up-date').value || today();
    zone.style.pointerEvents = 'none';
    const added = [];
    const errors = [];
    for (const file of files) {
      progress.textContent = `Envoi de la photo ${added.length + errors.length + 1} sur ${files.length}…`;
      try {
        const url = await uploadImage(file);
        const title = file.name.replace(/\.\w+$/, '').replace(/[-_]+/g, ' ').trim() || 'Photo';
        added.push({ id: newId('g'), url, title, category, date, description: '' });
      } catch (e) {
        errors.push(`${file.name} : ${e.message}`);
      }
    }
    if (added.length) {
      progress.textContent = 'Mise à jour de la galerie…';
      try {
        await commitChange('gallery', list => list.unshift(...added), `Galerie : ajout de ${added.length} photo(s)`);
      } catch (e) {
        errors.push(e.message);
        added.length = 0;
      }
    }
    zone.style.pointerEvents = '';
    refresh();
    if (errors.length) toast(`${added.length} photo(s) ajoutée(s). Problème : ${errors.join(' ; ')}`, true);
    else toast(`${added.length} photo${added.length > 1 ? 's' : ''} ajoutée${added.length > 1 ? 's' : ''} ✓ — pensez à modifier les légendes.` + PUBLISH_DELAY);
  }

  // Une photo envoyée récemment n'est pas encore publiée par l'hébergeur :
  // en attendant, on l'affiche directement depuis le dépôt GitHub.
  document.addEventListener('error', e => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !gh || img.dataset.fallback) return;
    const match = /\/(uploads\/[^?#]+)$/.exec(img.src);
    if (!match) return;
    img.dataset.fallback = '1';
    img.src = `https://raw.githubusercontent.com/${gh.repo}/${encodeURIComponent(gh.branch)}/${match[1]}`;
  }, true);

  // ---------- Démarrage ----------
  window.addEventListener('hashchange', () => {
    const tab = location.hash.slice(1);
    if (data && VIEWS[tab] && tab !== currentTab) show(tab);
  });

  (async function boot() {
    const saved = loadConfig();
    if (!saved || !saved.token) return showAuth();
    $('#auth').hidden = false;
    $('#auth-error').textContent = '';
    $('#auth-submit').textContent = 'Connexion…';
    $('#auth-submit').disabled = true;
    try {
      await connect(saved);
      startApp();
    } catch (e) {
      gh = null;
      showAuth(e.message);
    } finally {
      $('#auth-submit').disabled = false;
      $('#auth-submit').textContent = 'Se connecter';
    }
  })();
})();
