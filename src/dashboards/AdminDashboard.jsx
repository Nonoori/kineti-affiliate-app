import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, onSnapshot, doc, updateDoc, 
  increment 
} from 'firebase/firestore';
import { 
  ShieldCheck, DollarSign, PackageCheck, LogOut, CheckCircle2 
} from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  const [withdrawals, setWithdrawals] = useState([]);
  const [trainings, setTrainings] = useState([]);

  // Sinkronisasi data Penarikan & Verifikasi Training dari Firestore
  useEffect(() => {
    const unsubWd = onSnapshot(collection(db, 'withdrawals'), (snapshot) => {
      const wds = [];
      snapshot.forEach((docSnap) => {
        wds.push({ id: docSnap.id, ...docSnap.data() });
      });
      setWithdrawals(wds);
    });

    const unsubTraining = onSnapshot(collection(db, 'trainingVerifications'), (snapshot) => {
      const trs = [];
      snapshot.forEach((docSnap) => {
        trs.push({ id: docSnap.id, ...docSnap.data() });
      });
      setTrainings(trs);
    });

    return () => {
      unsubWd();
      unsubTraining();
    };
  }, []);

  // Admin Approve Penarikan Saldo Afiliator
  const approveWithdrawal = async (wd) => {
    if (window.confirm(`Konfirmasi pembayaran penarikan Rp ${wd.amount.toLocaleString('id-ID')} ke rekening ${wd.bank} milik ${wd.userName}?`)) {
      try {
        await updateDoc(doc(db, 'withdrawals', wd.id), {
          status: 'Approved',
          processedBy: user.whatsapp || 'admin',
          completedAt: new Date().toISOString()
        });

        // Kurangi saldo pengguna di Firestore & tambahkan totalWithdrawn
        if (wd.affiliateWa) {
          const userRef = doc(db, 'affiliates', wd.affiliateWa);
          await updateDoc(userRef, {
            saldo: increment(-wd.amount),
            totalWithdrawn: increment(wd.amount)
          });
        }
      } catch (err) {
        alert("Gagal memproses penarikan: " + err.message);
      }
    }
  };

  // Admin Approve Biaya Pelatihan (Aktivasi Akun Premium)
  const approveTraining = async (tr) => {
    try {
      await updateDoc(doc(db, 'trainingVerifications', tr.id), {
        status: 'Lunas (Aktif)',
        verifiedBy: user.whatsapp || 'admin'
      });

      // Update status training pengguna menjadi true
      if (tr.affiliateWa) {
        const userRef = doc(db, 'affiliates', tr.affiliateWa);
        await updateDoc(userRef, {
          trainingFeePaid: true
        });
      }
    } catch (err) {
      alert("Gagal verifikasi pembayaran: " + err.message);
    }
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
            <span className="ml-2 text-[10px] bg-amber-950 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-800">OPERATIONAL FIRESTORE</span>
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
            <PackageCheck className="w-4 h-4 text-emerald-400" /> Verifikasi Biaya Pelatihan (100k IDR)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <tr>
                  <th className="p-3">ID Pembayaran</th>
                  <th className="p-3">Nama Afiliator</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Nominal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {trainings.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3 font-mono">{t.id}</td>
                    <td className="p-3 font-semibold text-white">{t.userName || t.user || '-'}</td>
                    <td className="p-3">{t.affiliateWa || t.wa || '-'}</td>
                    <td className="p-3 font-bold text-emerald-400">Rp {(t.amount || t.fee || 100000).toLocaleString('id-ID')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status?.includes('Lunas') ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {t.status?.includes('Lunas') ? (
                        <span className="text-emerald-400 font-semibold text-[11px]">Terverifikasi</span>
                      ) : (
                        <button 
                          onClick={() => approveTraining(t)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          Aktifkan Akun
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
            <DollarSign className="w-4 h-4 text-amber-400" /> Permohonan Penarikan Komisi Afiliator
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
                    <td className="p-3 font-semibold text-white">{w.userName || w.user || '-'}</td>
                    <td className="p-3 text-slate-400">{w.bank} - {w.accountNumber}</td>
                    <td className="p-3 font-bold text-emerald-400">Rp {(w.amount || 0).toLocaleString('id-ID')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        w.status === 'Approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {w.status === 'Approved' ? (
                        <span className="text-emerald-400 font-semibold text-[11px]">Selesai Ditransfer</span>
                      ) : (
                        <button 
                          onClick={() => approveWithdrawal(w)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          Setujui &amp; Bayar
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
