/**
 * TemanBelajar Knowledge Base & Socratic Learning Modules
 * Designed for higher-education computer science / IT students.
 */

const LearningTopics = {
  '2nf-normalization': {
    id: '2nf-normalization',
    title: 'Normalisasi Database 2NF',
    category: 'Basis Data',
    goal: 'Understand Database Normalization',
    currentActivity: 'Explain 2NF in your own words',
    initialProgress: { current: 2, total: 4, label: 'concepts explored' },
    aiUsageCount: 3,

    // Initial seeded chat exchange
    initialChat: [
      {
        id: 'msg-1',
        sender: 'student',
        senderName: 'Alya Rahma',
        time: '10:24',
        text: 'Aku masih bingung kenapa 2NF diperlukan dalam database.'
      },
      {
        id: 'msg-2',
        sender: 'ai',
        senderName: 'TemanBelajar AI',
        badge: 'Penjelasan terarah',
        time: '10:25',
        text: '2NF diperlukan agar setiap atribut non-key bergantung penuh pada seluruh primary key, bukan hanya sebagian. Jika tabel belum dalam 2NF, dapat terjadi <strong>partial dependency</strong> yang menyebabkan redundansi dan inkonsistensi data.',
        exampleCard: {
          title: 'Contoh sederhana',
          text: 'Pada tabel dengan composite key, misalnya <code>(NIM, KodeMataKuliah)</code>, atribut seperti <code>NamaMataKuliah</code> hanya bergantung pada <code>KodeMataKuliah</code>, bukan pada keseluruhan key. Kondisi ini disebut dependensi parsial.'
        },
        guidingQuestionCard: {
          title: 'Pertanyaan pemantik',
          text: 'Jika sebuah tabel memiliki composite key, apakah setiap atribut non-key harus bergantung pada seluruh bagian key atau cukup salah satu?'
        },
        suggestedActions: [
          { id: 'hint', label: 'Petunjuk', icon: '' },
          { id: 'example', label: 'Lihat Contoh', icon: '' },
          { id: 'check', label: 'Cek Pemahaman', icon: '' }
        ]
      }
    ],

    // Dynamic responses for secondary action buttons
    hints: [
      'Coba ingat syarat 2NF: tabel harus memenuhi 1NF dan tidak boleh ada partial functional dependency terhadap composite candidate key.',
      'Bayangkan jika dosen mengganti nama mata kuliah "Basis Data" menjadi "Sistem Basis Data". Jika ada 100 mahasiswa yang mengambil mata kuliah tersebut dalam tabel yang sama, berapa baris yang harus diperbarui?'
    ],

    detailedExamples: [
      'Studi Kasus KRS:\n\nTabel KRS(NIM, KodeMK, Nilai, NamaMK, SKS, NamaMhs)\nPrimary Key: (NIM, KodeMK)\n\n• Nilai bergantung pada (NIM, KodeMK) -> DEPENDENSI PENUH (Benar)\n• NamaMK & SKS hanya bergantung pada KodeMK -> DEPENDENSI PARSIAL (Melanggar 2NF!)\n• NamaMhs hanya bergantung pada NIM -> DEPENDENSI PARSIAL (Melanggar 2NF!)\n\nSolusi 2NF: Pisahkan menjadi 3 tabel:\n1. Mahasiswa(NIM, NamaMhs)\n2. MataKuliah(KodeMK, NamaMK, SKS)\n3. NilaiKRS(NIM, KodeMK, Nilai)'
    ],

    // Socratic Evaluation Engine for Student Thinking
    evaluateThinking(studentText) {
      const lower = studentText.toLowerCase();
      let status = 'Developing';
      let feedback = '';
      let followUpQuestion = '';
      let progressGain = 1;

      if (lower.length < 20) {
        status = 'Needs Elaboration';
        feedback = 'Penjelasanmu masih terlalu singkat. Coba jelaskan apa yang terjadi pada atribut non-key jika tabel memiliki composite primary key.';
        followUpQuestion = 'Apa hubungan antara primary key gabungan dengan atribut biasa?';
        progressGain = 0;
      } else if (lower.includes('parsial') || lower.includes('partial') || lower.includes('redundansi') || lower.includes('bergantung') || lower.includes('kunci') || lower.includes('key')) {
        status = 'Developing';
        feedback = 'Penjelasanmu sudah menunjukkan pemahaman tentang partial dependency. Coba jelaskan mengapa dependency tersebut dapat menyebabkan redundansi data saat terjadi update atau delete.';
        followUpQuestion = 'Bagaimana pemisahan tabel menjadi relasi terpisah dapat menyelesaikan anomali ini?';
        progressGain = 1;
      } else {
        status = 'Approaching';
        feedback = 'Penjelasanmu sudah mengarah ke konsep yang tepat. Ingat bahwa 2NF secara spesifik mengatasi atribut yang hanya bergantung pada sebagian dari composite primary key.';
        followUpQuestion = 'Bisakah kamu memberikan satu contoh atribut yang mengalami partial dependency?';
        progressGain = 1;
      }

      return {
        status,
        feedback,
        followUpQuestion,
        progressGain
      };
    }
  },

  '3nf-transitive': {
    id: '3nf-transitive',
    title: 'Normalisasi Database 3NF',
    category: 'Basis Data',
    goal: 'Eliminate Transitive Dependencies',
    currentActivity: 'Identify non-key attributes depending on other non-key attributes',
    initialProgress: { current: 1, total: 3, label: 'concepts explored' },
    aiUsageCount: 2,

    initialChat: [
      {
        id: 'msg-3nf-1',
        sender: 'student',
        senderName: 'Alya Rahma',
        time: '11:05',
        text: 'Setelah tabel memenuhi 2NF, kenapa kita masih butuh 3NF?'
      },
      {
        id: 'msg-3nf-2',
        sender: 'ai',
        senderName: 'TemanBelajar AI',
        badge: 'Penjelasan terarah',
        time: '11:06',
        text: 'Meskipun sudah memenuhi 2NF, sebuah tabel masih dapat memiliki <strong>transitive dependency</strong>, yaitu atribut non-key yang bergantung pada atribut non-key lainnya, bukan langsung pada primary key.',
        exampleCard: {
          title: 'Contoh sederhana',
          text: 'Tabel Mahasiswa <code>(NIM, Nama, KodeJurusan, NamaJurusan)</code>. NIM menentukan KodeJurusan, lalu KodeJurusan menentukan NamaJurusan. Jadi, NIM secara tidak langsung menentukan NamaJurusan melalui KodeJurusan.'
        },
        guidingQuestionCard: {
          title: 'Pertanyaan pemantik',
          text: 'Apa yang terjadi jika nama jurusan berubah, sementara data mahasiswa masih menyimpan nama jurusan lama?'
        },
        suggestedActions: [
          { id: 'hint', label: 'Petunjuk', icon: '' },
          { id: 'example', label: 'Lihat Contoh', icon: '' },
          { id: 'check', label: 'Cek Pemahaman', icon: '' }
        ]
      }
    ],

    evaluateThinking(studentText) {
      return {
        status: 'Developing',
        feedback: 'Penjelasanmu sudah menunjukkan bahwa dependensi transitif membuat satu atribut non-key bergantung pada atribut non-key lainnya. Kondisi ini dapat menyebabkan masalah saat data diperbarui.',
        followUpQuestion: 'Bagaimana dekomposisi tabel yang ideal untuk memutus rantai dependensi tersebut?',
        progressGain: 1
      };
    }
  },

  'recursion-dp': {
    id: 'recursion-dp',
    title: 'Rekursi & Dynamic Programming',
    category: 'Struktur Data & Algoritma',
    goal: 'Master Memoization vs Tabulation',
    currentActivity: 'Compare top-down and bottom-up DP for Fibonacci',
    initialProgress: { current: 3, total: 5, label: 'concepts explored' },
    aiUsageCount: 5,

    initialChat: [
      {
        id: 'msg-dp-1',
        sender: 'student',
        senderName: 'Alya Rahma',
        time: '09:12',
        text: 'Kapan kita tahu sebuah masalah rekursif harus dioptimasi dengan Dynamic Programming?'
      },
      {
        id: 'msg-dp-2',
        sender: 'ai',
        senderName: 'TemanBelajar AI',
        badge: 'Penjelasan terarah',
        time: '09:13',
        text: 'Dynamic Programming cocok digunakan ketika masalah rekursif memiliki dua sifat utama: <strong>Optimal Substructure</strong> dan <strong>Overlapping Subproblems</strong>.',
        exampleCard: {
          title: 'Contoh sederhana',
          text: 'Pada Fibonacci rekursif biasa, misalnya <code>f(5) = f(4) + f(3)</code>, beberapa submasalah seperti <code>f(3)</code> dapat dihitung berulang kali. Dynamic Programming menyimpan hasil yang sudah dihitung agar tidak perlu mengulang proses yang sama.'
        },
        guidingQuestionCard: {
          title: 'Pertanyaan pemantik',
          text: 'Jika setiap submasalah hanya muncul satu kali, apakah Dynamic Programming masih memberikan keuntungan?'
        },
        suggestedActions: [
          { id: 'hint', label: 'Petunjuk', icon: '' },
          { id: 'example', label: 'Lihat Contoh', icon: '' },
          { id: 'check', label: 'Cek Pemahaman', icon: '' }
        ]
      }
    ],

    evaluateThinking(studentText) {
      return {
        status: 'Proficient',
        feedback: 'Analisis yang kamu berikan sudah tepat. Dynamic Programming membantu ketika terdapat submasalah yang berulang sehingga hasil yang sudah dihitung dapat digunakan kembali.',
        followUpQuestion: 'Kapan kamu memilih memoization atau pendekatan top-down dibandingkan tabulasi atau bottom-up?',
        progressGain: 1
      };
    }
  }
};

window.LearningTopics = LearningTopics;