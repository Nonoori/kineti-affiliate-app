import React from 'react';
import { TrendingUp, FileText, ArrowLeft } from 'lucide-react';

export default function TermsConditions({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 flex flex-col justify-between" style={{ backgroundColor: '#070b14', color: '#e2e8f0' }}>
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800" style={{ backgroundColor: '#070b14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-[#0f1d2e] p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white" style={{ color: '#ffffff' }}>
              Kineti<span className="text-emerald-400" style={{ color: '#34d399' }}>Affiliate</span>
            </span>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition"
            style={{ color: '#cbd5e1' }}
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-grow">
        <div className="mb-10 pb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#34d399' }}>
            <FileText className="w-3.5 h-3.5" /> Dokumen Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ color: '#ffffff' }}>Syarat &amp; Ketentuan</h1>
          <p className="text-sm text-slate-400 mt-2" style={{ color: '#94a3b8' }}>Terakhir diperbarui: 21 Agustus 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300" style={{ color: '#cbd5e1' }}>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white" style={{ color: '#ffffff' }}>1. Ketentuan Akun &amp; Pendaftaran</h2>
            <p style={{ color: '#94a3b8' }}>
              Pengguna wajib memberikan data yang sah dan akurat, mencakup Nama Lengkap, Nomor WhatsApp, Alamat Email, Akun Telegram, serta Data Rekening Bank untuk pencairan komisi. Verifikasi akun dilakukan melalui sistem OTP yang dikirimkan ke email terdaftar.
            </p>
            <p style={{ color: '#94a3b8' }}>
              Satu identitas pengguna hanya diizinkan mengelola satu akun KinetiAffiliate. Segala bentuk duplikasi akun berpotensi mengakibatkan penangguhan permanen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white" style={{ color: '#ffffff' }}>2. Biaya Pelatihan (Training Fee)</h2>
            <p style={{ color: '#94a3b8' }}>
              Pembayaran biaya pelatihan sebesar <strong style={{ color: '#ffffff' }}>Rp100.000 (IDR)</strong> merupakan pembayaran satu kali (<em>one-time fee</em>) yang membuka akses ke materi kurasi, panduan setup platform TikTok Shop &amp; Shopee Affiliate, materi promosi, dan sesi mentoring CS.
            </p>
            <p style={{ color: '#94a3b8' }}>
              Biaya pelatihan tidak dapat dikembalikan (<em>non-refundable</em>) setelah hak akses akun dan modul pelatihan berhasil diaktifkan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white" style={{ color: '#ffffff' }}>3. Tautan Afiliasi &amp; Praktik Promosi</h2>
            <p style={{ color: '#94a3b8' }}>
              Mitra afiliasi berhak menyebarkan tautan produk unik yang dihasilkan melalui dashboard platform. Promosi wajib mematuhi standar etika periklanan digital tanpa mengandung unsur manipulasi, pemalsuan identitas, maupun spamming otomatis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white" style={{ color: '#ffffff' }}>4. Validasi Komisi &amp; Pembayaran (Payouts)</h2>
            <p style={{ color: '#94a3b8' }}>
              Komisi dicatat secara bertahap melalui status <em>Pending</em>, <em>Valid</em>, dan <em>Approved</em>. Komisi hanya akan disetujui untuk penarikan dana setelah transaksi produk dinyatakan selesai tanpa retur atau pembatalan di platform marketplace terkait.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white" style={{ color: '#ffffff' }}>5. Pembatasan Tanggung Jawab</h2>
            <p style={{ color: '#94a3b8' }}>
              KinetiAffiliate berhak membatalkan saldo komisi atau menonaktifkan akun mitra secara sepihak jika ditemukan pelanggaran terhadap ketentuan ini atau indikasi tindakan penipuan transaksi.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#05080f] py-8 px-4 text-xs text-slate-500 text-center" style={{ backgroundColor: '#05080f', color: '#64748b' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© 2026 KinetiAffiliate. All rights reserved.</div>
          <div className="flex gap-6 text-slate-400">
            <button onClick={() => { window.scrollTo(0,0); onNavigate('privacy'); }} className="hover:text-white" style={{ color: '#94a3b8' }}>Privacy Policy</button>
            <button onClick={() => { window.scrollTo(0,0); onNavigate('home'); }} className="hover:text-white" style={{ color: '#94a3b8' }}>Beranda</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
