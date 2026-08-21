import React, { useState } from 'react';
import { 
  TrendingUp, Copy, Check, DollarSign, ExternalLink, 
  BookOpen, Clock, AlertCircle, CheckCircle2, ArrowUpRight, LogOut 
} from 'lucide-react';

export default function UserDashboard({ user, onLogout }) {
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (Number(withdrawAmount) > (user.saldo || 0)) {
      alert("Saldo tidak mencukupi!");
      return;
    }
    setWithdrawSuccess(true);
    setWithdrawAmount('');
    setTimeout(() => setWithdrawSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-[#0c121e] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#0f1d2e] p-1.5 rounded-lg border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg">Kineti<span className="text-emerald-400">Affiliate</span></span>
            <span className="ml-2 text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded border border-slate-700">USER DASHBOARD</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">Halo, <strong className="text-white">{user?.name || 'Afiliator'}</strong></span>
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Status Training Fee Notification */}
        {!user?.trainingFeePaid && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-200">Aktivasi Akun Premium Diperlukan</h4>
                <p className="text-xs text-amber-300/80">Bayar biaya training Rp100.000 (one-time fee) untuk membuka link produk premium dan sesi mentor CS[span_1](start_span)[span_1](end_span).</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition">
              Bayar Rp100.000
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Total Saldo Tersedia</span>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">Rp {(user?.saldo || 0).toLocaleString('id-ID')}</h3>
            <span className="text-[10px] text-slate-500">Dapat ditarik ke rekening bank[span_2](start_span)[span_2](end_span)</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">ID Afiliasi Anda</span>
            <div className="flex items-center justify-between mt-1">
              <h3 className="text-xl font-bold text-white">{user?.affiliateId || 'KNT-DEMO'}</h3>
              <button 
                onClick={() => copyToClipboard(user?.affiliateId || 'KNT-DEMO')}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-500">Kode unik link pelacakan</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Status Transaksi</span>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-semibold">Pending: 2[span_3](start_span)[span_3](end_span)</span>
              <span className="text-emerald-400 font-semibold">Approved: 5[span_4](start_span)[span_4](end_span)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Diperbarui secara real-time[span_5](start_span)[span_5](end_span)</span>
          </div>
        </div>

        {/* Link Generator & Withdraw */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Link Afiliasi Utama */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-400" /> Tautan Promosi Personal Anda
            </h3>
            <p className="text-xs text-slate-400">Bagikan link ini ke audience Anda. Setiap transaksi yang masuk melalui link ini akan langsung menghasilkan komisi ke akun Anda[span_6](start_span)[span_6](end_span).</p>
            
            <div className="flex items-center gap-2 bg-[#070b14] p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 overflow-x-auto">
              <span className="font-mono flex-1 truncate">https://kineti-affiliate.vercel.app/?ref={user?.affiliateId || 'KNT-DEMO'}</span>
              <button 
                onClick={() => copyToClipboard(`https://kineti-affiliate.vercel.app/?ref=${user?.affiliateId || 'KNT-DEMO'}`)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center gap-1 hover:bg-emerald-400 flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </div>

          {/* Form Tarik Saldo */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Tarik Saldo Komisi[span_7](start_span)[span_7](end_span)
            </h3>
            {withdrawSuccess && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Permohonan penarikan diajukan ke admin[span_8](start_span)[span_8](end_span).
              </div>
            )}
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold block mb-1">Nominal (Min. Rp50.000)</label>
                <input 
                  type="number"
                  required
                  min="50000"
                  placeholder="50000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Ajukan Penarikan[span_9](start_span)[span_9](end_span)
              </button>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
}
