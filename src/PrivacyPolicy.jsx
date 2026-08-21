import React from 'react';
import { TrendingUp, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-[#0f1d2e] p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Kineti<span className="text-emerald-400">Affiliate</span>
            </span>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-grow">
        <div className="mb-10 pb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Privasi &amp; Data
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Kebijakan Privasi</h1>
          <p className="text-sm text-slate-400 mt-2">Terakhir diperbarui: 21 Agustus 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Data yang Dikumpulkan</h2>
            <p className="text-slate-400">
              Kami mengumpulkan informasi identitas dasar yang Anda berikan saat pendaftaran, meliputi: Nama Lengkap, Nomor WhatsApp aktif, Alamat Email, Username Telegram, Lokasi Domisili, serta Informasi Rekening Bank (Nama Bank, Nomor Rekening, Nama Pemilik Rekening).
            </p>
            <p className="text-slate-400">
              Kami juga mencatat data analitik transaksi link afiliasi, log penarikan dana komisi, serta aktivitas navigasi pada sistem dashboard.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Tujuan Penggunaan Informasi</h2>
            <p className="text-slate-400">Data yang terkumpul digunakan untuk keperluan:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li>Otentikasi dan verifikasi kepemilikan akun.</li>
              <li>Penyaluran komisi dan verifikasi transfer penarikan dana ke rekening bank Anda.</li>
              <li>Distribusi materi pelatihan dan koordinasi dengan mentor Customer Support.</li>
              <li>Pencegahan penipuan transaksi dan audit keamanan data.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Keamanan Data Pengguna</h2>
            <p className="text-slate-400">
              Seluruh data kredensial dan informasi sensitif dilindungi menggunakan standar enkripsi modern serta disimpan secara terisolasi pada infrastruktur Firebase Database dengan aturan keamanan (*Security Rules*) berbasis otentikasi ketat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Pembagian Data ke Pihak Ketiga</h2>
            <p className="text-slate-400">
              KinetiAffiliate tidak memperjualbelikan data pribadi Anda. Pertukaran data hanya dilakukan dengan mitra perbankan atau penyedia gerbang pembayaran resmi untuk memproses transaksi pencairan komisi ke rekening Anda.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Hak Akses &amp; Penghapusan Data</h2>
            <p className="text-slate-400">
              Anda berhak memperbarui informasi profil atau mengajukan permintaan penutupan akun dan penghapusan data dengan menghubungi tim dukungan kami di <span className="text-emerald-400 font-semibold">privacy@kinetiaffiliate.com</span>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#05080f] py-8 px-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© 2026 KinetiAffiliate. All rights reserved.</div>
          <div className="flex gap-6 text-slate-400">
            <button onClick={() => { window.scrollTo(0,0); onNavigate('terms'); }} className="hover:text-white">Terms &amp; Conditions</button>
            <button onClick={() => { window.scrollTo(0,0); onNavigate('home'); }} className="hover:text-white">Beranda</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
