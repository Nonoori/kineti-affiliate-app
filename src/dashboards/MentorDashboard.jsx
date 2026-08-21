import React, { useState } from 'react';
import { 
  Users, MessageSquare, BookOpen, Clock, 
  ExternalLink, LogOut, CheckCircle2, Search, Send 
} from 'lucide-react';

const mockMentees = [
  { id: 1, name: "Dewi Anggraini", wa: "081298765432", city: "Jakarta", progress: "Modul 4: TikTok Viral", status: "Aktif" },
  { id: 2, name: "Rizky Pratama", wa: "081344556677", city: "Bandung", progress: "Modul 2: Shopee Affiliate Setup", status: "Butuh Bantuan" },
  { id: 3, name: "Sari Maharani", wa: "081911223344", city: "Surabaya", progress: "Modul 5: Copywriting Konversi", status: "Aktif" }
];

export default function MentorDashboard({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentees = mockMentees.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.wa.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      <nav className="border-b border-slate-800 bg-[#0c121e] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-sky-950 p-1.5 rounded-lg border border-sky-500/20 text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg">Kineti<span className="text-sky-400">Mentor</span></span>
            <span className="ml-2 text-[10px] bg-sky-950 text-sky-300 font-semibold px-2 py-0.5 rounded border border-sky-800">MENTOR CS PORTAL</span>
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
        
        {/* Banner Operasional CS */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 to-[#0f172a] border border-sky-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Jam Layanan Bimbingan: 08:00 - 21:00 WIB[span_11](start_span)[span_11](end_span)</h3>
            <p className="text-xs text-slate-400 mt-1">Bimbing afiliator baru dalam memilih produk dan optimasi tautan affiliate TikTok/Shopee[span_12](start_span)[span_12](end_span).</p>
          </div>
          <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
            ● Mentor Online
          </span>
        </div>

        {/* Tabel Afiliator Bimbingan */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-base font-bold text-white">Daftar Afiliator Bimbingan Anda</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Cari nama atau WA..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/50">
                <tr>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">Kota</th>
                  <th className="p-3">Progres Belajar</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi Bimbingan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredMentees.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-semibold text-white">{m.name}</td>
                    <td className="p-3 text-slate-400">{m.city}</td>
                    <td className="p-3 text-sky-400">{m.progress}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.status === 'Aktif' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950 text-amber-400 border border-amber-500/20'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <a 
                        href={`https://wa.me/${m.wa.replace(/^0/, '62')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold"
                      >
                        <Send className="w-3 h-3" /> Hubungi via WA[span_13](start_span)[span_13](end_span)
                      </a>
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
