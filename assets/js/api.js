/* ============================================================
   Web Kas Kelas — API client for the Google Apps Script backend
   ------------------------------------------------------------
   PASTE YOUR DEPLOYED WEB APP URL BELOW. See README.md.
   ============================================================ */

const API_URL = 'https://script.google.com/macros/s/AKfycbyNqVsXjegvcJWe06IcllExCEBf_xgGCuXE7HJhoCEj9ew7uwssif47koZiKcM2LHji/exec';

const SESSION_KEY = 'webkas_session';

async function apiGet(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(action, payload = {}) {
  // text/plain avoids a CORS preflight (Apps Script web apps don't
  // handle OPTIONS requests), the server parses the JSON manually.
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...payload })
  });
  return res.json();
}

let _cache = { users: [], transactions: [], weekly: [], announcements: [] };

const DB = {
  /** Fetches all data once and caches it in memory for this page load. */
  async init() {
    if (API_URL.indexOf('PASTE_YOUR') === 0) {
      throw new Error('Set API_URL in assets/js/api.js to your deployed Apps Script Web App URL first.');
    }
    const data = await apiGet('bootstrap');
    if (data.error) throw new Error(data.error);
    _cache.users = data.users;
    _cache.transactions = data.transactions;
    _cache.weekly = data.weekly;
    _cache.announcements = data.announcements || [];
  },
  async refresh() { return this.init(); },

  getUsers() { return _cache.users; },
  getTransactions() {
    return [..._cache.transactions].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  },
  getWeekly() { return _cache.weekly; },
  getAnnouncements() {
    return [..._cache.announcements].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  },

  getSession() { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); },
  setSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); },
  clearSession() { localStorage.removeItem(SESSION_KEY); },

  async login(email, password) {
    const res = await apiPost('login', { email, password });
    if (res.error || !res.id) return null;
    this.setSession({ userId: res.id, role: res.role });
    return res;
  },

  currentUser() {
    const s = this.getSession();
    if (!s) return null;
    return _cache.users.find(u => u.id === s.userId) || null;
  },

  balance() {
    return this.getTransactions().reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);
  },

  weeksList() {
    const uniq = [...new Set(_cache.weekly.map(x => x.week))].sort().reverse();
    return uniq;
  },

  weeklyForStudent(studentId) {
    return _cache.weekly.filter(w => w.studentId === studentId).sort((a, b) => String(b.week).localeCompare(String(a.week)));
  },

  weeklyForWeek(week) {
    return _cache.weekly.filter(w => w.week === week);
  },

  /** Toggles paid/unpaid, then refreshes the local cache from the sheet. */
  async markPaid(weekEntryId, adminName) {
    const res = await apiPost('markPaid', { id: weekEntryId, adminName });
    if (res.success) await this.refresh();
    return res;
  },

  async addTransaction(type, category, description, amount, byName) {
    const res = await apiPost('addTransaction', { type, category, description, amount, by: byName });
    if (res.success) await this.refresh();
    return res;
  },

  async deleteTransaction(id) {
    const res = await apiPost('deleteTransaction', { id });
    if (res.success) await this.refresh();
    return res;
  },

  /** Creates a new weekly dues entry for every student at once (manual week entry). */
  async addWeek(week, amount, byName) {
    const res = await apiPost('addWeek', { week, amount, by: byName });
    if (res.success) await this.refresh();
    return res;
  },

  async deleteWeekly(id) {
    const res = await apiPost('deleteWeekly', { id });
    if (res.success) await this.refresh();
    return res;
  },

  async addAnnouncement(title, description, icon, color, byName) {
    const res = await apiPost('addAnnouncement', { title, description, icon, color, by: byName });
    if (res.success) await this.refresh();
    return res;
  },

  async updateAnnouncement(id, title, description, icon, color) {
    const res = await apiPost('updateAnnouncement', { id, title, description, icon, color });
    if (res.success) await this.refresh();
    return res;
  },

  async deleteAnnouncement(id) {
    const res = await apiPost('deleteAnnouncement', { id });
    if (res.success) await this.refresh();
    return res;
  },

  async changePassword(userId, newPassword) {
    const res = await apiPost('changePassword', { userId, newPassword });
    return !!res.success;
  }
};
