const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const whatsappBtn = document.getElementById('whatsappBtn');
const secretAdminTrigger = document.getElementById('secretAdminTrigger');
const searchToggle = document.getElementById('searchToggle');
const searchBarWrap = document.getElementById('searchBarWrap');
const portfolioSearch = document.getElementById('portfolioSearch');
const searchResults = document.getElementById('searchResults');
const themeToggle = document.getElementById('themeToggle');

let activeWhatsapp = '8801755101237';

function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const active = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', active);
  if (themeToggle) {
    themeToggle.textContent = active === 'dark' ? '🌙' : '☀️';
  }
}

applyTheme(localStorage.getItem('portfolio_theme') || getSystemTheme());

if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio_theme', next);
    applyTheme(next);
  });
}

if (searchToggle && searchBarWrap && portfolioSearch && searchResults) {
  searchToggle.addEventListener('click', () => {
    searchBarWrap.classList.toggle('open');
    if (searchBarWrap.classList.contains('open')) {
      portfolioSearch.focus();
    } else {
      portfolioSearch.value = '';
      searchResults.innerHTML = '';
    }
  });

  portfolioSearch.addEventListener('input', () => {
    const query = portfolioSearch.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!query) return;

    const targets = [...document.querySelectorAll('main section[id], .skill-row, .project-card')];
    const matches = [];
    const seen = new Set();

    targets.forEach((el) => {
      const text = el.innerText.replace(/\s+/g, ' ').trim();
      if (!text.toLowerCase().includes(query)) return;
      const section = el.closest('section[id]');
      const href = section ? `#${section.id}` : '#home';
      const title = el.querySelector('h1, h2, h3')?.textContent?.trim() || section?.id || 'Section';
      const key = `${href}:${title}`;
      if (seen.has(key)) return;
      seen.add(key);
      const idx = text.toLowerCase().indexOf(query);
      const start = Math.max(0, idx - 30);
      const snippet = (start > 0 ? '...' : '') + text.slice(start, start + 90) + '...';
      matches.push({ href, title, snippet });
    });

    if (matches.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item">No matching content found.</div>';
      return;
    }

    matches.slice(0, 6).forEach((m) => {
      const a = document.createElement('a');
      a.className = 'search-result-item';
      a.href = m.href;
      const strong = document.createElement('strong');
      strong.textContent = m.title;
      const small = document.createElement('small');
      small.textContent = m.snippet;
      a.append(strong, small);
      a.addEventListener('click', () => searchBarWrap.classList.remove('open'));
      searchResults.appendChild(a);
    });
  });
}

const secretModal = document.getElementById('secretModal');
const secretModalClose = document.getElementById('secretModalClose');
const secretCancelBtn = document.getElementById('secretCancelBtn');
const secretEntryForm = document.getElementById('secretEntryForm');
const secretKeyInput = document.getElementById('secretKeyInput');
const secretError = document.getElementById('secretError');

function openSecretModal() {
  if (!secretModal) return;
  secretError.textContent = '';
  secretKeyInput.value = '';
  secretModal.classList.add('open');
  secretModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => secretKeyInput.focus(), 60);
}

function closeSecretModal() {
  if (!secretModal) return;
  secretModal.classList.remove('open');
  secretModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

if (secretAdminTrigger) {
  secretAdminTrigger.addEventListener('click', openSecretModal);
}
if (secretModalClose) secretModalClose.addEventListener('click', closeSecretModal);
if (secretCancelBtn) secretCancelBtn.addEventListener('click', closeSecretModal);
if (secretModal) {
  secretModal.addEventListener('click', (e) => {
    if (e.target === secretModal) closeSecretModal();
  });
}
if (secretEntryForm) {
  secretEntryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const expectedKey = localStorage.getItem('portfolio_entry_pass') || 'sourav8589';
    if (secretKeyInput.value === expectedKey) {
      window.location.href = 'admin.html';
    } else {
      secretError.textContent = 'Incorrect secret key. Try again.';
      secretKeyInput.value = '';
      secretKeyInput.focus();
    }
  });
}

function getSocialSvg(label = '', url = '') {
  const s = `${label} ${url}`.toLowerCase();
  if (s.includes('whatsapp') || s.includes('wa.me')) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.79 14.12c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.96-4.39-.15-.19-1.19-1.58-1.19-3.02 0-1.44.75-2.14 1.02-2.43.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.24.59.82 2.02.89 2.17.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.3.38-.43.51-.15.14-.3.3-.13.59.17.29.77 1.27 1.65 2.05 1.14 1.01 2.09 1.32 2.39 1.47.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.66-.14.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.7-.17 1.38z"/></svg>';
  }
  if (s.includes('messenger') || s.includes('m.me')) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.61.93 1.13.7l1.98-.88c.17-.08.36-.09.54-.04.92.25 1.89.38 2.89.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm5.89 7.46-2.94 4.66c-.47.74-1.47.92-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.19-.69-.64l2.94-4.66c.47-.74 1.47-.92 2.17-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.19.69.64z"/></svg>';
  }
  if (s.includes('telegram') || s.includes('t.me')) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>';
  }
  if (s.includes('mailto:') || s.includes('email')) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
}

function renderPortfolioData(data) {
  if (!data) return;

  const logoEl = document.getElementById('navLogo');
  if (logoEl && (data.logoName || data.name)) {
    const shortName = data.logoName || data.name.trim().split(/\s+/).pop() || 'Sourav';
    const badge = logoEl.querySelector('.brand-badge');
    const title = logoEl.querySelector('.brand-title');
    if (badge) badge.textContent = shortName.charAt(0).toUpperCase();
    if (title) title.textContent = shortName;
  }

  if (data.name) document.getElementById('heroName').textContent = data.name;
  if (data.badge) document.getElementById('heroBadge').textContent = data.badge;
  if (data.headline) document.getElementById('heroHeadline').textContent = data.headline;
  if (data.heroSub) document.getElementById('heroSub').textContent = data.heroSub;
  if (data.photoUrl) document.getElementById('heroPhoto').src = data.photoUrl;
  if (data.about) document.getElementById('aboutText').textContent = data.about;

  if (data.footerPrefix) document.getElementById('footerPrefix').textContent = data.footerPrefix;
  if (data.secretName && secretAdminTrigger) secretAdminTrigger.textContent = data.secretName;
  if (data.footerSuffix !== undefined) document.getElementById('footerSuffix').textContent = data.footerSuffix;

  if (Array.isArray(data.stats)) {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = '';
    data.stats.forEach((st) => {
      const item = document.createElement('div');
      item.className = 'stat-item';
      const h3 = document.createElement('h3');
      h3.textContent = st.value;
      const p = document.createElement('p');
      p.textContent = st.label;
      item.append(h3, p);
      statsGrid.appendChild(item);
    });
  }

  if (Array.isArray(data.skills)) {
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = '';
    const icons = ['💻', '🎨', '⚙️', '🚀'];
    data.skills.forEach((sk, idx) => {
      const row = document.createElement('div');
      row.className = 'skill-row clickable-card';
      const left = document.createElement('div');
      left.className = 'skill-row-left';
      const ic = document.createElement('span');
      ic.className = 'skill-icon';
      ic.textContent = icons[idx % icons.length];
      const h3 = document.createElement('h3');
      h3.textContent = sk.title;
      left.append(ic, h3);
      const p = document.createElement('p');
      p.textContent = sk.desc;
      const arr = document.createElement('span');
      arr.className = 'row-arrow';
      arr.textContent = '↗';
      row.append(left, p, arr);
      skillsGrid.appendChild(row);
    });
  }

  if (Array.isArray(data.projects)) {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    const tints = ['tint-pink', 'tint-sky', 'tint-violet'];
    data.projects.forEach((p, idx) => {
      const card = document.createElement('article');
      card.className = 'project-card clickable-card';
      card.setAttribute('data-tag', p.tag);
      const top = document.createElement('div');
      top.className = 'project-card-top';
      const titleBox = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = p.title;
      const tag = document.createElement('div');
      tag.className = 'project-tag';
      tag.textContent = p.tag;
      titleBox.append(h3, tag);
      const arr = document.createElement('span');
      arr.className = 'row-arrow';
      arr.textContent = '↗';
      top.append(titleBox, arr);

      const preview = document.createElement('div');
      preview.className = `project-preview ${tints[idx % tints.length]}`;
      const desc = document.createElement('p');
      desc.textContent = p.desc;
      preview.appendChild(desc);

      card.append(top, preview);
      grid.appendChild(card);
    });
  }

  if (data.email) {
    const el = document.getElementById('directEmail');
    el.textContent = data.email;
    el.href = `mailto:${data.email}`;
  }

  if (data.whatsapp) {
    activeWhatsapp = data.whatsapp;
    const waUrl = `https://wa.me/${data.whatsapp}`;
    const dw = document.getElementById('directWhatsapp');
    dw.href = waUrl;
    dw.textContent = `+${data.whatsapp}`;
  }

  if (data.messenger) {
    const mUrl = `https://m.me/${data.messenger}`;
    const dm = document.getElementById('directMessenger');
    dm.href = mUrl;
    dm.textContent = `m.me/${data.messenger}`;
    document.getElementById('messengerBtn').href = mUrl;
  }

  const floatingChat = document.getElementById('floatingChat');
  const floatingItems = document.getElementById('floatingItems');
  if (floatingChat) {
    floatingChat.classList.toggle('pos-left', data.floatPosition === 'left');
    floatingChat.classList.toggle('dir-row', data.floatDirection === 'row');

    if (floatingItems && Array.isArray(data.socials)) {
      floatingItems.innerHTML = '';
      data.socials.forEach((soc) => {
        if (soc.enabled === false) return;
        const a = document.createElement('a');
        a.className = 'float-icon-btn';
        a.href = soc.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.title = soc.label;
        a.setAttribute('aria-label', soc.label);
        a.style.background = soc.color || '#7c5cfc';
        a.innerHTML = getSocialSvg(soc.label, soc.url);
        floatingItems.appendChild(a);
      });
    }
  }
}

function getFirestoreDb() {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY' || !window.firebase) return null;
  if (!firebase.apps.length) firebase.initializeApp(cfg);
  return firebase.firestore();
}

async function applyAdminData() {
  try {
    const raw = localStorage.getItem('portfolio_admin_data');
    if (raw) renderPortfolioData(JSON.parse(raw));
  } catch {
    // Ignore malformed localStorage data
  }

  const db = getFirestoreDb();
  if (!db) return;

  try {
    const doc = await db.collection('portfolio').doc('content').get();
    if (doc.exists && doc.data()) {
      const data = doc.data();
      localStorage.setItem('portfolio_admin_data', JSON.stringify(data));
      renderPortfolioData(data);
    }
  } catch {
    // Keep local/default data if offline
  }
}

// Project Filter Chips
document.getElementById('projectFilters')?.addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  document.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
  chip.classList.add('active');
  const filter = chip.getAttribute('data-filter');
  document.querySelectorAll('#projectsGrid .project-card').forEach((card) => {
    const tag = card.getAttribute('data-tag') || '';
    card.style.display = filter === 'all' || tag === filter ? '' : 'none';
  });
});

// Detail Modal Layer + Background Blur
const detailModal = document.getElementById('detailModal');
const modalClose = document.getElementById('modalClose');
const modalBackBtn = document.getElementById('modalBackBtn');
const modalTag = document.getElementById('modalTag');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalList = document.getElementById('modalList');
const modalCta = document.getElementById('modalCta');

function openDetailLayer({ tag, title, desc, items }) {
  if (!detailModal) return;
  modalTag.textContent = tag || 'Details';
  modalTitle.textContent = title || '';
  modalDesc.textContent = desc || '';
  modalList.innerHTML = '';
  (items || []).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    modalList.appendChild(li);
  });
  detailModal.classList.add('open');
  detailModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeDetailLayer() {
  if (!detailModal) return;
  detailModal.classList.remove('open');
  detailModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

if (modalClose) modalClose.addEventListener('click', closeDetailLayer);
if (modalBackBtn) modalBackBtn.addEventListener('click', closeDetailLayer);
if (modalCta) modalCta.addEventListener('click', closeDetailLayer);
if (detailModal) {
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetailLayer();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDetailLayer();
    closeSecretModal();
  }
});

document.querySelector('[data-layer="about"]')?.addEventListener('click', () => {
  openDetailLayer({
    tag: 'About & Education',
    title: document.getElementById('heroName')?.textContent || 'About Me',
    desc: document.getElementById('aboutText')?.textContent || '',
    items: [
      'University: Daffodil International University (DIU)',
      'Focus: Frontend Web Development, Responsive UI & Cloud Integration',
      'Backend & Tools: Firebase Firestore, Web3Forms, GitHub Pages'
    ]
  });
});

document.getElementById('skillsGrid')?.addEventListener('click', (e) => {
  const row = e.target.closest('.skill-row');
  if (!row) return;
  openDetailLayer({
    tag: 'Service & Skill',
    title: row.querySelector('h3')?.textContent?.trim() || 'Skill',
    desc: row.querySelector('p')?.textContent?.trim() || '',
    items: ['Applied across responsive web interfaces and interactive portfolio components']
  });
});

document.getElementById('projectsGrid')?.addEventListener('click', (e) => {
  const card = e.target.closest('.project-card');
  if (!card) return;
  openDetailLayer({
    tag: card.querySelector('.project-tag')?.textContent?.trim() || 'Project',
    title: card.querySelector('h3')?.textContent?.trim() || 'Project Details',
    desc: card.querySelector('.project-preview p')?.textContent?.trim() || '',
    items: [
      'Responsive layout for mobile and desktop',
      'Built with clean HTML, CSS, and JavaScript',
      'Available for live demo or custom collaboration'
    ]
  });
});

// Floating Chat Toggle + Background Blur
const chatFab = document.getElementById('chatFab');
const floatingChatEl = document.getElementById('floatingChat');
if (chatFab && floatingChatEl) {
  chatFab.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = floatingChatEl.classList.toggle('open');
    document.body.classList.toggle('chat-open', isOpen);
    chatFab.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (floatingChatEl.classList.contains('open') && !floatingChatEl.contains(e.target)) {
      floatingChatEl.classList.remove('open');
      document.body.classList.remove('chat-open');
      chatFab.setAttribute('aria-expanded', 'false');
    }
  });
}

applyAdminData();

const revealTargets = document.querySelectorAll('.section .container, .skill-row, .project-card');
if ('IntersectionObserver' in window) {
  revealTargets.forEach((el) => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => observer.observe(el));
}

if (whatsappBtn) {
  whatsappBtn.addEventListener('click', () => {
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';
    const text = message
      ? `Hi Sourav, I'm ${name || 'a visitor'}${email ? ` (${email})` : ''}.\n\n${message}`
      : `Hi Sourav, I visited your portfolio and would like to connect!`;
    window.open(`https://wa.me/${activeWhatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    formStatus.textContent = 'Sending message...';
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const result = await response.json();
      if (response.ok && result.success) {
        formStatus.textContent = 'Thanks! Your message has been sent.';
        contactForm.reset();
      } else {
        formStatus.textContent = result.message || 'Something went wrong. Please try again.';
      }
    } catch {
      formStatus.textContent = 'Network error. Please check your connection and try again.';
    }
  });
}
