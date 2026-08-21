import React, { useState } from 'react';
import { 
  ShieldCheck, Check, X, DollarSign, PackageCheck, 
  LogOut, CheckCircle2, AlertTriangle 
} from 'lucide-react';

const initialWithdrawals = [
  { id: "WD-101", user: "Dewi Anggraini", bank: "BCA - 1234567890", amount: 500000, status: "Pending" },
  { id: "WD-102", user: "Rizky Pratama", bank: "Mandiri - 9876543210", amount: 1200000, status: "Pending" }
];

const initialTrainingVerifications = [
  { id: "TR-501", user: "Budi Santoso", wa: "081233445566", fee: 100000, date: "2026-08-21", status: "Menunggu Cek" }
];

export default function AdminDashboard({ user, onLogout }) {
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [trainings, setTrainings] = useState(initialTrainingVerifications);

  const approveWithdrawal = (id) => {
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: "Approved[span_15](start_span)[span_15](end_span)" } : w));
  };

  const approveTraining = (id) => {
    setTrainings(trainings.map(t => t.id === id ? { ...t, status: "Lunas (Aktif)[span_16](start_span)[span_16](end_span)" } : t));
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      <nav className="border-b border-slate-800 bg-[#0c121e] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-950 p-1.5 rounded-lg border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg">Kineti<span className="text-amber-400">Admin</span></span>
            <span className="ml-2 text-[10px] bg-amber-950 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-800">OPERATIONAL PANEL</span>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 font-semibold text-xs transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Verifikasi Training Fee 100k */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-emerald-400" /> Verifikasi Biaya Pelatihan (100k IDR)[span_17](start_span)[span_17](end_span)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <tr>
                  <th className="p-3">ID Bayar</th>
                  <th className="p-3">Nama Afiliator</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Nominal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {trainings.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3 font-mono">{t.id}</td>
                    <td className="p-3 font-semibold text-white">{t.user}</td>
                    <td className="p-3">{t.wa}</td>
                    <td className="p-3 font-bold text-emerald-400">Rp {t.fee.toLocaleString('id-ID')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status.includes('Lunas') ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {t.status.includes('Lunas') ? (
                        <span className="text-emerald-400 font-semibold text-[11px]">Terverifikasi</span>
                      ) : (
                        <button 
                          onClick={() => approveTraining(t.id)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          Aktifkan Akun[span_18](start_span)[span_18](end_span)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Persetujuan Penarikan Dana (Withdrawal) */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" /> Permohonan Penarikan Komisi Afiliator[span_19](start_span)[span_19](end_span)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <tr>
                  <th className="p-3">ID Penarikan</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Rekening Bank Tujuan</th>
                  <th className="p-3">Nominal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Proses Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td className="p-3 font-mono">{w.id}</td>
                    <td className="p-3 font-semibold text-white">{w.user}</td>
                    <td className="p-3 text-slate-400">{w.bank}</td>
                    <td className="p-3 font-bold text-emerald-400">Rp {w.amount.toLocaleString('id-ID')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${w.status.includes('Approved') ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {w.status.includes('Approved') ? (
                        <span className="text-emerald-400 font-semibold text-[11px]">Selesai Ditransfer</span>
                      ) : (
                        <button 
                          onClick={() => approveWithdrawal(w.id)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          Setujui &amp; Bayar[span_20](start_span)[span_20](end_span)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
