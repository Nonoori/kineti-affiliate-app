import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  LayoutDashboard, ShoppingBag, ShoppingCart, History, 
  Wallet, User, LogOut, Menu, X, Copy, Check, 
  ExternalLink, CheckCircle2, Clock, AlertCircle, HelpCircle, 
  MessageCircle, Mail, Sparkles, ArrowDownRight, ArrowUpRight, 
  ChevronRight, Lock, Building, Smartphone, Send, Shield
} from 'lucide-react';

// Data Mock Produk
const mockProducts = [
  { id: 1, title: "Course Video AI Mastery", category: "Digital Course", price: 250000, fee: 75000, platform: "TikTok" },
  { id: 2, title: "Wireless Earbuds Pro Max", category: "Elektronik", price: 299000, fee: 35880, platform: "Shopee" },
  { id: 3, title: "Smart Fitness Watch X9", category: "Wearables", price: 459000, fee: 68850, platform: "Shopee" },
  { id: 4, title: "Viral LED Ring Light 18 Inch", category: "Creator Tools", price: 189000, fee: 37800, platform: "TikTok" },
  { id: 5, title: "Serum Wajah Retinol Glow Bundle", category: "Beauty", price: 249000, fee: 54780, platform: "TikTok" },
  { id: 6, title: "Portable USB-C Smoothie Blender", category: "Home & Living", price: 175000, fee: 24500, platform: "Shopee" }
];

// Data Mock Mutasi & Transaksi
const initialMutations = [
  { id: "TRX-8801", type: "jualan", title: "Course Video AI Mastery", buyer: "0812****9921", date: "2026-08-21 14:10", fee: 75000, status: "berhasil", saldoAfter: 168000 },
  { id: "WD-3301", type: "wd", title: "Tarik Saldo Rekening (BCA)", bank: "BCA - 1234567890", date: "2026-08-20 09:30", fee: -286200, status: "berhasil", saldoAfter: 93000 },
  { id: "TRX-8802", type: "beli_sendiri", title: "Course Video AI (Beli Sendiri)", date: "2026-08-19 16:45", fee: 0, status: "berhasil", saldoAfter: 379200 },
  { id: "TRX-8803", type: "jualan", title: "Course Video AI Mastery", buyer: "0878****3310", date: "2026-08-18 11:20", fee: 75000, status: "berhasil", saldoAfter: 379200 },
  { id: "TRX-8804", type: "jualan", title: "Smart Fitness Watch X9", buyer: "0856****7712", date: "2026-08-17 19:00", fee: 68850, status: "pending", saldoAfter: 304200 },
  { id: "WD-3302", type: "wd", title: "Pengajuan Penarikan Saldo", bank: "BCA - 1234567890", date: "2026-08-21 15:00", fee: -100000, status: "pending", saldoAfter: 68000 }
];

export default function UserDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('beranda'); // 'beranda' | 'jual' | 'beli' | 'mutasi' | 'wd' | 'profil'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  
  // Data Profil Live dari Firestore
  const [profileData, setProfileData] = useState(user || {});
  const [mutations] = useState(initialMutations);
  
  // State Mutasi Filter
  const [mutasiFilter, setMutasiFilter] = useState('semua'); // 'semua' | 'jualan' | 'beli_sendiri' | 'wd'

  // State Form Tarik Dana (WD)
  const [nominalWd, setNominalWd] = useState('');
  const [wdAlert, setWdAlert] = useState('');

  // State Update Password
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [passLoading, setPassLoading] = useState(false);

  // Ambil Data Profil Terbaru dari Firestore
  useEffect(() => {
    async function fetchUserData() {
      if (user?.whatsapp) {
        try {
          const docRef = doc(db, 'affiliates', user.whatsapp);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setProfileData(snap.data());
          }
        } catch (e) {
          console.error("Gagal load data:", e);
        }
      }
    }
    fetchUserData();
  }, [user?.whatsapp]);

  const copyText = (txt, type) => {
    navigator.clipboard.writeText(txt);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);

  // Kalkulasi Ringkasan Mutasi
  const totalBerhasil = mutations.filter(m => m.status === 'berhasil' && m.fee > 0).reduce((acc, curr) => acc + curr.fee, 0);
  const totalPending = mutations.filter(m => m.status === 'pending' && m.fee > 0).reduce((acc, curr) => acc + curr.fee, 0);
  const saldoBelumDiajukan = profileData.saldo || 168000;

  // Filter Mutasi
  const filteredMutasi = mutations.filter(m => {
    if (mutasiFilter === 'semua') return true;
    return m.type === mutasiFilter;
  });

  // Handler Update Password
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
      setProfileData(prev => ({ ...prev, password: newPass }));
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

  // Handler Kirim Email Instruksi Pembayaran Premium
  const handleRequestPremiumPayment = () => {
    const emailAdmin = "help@kinetiaffiliate.com";
    const subject = encodeURIComponent("Permintaan Instruksi Pembayaran Lisensi Afiliasi Premium Rp100.000");
    const body = encodeURIComponent(
      `Halo Admin,\n\nSaya ingin mengaktifkan Akun Afiliasi Premium (Training Fee Rp100.000).\n\nNama: ${profileData.fullName || profileData.name}\nWhatsApp: ${profileData.whatsapp}\nID Afiliasi: ${profileData.affiliateId}\n\nMohon kirimkan nomor rekening tujuan transfer dan petunjuk konfirmasi aktivasi.\n\nTerima kasih.`
    );
    window.location.href = `mailto:${emailAdmin}?subject=${subject}&body=${body}`;
  };

  // Handler Pengajuan WD
  const handleSubmitWD = (e) => {
    e.preventDefault();
    const amount = Number(nominalWd);
    if (amount > (profileData.saldo || 168000)) {
      setWdAlert("Nominal melebihi saldo bersih Anda.");
      return;
    }
    if (amount < 50000) {
      setWdAlert("Minimal penarikan adalah Rp50.000.");
      return;
    }
    setWdAlert("Permohonan penarikan Rp" + amount.toLocaleString('id-ID') + " berhasil diajukan ke admin.");
    setNominalWd('');
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
      
      {/* ================= SIDEBAR (DESKTOP & MOBILE) ================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0c121e] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-950 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-base leading-tight">Mitra Berkah</h2>
                <span className="text-[10px] text-slate-400">KinetiAffiliate Platform</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
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

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/30 hover:border hover:border-rose-500/30 transition"
          >
            <LogOut className="w-4 h-4" /> Keluar Akun
          </button>
        </div>
      </aside>

      {/* Backdrop Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>

          {/* Saldo Badge Bersih */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0f172a] border border-emerald-500/30 px-3 sm:px-4 py-1.5 rounded-2xl flex items-center gap-2.5 shadow-lg">
              <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Saldo Bersih</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-400">{formatRupiah(profileData.saldo || 168000)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Body */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl w-full mx-auto">
          
          {/* ================= 1. TAB BERANDA / SUMMARY ================= */}
          {activeTab === 'beranda' && (
            <div className="space-y-6">
              
              {/* Banner Status Akun Premium / Free */}
              <div className={`p-5 sm:p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                profileData.trainingFeePaid 
                  ? 'bg-gradient-to-r from-emerald-950/40 to-[#0f172a] border-emerald-500/30' 
                  : 'bg-gradient-to-r from-amber-950/40 to-[#0f172a] border-amber-500/30'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded-2xl ${profileData.trainingFeePaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">Status Lisensi Akun:</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        profileData.trainingFeePaid ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {profileData.trainingFeePaid ? 'PREMIUM (AKTIF)' : 'FREE MEMBER'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {profileData.trainingFeePaid 
                        ? 'Semua materi pelatihan dan akses mentoring CS aktif.' 
                        : 'Buka materi pelatihan video & konsultasi intensif dengan mengaktifkan training fee.'}
                    </p>
                  </div>
                </div>

                {!profileData.trainingFeePaid && (
                  <button 
                    onClick={handleRequestPremiumPayment}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Mail className="w-4 h-4" /> Dapatkan Petunjuk Bayar ke Email
                  </button>
                )}
              </div>

              {/* Tautan Afiliasi Cepat */}
              <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">Tautan Afiliasi Personal Anda</h3>
                    <p className="text-xs text-slate-400">Gunakan link ini untuk menyebarkan promosi ke media sosial</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-700 text-emerald-400 rounded-lg">
                    ID: {profileData.affiliateId || 'KNT-MTR77'}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#070b14] p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 overflow-x-auto">
                  <span className="font-mono flex-1 truncate">
                    https://mitra-berkah-affiliate.vercel.app/?ref={profileData.affiliateId || 'KNT-MTR77'}
                  </span>
                  <button 
                    onClick={() => copyText(`https://mitra-berkah-affiliate.vercel.app/?ref=${profileData.affiliateId || 'KNT-MTR77'}`, 'link')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center gap-1.5 hover:bg-emerald-400 flex-shrink-0 transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'Tersalin' : 'Salin Link'}
                  </button>
                </div>
              </div>

              {/* Matrix Card Saldo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Total Saldo Bersih</span>
                    <Wallet className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-emerald-400">{formatRupiah(profileData.saldo || 168000)}</h3>
                  <span className="text-[10px] text-slate-500">Tersedia untuk ditarik (WD)</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Komisi Berhasil</span>
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{formatRupiah(totalBerhasil)}</h3>
                  <span className="text-[10px] text-slate-500">Dari penjualan produk valid</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Komisi Tertunda (Pending)</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-amber-400">{formatRupiah(totalPending)}</h3>
                  <span className="text-[10px] text-slate-500">Menunggu verifikasi marketplace</span>
                </div>
              </div>

              {/* Petunjuk Afiliasi & Bantuan CS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Petunjuk */}
                <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" /> Petunjuk Menjalankan Afiliasi
                  </h3>
                  <ul className="text-xs text-slate-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">1.</span>
                      <span>Pilih produk di menu <strong>List Produk Dijual</strong> lalu salin tautan produk atau tautan utama profil Anda.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">2.</span>
                      <span>Buat video promosi atau postingan di TikTok, Reels, atau WhatsApp Story menyertakan tautan tersebut.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">3.</span>
                      <span>Setiap pembelian yang tervalidasi akan otomatis menambahkan komisi ke saldo bersih Anda.</span>
                    </li>
                  </ul>
                </div>

                {/* Bantuan WA CS */}
                <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" /> Bantuan &amp; Konsultasi Mentor CS
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Memiliki kendala transaksi, pertanyaan materi promosi, atau kendala teknis? Hubungi tim support WhatsApp kami.
                    </p>
                  </div>
                  <a 
                    href="https://wa.me/6281234567890?text=Halo%20Admin%20Mitra%20Berkah,%20saya%20butuh%20bantuan%20mengenai%20akun%20afiliasi"
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" /> Hubungi WhatsApp Admin (08:00 - 21:00 WIB)
                  </a>
                </div>

              </div>

            </div>
          )}

          {/* ================= 2. TAB LIST PRODUK DIJUAL ================= */}
          {activeTab === 'jual' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2">
                <div>
                  <h3 className="text-base font-bold text-white">Katalog Produk Dijual</h3>
                  <p className="text-xs text-slate-400">Bagikan tautan produk untuk mendapatkan fee komisi setiap penjualan</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProducts.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{p.category}</span>
                        <span className="text-xs font-bold text-emerald-400">{p.platform} Affiliate</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Harga Normal</span>
                          <span className="font-semibold text-slate-300">{formatRupiah(p.price)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 font-bold block">Fee Jualan Anda</span>
                          <span className="font-extrabold text-emerald-400 text-sm">+{formatRupiah(p.fee)}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => copyText(`https://mitra-berkah-affiliate.vercel.app/p/${p.id}?ref=${profileData.affiliateId || 'KNT-MTR77'}`, 'link')}
                      className="mt-4 w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" /> Salin Link Promosi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 3. TAB BELI SENDIRI (FEE RP 0) ================= */}
          {activeTab === 'beli' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>
                  <strong>Ketentuan Beli Sendiri:</strong> Pembelian yang dilakukan oleh akun afiliator untuk pemakaian sendiri mendapatkan harga normal dan <strong>tidak menghasilkan fee komisi (Rp 0)</strong>.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProducts.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{p.category}</span>
                        <span className="text-[10px] font-bold text-slate-500">Normal Order</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Harga Produk</span>
                          <span className="font-semibold text-slate-200">{formatRupiah(p.price)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-semibold block">Fee Komisi</span>
                          <span className="font-bold text-slate-400">Rp 0 (Non-Fee)</span>
                        </div>
                      </div>
                    </div>

                    <a 
                      href={`https://tokopedia.com`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-700"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Beli Sekarang (Normal)
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. TAB MUTASI LENGKAP ================= */}
          {activeTab === 'mutasi' && (
            <div className="space-y-6">
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'semua', label: 'Semua Transaksi' },
                  { id: 'jual', label: 'Fee Jualan', val: 'jualan' },
                  { id: 'beli', label: 'Beli Sendiri', val: 'beli_sendiri' },
                  { id: 'wd', label: 'Penarikan (WD)', val: 'wd' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setMutasiFilter(f.val || f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                      mutasiFilter === (f.val || f.id)
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                        : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* List Detail Mutasi */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">Rincian Buku Kas / Mutasi</h3>
                  <span className="text-xs text-slate-500">Terupdate akurat</span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {filteredMutasi.map((m) => (
                    <div key={m.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/20 transition">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-2xl flex-shrink-0 ${
                          m.type === 'jualan' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          m.type === 'wd' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {m.type === 'jualan' ? <ArrowDownRight className="w-5 h-5" /> : 
                           m.type === 'wd' ? <ArrowUpRight className="w-5 h-5" /> : 
                           <ShoppingCart className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white">{m.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              m.status === 'berhasil' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                              'bg-amber-950 text-amber-400 border border-amber-500/30'
                            }`}>
                              {m.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-0.5 block">{m.date} • Ref: {m.id}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-xs sm:text-sm font-extrabold ${
                          m.fee > 0 ? 'text-emerald-400' : m.fee < 0 ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {m.fee > 0 ? `+${formatRupiah(m.fee)}` : m.fee < 0 ? formatRupiah(m.fee) : 'Rp 0'}
                        </div>
                        <span className="text-[10px] text-slate-500 block">Saldo: {formatRupiah(m.saldoAfter)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= 5. TAB PENARIKAN SALDO (WD) ================= */}
          {activeTab === 'wd' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4">
                <div className="text-center pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400">Saldo Bersih Siap Ditarik</span>
                  <h2 className="text-3xl font-extrabold text-emerald-400 mt-1">{formatRupiah(profileData.saldo || 168000)}</h2>
                </div>

                {wdAlert && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{wdAlert}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitWD} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Rekening Tujuan Penarikan</label>
                    <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800 text-xs space-y-1">
                      <div className="text-slate-400 font-medium">Bank / E-Wallet: <strong className="text-white">{profileData.bankOrEwallet || 'BCA'}</strong></div>
                      <div className="text-slate-400 font-medium">No. Rekening: <strong className="text-white font-mono">{profileData.accountNumber || '1234567890'}</strong></div>
                      <div className="text-slate-400 font-medium">Nama Pemilik: <strong className="text-white">{profileData.fullName || profileData.name}</strong></div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Nominal Penarikan (Rp)</label>
                    <input 
                      type="number"
                      required
                      min="50000"
                      placeholder="Contoh: 100000"
                      value={nominalWd}
                      onChange={(e) => setNominalWd(e.target.value)}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Minimal penarikan Rp 50.000. Bebas biaya admin transfer.</span>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg"
                  >
                    Kirim Permohonan Penarikan
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= 6. TAB PROFIL & UPDATE PASSWORD ================= */}
          {activeTab === 'profil' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Rincian Profil Lengkap */}
              <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" /> Informasi Data Akun
                  </h3>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded border border-slate-700">
                    ID: {profileData.affiliateId || 'KNT-MTR77'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Nama Lengkap</span>
                    <span className="font-semibold text-white">{profileData.fullName || profileData.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Alamat Email</span>
                    <span className="font-semibold text-white">{profileData.email || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nomor WhatsApp (Index ID)</span>
                    <span className="font-semibold text-white font-mono">{profileData.whatsapp || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Username Telegram</span>
                    <span className="font-semibold text-white">{profileData.telegram || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Kota &amp; Provinsi</span>
                    <span className="font-semibold text-white">{profileData.city || '-'}, {profileData.province || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Bank &amp; No. Rekening</span>
                    <span className="font-semibold text-white">{profileData.bankOrEwallet || '-'} ({profileData.accountNumber || '-'})</span>
                  </div>
                </div>
              </div>

              {/* Form Update Password */}
              <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" /> Perbarui Password
                </h3>

                {passMsg.text && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passMsg.type === 'success' 
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300' 
                      : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                  }`}>
                    {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{passMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password Lama</label>
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password Baru</label>
                      <input 
                        type="password"
                        required
                        placeholder="Min. 6 digit"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ulangi Password Baru</label>
                      <input 
                        type="password"
                        required
                        placeholder="Ulangi password baru"
                        value={confirmNewPass}
                        onChange={(e) => setConfirmNewPass(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={passLoading}
                    className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-50"
                  >
                    {passLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
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
