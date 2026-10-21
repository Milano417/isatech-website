/* =========================================================
   ISATech — script du site public
   Tout le site tient dans index.html : chaque rubrique est un
   bloc <div class="view" data-view="...">. Ce script charge les
   fichiers data/*.json puis affiche la rubrique demandée dans l'adresse
   (#/formations, #/formation/ida, #/contact…).
   ========================================================= */
(function () {
  'use strict';

  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  const NAV = [
    { href: '#/', label: 'Accueil', view: 'home' },
    { href: '#/a-propos', label: 'À propos', view: 'about' },
    { href: '#/formations', label: 'Formations', view: 'formations' },
    { href: '#/admission', label: 'Admission', view: 'admission' },
    { href: '#/actualites', label: 'Actualités', view: 'news' },
    { href: '#/galerie', label: 'Galerie', view: 'gallery' },
    { href: '#/contact', label: 'Contact', view: 'contact' }
  ];

  // Segment de l'adresse → rubrique
  const ROUTES = {
    '': 'home', 'a-propos': 'about', formations: 'formations', formation: 'formation', admission: 'admission',
    actualites: 'news', article: 'article', galerie: 'gallery', contact: 'contact'
  };

  const TITLES = {
    about: 'À propos', formations: 'Nos formations', admission: 'Admission & inscription', news: 'Actualités & infos',
    gallery: 'Galerie photos', contact: 'Contact', notfound: 'Page introuvable'
  };

  // Rubrique affichée dans le menu comme active
  const NAV_PARENT = { formation: 'formations', article: 'news' };

  const ICONS = {
    whatsapp: '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5 0-1.1.2-3.6-.8-3-1.2-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.5-.2.7-.1l2.1 1c.3.1.5.2.5.4.1.1.1.7-.1 1.4z"/>'
  };

  let data = null;

  // ---------- Utilitaires ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function icon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  }

  // N'autorise que les liens http(s), mailto, tel et relatifs.
  function safeUrl(url) {
    const u = String(url || '').trim();
    if (!u) return '';
    if (/^(https?:|mailto:|tel:)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
    return '';
  }

  function parseDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    return m ? { y: m[1], m: Number(m[2]) - 1, d: Number(m[3]) } : null;
  }

  function formatDate(iso) {
    const p = parseDate(iso);
    return p ? `${p.d} ${MONTHS[p.m]} ${p.y}` : '';
  }

  // "#/formation/ida?x=1" → { view: 'formation', id: 'ida', query }
  function parseRoute() {
    const hash = location.hash.replace(/^#\/?/, '');
    const [pathPart, queryPart = ''] = hash.split('?');
    const [segment = '', id] = pathPart.split('/');
    const view = Object.prototype.hasOwnProperty.call(ROUTES, segment) ? ROUTES[segment] : 'notfound';
    return { view, id: id ? decodeURIComponent(id) : null, query: new URLSearchParams(queryPart) };
  }

  const formationLink = f => '#/formation/' + encodeURIComponent(f.id);
  const articleLink = n => '#/article/' + encodeURIComponent(n.id);

  // Texte simple → HTML : paragraphes et listes à puces ("- ")
  function richText(text) {
    const blocks = String(text || '').replace(/\r/g, '').split(/\n{2,}/);
    return blocks.map(block => {
      const lines = block.split('\n').filter(l => l.trim());
      if (lines.length && lines.every(l => /^\s*[-•*]\s+/.test(l))) {
        return '<ul>' + lines.map(l => `<li>${esc(l.replace(/^\s*[-•*]\s+/, ''))}</li>`).join('') + '</ul>';
      }
      return lines.length ? `<p>${lines.map(esc).join('<br>')}</p>` : '';
    }).join('');
  }

  function telHref(phones) {
    const first = String(phones || '').split('/')[0].replace(/[^\d+]/g, '');
    return first ? 'tel:' + first : '';
  }

  function shortName(name) {
    return String(name || '').replace(/^.*?—\s*/, '');
  }

  // ---------- En-tête, bandeau, pied ----------
  function renderBanner(infos) {
    const info = infos.find(i => i.banner);
    const host = $('#banner');
    if (!info || !host) return;
    const key = 'isatech-banner-' + info.id;
    try { if (sessionStorage.getItem(key)) return; } catch (e) { /* stockage indisponible */ }
    host.innerHTML = `
      <div class="info-banner${info.type === 'urgent' ? ' is-urgent' : ''}" role="status">
        <div class="container">
          <span class="tag">${info.type === 'urgent' ? 'Urgent' : 'Info'}</span>
          <span>${esc(info.title)} — <a href="#/actualites">en savoir plus</a></span>
          <button class="close" type="button" aria-label="Masquer l'information">×</button>
        </div>
      </div>`;
    $('.close', host).addEventListener('click', () => {
      host.innerHTML = '';
      try { sessionStorage.setItem(key, '1'); } catch (e) { /* stockage indisponible */ }
    });
  }

  function renderHeader(s) {
    $('#header').outerHTML = `
      <header class="site-header">
        <div class="container">
          <a class="brand" href="#/" aria-label="${esc(s.shortName)} — accueil">
            <img src="assets/images/logo.jpg" alt="" width="46" height="46">
            <span><strong>${esc(s.shortName)}</strong><small>${esc(s.schoolName)}</small></span>
          </a>
          <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
            <ul>
              ${NAV.map(n => `<li><a href="${n.href}" data-nav="${n.view}">${n.label}</a></li>`).join('')}
            </ul>
            <a class="btn btn-primary btn-block mobile-cta" href="#/admission">S'inscrire ${esc(s.admissionYear || '')}</a>
          </nav>
          <div class="header-cta">
            <a class="btn btn-primary btn-sm" href="#/admission">S'inscrire</a>
            <button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="Ouvrir le menu"><span></span></button>
          </div>
        </div>
      </header>`;
    $('.menu-toggle').addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  }

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    const toggle = $('.menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function setActiveNav(view) {
    const active = NAV_PARENT[view] || view;
    $$('[data-nav]').forEach(a => {
      if (a.dataset.nav === active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function renderFooter(s, formations) {
    const year = new Date().getFullYear();
    $('#footer').outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a class="brand" href="#/"><img src="assets/images/logo.jpg" alt="" width="46" height="46"><span><strong>${esc(s.shortName)}</strong><small>${esc(s.schoolName)}</small></span></a>
              <p>Établissement d'enseignement supérieur fondé le ${esc(s.foundedDate)} à Abidjan-Koumassi. Plus de ${esc(s.graduates)} diplômés formés.</p>
              <p class="footer-motto">« ${esc(s.slogan)} »</p>
            </div>
            <div>
              <h4>L'établissement</h4>
              <ul>${NAV.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
            </div>
            <div>
              <h4>Nos filières</h4>
              <ul>${formations.map(f => `<li><a href="${formationLink(f)}">${esc(f.code)} — ${esc(shortName(f.name))}</a></li>`).join('')}</ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>${esc(s.address)}</li>
                ${s.postalBox ? `<li>${esc(s.postalBox)}</li>` : ''}
                <li><a href="${telHref(s.phones)}">${esc(s.phones)}</a></li>
                <li><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>
                <li>${esc(s.hours)}</li>
                ${safeUrl(s.facebook) ? `<li><a href="${esc(safeUrl(s.facebook))}" target="_blank" rel="noopener">Facebook</a></li>` : ''}
              </ul>
            </div>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© ${year} ${esc(s.shortName)} — ${esc(s.schoolName)}. Tous droits réservés.</span>
          <a href="admin/">Espace administration</a>
        </div>
      </footer>
      ${s.whatsapp ? `<a class="wa-float" href="https://wa.me/${esc(String(s.whatsapp).replace(/\D/g, ''))}" target="_blank" rel="noopener" aria-label="Nous écrire sur WhatsApp">${icon('whatsapp')}</a>` : ''}`;
  }

  // Remplit les éléments statiques marqués data-s="cléDesOptions"
  function fillSettings(s) {
    $$('[data-s]').forEach(el => {
      const value = s[el.dataset.s];
      if (value != null && value !== '') el.textContent = value;
    });
  }

  // ---------- Composants ----------
  function formationCard(f) {
    return `
      <a class="card reveal" href="${formationLink(f)}">
        <div class="card-media">
          <img src="${esc(f.image)}" alt="" loading="lazy">
          <span class="badge badge-code">${esc(f.code)}</span>
        </div>
        <div class="card-body">
          <span class="meta">${esc(f.category)}</span>
          <h3>${esc(f.name)}</h3>
          <p>${esc(f.shortDescription)}</p>
          <div class="card-foot"><span>${esc(f.duration)}</span><span>Découvrir →</span></div>
        </div>
      </a>`;
  }

  function newsCard(n) {
    return `
      <a class="card reveal" href="${articleLink(n)}">
        <div class="card-media">${n.image ? `<img src="${esc(n.image)}" alt="" loading="lazy">` : ''}</div>
        <div class="card-body">
          <div class="meta"><span class="badge">${esc(n.category)}</span><span>${formatDate(n.date)}</span></div>
          <h3>${esc(n.title)}</h3>
          <p>${esc(n.excerpt)}</p>
          <div class="card-foot"><span>Lire l'article →</span></div>
        </div>
      </a>`;
  }

  function infoItem(i) {
    const p = parseDate(i.date);
    const link = safeUrl(i.link);
    return `
      <article class="info-item ${esc(i.type)}">
        ${p ? `<div class="info-date"><b>${p.d}</b><small>${MONTHS[p.m]}</small></div>` : ''}
        <div>
          ${i.type === 'urgent' ? '<span class="badge badge-red">Urgent</span> ' : i.type === 'important' ? '<span class="badge badge-gold">Important</span> ' : ''}
          <h3>${esc(i.title)}</h3>
          <p>${esc(i.text)}</p>
          ${link ? `<p><a href="${esc(link)}" target="_blank" rel="noopener">Voir le document →</a></p>` : ''}
        </div>
      </article>`;
  }

  function galleryGrid(photos) {
    return photos.map((p, i) => `
      <button class="gallery-item reveal" type="button" data-index="${i}" aria-label="Agrandir : ${esc(p.title)}">
        <img src="${esc(p.url)}" alt="${esc(p.title)}" loading="lazy">
        <figcaption>${esc(p.title)}</figcaption>
      </button>`).join('');
  }

  // ---------- Visionneuse photo (une seule pour tout le site) ----------
  const lightbox = { photos: [], index: 0, lastFocus: null, box: null };

  function initLightbox() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo agrandie">
        <button class="lb-btn lb-close" type="button" aria-label="Fermer">×</button>
        <button class="lb-btn lb-prev" type="button" aria-label="Photo précédente">‹</button>
        <figure><img alt=""><figcaption><strong></strong><span></span></figcaption></figure>
        <button class="lb-btn lb-next" type="button" aria-label="Photo suivante">›</button>
      </div>`);
    const box = lightbox.box = $('#lightbox');
    box.addEventListener('click', e => { if (e.target === box) closeLightbox(); });
    $('.lb-close', box).addEventListener('click', closeLightbox);
    $('.lb-prev', box).addEventListener('click', () => showPhoto(lightbox.index - 1));
    $('.lb-next', box).addEventListener('click', () => showPhoto(lightbox.index + 1));
    document.addEventListener('keydown', e => {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPhoto(lightbox.index - 1);
      if (e.key === 'ArrowRight') showPhoto(lightbox.index + 1);
    });
    let startX = 0;
    box.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) showPhoto(lightbox.index + (dx < 0 ? 1 : -1));
    });
  }

  function showPhoto(i) {
    const photos = lightbox.photos;
    if (!photos.length) return;
    lightbox.index = (i + photos.length) % photos.length;
    const p = photos[lightbox.index];
    const box = lightbox.box;
    $('img', box).src = p.url;
    $('img', box).alt = p.title;
    $('strong', box).textContent = p.title;
    $('span', box).textContent = [p.category, p.description].filter(Boolean).join(' — ');
  }

  function closeLightbox() {
    lightbox.box.classList.remove('open');
    document.body.style.overflow = '';
    if (lightbox.lastFocus) lightbox.lastFocus.focus();
  }

  // Ouvre la visionneuse au clic sur une photo de cette grille
  function bindGallery(container, getPhotos) {
    container.addEventListener('click', e => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      lightbox.photos = getPhotos();
      lightbox.lastFocus = item;
      showPhoto(Number(item.dataset.index));
      lightbox.box.classList.add('open');
      document.body.style.overflow = 'hidden';
      $('.lb-close', lightbox.box).focus();
    });
  }

  function filterChips(container, categories, onChange) {
    container.innerHTML = ['Tout', ...categories].map((c, i) =>
      `<button class="chip" type="button" aria-pressed="${i === 0}" data-cat="${i === 0 ? '' : esc(c)}">${esc(c)}</button>`).join('');
    container.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      $$('.chip', container).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      onChange(chip.dataset.cat);
    });
  }

  function emptyState(text) {
    return `<div class="empty">${esc(text)}</div>`;
  }

  // ---------- Rubriques ----------
  // init : préparé une seule fois au chargement ; enter : à chaque visite de la rubrique.
  const VIEWS = {
    home: {
      init(d) {
        const s = d.settings;
        $('#hero-title').innerHTML = esc(s.heroTitle).replace(/(avenir|futur)/i, '<em>$1</em>');
        $('#hero-subtitle').textContent = s.heroSubtitle;
        if (s.heroImage) $('#hero-image').src = s.heroImage;
        $('#stat-formations').textContent = d.formations.length;
        $('#home-formations').innerHTML = d.formations.map(formationCard).join('') || emptyState('Aucune formation publiée.');
        $('#home-news').innerHTML = d.news.slice(0, 3).map(newsCard).join('') || emptyState('Aucune actualité pour le moment.');
        $('#home-infos').innerHTML = d.infos.slice(0, 3).map(infoItem).join('') || emptyState('Aucune information en cours.');
        const photos = d.gallery.slice(0, 8);
        const grid = $('#home-gallery');
        grid.innerHTML = galleryGrid(photos) || emptyState('La galerie sera bientôt disponible.');
        bindGallery(grid, () => photos);
        if (!s.admissionOpen) $$('.when-admission').forEach(el => el.remove());
      }
    },

    about: {
      init(d) {
        $('#stat-formations-about').textContent = d.formations.length;
      }
    },

    formations: {
      init(d) {
        const grid = $('#formations-grid');
        const cats = [...new Set(d.formations.map(f => f.category))];
        const draw = cat => {
          const list = cat ? d.formations.filter(f => f.category === cat) : d.formations;
          grid.innerHTML = list.map(formationCard).join('') || emptyState('Aucune formation dans cette catégorie.');
          reveal();
        };
        filterChips($('#formations-filters'), cats, draw);
        draw('');
      }
    },

    formation: {
      enter(d, route) {
        const f = d.formations.find(x => x.id === route.id || x.code === route.id);
        const main = $('#formation');
        if (!f) {
          main.innerHTML = `<div class="container section">${emptyState('Cette formation est introuvable.')}<p style="text-align:center;margin-top:16px"><a class="btn btn-primary" href="#/formations">Voir toutes les formations</a></p></div>`;
          return 'Formation introuvable';
        }
        const list = items => (items || []).map(x => `<li>${esc(x)}</li>`).join('');
        main.innerHTML = `
          <section class="page-header">
            <div class="container">
              <div class="breadcrumb"><a href="#/formations">Formations</a> / ${esc(f.code)}</div>
              <span class="eyebrow">${esc(f.category)}</span>
              <h1>${esc(f.name)}</h1>
              <p>${esc(f.shortDescription)}</p>
            </div>
          </section>
          <section class="section-sm">
            <div class="container detail-layout">
              <div>
                <div class="panel">
                  <img class="rounded-img" src="${esc(f.image)}" alt="" style="aspect-ratio:16/8;margin-bottom:20px">
                  <h2>Présentation</h2>
                  ${richText(f.description)}
                </div>
                ${f.objectives && f.objectives.length ? `<div class="panel"><h2>Objectifs de la formation</h2><ul class="check-list">${list(f.objectives)}</ul></div>` : ''}
                ${f.skills && f.skills.length ? `<div class="panel"><h2>Compétences acquises</h2><div class="tags">${f.skills.map(x => `<span>${esc(x)}</span>`).join('')}</div></div>` : ''}
                ${f.program && f.program.length ? `<div class="panel"><h2>Programme</h2>${f.program.map((p, i) => `
                  <details class="acc"${i === 0 ? ' open' : ''}><summary>${esc(p.semester)}</summary><div class="acc-body"><ul>${list(p.modules)}</ul></div></details>`).join('')}</div>` : ''}
                ${f.opportunities && f.opportunities.length ? `<div class="panel"><h2>Débouchés</h2><ul class="check-list">${list(f.opportunities)}</ul></div>` : ''}
              </div>
              <aside class="sticky">
                <div class="panel">
                  <h3>En bref</h3>
                  <ul class="facts">
                    <li><span>Code</span><strong>${esc(f.code)}</strong></li>
                    <li><span>Diplôme</span><strong>${esc(f.level)}</strong></li>
                    <li><span>Durée</span><strong>${esc(f.duration)}</strong></li>
                    <li><span>Lieu</span><strong>${esc(d.settings.address)}</strong></li>
                  </ul>
                  <a class="btn btn-primary btn-block" href="#/admission">S'inscrire dans cette filière</a>
                  <a class="btn btn-outline btn-block" style="margin-top:10px" href="#/contact?sujet=${encodeURIComponent('Filière ' + f.code)}">Poser une question</a>
                </div>
                ${f.admissionRequirements && f.admissionRequirements.length ? `<div class="panel"><h3>Conditions d'admission</h3><ul class="check-list">${list(f.admissionRequirements)}</ul></div>` : ''}
              </aside>
            </div>
          </section>`;
        return `${f.code} — ${f.name}`;
      }
    },

    admission: {
      init(d) {
        $('#admission-formations').innerHTML = d.formations.map(f => `<li><a href="${formationLink(f)}"><strong>${esc(f.code)}</strong> — ${esc(f.name)}</a></li>`).join('');
        if (!d.settings.admissionOpen) {
          $('#admission-status').innerHTML = '<div class="alert alert-err" style="margin-bottom:28px">Les inscriptions sont actuellement fermées. Contactez le secrétariat pour plus d\'informations.</div>';
        }
      }
    },

    news: {
      init(d) {
        $('#infos-list').innerHTML = d.infos.map(infoItem).join('') || emptyState('Aucune information en cours.');
        const grid = $('#news-grid');
        const cats = [...new Set(d.news.map(n => n.category))];
        const draw = cat => {
          const list = cat ? d.news.filter(n => n.category === cat) : d.news;
          grid.innerHTML = list.map(newsCard).join('') || emptyState('Aucune actualité dans cette catégorie.');
          reveal();
        };
        filterChips($('#news-filters'), cats, draw);
        draw('');
      }
    },

    article: {
      enter(d, route) {
        const n = d.news.find(x => x.id === route.id);
        const main = $('#article');
        if (!n) {
          main.innerHTML = `<div class="container section">${emptyState('Cet article est introuvable.')}<p style="text-align:center;margin-top:16px"><a class="btn btn-primary" href="#/actualites">Toutes les actualités</a></p></div>`;
          return 'Article introuvable';
        }
        const others = d.news.filter(x => x.id !== n.id).slice(0, 3);
        main.innerHTML = `
          <section class="page-header">
            <div class="container article">
              <div class="breadcrumb"><a href="#/actualites">Actualités</a> / ${esc(n.category)}</div>
              <h1>${esc(n.title)}</h1>
              <p>${formatDate(n.date)}${n.author ? ' — ' + esc(n.author) : ''}</p>
            </div>
          </section>
          <section class="section-sm">
            <div class="container">
              <article class="article">
                ${n.image ? `<img class="article-cover" src="${esc(n.image)}" alt="">` : ''}
                <div class="article-content">${richText(n.content)}</div>
                <p style="margin-top:32px"><a class="btn btn-outline" href="#/actualites">← Toutes les actualités</a></p>
              </article>
            </div>
          </section>
          ${others.length ? `<section class="section-sm section-white"><div class="container"><h2>À lire aussi</h2><div class="grid grid-3">${others.map(newsCard).join('')}</div></div></section>` : ''}`;
        return n.title;
      }
    },

    gallery: {
      init(d) {
        const grid = $('#gallery-grid');
        const cats = [...new Set(d.gallery.map(p => p.category).filter(Boolean))];
        let current = d.gallery;
        const draw = cat => {
          current = cat ? d.gallery.filter(p => p.category === cat) : d.gallery;
          grid.innerHTML = galleryGrid(current) || emptyState('Aucune photo dans cette catégorie.');
          reveal();
        };
        filterChips($('#gallery-filters'), cats, draw);
        draw('');
        bindGallery(grid, () => current);
      }
    },

    contact: {
      init(d) {
        const s = d.settings;
        $('#c-address').textContent = [s.address, s.postalBox].filter(Boolean).join(' — ');
        $('#c-phones').innerHTML = `<a href="${telHref(s.phones)}">${esc(s.phones)}</a>`;
        $('#c-email').innerHTML = `<a href="mailto:${esc(s.email)}">${esc(s.email)}</a>`;
        $('#c-hours').textContent = s.hours;
        // Pas de serveur : le message est transmis par WhatsApp ou par l'application email du visiteur.
        const form = $('#contact-form');
        const status = $('#contact-status');
        const whatsapp = String(s.whatsapp || '').replace(/\D/g, '');
        if (!whatsapp) $('[data-send=whatsapp]', form).remove();
        form.addEventListener('submit', e => {
          e.preventDefault();
          const f = Object.fromEntries(new FormData(form));
          if (!f.name.trim() || !f.message.trim()) {
            status.innerHTML = '<div class="alert alert-err">Merci d\'indiquer votre nom et votre message.</div>';
            return;
          }
          status.innerHTML = '';
          const subject = f.subject.trim() || 'Demande de renseignements';
          const body = [
            `Bonjour ${s.shortName},`, '', f.message.trim(), '',
            `${f.name.trim()}${f.phone.trim() ? ' — ' + f.phone.trim() : ''}`
          ].join('\n');
          if (e.submitter && e.submitter.dataset.send === 'whatsapp') {
            window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(subject + '\n\n' + body)}`, '_blank', 'noopener');
          } else {
            location.href = `mailto:${s.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }
          status.innerHTML = '<div class="alert alert-ok">Votre message est prêt : il ne reste plus qu\'à l\'envoyer depuis WhatsApp ou votre messagerie.</div>';
        });
      },
      enter(d, route) {
        // Le plan Google n'est chargé qu'à la première visite de la page Contact
        const map = $('#c-map');
        if (!map.src && d.settings.mapQuery) map.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(d.settings.mapQuery) + '&z=15&output=embed';
        const subject = route.query.get('sujet');
        if (subject) $('#contact-form [name=subject]').value = subject;
      }
    }
  };

  // ---------- Navigation entre rubriques ----------
  function navigate() {
    const route = parseRoute();
    const s = data.settings;
    $$('.view').forEach(v => { v.hidden = v.dataset.view !== route.view; });
    const view = VIEWS[route.view];
    const pageTitle = (view && view.enter && view.enter(data, route)) || TITLES[route.view];
    document.title = pageTitle
      ? `${pageTitle} | ${s.shortName} Abidjan-Koumassi`
      : `${s.shortName} — ${s.schoolName} | Abidjan-Koumassi`;
    setActiveNav(route.view);
    setMenu(false);
    window.scrollTo(0, 0);
    reveal();
  }

  // ---------- Animations d'apparition ----------
  let observer = null;
  function reveal() {
    const items = $$('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('visible')); return; }
    observer = observer || new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => observer.observe(el));
  }

  // ---------- Chargement des données ----------
  async function fetchJson(url) {
    // Paramètre horaire : évite d'afficher une ancienne version gardée en cache par le navigateur
    const res = await fetch(url + '?v=' + Date.now());
    if (!res.ok) throw new Error(url + ' : HTTP ' + res.status);
    return res.json();
  }

  // Le contenu est dans data/*.json, modifié depuis l'espace admin.
  async function loadData() {
    const names = ['settings', 'formations', 'news', 'infos', 'gallery'];
    const [settings, formations, news, infos, gallery] = await Promise.all(names.map(n => fetchJson(`data/${n}.json`)));
    const byDateDesc = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));
    return {
      settings,
      formations: formations.filter(f => f.published).sort((a, b) => (a.order || 0) - (b.order || 0)),
      news: news.filter(n => n.published).sort(byDateDesc),
      infos: infos.filter(i => i.active).sort(byDateDesc),
      gallery: gallery.sort(byDateDesc)
    };
  }

  // ---------- Démarrage ----------
  async function init() {
    try {
      data = await loadData();
    } catch (err) {
      console.error(err);
      $$('.view').forEach(v => { v.hidden = v.dataset.view !== 'home'; });
      $('main').insertAdjacentHTML('afterbegin', '<div class="container" style="padding:24px 16px"><div class="alert alert-err">Impossible de charger le contenu du site. Vérifiez votre connexion puis rechargez la page.</div></div>');
      return;
    }
    const s = data.settings || {};
    data.settings = s;
    renderBanner(data.infos || []);
    renderHeader(s);
    renderFooter(s, data.formations || []);
    fillSettings(s);
    initLightbox();
    Object.values(VIEWS).forEach(v => { if (v.init) v.init(data); });
    window.addEventListener('hashchange', navigate);
    navigate();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
