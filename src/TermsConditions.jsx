import React from 'react';
import { ShieldAlert, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function TermsConditions({ onBack }) {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>

        <div className="bg-[#0f172a]/80 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/20 rounded-xl text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Syarat &amp; Ketentuan</h1>
              <p className="text-xs text-slate-400 mt-1">Terakhir diperbarui: 21 Agustus 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-300">
            <section>
              <h2 className="text-base font-bold text-white mb-2">1. Ketentuan Akun &amp; Pendaftaran</h2>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li>Pengguna wajib mengisi data valid (Nama Lengkap, Nomor WhatsApp, Email, Akun Telegram, dan Informasi Rekening Bank).</li>
                <li>Verifikasi akun dilakukan melalui kode OTP yang dikirimkan ke alamat email terdaftar.</li>
                <li>Setiap pengguna hanya diperkenankan memiliki satu akun aktif. Akun ganda dapat dinonaktifkan secara permanen.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">2. Biaya Pelatihan (Training Fee)</h2>
              <p className="text-slate-400 mb-2">
                Biaya pelatihan sebesar <strong>Rp100.000 (IDR)</strong> merupakan pembayaran satu kali (one-time fee) untuk membuka akses penuh ke arsip materi, template promosi, dan pendampingan Customer Support / Mentor.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Biaya pelatihan bersifat <em>non-refundable</em> (tidak dapat dikembalikan) setelah akses materi dan modul berhasil diaktifkan.</li>
                <li>Pembayaran biaya pelatihan memberi lisensi akses seumur hidup (lifetime access) selama platform beroperasi.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">3. Distribusi Tautan Afiliasi &amp; Konten Promosi</h2>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li>Afiliator diperbolehkan membagikan link afiliasi Shopee &amp; TikTok yang disediakan melalui media sosial pribadi (Instagram, TikTok, WhatsApp Story, Telegram, dll.).</li>
                <li>Dilarang keras menyebarkan link dengan metode spam, penipuan (clickbait palsu), bot otomatis ilegal, atau pelanggaran hak cipta pihak ketiga.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">4. Validasi Komisi &amp; Pembayaran (Payouts)</h2>
              <p className="text-slate-400 mb-2">
                Setiap komisi penjualan tercatat dengan tahapan status: <strong>Pending</strong>, <strong>Valid</strong>, <strong>Approved</strong>, atau <strong>Canceled</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li>Komisi hanya disetujui (*Approved*) jika pesanan berhasil diselesaikan oleh pembeli tanpa adanya retur/pembatalan di platform e-commerce terkait.</li>
                <li>Penarikan dana diproses ke rekening bank lokal yang telah didaftarkan dan diverifikasi oleh tim verifikasi admin.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">5. Penghentian Layanan</h2>
              <p className="text-slate-400">
                KinetiAffiliate berhak menangguhkan atau menghapus akses akun secara sepihak jika ditemukan indikasi manipulasi transaksi, transaksi palsu, atau pelanggaran hukum yang berlaku di Indonesia.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
