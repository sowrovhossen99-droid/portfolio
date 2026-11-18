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

    const targets = [
      ...document.querySelectorAll('main section[id], .skill-card, .project-card')
    ];
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
      a.addEventListener('click', () => {
        searchBarWrap.classList.remove('open');
      });
      searchResults.appendChild(a);
    });
  });
}

if (secretAdminTrigger) {
  secretAdminTrigger.addEventListener('click', () => {
    const entryKey = prompt('Enter secret access key:');
    const expectedKey = localStorage.getItem('portfolio_entry_pass') || 'sourav8589';
    if (entryKey === expectedKey) {
      window.location.href = 'admin.html';
    }
  });
}

let activeWhatsapp = '8801755101237';

function renderPortfolioData(data) {
  if (!data) return;
  if (data.name) document.getElementById('heroName').textContent = data.name;
  if (data.badge) document.getElementById('heroBadge').textContent = data.badge;
  if (data.heroSub) document.getElementById('heroSub').textContent = data.heroSub;
  if (data.about) document.getElementById('aboutText').textContent = data.about;

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
    document.getElementById('floatWhatsapp').href = waUrl;
  }

  if (data.messenger) {
    const mUrl = `https://m.me/${data.messenger}`;
    const dm = document.getElementById('directMessenger');
    dm.href = mUrl;
    dm.textContent = `m.me/${data.messenger}`;
    document.getElementById('messengerBtn').href = mUrl;
    document.getElementById('floatMessenger').href = mUrl;
  }

  if (Array.isArray(data.projects)) {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    data.projects.forEach((p) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      const tag = document.createElement('div');
      tag.className = 'project-tag';
      tag.textContent = p.tag;
      const h3 = document.createElement('h3');
      h3.textContent = p.title;
      const desc = document.createElement('p');
      desc.textContent = p.desc;
      const links = document.createElement('div');
      links.className = 'project-links';
      links.innerHTML = '<a href="#contact" class="link-arrow">Live Demo →</a>';
      card.append(tag, h3, desc, links);
      grid.appendChild(card);
    });
  }
}

function getFirestoreDb() {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY' || !window.firebase) {
    return null;
  }
  if (!firebase.apps.length) {
    firebase.initializeApp(cfg);
  }
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
    // Keep local/default data if offline or unconfigured
  }
}

applyAdminData();

if (whatsappBtn) {
  whatsappBtn.addEventListener('click', () => {
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    const text = message
      ? `Hi Sourav, I'm ${name || 'a visitor'}${email ? ` (${email})` : ''}.\n\n${message}`
      : `Hi Sourav, I visited your portfolio and would like to connect!`;

    const url = `https://wa.me/${activeWhatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    formStatus.textContent = 'Sending message...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok && result.success) {
        formStatus.textContent = 'Thanks! Your message has been sent.';
        contactForm.reset();
      } else {
        formStatus.textContent = result.message || 'Something went wrong. Please try again.';
      }
    } catch (error) {
      formStatus.textContent = 'Network error. Please check your connection and try again.';
    }
  });
}
