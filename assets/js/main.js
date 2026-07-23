/* ============================================================
   Web Kas Kelas — shared UI logic (theme, nav, auth guard, utils)
   ============================================================ */

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3"/><path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-4a2 2 0 0 0 0 4h5"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c.6-3.2 3-5 6.5-5s5.9 1.8 6.5 5"/><circle cx="17.5" cy="8.5" r="2.4"/><path d="M15.8 14.2c2.6.4 4.3 1.9 4.8 4.8"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M11 12 20 3M20 3v4h-4M20 3l-5 5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4.8c0-.4.4-.8.9-.8h4.2c.5 0 .9.4.9.8V7"/><path d="M6.5 7 7.3 19.2c0 .8.7 1.5 1.5 1.5h6.4c.8 0 1.5-.7 1.5-1.5L17.5 7"/><path d="M10.2 11v6M13.8 11v6"/></svg>'
};

function formatIDR(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID');
}

/* Shared color choices for announcement dots (bg/fg pairs) */
const ANN_COLORS = {
  mustard: { bg: 'var(--accent-mustard)', fg: '#4a3410', label: 'Kuning' },
  sage:    { bg: 'var(--accent-sage)',    fg: '#1d3527', label: 'Hijau' },
  coral:   { bg: 'var(--accent-coral)',   fg: '#ffffff', label: 'Merah Muda' }
};
function annColor(key) { return ANN_COLORS[key] || ANN_COLORS.mustard; }

/* dd:mm:yy */
function formatDT(input) {
  if (!input) return '-';
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  const p = (n) => String(n).padStart(2, '0');
  const dd = p(d.getDate());
  const mm = p(d.getMonth() + 1);
  const yy = p(d.getFullYear() % 100);
  return `${dd}:${mm}:${yy}`;
}

/* ---------- Theme ---------- */
function initTheme() {
  const saved = localStorage.getItem('webkas_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('webkas_theme', next);
  const btn = document.getElementById('themeToggleIcon');
  if (btn) btn.innerHTML = next === 'dark' ? ICONS.sun : ICONS.moon;
}
initTheme();

/* ---------- Auth guard ---------- */
async function requireAuth(role) {
  const session = DB.getSession();
  if (!session) { window.location.href = 'index.html'; return null; }
  try {
    await DB.init();
  } catch (err) {
    document.body.innerHTML = `<div style="padding:40px; font-family:sans-serif; max-width:520px; margin:0 auto;">
      <h2>Tidak bisa terhubung ke server</h2><p>${err.message}</p>
      <p>Pastikan API_URL di <code>assets/js/api.js</code> sudah diisi dengan URL Web App Apps Script yang sudah dideploy, dan sheet sudah di-setup.</p></div>`;
    throw err;
  }
  const user = DB.currentUser();
  if (!user) { DB.clearSession(); window.location.href = 'index.html'; return null; }
  if (role && user.role !== role) {
    window.location.href = user.role === 'admin' ? 'admin.html' : 'student.html';
    return null;
  }
  return user;
}
function doLogout() {
  DB.clearSession();
  window.location.href = 'index.html';
}

/* ---------- Nav ---------- */
function navItemsFor(role) {
  if (role === 'admin') {
    return [
      { id: 'overview', label: 'Beranda', icon: 'home' },
      { id: 'tracking', label: 'Iuran', icon: 'users' },
      { id: 'transactions', label: 'Transaksi', icon: 'wallet' },
      { id: 'announcements', label: 'Info', icon: 'bell' },
      { id: 'account', label: 'Akun', icon: 'user' }
    ];
  }
  return [
    { id: 'overview', label: 'Beranda', icon: 'home' },
    { id: 'history', label: 'Riwayat', icon: 'history' },
    { id: 'account', label: 'Akun', icon: 'user' }
  ];
}

function renderNav(activeId, role) {
  const items = navItemsFor(role);
  const brand = role === 'admin' ? 'Kas Kelas' : 'Kas Kelas';

  const bottomHTML = items.map(it => `
    <button class="navbtn ${it.id === activeId ? 'active' : ''}" data-target="${it.id}">
      <span class="navicon">${ICONS[it.icon]}</span>
      <span class="navlabel">${it.label}</span>
    </button>`).join('');

  const sidebarHTML = items.map(it => `
    <button class="sidebtn ${it.id === activeId ? 'active' : ''}" data-target="${it.id}" title="${it.label}">
      <span class="navicon">${ICONS[it.icon]}</span>
    </button>`).join('');

  document.getElementById('bottomNav').innerHTML = bottomHTML;
  document.getElementById('sidebarNav').innerHTML = `
    <div class="side-logo" title="${brand}"><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyaMkNQ8IrmiIC0KtznmvhtomCWrptGB-ocowsYF7kNlDE8qAcvrXYCgtgrvcBfFqH9N3pK-g598Hc3DMBw3wHo-ZlP67Xvd3tyNnMS9s2g6-c3bwOXplwTD8Hn6CmhyphenhyphenK9eSoynKejUCANoUrGJRmZbybcQOezWGbYKJ3VF1vTJvUSZA__R6kpwOb7wO0/s500/logo.png" alt="Logo"></div>
    <div class="side-items">${sidebarHTML}</div>
    <button class="sidebtn logout" data-action="logout" title="Keluar">${ICONS.logout}</button>`;

  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.target));
  });
  document.querySelectorAll('[data-action="logout"]').forEach(btn => btn.addEventListener('click', doLogout));

  showSection(activeId);
}

function showSection(id) {
  document.querySelectorAll('.view-section').forEach(s => s.classList.toggle('is-active', s.id === 'view-' + id));
  document.querySelectorAll('[data-target]').forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
  const main = document.querySelector('.main-scroll');
  if (main) main.scrollTo({ top: 0, behavior: 'instant' });
}

/* ---------- Modal ---------- */
function openModal(id) { document.getElementById(id).classList.add('is-open'); }
function closeModal(id) { document.getElementById(id).classList.remove('is-open'); }

/* ---------- Toast ---------- */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2400);
}

/* ---------- Export helpers ---------- */
function exportCSV(filename, rows) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function exportXLSX(filename, sheetName, rows) {
  if (typeof XLSX === 'undefined') { exportCSV(filename.replace('.xlsx', '.csv'), rows); return; }
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

function exportPDF(elementId) {
  const original = document.body.innerHTML;
  const printContent = document.getElementById(elementId).innerHTML;
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Cetak Rekap</title>
    <style>
      body{font-family:Nunito,sans-serif;padding:24px;color:#333}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      th,td{padding:8px 10px;border-bottom:1px solid #eee;text-align:left;font-size:13px}
      h2{margin-bottom:4px}
    </style></head><body>${printContent}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 300);
}
