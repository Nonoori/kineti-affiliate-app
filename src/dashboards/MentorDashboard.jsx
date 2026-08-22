import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Users, LogOut, Search, Send, MessageSquare } from 'lucide-react';

export default function MentorDashboard({ user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mentees, setMentees] = useState([]);

  // Ambil daftar afiliator role 'user' dari Firestore
  useEffect(() => {
    const q = query(collection(db, 'affiliates'), where('role', '==', 'user'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMentees(list);
    });

    return () => unsubscribe();
  }, []);

  const filteredMentees = mentees.filter(m => 
    (m.fullName || m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.whatsapp || '').includes(searchTerm)
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
        <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 to-[#0f172a] border border-sky-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Layanan Konsultasi &amp; Mentoring Afiliator[span_0](start_span)[span_0](end_span)</h3>
            <p className="text-xs text-slate-400 mt-1">Bimbing member dalam memilih produk Shopee/TikTok dan optimasi materi konten promosi.[span_1](start_span)[span_1](end_span)</p>
          </div>
          <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
            ● Mentor Online ({mentees.length} Member Terhubung)
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-base font-bold text-white">Daftar Afiliator di Database</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Cari nama atau WhatsApp..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <tr>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">Kota / Domisili</th>
                  <th className="p-3">Lisensi Pelatihan</th>
                  <th className="p-3">Status Belajar</th>
                  <th className="p-3 text-right">Aksi Bimbingan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredMentees.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/20">
                    <td className="p-3 font-semibold text-white">{m.fullName || m.name || '-'}</td>
                    <td className="p-3 text-slate-400">{m.city || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.trainingFeePaid ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.trainingFeePaid ? 'Premium Member' : 'Free Member'}
                      </span>
                    </td>
                    <td className="p-3 text-sky-400">{m.learningProgress || 'Modul 1: Pengenalan'}</td>
                    <td className="p-3 text-right">
                      <a 
                        href={`https://wa.me/${(m.whatsapp || '').replace(/^0/, '62')}?text=Halo%20${encodeURIComponent(m.fullName || '')},%20saya%20mentor%20KinetiAffiliate%20siap%20membantu%20sesi%20bimbingan%20Anda`}
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold"
                      >
                        <Send className="w-3 h-3" /> Hubungi via WhatsApp
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
