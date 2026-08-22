import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  doc, onSnapshot, collection, query, 
  where, updateDoc, setDoc 
} from 'firebase/firestore';
import {
  LayoutDashboard, ShoppingBag, ShoppingCart, History, 
  Wallet, User, LogOut, Menu, X, Copy, Check, 
  CheckCircle2, Clock, AlertCircle, HelpCircle, 
  MessageCircle, Mail, Sparkles, ArrowDownRight, ArrowUpRight, 
  Lock, Shield
} from 'lucide-react';

export default function UserDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('beranda');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const [profileData, setProfileData] = useState(user || {});
  const [productsList, setProductsList] = useState([]);
  const [mutations, setMutations] = useState([]);
  
  const [mutasiFilter, setMutasiFilter] = useState('semua');
  const [nominalWd, setNominalWd] = useState('');
  const [wdAlert, setWdAlert] = useState('');

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [passLoading, setPassLoading] = useState(false);

  // 1. Sinkronisasi Profil User Real-time
  useEffect(() => {
    if (!user?.whatsapp) return;
    const unsubUser = onSnapshot(doc(db, 'affiliates', user.whatsapp), (docSnap) => {
      if (docSnap.exists()) {
        setProfileData({ id: docSnap.id, ...docSnap.data() });
      }
    });
    return () => unsubUser();
  }, [user?.whatsapp]);

  // 2. Sinkronisasi Katalog Produk Real-time dari Firestore
  useEffect(() => {
    const unsubProds = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = [];
      snapshot.forEach((docSnap) => {
        prods.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProductsList(prods);
    });
    return () => unsubProds();
  }, []);

  // 3. Sinkronisasi Transaksi & Mutasi Afiliator Ini dari Firestore
  useEffect(() => {
    if (!user?.whatsapp) return;
    const q = query(collection(db, 'transactions'), where('affiliateWa', '==', user.whatsapp));
    const unsubTrx = onSnapshot(q, (snapshot) => {
      const trxList = [];
      snapshot.forEach((docSnap) => {
        trxList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMutations(trxList);
    });
    return () => unsubTrx();
  }, [user?.whatsapp]);

  const copyText = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);

  const totalBerhasil = mutations.filter(m => m.status === 'berhasil' && m.feeEarned > 0).reduce((acc, curr) => acc + curr.feeEarned, 0);
  const totalPending = mutations.filter(m => m.status === 'pending' && m.feeEarned > 0).reduce((acc, curr) => acc + curr.feeEarned, 0);

  const filteredMutasi = mutations.filter(m => {
    if (mutasiFilter === 'semua') return true;
    return m.type === mutasiFilter;
  });

  // Handler Update Password ke Firestore
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (profileData.password && oldPass !== profileData.password) {
      setPassMsg({ type: 'error', text: 'Password lama salah.' });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'Password baru minimal 6 karakter.' });
      return;
    }
    if (newPass !== confirmNewPass) {
      setPassMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setPassLoading(true);
    try {
      const userRef = doc(db, 'affiliates', profileData.whatsapp);
      await updateDoc(userRef, { password: newPass });
      setPassMsg({ type: 'success', text: 'Password berhasil diperbarui!' });
      setOldPass('');
      setNewPass('');
      setConfirmNewPass('');
    } catch (err) {
      setPassMsg({ type: 'error', text: 'Gagal update password: ' + err.message });
    } finally {
      setPassLoading(false);
    }
  };

  // Handler Pengajuan Penarikan Saldo (WD) ke Firestore
  const handleSubmitWD = async (e) => {
    e.preventDefault();
    const amount = Number(nominalWd);
    if (amount > (profileData.saldo || 0)) {
      setWdAlert("Nominal melebihi saldo bersih Anda.");
      return;
    }
    if (amount < 50000) {
      setWdAlert("Minimal penarikan adalah Rp50.000.");
      return;
    }

    try {
      const wdDocId = `WD_${Date.now()}`;
      await setDoc(doc(db, 'withdrawals', wdDocId), {
        withdrawalId: wdDocId,
        affiliateWa: profileData.whatsapp,
        userName: profileData.fullName || profileData.name || '',
        bank: profileData.bankOrEwallet || 'BCA',
        accountNumber: profileData.accountNumber || '',
        amount: amount,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });

      setWdAlert("Permohonan penarikan Rp " + amount.toLocaleString('id-ID') + " berhasil diajukan ke admin.");
      setNominalWd('');
    } catch (err) {
      setWdAlert("Gagal mengajukan WD: " + err.message);
    }
  };

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: LayoutDashboard },
    { id: 'jual', label: 'List Produk Dijual', icon: ShoppingBag },
    { id: 'beli', label: 'Beli Sendiri (Normal)', icon: ShoppingCart },
    { id: 'mutasi', label: 'Riwayat & Mutasi', icon: History },
    { id: 'wd', label: 'Tarik Saldo (WD)', icon: Wallet },
    { id: 'profil', label: 'Profil Akun', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0c121e] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-950 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-base leading-tight">Kineti-Affiliate</h2>
                <span className="text-[10px] text-slate-400">Affiliate Portal</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition ${
                    active 
                      ? 'bg-slate-800/90 text-emerald-400 border border-slate-700 shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/30 hover:border hover:border-rose-500/30 transition"
          >
            <LogOut className="w-4 h-4" /> Keluar Akun
          </button>
        </div>
      </aside>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/70 z-40 lg:hidden" />}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="bg-[#0f172a] border border-emerald-500/30 px-3 sm:px-4 py-1.5 rounded-2xl flex items-center gap-2.5 shadow-lg">
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Saldo Bersih</span>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-400">{formatRupiah(profileData.saldo || 0)}</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-6 max-w-6xl w-full mx-auto">
          {/* TAB BERANDA */}
          {activeTab === 'beranda' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">Tautan Afiliasi Personal Anda</h3>
                    <p className="text-xs text-slate-400">Gunakan link ini untuk promosi dan komisi otomatis</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-700 text-emerald-400 rounded-lg">
                    ID: {profileData.affiliateId || 'KNT-MTR77'}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#070b14] p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 overflow-x-auto">
                  <span className="font-mono flex-1 truncate">
                    https://kineti-affiliate-app-nu.vercel.app/?ref={profileData.affiliateId || 'KNT-MTR77'}
                  </span>
                  <button 
                    onClick={() => copyText(`https://kineti-affiliate-app-nu.vercel.app/?ref=${profileData.affiliateId || 'KNT-MTR77'}`)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center gap-1.5 hover:bg-emerald-400 flex-shrink-0 transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'Tersalin' : 'Salin Link'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">Total Saldo Bersih</span>
                  <h3 className="text-xl font-extrabold text-emerald-400">{formatRupiah(profileData.saldo || 0)}</h3>
                </div>
                <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">Komisi Valid</span>
                  <h3 className="text-xl font-extrabold text-white">{formatRupiah(totalBerhasil)}</h3>
                </div>
                <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">Komisi Pending</span>
                  <h3 className="text-xl font-extrabold text-amber-400">{formatRupiah(totalPending)}</h3>
                </div>
              </div>
            </div>
          )}

          {/* TAB LIST PRODUK DIJUAL (Realtime Firestore) */}
          {activeTab === 'jual' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Katalog Produk Dijual (Update Real-time)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productsList.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{p.category}</span>
                        <span className="text-xs font-bold text-emerald-400">{p.platform} Affiliate</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Harga</span>
                          <span className="font-semibold text-slate-300">{formatRupiah(p.price)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 font-bold block">Fee Komisi Anda</span>
                          <span className="font-extrabold text-emerald-400 text-sm">+{formatRupiah(p.fee)}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => copyText(`https://kineti-affiliate-app-nu.vercel.app/p/${p.id}?ref=${profileData.affiliateId || 'KNT-MTR77'}`)}
                      className="mt-4 w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" /> Salin Link Promosi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB BELI SENDIRI */}
          {activeTab === 'beli' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Pembelian untuk konsumsi pribadi mendapatkan harga normal tanpa komisi afiliasi (Fee Rp 0).</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productsList.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{p.category}</span>
                      <h4 className="text-sm font-bold text-white mt-2">{p.title}</h4>
                      <div className="mt-3 text-xs flex justify-between border-t border-slate-800 pt-2">
                        <span className="text-slate-400">Harga: {formatRupiah(p.price)}</span>
                        <span className="text-slate-500 font-semibold">Fee: Rp 0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB MUTASI & TARIK SALDO */}
          {activeTab === 'wd' && (
            <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4">
              <div className="text-center pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400">Saldo Tersedia</span>
                <h2 className="text-3xl font-extrabold text-emerald-400 mt-1">{formatRupiah(profileData.saldo || 0)}</h2>
              </div>
              {wdAlert && <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">{wdAlert}</div>}
              <form onSubmit={handleSubmitWD} className="space-y-3">
                <input 
                  type="number"
                  required
                  min="50000"
                  placeholder="Nominal Penarikan (Min. Rp50.000)"
                  value={nominalWd}
                  onChange={(e) => setNominalWd(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition">
                  Ajukan Penarikan Dana
                </button>
              </form>
            </div>
          )}

          {/* TAB PROFIL */}
          {activeTab === 'profil' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-4">Informasi Akun</h3>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                  <div>Nama: <strong className="text-white">{profileData.fullName || profileData.name || '-'}</strong></div>
                  <div>WhatsApp: <strong className="text-white">{profileData.whatsapp || '-'}</strong></div>
                  <div>Bank: <strong className="text-white">{profileData.bankOrEwallet || '-'} ({profileData.accountNumber || '-'})</strong></div>
                  <div>Role: <strong className="text-emerald-400 uppercase">{profileData.role || 'user'}</strong></div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-4">Ubah Password</h3>
                {passMsg.text && <div className="p-2.5 mb-3 text-xs rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">{passMsg.text}</div>}
                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <input 
                    type="password"
                    placeholder="Password Baru (Min 6 Karakter)"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  />
                  <input 
                    type="password"
                    placeholder="Konfirmasi Password Baru"
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  />
                  <button type="submit" className="w-full py-2.5 bg-emerald-500 font-bold text-slate-950 rounded-xl text-xs">
                    Simpan Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
