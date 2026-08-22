import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, onSnapshot, doc, updateDoc, 
  deleteDoc, setDoc, getDocs 
} from 'firebase/firestore';
import { 
  ShieldAlert, UserCog, Database, Activity, 
  LogOut, Plus, Edit2, Trash2, CheckCircle2, 
  TrendingUp, Package, X, Save 
} from 'lucide-react';

export default function SuperadminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'products'
  const [usersList, setUsersList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State (Tambah/Edit Produk)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    title: '',
    category: '',
    platform: 'Shopee',
    price: '',
    fee: '',
    commissionRate: '',
    desc: ''
  });

  // Sinkronisasi Real-time Users & Products dari Firestore
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'affiliates'), (snapshot) => {
      const users = [];
      snapshot.forEach((docSnap) => {
        users.push({ id: docSnap.id, ...docSnap.data() });
      });
      setUsersList(users);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = [];
      snapshot.forEach((docSnap) => {
        prods.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProductsList(prods);
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubProducts();
    };
  }, []);

  // Update Role Pengguna Langsung di Firestore
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'affiliates', userId), {
        role: newRole
      });
    } catch (err) {
      alert("Gagal mengubah role: " + err.message);
    }
  };

  // Buka Modal Tambah Produk
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdForm({
      title: '',
      category: '',
      platform: 'Shopee',
      price: '',
      fee: '',
      commissionRate: '',
      desc: ''
    });
    setModalOpen(true);
  };

  // Buka Modal Edit Produk
  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProdForm({
      title: p.title || '',
      category: p.category || '',
      platform: p.platform || 'Shopee',
      price: p.price || '',
      fee: p.fee || '',
      commissionRate: p.commissionRate || '',
      desc: p.desc || ''
    });
    setModalOpen(true);
  };

  // Simpan Produk (Tambah atau Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const docId = editingProduct ? editingProduct.id : `prod_${Date.now()}`;
      const payload = {
        title: prodForm.title.trim(),
        category: prodForm.category.trim(),
        platform: prodForm.platform,
        price: Number(prodForm.price),
        fee: Number(prodForm.fee),
        commissionRate: prodForm.commissionRate.trim() || `${Math.round((Number(prodForm.fee)/Number(prodForm.price))*100)}%`,
        desc: prodForm.desc.trim(),
        isActive: true,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'products', docId), payload, { merge: true });
      setModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan produk: " + err.message);
    }
  };

  // Hapus Produk dari Firestore
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini secara permanen dari database?")) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (err) {
        alert("Gagal menghapus produk: " + err.message);
      }
    }
  };

  const totalOmzet = usersList.reduce((acc, u) => acc + (u.totalEarned || 0), 0);
  const totalTrainingPaid = usersList.filter(u => u.trainingFeePaid).length * 100000;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-[#0c121e] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-rose-950 p-1.5 rounded-lg border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg">Kineti<span className="text-rose-400">Superadmin</span></span>
            <span className="ml-2 text-[10px] bg-rose-950 text-rose-300 font-semibold px-2 py-0.5 rounded border border-rose-800">DATABASE SYNC</span>
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
            <span className="text-xs text-slate-400 font-semibold">Total Pengguna Aktif</span>
            <h3 className="text-2xl font-extrabold text-white mt-1">{usersList.length} Akun</h3>
            <span className="text-[10px] text-emerald-400">Tersinkronisasi Firestore</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Total Produk Terdaftar</span>
            <h3 className="text-2xl font-extrabold text-white mt-1">{productsList.length} Item</h3>
            <span className="text-[10px] text-sky-400">Shopee &amp; TikTok Katalog</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Total Omzet Komisi</span>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">Rp {totalOmzet.toLocaleString('id-ID')}</h3>
            <span className="text-[10px] text-slate-500">Akumulasi Semua Afiliator</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Pendapatan Training Fee</span>
            <h3 className="text-2xl font-extrabold text-sky-400 mt-1">Rp {totalTrainingPaid.toLocaleString('id-ID')}</h3>
            <span className="text-[10px] text-slate-500">{usersList.filter(u => u.trainingFeePaid).length} Lisensi Premium Aktif</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'users' 
                ? 'bg-rose-500 text-slate-950 shadow-lg' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Manajemen Role Pengguna ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'products' 
                ? 'bg-rose-500 text-slate-950 shadow-lg' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Kelola Produk &amp; Fee Komisi ({productsList.length})
          </button>
        </div>

        {/* ================= TAB 1: USERS ROLE MANAGEMENT ================= */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCog className="w-4 h-4 text-rose-400" /> Kontrol Hak Akses Akun (Firestore Sync)
              </h3>
              <span className="text-xs text-slate-400">Pilih role untuk mengubah hak akses secara otomatis</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                  <tr>
                    <th className="p-3">WhatsApp / Doc ID</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">Saldo Komisi</th>
                    <th className="p-3">Status Training</th>
                    <th className="p-3">Role Saat Ini</th>
                    <th className="p-3 text-right">Ubah Role Langsung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/20">
                      <td className="p-3 font-mono">{u.id}</td>
                      <td className="p-3 font-semibold text-white">{u.fullName || u.name || '-'}</td>
                      <td className="p-3 font-bold text-emerald-400">Rp {(u.saldo || 0).toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.trainingFeePaid ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {u.trainingFeePaid ? 'Premium (Lunas)' : 'Free Member'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'superadmin' ? 'bg-rose-950 text-rose-400 border border-rose-500/20' :
                          u.role === 'admin' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                          u.role === 'mentor' ? 'bg-sky-950 text-sky-400 border border-sky-500/20' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select 
                          value={u.role || 'user'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-[#070b14] border border-slate-800 text-xs rounded-lg py-1 px-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
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
        )}

        {/* ================= TAB 2: PRODUCT CRUD ================= */}
        {activeTab === 'products' && (
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-rose-400" /> Manajemen Produk &amp; Besaran Fee
                </h3>
                <p className="text-xs text-slate-400">Tambah, ubah data fee komisi, atau hapus produk dari sistem</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Tambah Produk Baru
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                  <tr>
                    <th className="p-3">Nama Produk</th>
                    <th className="p-3">Platform</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Harga Normal</th>
                    <th className="p-3">Fee Komisi Afiliasi</th>
                    <th className="p-3 text-right">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/20">
                      <td className="p-3 font-semibold text-white">{p.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          {p.platform}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{p.category}</td>
                      <td className="p-3 font-semibold text-slate-200">Rp {(p.price || 0).toLocaleString('id-ID')}</td>
                      <td className="p-3 font-bold text-emerald-400">
                        Rp {(p.fee || 0).toLocaleString('id-ID')} ({p.commissionRate || '-'})
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg transition"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL TAMBAH / EDIT PRODUK ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Rincian Produk' : 'Tambah Produk Baru ke Database'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nama Produk</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Wireless Earbuds Pro Max"
                  value={prodForm.title}
                  onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Platform</label>
                  <select 
                    value={prodForm.platform}
                    onChange={(e) => setProdForm({ ...prodForm, platform: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Shopee">Shopee</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Kategori</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Elektronik / Digital Course"
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Harga Normal (Rp)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="250000"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Fee Komisi Afiliator (Rp)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="75000"
                    value={prodForm.fee}
                    onChange={(e) => setProdForm({ ...prodForm, fee: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Label Persentase Komisi</label>
                <input 
                  type="text" 
                  placeholder="30% / 15%"
                  value={prodForm.commissionRate}
                  onChange={(e) => setProdForm({ ...prodForm, commissionRate: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Deskripsi Singkat</label>
                <textarea 
                  rows="2"
                  placeholder="Deskripsi keunggulan produk untuk promosi..."
                  value={prodForm.desc}
                  onChange={(e) => setProdForm({ ...prodForm, desc: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Save className="w-4 h-4" /> Simpan ke Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
