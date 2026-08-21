import React, { useState } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  TrendingUp, ArrowLeft, Lock, Smartphone, Mail, 
  Send, User, MapPin, Building, CreditCard, AlertCircle, 
  CheckCircle2, Shield, UserCheck 
} from 'lucide-react';

// Fungsi generate ID Unik Afiliasi (6 karakter alfanumerik acak)
const generateAffiliateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'KNT-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


export default function AuthPages({ initialView = 'login', onNavigate, onLoginSuccess })



 {
  const [view, setView] = useState(initialView); // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // State Register (Default role: user, saldo: 0, link unik)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    telegram: '',
    city: '',
    province: '',
    bankName: '',
    accountNumber: '',
    password: '',
    confirmPassword: ''
  });

  // State Login (dengan pilihan role)
  const [loginForm, setLoginForm] = useState({
    whatsapp: '',
    password: '',
    role: 'user' // default role user
  });

  // State Forgot Password
  const [forgotInput, setForgotInput] = useState('');

  const handleRegChange = (e) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  // 1. PROSES REGISTER
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regForm.password !== regForm.confirmPassword) {
      setErrorMsg('Konfirmasi password tidak sesuai.');
      return;
    }

    if (regForm.password.length < 6) {
      setErrorMsg('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const waIndex = regForm.whatsapp.trim().replace(/[^0-9]/g, '');
      const userRef = doc(db, 'affiliates', waIndex);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setErrorMsg('Nomor WhatsApp ini sudah terdaftar. Silakan login.');
        setLoading(false);
        return;
      }

      // Generate ID unik untuk link referral/afiliasi
      const uniqueAffiliateId = generateAffiliateId();
      const timestampNow = new Date().toISOString();

      await setDoc(userRef, {
        // Data Registrasi Dasar
        fullName: regForm.name.trim(),
        email: regForm.email.toLowerCase().trim(),
        whatsapp: waIndex,
        telegram: regForm.telegram.trim(),
        city: regForm.city.trim(),
        province: regForm.province.trim(),
        bankOrEwallet: regForm.bankName.trim(),
        accountNumber: regForm.accountNumber.trim(),
        password: regForm.password,

        // Data Sistem Default
        role: 'user',                                       // Default role: user
        saldo: 0,                                          // Saldo awal 0
        affiliateId: uniqueAffiliateId,                    // ID Unik untuk link afiliasi
        affiliateLink: `https://kineti-affiliate.vercel.app/?ref=${uniqueAffiliateId}`,
        createdAt: timestampNow,                           // Waktu pendaftaran (Time now)
        trainingFeePaid: false,                            // Status pembayaran training 100k
        totalEarned: 0,
        totalWithdrawn: 0
      });

      setSuccessMsg(`Pendaftaran berhasil! ID Afiliasi Anda: ${uniqueAffiliateId}`);
      setTimeout(() => {
        setView('login');
        setSuccessMsg('');
      }, 2000);
    } catch (err) {
      setErrorMsg('Gagal mendaftar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. PROSES LOGIN DENGAN VALIDASI ROLE
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const waIndex = loginForm.whatsapp.trim().replace(/[^0-9]/g, '');
      const userRef = doc(db, 'affiliates', waIndex);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setErrorMsg('Nomor WhatsApp tidak terdaftar.');
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      // Cek Password
      if (userData.password !== loginForm.password) {
        setErrorMsg('Password salah.');
        setLoading(false);
        return;
      }

          // Validasi Kesesuaian Role
      const userRole = userData.role || 'user';
      if (userRole !== loginForm.role) {
        setErrorMsg(`Akun ini tidak memiliki hak akses sebagai [${loginForm.role.toUpperCase()}]. Role akun Anda: [${userRole.toUpperCase()}].`);
        setLoading(false);
        return;
      }

      const sessionData = {
        whatsapp: userData.whatsapp,
        name: userData.fullName,
        role: userRole,
        affiliateId: userData.affiliateId,
        saldo: userData.saldo || 0,
        trainingFeePaid: userData.trainingFeePaid || false
      };


       // Simpan session ke localStorage
      localStorage.setItem('currentUser', JSON.stringify(sessionData));

      setSuccessMsg(`Login berhasil sebagai ${loginForm.role.toUpperCase()}! Mengalihkan...`);
      
      // Arahkan LANGSUNG ke dashboard role yang sesuai
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(sessionData);
        } else {
          onNavigate(userRole);
        }
      }, 1000);

    } catch (err) {
      setErrorMsg('Gagal masuk: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. PROSES LUPA PASSWORD
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotInput) {
      setErrorMsg('Harap isi Email, Nomor WhatsApp, atau Telegram Anda.');
      return;
    }

    const adminEmail = 'help@kinetiaffiliate.com';
    const subject = encodeURIComponent('Permintaan Reset Password Akun KinetiAffiliate');
    const body = encodeURIComponent(
      `Halo Admin KinetiAffiliate,\n\nSaya ingin mengajukan permohonan reset sandi akun:\n\nIdentitas Akun / Kontak: ${forgotInput}\n\nMohon bantuannya untuk memproses pengaturan ulang password saya.\n\nTerima kasih.`
    );

    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    setSuccessMsg('Form permohonan telah diarahkan ke aplikasi email Anda.');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Header Bar */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pb-4">
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-[#0f1d2e] p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Kineti<span className="text-emerald-400">Affiliate</span>
          </span>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Beranda
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto my-auto bg-[#0f172a]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        
        {/* Notifikasi Pesan */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= FORM LOGIN (DENGAN ROLE) ================= */}
        {view === 'login' && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold text-white">Masuk Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Pilih hak akses dan masukkan kredensial Anda</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Pilihan Role Login */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Masuk Sebagai (Role)</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                  <select
                    value={loginForm.role}
                    onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition appearance-none cursor-pointer"
                  >
                    <option value="user">User (Afiliator)</option>
                    <option value="mentor">Mentor CS</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
              </div>

              {/* Input WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nomor WhatsApp</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={loginForm.whatsapp}
                    onChange={(e) => setLoginForm({ ...loginForm, whatsapp: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('forgot'); }}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition disabled:opacity-50"
              >
                {loading ? 'Memverifikasi...' : `Masuk sebagai ${loginForm.role.toUpperCase()}`}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              Belum punya akun?{' '}
              <button
                onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('register'); }}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Daftar Afiliasi Sekarang
              </button>
            </div>
          </div>
        )}

        {/* ================= FORM REGISTER (DEFAULT ROLE USER & SALDO 0) ================= */}
        {view === 'register' && (
          <div>
            <div className="text-center mb-5">
              <h1 className="text-2xl font-extrabold text-white">Daftar Akun Baru</h1>
              <p className="text-xs text-slate-400 mt-1">Dapatkan link tracking unik &amp; mulai raih komisi</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Nama Lengkap KTP"
                    value={regForm.name}
                    onChange={handleRegChange}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="nama@email.com"
                    value={regForm.email}
                    onChange={handleRegChange}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">WhatsApp (Index ID)</label>
                  <div className="relative">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="whatsapp"
                      required
                      placeholder="08123..."
                      value={regForm.whatsapp}
                      onChange={handleRegChange}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Telegram</label>
                  <div className="relative">
                    <Send className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="telegram"
                      required
                      placeholder="@username"
                      value={regForm.telegram}
                      onChange={handleRegChange}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Kota / Kabupaten</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Jakarta Selatan"
                      value={regForm.city}
                      onChange={handleRegChange}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Provinsi</label>
                  <input
                    type="text"
                    name="province"
                    required
                    placeholder="DKI Jakarta"
                    value={regForm.province}
                    onChange={handleRegChange}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Bank / E-Wallet</label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="bankName"
                      required
                      placeholder="BCA / Dana / Mandiri"
                      value={regForm.bankName}
                      onChange={handleRegChange}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">No. Rekening / No. HP</label>
                  <div className="relative">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="accountNumber"
                      required
                      placeholder="Nomor rekening"
                      value={regForm.accountNumber}
                      onChange={handleRegChange}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="Min 6 digit"
                      value={regForm.password}
                      onChange={handleRegChange}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ulang Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="Ulangi"
                      value={regForm.confirmPassword}
                      onChange={handleRegChange}
                      className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Akun akan didaftarkan sebagai <strong>User</strong> dengan <strong>Saldo Rp 0</strong> &amp; link unik otomatis.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition disabled:opacity-50"
              >
                {loading ? 'Menyimpan Akun...' : 'Daftar Sekarang'}
              </button>
            </form>

            <div className="mt-4 pt-3.5 border-t border-slate-800 text-center text-xs text-slate-400">
              Sudah punya akun?{' '}
              <button
                onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('login'); }}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Masuk di sini
              </button>
            </div>
          </div>
        )}

        {/* ================= FORM LUPA PASSWORD ================= */}
        {view === 'forgot' && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl font-extrabold text-white">Reset Password</h1>
              <p className="text-xs text-slate-400 mt-1">
                Kirimkan kontak akun terdaftar Anda untuk verifikasi reset sandi oleh admin.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email / WhatsApp / Telegram
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="08123456789 atau user@mail.com"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
              >
                Kirim Permohonan ke Email Admin
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              Kembali ke login?{' '}
              <button
                onClick={() => { setErrorMsg(''); setSuccessMsg(''); setView('login'); }}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Masuk
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="text-center text-[11px] text-slate-600 pt-4">
        © 2026 KinetiAffiliate. All rights reserved.
      </footer>
    </div>
  );
}
