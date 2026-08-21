import React, { useState } from 'react';
import { 
  ShieldAlert, UserCog, Database, Activity, 
  LogOut, CheckCircle2, TrendingUp 
} from 'lucide-react';

const initialUsers = [
  { id: "081200000001", name: "Super User Admin", role: "superadmin", saldo: 25000000 },
  { id: "081298765432", name: "Dewi Anggraini", role: "user", saldo: 4200000 },
  { id: "081344556677", name: "Mentor Master CS", role: "mentor", saldo: 1500000 },
  { id: "081255554444", name: "Finance Admin 1", role: "admin", saldo: 0 }
];

export default function SuperadminDashboard({ user, onLogout }) {
  const [usersList, setUsersList] = useState(initialUsers);

  const changeRole = (id, newRole) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      <nav className="border-b border-slate-800 bg-[#0c121e] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-rose-950 p-1.5 rounded-lg border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg">Kineti<span className="text-rose-400">Superadmin</span></span>
            <span className="ml-2 text-[10px] bg-rose-950 text-rose-300 font-semibold px-2 py-0.5 rounded border border-rose-800">ROOT ACCESS</span>
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
        
        {/* Sistem Overview Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Total Pengguna</span>
            <h3 className="text-2xl font-extrabold text-white mt-1">1,248</h3>
            <span className="text-[10px] text-emerald-400">+12 akun hari ini</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Total Omzet Komisi</span>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">Rp 142.800.000</h3>
            <span className="text-[10px] text-slate-500">TikTok &amp; Shopee[span_21](start_span)[span_21](end_span)</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Pendapatan Training (100k)</span>
            <h3 className="text-2xl font-extrabold text-sky-400 mt-1">Rp 48.300.000</h3>
            <span className="text-[10px] text-slate-500">483 Member Aktif[span_22](start_span)[span_22](end_span)</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Status Firebase Firestore</span>
            <h3 className="text-lg font-extrabold text-emerald-400 mt-1 flex items-center gap-1">
              <Activity className="w-4 h-4" /> Normal / Connected
            </h3>
            <span className="text-[10px] text-slate-500">0 latency errors</span>
          </div>
        </div>

        {/* Manajemen Role Pengguna */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCog className="w-4 h-4 text-rose-400" /> Manajemen Hak Akses Pengguna (Role Control)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <tr>
                  <th className="p-3">WhatsApp / User ID</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Saldo Akun</th>
                  <th className="p-3">Role Saat Ini</th>
                  <th className="p-3 text-right">Ubah Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3 font-mono">{u.id}</td>
                    <td className="p-3 font-semibold text-white">{u.name}</td>
                    <td className="p-3 font-bold text-emerald-400">Rp {u.saldo.toLocaleString('id-ID')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'superadmin' ? 'bg-rose-950 text-rose-400 border border-rose-500/20' :
                        u.role === 'admin' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                        u.role === 'mentor' ? 'bg-sky-950 text-sky-400 border border-sky-500/20' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select 
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="bg-[#070b14] border border-slate-800 text-xs rounded-lg py-1 px-2 text-slate-200 focus:outline-none focus:border-rose-500"
                      >
                        <option value="user">User (Afiliator)</option>
                        <option value="mentor">Mentor CS</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
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
