import React from 'react';
import { ShieldCheck, Lock, Eye, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy({ onBack }) {
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Kebijakan Privasi</h1>
              <p className="text-xs text-slate-400 mt-1">Terakhir diperbarui: 21 Agustus 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-slate-300">
            <section>
              <h2 className="text-base font-bold text-white mb-2">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-slate-400 mb-2">
                Untuk menyediakan layanan pelacakan link afiliasi dan pembayaran komisi, kami mengumpulkan data pengguna berikut:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Informasi Pribadi: Nama, Alamat Email, Nomor WhatsApp, ID Telegram, dan Kota Domisili.</li>
                <li>Informasi Keuangan: Nama Bank, Nomor Rekening, dan Nama Pemilik Rekening (khusus keperluan pencairan komisi).</li>
                <li>Data Transaksi &amp; Log: Riwayat klik tautan afiliasi, transaksi terkonfirmasi, serta nominal penarikan dana.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">2. Penggunaan Informasi</h2>
              <p className="text-slate-400 mb-2">Data Anda digunakan secara ketat untuk:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Memverifikasi identitas dan kepemilikan akun.</li>
                <li>Menghubungkan Anda dengan mentor CS saat program pelatihan aktif.</li>
                <li>Memproses pembayaran komisi dan pencairan dana ke rekening bank.</li>
                <li>Mengirimkan notifikasi riwayat status transaksi (Pending, Valid, Approved).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">3. Keamanan &amp; Perlindungan Data</h2>
              <p className="text-slate-400">
                Kami menerapkan enkripsi standar industri dan perlindungan database aman melalui infrastruktur cloud Firebase / Google Cloud untuk memastikan data akun serta nomor rekening Anda tidak dapat diakses oleh pihak yang tidak berwenang.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">4. Pengungkapan kepada Pihak Ketiga</h2>
              <p className="text-slate-400">
                KinetiAffiliate tidak memperjualbelikan data pribadi pengguna kepada pihak ketiga. Informasi hanya dibagikan kepada penyedia gerbang pembayaran atau institusi perbankan untuk tujuan transfer dana penarikan komisi.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">5. Kontak Privasi</h2>
              <p className="text-slate-400">
                Jika ada pertanyaan mengenai penghapusan atau pembaruan data pribadi, silakan hubungi tim keamanan privasi kami melalui email: <strong className="text-emerald-400">privacy@kinetiaffiliate.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
