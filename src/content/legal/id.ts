import type { LegalDocument } from '@/content/legal/types'

export const LEGAL_LAST_UPDATED_ID = '28 Oktober 2026'

export const termsDocumentId: LegalDocument = {
  lastUpdated: LEGAL_LAST_UPDATED_ID,
  title: 'Syarat Layanan',
  description:
    'Ketentuan penggunaan platform pembelajaran Skillopa untuk pelajar, instruktur, dan pengunjung terdaftar.',
  sections: [
    {
      id: 'pendahuluan',
      title: '1. Pendahuluan',
      paragraphs: [
        'Dokumen Syarat Layanan ("Syarat") mengatur penggunaan situs dan layanan Skillopa ("Layanan") yang tersedia melalui skillopa.showcaseproject.my.id dan domain terkait.',
        'Dengan mendaftar, masuk, mendaftar kursus, atau menggunakan Layanan, Anda menyatakan telah membaca, memahami, dan menyetujui Syarat ini serta Kebijakan Privasi Skillopa.',
      ],
    },
    {
      id: 'definisi',
      title: '2. Definisi',
      paragraphs: ['Dalam Syarat ini:'],
      bullets: [
        'Pelajar: pengguna yang mengikuti kursus, mengerjakan kuis, dan memperoleh sertifikat.',
        'Instruktur: pengguna yang membuat, mempublikasikan, dan mengelola konten kursus.',
        'Kursus: materi belajar (video, teks, kuis, tugas) yang disediakan melalui platform.',
        'Sertifikat: bukti penyelesaian yang diterbitkan Skillopa sesuai aturan kursus dan verifikasi platform.',
      ],
    },
    {
      id: 'akun',
      title: '3. Akun dan keamanan',
      paragraphs: [
        'Anda wajib memberikan informasi yang benar saat pendaftaran dan menjaga kerahasiaan kata sandi.',
        'Anda bertanggung jawab atas aktivitas melalui akun Anda. Segera hubungi kami jika mengetahui akses tanpa izin.',
        'Kami dapat menangguhkan atau menutup akun jika terdapat pelanggaran Syarat, penyalahgunaan, atau kewajiban hukum.',
        'Login melalui Google atau penyedia OAuth lain tunduk pada kebijakan penyedia tersebut selain Syarat ini.',
      ],
    },
    {
      id: 'layanan',
      title: '4. Ruang lingkup layanan',
      paragraphs: [
        'Skillopa menyediakan katalog kursus, pembelajaran daring, sertifikat, keranjang/checkout, wishlist, program afiliasi, dan fitur lain yang tercantum di aplikasi.',
        'Konten kursus dapat berubah, diperbarui, atau dihentikan seiring pengembangan. Instruktur dan platform berupaya menjaga akurasi materi, namun tidak menjamin bebas kesalahan.',
        'Layanan membutuhkan koneksi internet. Beberapa fitur (misalnya pemutaran video) bergantung pada perangkat dan browser Anda.',
      ],
    },
    {
      id: 'pembayaran',
      title: '5. Kursus berbayar dan pembayaran',
      paragraphs: [
        'Harga kursus, paket (bundle), dan langganan mengikuti informasi saat checkout. Pembayaran diproses melalui penyedia pihak ketiga (misalnya Mayar) yang aman.',
        'Akses ke materi berbayar diberikan setelah pembayaran tervalidasi sesuai kebijakan platform.',
        'Kebijakan refund atau pembatalan, jika ada, mengikuti ketentuan yang ditampilkan saat transaksi atau permintaan resmi melalui kontak dukungan.',
      ],
    },
    {
      id: 'konten',
      title: '6. Konten dan hak cipta',
      paragraphs: [
        'Materi kursus dilindungi hak cipta instruktur dan/atau Skillopa. Anda tidak boleh menyalin, mendistribusikan, atau menjual ulang konten tanpa izin.',
        'Instruktur menjamin memiliki hak untuk materi yang diunggah dan memberi lisensi operasional kepada Skillopa untuk menampilkan konten di platform.',
        'Ulasan, pertanyaan, dan kiriman pengguna dapat dimoderasi untuk menjaga kualitas dan kepatuhan hukum.',
      ],
    },
    {
      id: 'sertifikat',
      title: '7. Sertifikat',
      paragraphs: [
        'Sertifikat diterbitkan setelah persyaratan penyelesaian kursus terpenuhi (misalnya menonton materi wajib).',
        'Setiap sertifikat memiliki kode verifikasi publik. Palsu atau manipulasi sertifikat dilarang.',
        'Nama pada sertifikat mengikuti profil akun Anda; pastikan nama asli saat mendaftar jika sertifikat digunakan secara formal.',
      ],
    },
    {
      id: 'larangan',
      title: '8. Penggunaan yang dilarang',
      bullets: [
        'Menyalahgunakan akun, voucher, kupon, atau program afiliasi.',
        'Mengunggah malware, spam, atau konten yang melanggar hukum.',
        'Mencoba mengakses sistem, API, atau data pengguna lain tanpa izin.',
        'Menyamar sebagai instruktur, admin, atau pihak Skillopa.',
      ],
      paragraphs: ['Anda setuju untuk tidak:'],
    },
    {
      id: 'privasi',
      title: '9. Data pribadi',
      paragraphs: [
        'Pemrosesan data diatur dalam Kebijakan Privasi Skillopa, yang menjadi bagian integral dari perjanjian ini.',
      ],
    },
    {
      id: 'tanggung-jawab',
      title: '10. Batas tanggung jawab',
      paragraphs: [
        'Layanan disediakan "sebagaimana adanya" dalam batas hukum. Kami berupaya menjaga ketersediaan namun tidak menjamin bebas gangguan.',
        'Skillopa bukan pengganti sertifikasi profesional resmi kecuali dinyatakan secara eksplisit oleh institusi mitra.',
        'Tanggung jawab kami dibatasi sejauh diizinkan peraturan perundang-undangan Indonesia.',
      ],
    },
    {
      id: 'perubahan',
      title: '11. Perubahan Syarat',
      paragraphs: [
        'Kami dapat memperbarui Syarat. Tanggal "Terakhir diperbarui" akan diubah di halaman ini. Penggunaan berkelanjutan setelah perubahan dianggap sebagai penerimaan Syarat baru, kecuali diwajibkan hukum.',
      ],
    },
    {
      id: 'hukum',
      title: '12. Hukum yang berlaku',
      paragraphs: [
        'Syarat ini diatur oleh hukum Republik Indonesia. Sengketa diselesaikan musyawarah terlebih dahulu; jika gagal, melalui pengadilan yang berwenang di Indonesia.',
      ],
    },
  ],
}

export const privacyDocumentId: LegalDocument = {
  lastUpdated: LEGAL_LAST_UPDATED_ID,
  title: 'Kebijakan Privasi',
  description:
    'Cara Skillopa mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi pengguna platform pembelajaran.',
  sections: [
    {
      id: 'pendahuluan',
      title: '1. Pendahuluan',
      paragraphs: [
        'Kebijakan Privasi ini menjelaskan praktik data saat Anda menggunakan Skillopa.',
        'Kebijakan disusun selaras dengan prinsip perlindungan data pribadi di Indonesia, termasuk UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).',
      ],
    },
    {
      id: 'pengendali',
      title: '2. Pengendali data',
      paragraphs: [
        'Pengelola layanan Skillopa (operasional skillopa.showcaseproject.my.id) bertindak sebagai pengendali data untuk akun dan data yang diproses melalui platform.',
      ],
    },
    {
      id: 'data',
      title: '3. Data yang kami kumpulkan',
      paragraphs: ['Kategori data dapat meliputi:'],
      bullets: [
        'Akun: nama, email, kata sandi (hash), foto profil, peran (pelajar/instruktur/admin), preferensi bahasa.',
        'Pembelajaran: progres video, catatan, bookmark, hasil kuis, pengumpulan tugas, sertifikat yang diterbitkan.',
        'Transaksi: riwayat pesanan, status pembayaran, identifikator dari penyedia pembayaran (bukan nomor kartu penuh di server kami).',
        'Komunikasi: pertanyaan kursus, ulasan, notifikasi in-app atau push (jika diaktifkan).',
        'Teknis: alamat IP, log akses, cookie sesi, informasi browser/perangkat untuk keamanan.',
        'OAuth: identitas dari Google/GitHub jika Anda memilih login tersebut (sesuai izin yang Anda berikan).',
      ],
    },
    {
      id: 'tujuan',
      title: '4. Tujuan pemrosesan',
      paragraphs: ['Data diproses untuk:'],
      bullets: [
        'Menyediakan, mengamankan, dan meningkatkan layanan belajar.',
        'Memproses pendaftaran kursus, pembayaran, dan penerbitan sertifikat.',
        'Mengirim email transaksional (reset kata sandi, notifikasi penting).',
        'Mencegah penipuan dan penyalahgunaan.',
        'Memenuhi kewajiban hukum.',
      ],
    },
    {
      id: 'pihak-ketiga',
      title: '5. Berbagi dengan pihak ketiga',
      paragraphs: ['Kami tidak menjual data pribadi. Data dapat dibagikan terbatas kepada:'],
      bullets: [
        'Penyedia hosting, database, email transaksional (misalnya Resend), dan CDN.',
        'Penyedia pembayaran untuk checkout.',
        'Penyedia OAuth (Google/GitHub) jika Anda menggunakannya.',
        'Penyedia video/embedding (misalnya YouTube) saat Anda memutar materi, tunduk kebijakan mereka.',
        'Otoritas publik jika diwajibkan hukum.',
      ],
    },
    {
      id: 'retensi',
      title: '6. Retensi',
      paragraphs: [
        'Data disimpan selama akun aktif dan sesuai kebutuhan operasional, audit, atau hukum.',
        'Anda dapat meminta penghapusan akun atau data tertentu melalui kontak dukungan. Beberapa log dapat disimpan terbatas untuk keamanan.',
      ],
    },
    {
      id: 'hak',
      title: '7. Hak subjek data',
      paragraphs: [
        'Anda berhak mengajukan akses, perbaikan, penghapusan, dan pembatasan pemrosesan sesuai UU PDP.',
        'Permintaan dapat diajukan ke email kontak di halaman legal. Kami merespons dalam jangka waktu wajar.',
      ],
    },
    {
      id: 'keamanan',
      title: '8. Keamanan',
      paragraphs: [
        'Kami menerapkan HTTPS, hashing kata sandi, kontrol akses berbasis peran, dan praktik keamanan wajar.',
        'Segera laporkan jika Anda menemukan indikasi kebocoran atau akses tidak sah.',
      ],
    },
    {
      id: 'anak',
      title: '9. Anak di bawah umur',
      paragraphs: [
        'Layanan ditujukan untuk pengguna yang memenuhi syarat usia minimum yang berlaku. Jika Anda mewakili anak, pastikan persetujuan orang tua/wali sesuai hukum setempat.',
      ],
    },
    {
      id: 'perubahan',
      title: '10. Perubahan kebijakan',
      paragraphs: [
        'Kebijakan dapat diperbarui. Perubahan material ditunjukkan melalui tanggal pembaruan di halaman ini atau pemberitahuan di aplikasi jika diperlukan.',
      ],
    },
  ],
}
