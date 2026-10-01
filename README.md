# TemanBelajar — AI Learning Workspace
> **“Belajar bersama AI, tetap berpikir sendiri.”**

Desain *High-Fidelity Desktop Web Application* (1440 × 1024 px) untuk platform ruang belajar berbasis AI khusus mahasiswa perguruan tinggi.

---

## 🎯 Fokus Desain & Hirarki Visual (Refined Layout)

Struktur antarmuka telah disempurnakan agar **fokus, tenang, lapang, dan mudah dipindai**, menghindari kesan "dashboard berjejal widget" dan mengedepankan satu tugas utama pada satu waktu.

### Hirarki Visual Utama:
1. **AI Assistant / Percakapan Pembelajaran** (Mendominasi ~62% lebar halaman)
2. **Penjelasan Terarah (Guided Explanation) + Pertanyaan Pemantik**
3. **Your Thinking (Ruang Berpikir Mahasiswa)**
4. **Learning Progress (Konteks Pendukung Kompak)**

---

## 📐 Proporsi Tata Letak Desktop (1440 × 1024 px)

| Area | Lebar | Peran & Karakter |
| :--- | :--- | :--- |
| **Left Sidebar** | ~220 px | Navigasi tenang tanpa kartu bertumpuk, permukaan kaca lembut tunggal. |
| **Main AI Workspace** | ~850 px | **Focal Point Dominan**: permukaan kaca jernih, alur membaca terarah dari pertanyaan → penjelasan → pemantik → formulasi pemikiran. |
| **Right Learning Context**| ~265 px | Satu panel tunggal ringkas (*Progress Donut* + Goal + Activity) dengan *Quick Reflection* yang terintegrasi rapi. |

---

## 🎨 Palet Warna & Glassmorphism Terpilih

- **Electric Blue**: `#4F8BFF`
- **Bright Cyan**: `#6EE1FF`
- **Soft Violet**: `#7B61FF`
- **Deep Navy**: `#2E3A59`
- **Glassmorphism**: Diterapkan secara selektif pada panel utama (Sidebar, Workspace AI, Progress Context, Input Bar) untuk menjaga kejernihan visual dan kenyamanan membaca (*calm clarity*).

---

## 🚀 Alur Interaksi (Socratic Learning Loop)

1. **Mahasiswa Mengajukan Kebingungan**: *"Aku masih bingung kenapa 2NF diperlukan dalam database."*
2. **AI Menjelaskan Secara Terarah**: Ringkas, contoh kontekstual tipografis, dan pertanyaan pemantik yang merangsang analisis.
3. **Aksi Sekunder Halus**: Opsi `💡 Give me a hint` dan `📑 Show an example` hadir dengan bobot visual rendah agar tidak mengalihkan perhatian.
4. **Mahasiswa Merumuskan Pemikiran ("Your Thinking")**: Komponen berjarak lapang untuk menuliskan pemahaman sendiri.
5. **Tombol Primer ("Submit for Feedback")**: Menganalisis respon mahasiswa dan menampilkan evaluasi formatif (*Understanding: Developing*).
6. **Progress Dinamis & Refleksi**: Donut progress bertambah, dan mahasiswa diajak melakukan refleksi singkat.

---

## 📁 Struktur Berkas

```
D:/TEMANBELAJAR/
├── index.html                 # Struktur semantik desktop 1440 × 1024 (bersih & fokus)
├── css/
│   └── style.css              # Sistem desain Blue Glassmorphism dengan whitespace lapang
├── js/
│   ├── app.js                 # Kontroler alur sokrates, evaluasi pemikiran, & Web Audio
│   ├── mascot.js              # Vector SVG Mascot renderer & transisi ekspresi
│   └── learning-data.js       # Basis pengetahuan materi perkuliahan & umpan balik
├── assets/
│   ├── logo.svg               # Brand logo (Buku Terbuka & Cahaya/Spark)
│   ├── alya_avatar.svg        # Avatar profil mahasiswi IT UGM
│   └── illustration.svg       # Ilustrasi tumpukan buku & tunas
└── README.md                  # Dokumentasi spesifikasi arsitektur
```
=======
# TemanBelajar