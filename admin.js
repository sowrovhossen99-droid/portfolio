const STORAGE_KEY = 'portfolio_admin_data';
const PASS_KEY = 'portfolio_admin_pass';
const ENTRY_PASS_KEY = 'portfolio_entry_pass';

const DEFAULT_DATA = {
  name: 'Md. Mostafizur Rahman Sourav',
  badge: 'Available for Work',
  heroSub: 'A student at Daffodil International University and a passionate web developer focused on crafting fast, responsive, and user-friendly websites.',
  about: "I'm Md. Mostafizur Rahman Sourav, currently studying at Daffodil International University. I love turning ideas into real, interactive products on the web, focusing on clean code, thoughtful UI design, and smooth user experiences across desktop and mobile devices.",
  email: 'sowrovhossen8589@gmail.com',
  whatsapp: '8801755101237',
  messenger: 'souravhossen99',
  projects: [
    { tag: 'Web App', title: 'Task Tracker', desc: 'A clean daily productivity app with local storage persistence, task filtering, and dark mode.' },
    { tag: 'Landing Page', title: 'Modern SaaS UI', desc: 'A high-converting responsive landing page built with CSS Grid, smooth transitions, and accessible markup.' },
    { tag: 'Portfolio', title: 'Personal Website', desc: 'A fast static portfolio template ready to deploy for free on GitHub Pages, Netlify, or Vercel.' }
  ]
};

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminForm = document.getElementById('adminForm');
const projectsEditor = document.getElementById('projectsEditor');
const addProjectBtn = document.getElementById('addProjectBtn');
const resetBtn = document.getElementById('resetBtn');
const saveStatus = document.getElementById('saveStatus');

let currentData = loadData();

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_DATA, ...JSON.parse(raw) } : structuredClone(DEFAULT_DATA);
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function renderProjectsEditor() {
  projectsEditor.innerHTML = '';
  currentData.projects.forEach((proj, idx) => {
    const row = document.createElement('div');
    row.className = 'project-row';
    row.innerHTML = `
      <div class="project-row-head">
        <strong>Project #${idx + 1}</strong>
        <button type="button" class="btn btn-danger" data-remove="${idx}">Remove</button>
      </div>
      <div class="form-group">
        <label>Tag</label>
        <input type="text" data-field="tag" data-idx="${idx}" value="${escapeHtml(proj.tag)}" required />
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" data-field="title" data-idx="${idx}" value="${escapeHtml(proj.title)}" required />
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label>Description</label>
        <textarea rows="2" data-field="desc" data-idx="${idx}" required>${escapeHtml(proj.desc)}</textarea>
      </div>
    `;
    projectsEditor.appendChild(row);
  });

  projectsEditor.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-remove'));
      currentData.projects.splice(idx, 1);
      renderProjectsEditor();
    });
  });

  projectsEditor.querySelectorAll('[data-field]').forEach((el) => {
    el.addEventListener('input', () => {
      const idx = Number(el.getAttribute('data-idx'));
      const field = el.getAttribute('data-field');
      currentData.projects[idx][field] = el.value;
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function populateForm() {
  document.getElementById('editName').value = currentData.name;
  document.getElementById('editBadge').value = currentData.badge;
  document.getElementById('editHeroSub').value = currentData.heroSub;
  document.getElementById('editAbout').value = currentData.about;
  document.getElementById('editEmail').value = currentData.email;
  document.getElementById('editWhatsapp').value = currentData.whatsapp;
  document.getElementById('editMessenger').value = currentData.messenger;
  renderProjectsEditor();
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

async function loadFromFirebase() {
  const db = getFirestoreDb();
  if (!db) return;
  try {
    const doc = await db.collection('portfolio').doc('content').get();
    if (doc.exists && doc.data()) {
      currentData = { ...DEFAULT_DATA, ...doc.data() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
      populateForm();
    }
  } catch {
    // Ignore fetch errors
  }
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const savedPass = localStorage.getItem(PASS_KEY) || 'sourav123';
  const input = document.getElementById('adminPass').value;
  if (input === savedPass) {
    loginError.textContent = '';
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    populateForm();
    loadFromFirebase();
  } else {
    loginError.textContent = 'Incorrect passcode. Try again.';
  }
});

logoutBtn.addEventListener('click', () => {
  dashboardSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
  document.getElementById('adminPass').value = '';
});

addProjectBtn.addEventListener('click', () => {
  currentData.projects.push({ tag: 'New', title: 'New Project', desc: 'Project description here.' });
  renderProjectsEditor();
});

adminForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  currentData.name = document.getElementById('editName').value.trim();
  currentData.badge = document.getElementById('editBadge').value.trim();
  currentData.heroSub = document.getElementById('editHeroSub').value.trim();
  currentData.about = document.getElementById('editAbout').value.trim();
  currentData.email = document.getElementById('editEmail').value.trim();
  currentData.whatsapp = document.getElementById('editWhatsapp').value.replace(/\D/g, '');
  currentData.messenger = document.getElementById('editMessenger').value.trim();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));

  const newEntryPass = document.getElementById('editEntryPass').value.trim();
  const newAdminPass = document.getElementById('editAdminPass').value.trim();
  if (newEntryPass) {
    localStorage.setItem(ENTRY_PASS_KEY, newEntryPass);
    document.getElementById('editEntryPass').value = '';
  }
  if (newAdminPass) {
    localStorage.setItem(PASS_KEY, newAdminPass);
    document.getElementById('editAdminPass').value = '';
  }

  const db = getFirestoreDb();
  if (!db) {
    saveStatus.textContent = 'Saved locally! Add your Firebase config in firebase-config.js to sync globally.';
    return;
  }

  saveStatus.textContent = 'Saving to Firebase...';
  try {
    await db.collection('portfolio').doc('content').set({
      ...currentData,
      updatedAt: new Date().toISOString()
    });
    saveStatus.textContent = 'Saved to Firebase & live for all visitors!';
  } catch {
    saveStatus.textContent = 'Saved locally, but could not reach Firebase. Check your Firestore rules/config.';
  }
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  currentData = structuredClone(DEFAULT_DATA);
  populateForm();
  saveStatus.textContent = 'Reset to default portfolio content.';
});
