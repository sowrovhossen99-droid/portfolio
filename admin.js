const STORAGE_KEY = 'portfolio_admin_data';
const USER_KEY = 'portfolio_admin_user';
const PASS_HASH_KEY = 'portfolio_admin_pass_hash';
const ENTRY_PASS_KEY = 'portfolio_entry_pass';
const HINT_Q_KEY = 'portfolio_hint_question';
const HINT_A_HASH_KEY = 'portfolio_hint_answer_hash';
const LOCK_KEY = 'portfolio_login_lock';

const DEFAULT_PASS_HASH = '9a5f111f4ff963dbb18f828203d0ffbae2fddc759acbb65c0fdf003a456fb367';
const DEFAULT_HINT_HASH = 'b3993245413a180bbde95ca9e30ac225d9843ffd05bc5eba1668e2d03cbe1f3c';
const DEFAULT_HINT_Q = 'What is your university short name?';
const DEFAULT_USER = 'sourav';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`sourav_v1:${str}`));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_DATA = {
  logoName: 'Sourav',
  name: 'Md. Mostafizur Rahman Sourav',
  badge: 'Available for Work',
  headline: 'I build clean & modern web experiences.',
  heroSub: 'A student at Daffodil International University and a passionate web developer focused on crafting fast, responsive, and user-friendly websites.',
  photoUrl: 'profile.jpg',
  about: "I'm Md. Mostafizur Rahman Sourav, currently studying at Daffodil International University. I love turning ideas into real, interactive products on the web, focusing on clean code, thoughtful UI design, and smooth user experiences across desktop and mobile devices.",
  stats: [
    { value: '10+', label: 'Projects Built' },
    { value: '100%', label: 'Responsive Design' },
    { value: '24/7', label: 'Always Learning' }
  ],
  skills: [
    { title: 'Frontend', desc: 'HTML5, CSS3, JavaScript (ES6+), Responsive Design' },
    { title: 'UI & Styling', desc: 'Flexbox, CSS Grid, Modern Animations, Clean Typography' },
    { title: 'Tools & Workflow', desc: 'Git, GitHub, VS Code, Chrome DevTools' }
  ],
  projects: [
    { tag: 'Web App', title: 'Task Tracker', desc: 'A clean daily productivity app with local storage persistence, task filtering, and dark mode.' },
    { tag: 'Landing Page', title: 'Modern SaaS UI', desc: 'A high-converting responsive landing page built with CSS Grid, smooth transitions, and accessible markup.' },
    { tag: 'Portfolio', title: 'Personal Website', desc: 'A fast static portfolio template ready to deploy for free on GitHub Pages, Netlify, or Vercel.' }
  ],
  floatPosition: 'right',
  floatDirection: 'column',
  socials: [
    { label: '💬 WhatsApp', url: 'https://wa.me/8801755101237', color: '#16a34a', enabled: true },
    { label: '💬 Messenger', url: 'https://m.me/souravhossen99', color: '#0084ff', enabled: true }
  ],
  email: 'sowrovhossen8589@gmail.com',
  whatsapp: '8801755101237',
  messenger: 'souravhossen99',
  footerPrefix: '© 2026 Md. Mostafizur Rahman',
  secretName: 'Sourav',
  footerSuffix: '. Built with HTML, CSS & JavaScript.'
};

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const adminForm = document.getElementById('adminForm');
const statsEditor = document.getElementById('statsEditor');
const skillsEditor = document.getElementById('skillsEditor');
const projectsEditor = document.getElementById('projectsEditor');
const socialsEditor = document.getElementById('socialsEditor');
const addSkillBtn = document.getElementById('addSkillBtn');
const addProjectBtn = document.getElementById('addProjectBtn');
const addSocialBtn = document.getElementById('addSocialBtn');
const resetBtn = document.getElementById('resetBtn');
const saveStatus = document.getElementById('saveStatus');
const editPhotoUrl = document.getElementById('editPhotoUrl');
const editPhotoFile = document.getElementById('editPhotoFile');
const photoPreview = document.getElementById('photoPreview');

let currentData = loadData();

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...structuredClone(DEFAULT_DATA), ...JSON.parse(raw) } : structuredClone(DEFAULT_DATA);
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderStatsEditor() {
  statsEditor.innerHTML = '';
  currentData.stats.forEach((st, idx) => {
    const box = document.createElement('div');
    box.className = 'item-row';
    box.innerHTML = `
      <div class="form-group">
        <label>Stat #${idx + 1} Value</label>
        <input type="text" data-stat="value" data-idx="${idx}" value="${escapeHtml(st.value)}" required />
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label>Stat #${idx + 1} Label</label>
        <input type="text" data-stat="label" data-idx="${idx}" value="${escapeHtml(st.label)}" required />
      </div>
    `;
    statsEditor.appendChild(box);
  });
  statsEditor.querySelectorAll('[data-stat]').forEach((el) => {
    el.addEventListener('input', () => {
      const idx = Number(el.getAttribute('data-idx'));
      currentData.stats[idx][el.getAttribute('data-stat')] = el.value;
    });
  });
}

function renderSkillsEditor() {
  skillsEditor.innerHTML = '';
  currentData.skills.forEach((sk, idx) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <div class="item-row-head">
        <strong>Skill #${idx + 1}</strong>
        <button type="button" class="btn btn-danger btn-sm" data-rm-skill="${idx}">Remove</button>
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" data-skill="title" data-idx="${idx}" value="${escapeHtml(sk.title)}" required />
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label>Description</label>
        <input type="text" data-skill="desc" data-idx="${idx}" value="${escapeHtml(sk.desc)}" required />
      </div>
    `;
    skillsEditor.appendChild(row);
  });
  skillsEditor.querySelectorAll('[data-rm-skill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentData.skills.splice(Number(btn.getAttribute('data-rm-skill')), 1);
      renderSkillsEditor();
    });
  });
  skillsEditor.querySelectorAll('[data-skill]').forEach((el) => {
    el.addEventListener('input', () => {
      currentData.skills[Number(el.getAttribute('data-idx'))][el.getAttribute('data-skill')] = el.value;
    });
  });
}

function renderProjectsEditor() {
  projectsEditor.innerHTML = '';
  currentData.projects.forEach((proj, idx) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <div class="item-row-head">
        <strong>Project #${idx + 1}</strong>
        <button type="button" class="btn btn-danger btn-sm" data-remove="${idx}">Remove</button>
      </div>
      <div class="row-2col">
        <div class="form-group">
          <label>Tag</label>
          <input type="text" data-field="tag" data-idx="${idx}" value="${escapeHtml(proj.tag)}" required />
        </div>
        <div class="form-group">
          <label>Title</label>
          <input type="text" data-field="title" data-idx="${idx}" value="${escapeHtml(proj.title)}" required />
        </div>
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
      currentData.projects.splice(Number(btn.getAttribute('data-remove')), 1);
      renderProjectsEditor();
    });
  });
  projectsEditor.querySelectorAll('[data-field]').forEach((el) => {
    el.addEventListener('input', () => {
      currentData.projects[Number(el.getAttribute('data-idx'))][el.getAttribute('data-field')] = el.value;
    });
  });
}

function renderSocialsEditor() {
  socialsEditor.innerHTML = '';
  currentData.socials.forEach((soc, idx) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <div class="item-row-head">
        <label style="display:flex;align-items:center;gap:0.5rem;margin:0;cursor:pointer;">
          <input type="checkbox" data-soc-chk="${idx}" ${soc.enabled !== false ? 'checked' : ''} style="width:auto;" />
          <strong>Icon #${idx + 1}</strong>
        </label>
        <div style="display:flex;gap:0.4rem;">
          <button type="button" class="btn btn-secondary btn-sm" data-soc-up="${idx}">↑</button>
          <button type="button" class="btn btn-secondary btn-sm" data-soc-dn="${idx}">↓</button>
          <button type="button" class="btn btn-danger btn-sm" data-soc-rm="${idx}">Remove</button>
        </div>
      </div>
      <div class="row-2col">
        <div class="form-group">
          <label>Button Label</label>
          <input type="text" data-soc="label" data-idx="${idx}" value="${escapeHtml(soc.label)}" required />
        </div>
        <div class="form-group">
          <label>Color (Hex)</label>
          <input type="color" data-soc="color" data-idx="${idx}" value="${escapeHtml(soc.color || '#6366f1')}" style="height:44px;padding:4px;" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label>Link URL</label>
        <input type="url" data-soc="url" data-idx="${idx}" value="${escapeHtml(soc.url)}" required />
      </div>
    `;
    socialsEditor.appendChild(row);
  });

  socialsEditor.querySelectorAll('[data-soc-chk]').forEach((chk) => {
    chk.addEventListener('change', () => {
      currentData.socials[Number(chk.getAttribute('data-soc-chk'))].enabled = chk.checked;
    });
  });
  socialsEditor.querySelectorAll('[data-soc-up]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.getAttribute('data-soc-up'));
      if (i > 0) {
        [currentData.socials[i - 1], currentData.socials[i]] = [currentData.socials[i], currentData.socials[i - 1]];
        renderSocialsEditor();
      }
    });
  });
  socialsEditor.querySelectorAll('[data-soc-dn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.getAttribute('data-soc-dn'));
      if (i < currentData.socials.length - 1) {
        [currentData.socials[i], currentData.socials[i + 1]] = [currentData.socials[i + 1], currentData.socials[i]];
        renderSocialsEditor();
      }
    });
  });
  socialsEditor.querySelectorAll('[data-soc-rm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentData.socials.splice(Number(btn.getAttribute('data-soc-rm')), 1);
      renderSocialsEditor();
    });
  });
  socialsEditor.querySelectorAll('[data-soc]').forEach((el) => {
    el.addEventListener('input', () => {
      currentData.socials[Number(el.getAttribute('data-idx'))][el.getAttribute('data-soc')] = el.value;
    });
  });
}

function populateForm() {
  document.getElementById('editLogo').value = currentData.logoName;
  document.getElementById('editName').value = currentData.name;
  document.getElementById('editBadge').value = currentData.badge;
  document.getElementById('editHeadline').value = currentData.headline;
  document.getElementById('editHeroSub').value = currentData.heroSub;
  editPhotoUrl.value = currentData.photoUrl;
  photoPreview.src = currentData.photoUrl;
  document.getElementById('editAbout').value = currentData.about;
  document.getElementById('editFloatPos').value = currentData.floatPosition || 'right';
  document.getElementById('editFloatDir').value = currentData.floatDirection || 'column';
  document.getElementById('editEmail').value = currentData.email;
  document.getElementById('editWhatsapp').value = currentData.whatsapp;
  document.getElementById('editMessenger').value = currentData.messenger;
  document.getElementById('editFooterPrefix').value = currentData.footerPrefix;
  document.getElementById('editSecretName').value = currentData.secretName;
  document.getElementById('editFooterSuffix').value = currentData.footerSuffix;
  document.getElementById('editAdminUser').value = localStorage.getItem(USER_KEY) || DEFAULT_USER;
  document.getElementById('editHintQuestion').value = localStorage.getItem(HINT_Q_KEY) || DEFAULT_HINT_Q;
  renderStatsEditor();
  renderSkillsEditor();
  renderProjectsEditor();
  renderSocialsEditor();
}

editPhotoUrl.addEventListener('input', () => {
  photoPreview.src = editPhotoUrl.value.trim() || 'profile.jpg';
});

const cropperBox = document.getElementById('cropperBox');
const cropCanvas = document.getElementById('cropCanvas');
const cropRatio = document.getElementById('cropRatio');
const cropSize = document.getElementById('cropSize');
const cropZoom = document.getElementById('cropZoom');
const cropZoomVal = document.getElementById('cropZoomVal');
const applyCropBtn = document.getElementById('applyCropBtn');
const cancelCropBtn = document.getElementById('cancelCropBtn');

let cropImg = null;
let cropOffsetX = 0;
let cropOffsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function drawCropCanvas(targetCanvas, outWidth) {
  if (!cropImg || !targetCanvas) return;
  const ratio = Number(cropRatio.value) || 0.8;
  const w = outWidth || 260;
  const h = Math.round(w / ratio);
  targetCanvas.width = w;
  targetCanvas.height = h;

  const ctx = targetCanvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);

  const zoom = Number(cropZoom.value) || 1;
  const baseScale = Math.max(w / cropImg.width, h / cropImg.height);
  const drawW = cropImg.width * baseScale * zoom;
  const drawH = cropImg.height * baseScale * zoom;

  const maxX = Math.max(0, (drawW - w) / 2);
  const maxY = Math.max(0, (drawH - h) / 2);
  const ratioScale = w / 260;
  const clampedX = Math.max(-maxX, Math.min(maxX, cropOffsetX * ratioScale));
  const clampedY = Math.max(-maxY, Math.min(maxY, cropOffsetY * ratioScale));

  const x = (w - drawW) / 2 + clampedX;
  const y = (h - drawH) / 2 + clampedY;
  ctx.drawImage(cropImg, x, y, drawW, drawH);
}

function updateCropPreview() {
  if (cropZoomVal) cropZoomVal.textContent = `${Number(cropZoom.value).toFixed(2)}x`;
  drawCropCanvas(cropCanvas, 260);
}

editPhotoFile.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      cropImg = img;
      cropOffsetX = 0;
      cropOffsetY = 0;
      cropZoom.value = '1';
      cropperBox.classList.remove('hidden');
      updateCropPreview();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

cropCanvas?.addEventListener('pointerdown', (e) => {
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  cropCanvas.style.cursor = 'grabbing';
});

window.addEventListener('pointermove', (e) => {
  if (!isDragging || !cropImg) return;
  cropOffsetX += e.clientX - dragStartX;
  cropOffsetY += e.clientY - dragStartY;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  updateCropPreview();
});

window.addEventListener('pointerup', () => {
  if (!isDragging) return;
  isDragging = false;
  if (cropCanvas) cropCanvas.style.cursor = 'grab';
});

cropRatio?.addEventListener('change', updateCropPreview);
cropZoom?.addEventListener('input', updateCropPreview);

applyCropBtn?.addEventListener('click', () => {
  if (!cropImg) return;
  const outW = Number(cropSize.value) || 480;
  const exportCanvas = document.createElement('canvas');
  drawCropCanvas(exportCanvas, outW);
  const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.88);
  editPhotoUrl.value = dataUrl;
  photoPreview.src = dataUrl;
  cropperBox.classList.add('hidden');
});

cancelCropBtn?.addEventListener('click', () => {
  cropperBox.classList.add('hidden');
  editPhotoFile.value = '';
});

function getFirestoreDb() {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY' || !window.firebase) return null;
  if (!firebase.apps.length) firebase.initializeApp(cfg);
  return firebase.firestore();
}

async function loadFromFirebase() {
  const db = getFirestoreDb();
  if (!db) return;
  try {
    const doc = await db.collection('portfolio').doc('content').get();
    if (doc.exists && doc.data()) {
      currentData = { ...structuredClone(DEFAULT_DATA), ...doc.data() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
      populateForm();
    }
  } catch {
    // Keep local data
  }
}

const loginView = document.getElementById('loginView');
const forgotView = document.getElementById('forgotView');
const forgotBtn = document.getElementById('forgotBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const tabHintBtn = document.getElementById('tabHintBtn');
const tabEmailBtn = document.getElementById('tabEmailBtn');
const hintRecoveryPane = document.getElementById('hintRecoveryPane');
const emailRecoveryPane = document.getElementById('emailRecoveryPane');
const hintQuestionDisplay = document.getElementById('hintQuestionDisplay');
const hintForm = document.getElementById('hintForm');
const hintError = document.getElementById('hintError');
const resetPassForm = document.getElementById('resetPassForm');
const resetSuccess = document.getElementById('resetSuccess');
const resetEmailForm = document.getElementById('resetEmailForm');
const recoveryStatus = document.getElementById('recoveryStatus');

function ensureFirebaseInit() {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY' || !window.firebase) return false;
  if (!firebase.apps.length) firebase.initializeApp(cfg);
  return true;
}

if (ensureFirebaseInit() && firebase.auth) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      loginError.textContent = '';
      loginSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
      const authEmailInput = document.getElementById('editAuthEmail');
      if (authEmailInput && user.email) authEmailInput.value = user.email;
      populateForm();
      loadFromFirebase();
    }
  });
}

document.getElementById('updateAuthEmailBtn')?.addEventListener('click', async () => {
  const statusEl = document.getElementById('authEmailStatus');
  const newEmail = document.getElementById('editAuthEmail')?.value.trim();
  const user = firebase.auth?.().currentUser;
  if (!user || !newEmail) {
    statusEl.textContent = 'To update Firebase email, log in with your Firebase email & password first.';
    return;
  }
  if (newEmail === user.email) {
    statusEl.textContent = 'This is already your active Firebase email.';
    return;
  }
  try {
    await user.verifyBeforeUpdateEmail(newEmail);
    statusEl.textContent = `Verification link sent to ${newEmail}. Click it to complete the change!`;
  } catch (err) {
    statusEl.textContent = err?.code === 'auth/requires-recent-login'
      ? 'For security, please Lock and log in again right before changing your email.'
      : (err?.message || 'Could not update email.');
  }
});

let failedAttempts = 0;

function getLockRemaining() {
  const until = Number(localStorage.getItem(LOCK_KEY) || 0);
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

function recordFailedAttempt(errorEl) {
  failedAttempts += 1;
  if (failedAttempts >= 5) {
    localStorage.setItem(LOCK_KEY, String(Date.now() + 60000));
    failedAttempts = 0;
    errorEl.textContent = 'Too many failed attempts. Locked for 60 seconds.';
  } else {
    errorEl.textContent = 'Incorrect password. Try again.';
  }
  errorEl.classList.remove('shake');
  void errorEl.offsetWidth;
  errorEl.classList.add('shake');
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const lockSec = getLockRemaining();
  if (lockSec > 0) {
    loginError.textContent = `Too many failed attempts. Try again in ${lockSec}s.`;
    return;
  }

  const enteredIdentity = document.getElementById('adminUser').value.trim();
  const enteredPass = document.getElementById('adminPass').value;

  // Support Firebase Email/Password sign-in when an email is entered
  if (enteredIdentity.includes('@') && ensureFirebaseInit() && firebase.auth) {
    try {
      await firebase.auth().signInWithEmailAndPassword(enteredIdentity, enteredPass);
      failedAttempts = 0;
      loginError.textContent = '';
      loginSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
      populateForm();
      loadFromFirebase();
      return;
    } catch {
      recordFailedAttempt(loginError);
      return;
    }
  }

  // Standard Username + Password login
  const expectedUser = (localStorage.getItem(USER_KEY) || DEFAULT_USER).toLowerCase();
  const expectedHash = localStorage.getItem(PASS_HASH_KEY) || DEFAULT_PASS_HASH;
  const enteredHash = await sha256(enteredPass);

  if (enteredIdentity.toLowerCase() === expectedUser && enteredHash === expectedHash) {
    failedAttempts = 0;
    loginError.textContent = '';
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    populateForm();
    loadFromFirebase();
  } else {
    recordFailedAttempt(loginError);
  }
});

forgotBtn?.addEventListener('click', () => {
  loginView.classList.add('hidden');
  forgotView.classList.remove('hidden');
  hintForm.classList.remove('hidden');
  resetPassForm.classList.add('hidden');
  hintError.textContent = '';
  resetSuccess.textContent = '';
  recoveryStatus.textContent = '';
  hintQuestionDisplay.textContent = `Hint: ${localStorage.getItem(HINT_Q_KEY) || DEFAULT_HINT_Q}`;
});

tabHintBtn?.addEventListener('click', () => {
  tabHintBtn.classList.add('active');
  tabEmailBtn.classList.remove('active');
  hintRecoveryPane.classList.remove('hidden');
  emailRecoveryPane.classList.add('hidden');
});

tabEmailBtn?.addEventListener('click', () => {
  tabEmailBtn.classList.add('active');
  tabHintBtn.classList.remove('active');
  emailRecoveryPane.classList.remove('hidden');
  hintRecoveryPane.classList.add('hidden');
});

backToLoginBtn?.addEventListener('click', () => {
  forgotView.classList.add('hidden');
  loginView.classList.remove('hidden');
  loginError.textContent = '';
});

hintForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const lockSec = getLockRemaining();
  if (lockSec > 0) {
    hintError.textContent = `Locked for ${lockSec}s due to failed attempts.`;
    return;
  }
  const expectedHintHash = localStorage.getItem(HINT_A_HASH_KEY) || DEFAULT_HINT_HASH;
  const enteredHintHash = await sha256(document.getElementById('hintAnswerInput').value.trim().toLowerCase());
  if (enteredHintHash === expectedHintHash) {
    failedAttempts = 0;
    hintError.textContent = '';
    hintForm.classList.add('hidden');
    resetPassForm.classList.remove('hidden');
  } else {
    recordFailedAttempt(hintError);
  }
});

resetPassForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newUser = document.getElementById('resetNewUser').value.trim();
  const newPass = document.getElementById('resetNewPass').value;
  if (newUser) localStorage.setItem(USER_KEY, newUser);
  localStorage.setItem(PASS_HASH_KEY, await sha256(newPass));
  resetSuccess.textContent = 'Password updated! You can now log in.';
  document.getElementById('resetNewPass').value = '';
  setTimeout(() => {
    forgotView.classList.add('hidden');
    loginView.classList.remove('hidden');
    document.getElementById('adminPass').value = '';
  }, 1000);
});

resetEmailForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('recoveryEmailInput').value.trim();
  if (!ensureFirebaseInit() || !firebase.auth) {
    recoveryStatus.textContent = 'Firebase Auth is not loaded.';
    return;
  }
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    recoveryStatus.style.color = '#16a34a';
    recoveryStatus.textContent = 'Reset link sent! Check your Gmail inbox (and Spam folder).';
  } catch (err) {
    recoveryStatus.style.color = '#dc2626';
    recoveryStatus.textContent = err?.message || 'Could not send reset email. Check the address.';
  }
});

logoutBtn.addEventListener('click', async () => {
  if (ensureFirebaseInit() && firebase.auth) {
    await firebase.auth().signOut();
  }
  dashboardSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
  document.getElementById('adminPass').value = '';
});

addSkillBtn.addEventListener('click', () => {
  currentData.skills.push({ title: 'New Skill', desc: 'Describe your skill or tools' });
  renderSkillsEditor();
});

addProjectBtn.addEventListener('click', () => {
  currentData.projects.push({ tag: 'New', title: 'New Project', desc: 'Project description here.' });
  renderProjectsEditor();
});

addSocialBtn.addEventListener('click', () => {
  currentData.socials.push({ label: '💬 Telegram', url: 'https://t.me/', color: '#0ea5e9', enabled: true });
  renderSocialsEditor();
});

adminForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  currentData.logoName = document.getElementById('editLogo').value.trim();
  currentData.name = document.getElementById('editName').value.trim();
  currentData.badge = document.getElementById('editBadge').value.trim();
  currentData.headline = document.getElementById('editHeadline').value.trim();
  currentData.heroSub = document.getElementById('editHeroSub').value.trim();
  currentData.photoUrl = editPhotoUrl.value.trim() || 'profile.jpg';
  currentData.about = document.getElementById('editAbout').value.trim();
  currentData.floatPosition = document.getElementById('editFloatPos').value;
  currentData.floatDirection = document.getElementById('editFloatDir').value;
  currentData.email = document.getElementById('editEmail').value.trim();
  currentData.whatsapp = document.getElementById('editWhatsapp').value.replace(/\D/g, '');
  currentData.messenger = document.getElementById('editMessenger').value.trim();
  currentData.footerPrefix = document.getElementById('editFooterPrefix').value.trim();
  currentData.secretName = document.getElementById('editSecretName').value.trim();
  currentData.footerSuffix = document.getElementById('editFooterSuffix').value;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));

  const newAdminUser = document.getElementById('editAdminUser').value.trim();
  const newHintQ = document.getElementById('editHintQuestion').value.trim();
  const newHintA = document.getElementById('editHintAnswer').value.trim();
  const newEntryPass = document.getElementById('editEntryPass').value.trim();
  const newAdminPass = document.getElementById('editAdminPass').value;

  if (newAdminUser) localStorage.setItem(USER_KEY, newAdminUser);
  if (newHintQ) localStorage.setItem(HINT_Q_KEY, newHintQ);
  if (newHintA) {
    localStorage.setItem(HINT_A_HASH_KEY, await sha256(newHintA.toLowerCase()));
    document.getElementById('editHintAnswer').value = '';
  }
  if (newEntryPass) {
    localStorage.setItem(ENTRY_PASS_KEY, newEntryPass);
    document.getElementById('editEntryPass').value = '';
  }
  if (newAdminPass) {
    localStorage.setItem(PASS_HASH_KEY, await sha256(newAdminPass));
    document.getElementById('editAdminPass').value = '';
  }

  const db = getFirestoreDb();
  if (!db) {
    saveStatus.textContent = 'Saved locally!';
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
    saveStatus.textContent = 'Saved locally, but could not reach Firebase.';
  }
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  currentData = structuredClone(DEFAULT_DATA);
  populateForm();
  saveStatus.textContent = 'Reset to default portfolio content.';
});
