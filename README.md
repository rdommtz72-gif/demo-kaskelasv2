# Web Kas Kelas — Versi Online (Google Sheets + Backend Apps Script)

Ini mengubah prototipe statis menjadi aplikasi online sungguhan: Google
Sheets sebagai database, Google Apps Script (GAS) sebagai REST API, dan
frontend (`index.html` / `admin.html` / `student.html`) memanggil API
tersebut menggunakan `fetch()`.

## 1. Skema Google Sheets

Buat Google Sheet baru (atau biarkan `setup.gs` yang membuatkan tab-nya —
lihat langkah 3). Dibutuhkan tepat tiga tab berikut:

**Users**
| id | name | userid | password | role | class |
|----|------|-------|----------|------|-------|
| u-admin | Bu Sari Wulandari | admin@kelas.com | admin123 | admin | XII IPA 1 |
| u-1 | Andi Pratama | siswa1@kelas.com | siswa123 | student | XII IPA 1 |

**Transactions**
| id | date | type | category | description | amount | by |
|----|------|------|----------|-------------|--------|----|

`type` diisi `income` atau `expense`.

**WeeklyTracking**
| id | week | weekDate | studentId | amount | status | paidDate | paidBy |
|----|------|----------|-----------|--------|--------|----------|--------|

`week` berupa label seperti `2026-W29`, `studentId` mengacu ke `id` di
tab Users, dan `status` diisi `paid` atau `unpaid`.

> Kata sandi disimpan dalam bentuk teks biasa (plain text) di sheet demi
> kesederhanaan, sesuai dengan skala aplikasi kas kelas. Jangan gunakan
> kata sandi yang sensitif untuk akun demo, dan jaga agar pengaturan
> berbagi sheet tetap privat (hanya Anda sebagai pemilik, jangan pernah
> "Siapa saja yang memiliki link dapat mengedit").

## 2. Setup Backend (Google Apps Script)

1. Buka Google Sheet Anda → **Extensions → Apps Script**.
2. Hapus isi bawaan `Code.gs` dan tempelkan isi dari `gas-backend/Code.gs`.
3. Tambahkan file skrip baru bernama `setup` dan tempelkan isi dari
   `gas-backend/setup.gs`.
4. Simpan proyek (nama bebas, misalnya "Kas Kelas API").
5. Kembali ke Sheet, muat ulang halamannya. Menu baru **"Kas Kelas"** akan
   muncul. Klik **Kas Kelas → Setup / Seed Database**. Ini akan membuat
   tiga tab beserta header-nya dan mengisi satu akun admin, 10 siswa demo,
   contoh transaksi, dan 6 minggu data iuran — sehingga aplikasi langsung
   memiliki data.
   - Alternatif lain: di editor Apps Script, pilih fungsi `setupDatabase`
     dari dropdown fungsi lalu klik **Run** (berikan izin akses saat diminta).

## 3. Deploy API sebagai Web App

1. Di editor Apps Script: **Deploy → New deployment**.
2. Klik ikon gerigi di samping "Select type" → pilih **Web app**.
3. Pengaturan:
   - **Execute as:** Me (akun Anda)
   - **Who has access:** Anyone
4. Klik **Deploy**, lalu izinkan permintaan akses yang muncul.
5. Salin **Web app URL** — bentuknya seperti
   `https://script.google.com/macros/s/AKfycb.../exec`.

Setiap kali Anda mengubah `Code.gs`, Anda harus melakukan **Deploy → Manage
deployments → Edit (ikon pensil) → New version → Deploy** agar perubahan
aktif; URL-nya tidak berubah.

## 4. Menghubungkan Frontend

Buka `assets/js/api.js` dan tempelkan Web App URL Anda:

```js
const API_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

Hanya itu perubahan yang dibutuhkan — `index.html`, `admin.html`, dan
`student.html` sudah memanggil `DB.login()`, `DB.addTransaction()`,
`DB.markPaid()`, dan seterusnya, yang sekarang mengarah ke API Apps Script
Anda, bukan lagi ke `localStorage`.

### Kenapa POST menggunakan `text/plain`
Web app Apps Script tidak menangani permintaan CORS preflight (`OPTIONS`).
Agar browser tidak pernah mengirim preflight, semua permintaan POST
menggunakan `Content-Type: text/plain` (dikategorikan sebagai "simple
request" yang melewati preflight), dan di sisi server (`doPost`)
`e.postData.contents` di-parse sebagai JSON secara manual. Jangan mengubah
ini menjadi `application/json` atau menambahkan header kustom, karena
permintaan akan mulai gagal dengan error CORS.

## 5. Uji Coba secara Lokal

Karena ini file statis biasa, Anda bisa langsung membuka `index.html` di
browser, atau menjalankan folder ini secara lokal agar path relatifnya
lebih rapi:

```bash
npx serve .
# atau
python3 -m http.server 8080
```

Masuk menggunakan akun demo yang sudah di-seed:
- Admin: `admin@kelas.com` / `admin123`
- Siswa: `siswa1@kelas.com` / `siswa123` (sampai `siswa10@kelas.com`)

## 6. Deploy Frontend (GitHub → Vercel)

1. Push folder ini ke repo GitHub.
2. Di Vercel: **New Project → Import** repo tersebut.
3. Framework preset: **Other** (ini HTML statis, tanpa proses build).
4. Deploy. Vercel akan menyajikan `index.html`, `admin.html`,
   `student.html`, dan `assets/` apa adanya.
5. Karena `API_URL` sudah tertanam langsung di `assets/js/api.js`, lakukan
   redeploy (atau cukup push commit baru) setiap kali Anda mengubahnya.

## Referensi API

| Method | Action | Parameter | Mengembalikan |
|---|---|---|---|
| GET | `?action=bootstrap` | – | `{ users, transactions, weekly }` (password dihilangkan) |
| GET | `?action=ping` | – | `{ ok: true, time }` |
| POST | `login` | `userid, password` | objek user (tanpa password) atau `{error}` |
| POST | `addTransaction` | `type, category, description, amount, by` | `{success, transaction}` |
| POST | `markPaid` | `id, adminName` | `{success}` — mengubah status lunas/belum lunas |
| POST | `changePassword` | `userId, newPassword` | `{success}` |

## Keterbatasan yang Perlu Diketahui / Langkah Lanjutan yang Disarankan

- **Autentikasi masih sederhana.** Tidak ada token sesi atau masa
  kedaluwarsa — browser hanya menyimpan `{userId, role}` di `localStorage`
  setelah berhasil login yang dicocokkan dengan data di sheet. Cukup untuk
  aplikasi kas kelas skala kecil; tidak cocok untuk data yang sensitif.
- **Tidak ada hashing password.** Untuk keamanan tambahan, gunakan
  `Utilities.computeDigest()` di `Code.gs` untuk hashing password sebelum
  disimpan/dibandingkan.
- **Google Sheets sebagai database punya batasan** (jumlah baris,
  penulisan bersamaan/concurrent). Cocok untuk satu kelas, tidak untuk
  ratusan pengguna bersamaan.
- **Ekspor Excel** menggunakan library SheetJS (sudah terpasang di
  `admin.html`) sehingga menghasilkan file `.xlsx` sungguhan; ekspor PDF
  membuka dialog cetak yang sudah diberi gaya untuk pencetakan — ganti
  dengan `jsPDF` jika Anda ingin unduhan langsung.
