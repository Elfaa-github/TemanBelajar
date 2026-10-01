# TemanBelajar

**AI Learning Workspace untuk mahasiswa perguruan tinggi**

> “Belajar bersama AI, tetap berpikir sendiri.”

## Deskripsi

TemanBelajar adalah desain **High-Fidelity Desktop Web Application** untuk ruang belajar berbasis AI yang ditujukan bagi mahasiswa perguruan tinggi.

Antarmuka dirancang untuk memberikan pengalaman belajar yang fokus dan mudah dipahami dengan menempatkan percakapan dengan AI sebagai bagian utama, kemudian diikuti ruang bagi mahasiswa untuk memahami penjelasan, menyusun pemikiran sendiri, memantau progres, dan melakukan refleksi.

## Fokus Desain

Desain TemanBelajar menggunakan pendekatan yang berfokus pada satu aktivitas utama dalam satu waktu. Struktur antarmuka dibuat agar informasi tidak terlalu padat dan memiliki hierarki visual yang jelas.

Hierarki utama antarmuka:

1. AI Assistant dan percakapan pembelajaran
2. Penjelasan terarah dan pertanyaan pemantik
3. Your Thinking sebagai ruang untuk menyusun pemikiran mahasiswa
4. Learning Progress sebagai konteks pendukung

## Struktur Tata Letak

Target desain desktop menggunakan ukuran kanvas **1440 × 1024 px**.

| Area                   | Perkiraan Lebar | Fungsi                                           |
| ---------------------- | --------------: | ------------------------------------------------ |
| Left Sidebar           |          220 px | Navigasi utama aplikasi                          |
| Main AI Workspace      |          850 px | Area utama percakapan dan aktivitas pembelajaran |
| Right Learning Context |          265 px | Informasi progres dan konteks pembelajaran       |

## Desain Visual

TemanBelajar menggunakan pendekatan **Blue Glassmorphism** dengan penggunaan efek kaca secara selektif pada beberapa bagian antarmuka.

### Palet Warna

* Electric Blue: `#4F8BFF`
* Bright Cyan: `#6EE1FF`
* Soft Violet: `#7B61FF`
* Deep Navy: `#2E3A59`

Font yang digunakan adalah **Plus Jakarta Sans**.

## Alur Pembelajaran

TemanBelajar menggunakan alur pembelajaran yang berfokus pada proses berpikir mahasiswa:

1. **Mahasiswa Mengajukan Kebingungan**
   Mahasiswa menyampaikan bagian materi yang belum dipahami.

2. **AI Memberikan Penjelasan Terarah**
   AI memberikan penjelasan dan contoh yang berkaitan dengan materi.

3. **Pertanyaan Pemantik**
   AI memberikan pertanyaan untuk membantu mahasiswa membangun pemahamannya sendiri.

4. **Your Thinking**
   Mahasiswa menuliskan pemahamannya berdasarkan proses belajar yang telah dilakukan.

5. **Submit for Feedback**
   Jawaban mahasiswa dikirim untuk mendapatkan evaluasi pemahaman secara formatif.

6. **Learning Progress dan Reflection**
   Progres pembelajaran diperbarui dan mahasiswa dapat melakukan refleksi terhadap proses belajarnya.

## Struktur Berkas

```text
D:/TEMANBELAJAR/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── mascot.js
│   ├── learning-data.js
│   ├── project.js
│   ├── reflection-nav.js
│   ├── reflection.js
│   └── sidebar.js
├── assets/
│   ├── logo.svg
│   ├── alya_avatar.svg
│   └── illustration.svg
├── my-learning.html
├── projects.html
├── reflection.html
├── work-area.html
└── README.md
```

## Fungsi Berkas Utama

### `index.html`

Halaman utama TemanBelajar yang memuat struktur antarmuka desktop, AI Workspace, navigasi, dan Learning Context.

### `css/style.css`

Berisi sistem styling utama aplikasi, termasuk layout, warna, typography, glassmorphism, spacing, dan elemen visual lainnya.

### `js/app.js`

Mengatur interaksi utama pada AI Learning Workspace, termasuk alur pembelajaran, evaluasi pemikiran mahasiswa, dan interaksi terkait AI Assistant.

### `js/mascot.js`

Mengatur tampilan dan perubahan ekspresi mascot AI pada antarmuka.

### `js/learning-data.js`

Berisi data pembelajaran yang digunakan oleh aplikasi, termasuk materi dan data untuk evaluasi pemikiran mahasiswa.

### `js/project.js`

Berisi fungsi JavaScript yang digunakan pada halaman Projects.

### `js/reflection.js`

Berisi fungsi JavaScript yang digunakan pada halaman Reflection.

### `js/reflection-nav.js`

Mengatur navigasi yang berkaitan dengan fitur Reflection.

### `js/sidebar.js`

Mengatur interaksi dan navigasi pada sidebar aplikasi.

### `my-learning.html`

Halaman My Learning untuk bagian pembelajaran pengguna.

### `projects.html`

Halaman Projects untuk menampilkan bagian proyek pembelajaran.

### `reflection.html`

Halaman Reflection untuk membantu mahasiswa meninjau proses dan pemahaman belajarnya.

### `work-area.html`

Halaman Work Area sebagai bagian dari workspace pembelajaran.

## Aset

* `logo.svg` — logo TemanBelajar.
* `alya_avatar.svg` — avatar yang digunakan pada antarmuka.
* `illustration.svg` — ilustrasi yang digunakan pada antarmuka.

## Teknologi

Project ini menggunakan teknologi web dasar:

* HTML
* CSS
* JavaScript
* SVG

Tidak menggunakan framework JavaScript eksternal pada struktur utama project.

## Tujuan Desain

TemanBelajar dirancang untuk membantu mahasiswa belajar bersama AI tanpa menghilangkan proses berpikir mandiri. AI berperan sebagai pendamping dalam memberikan penjelasan, pertanyaan pemantik, contoh, dan feedback terhadap pemikiran mahasiswa.
