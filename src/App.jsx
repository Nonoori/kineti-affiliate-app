
import React, { useState, useEffect } from 'react';
import TermsConditions from './TermsConditions';
import PrivacyPolicy from './PrivacyPolicy';
import AuthPages from './AuthPages';

// Import Dashboard Komponen
import UserDashboard from './dashboards/UserDashboard';
import MentorDashboard from './dashboards/MentorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import SuperadminDashboard from './dashboards/SuperadminDashboard';

import { 
  TrendingUp, Menu, X, ChevronRight, CheckCircle2, 
  ArrowRight, MessageCircle, Send, Mail, Star 
} from 'lucide-react';

const productsData = [
  {
    id: 1,
    title: "Wireless Earbuds Pro Max",
    desc: "Premium noise-cancelling wireless earbuds with 36-hour battery life.",
    platform: "Shopee",
    category: "ELECTRONICS",
    rate: "12%",
    price: 299000,
    earn: 35880,
  },
  {
    id: 2,
    title: "Smart Fitness Watch X9",
    desc: "Health tracking smartwatch with heart rate, SpO2, and sleep monitoring.",
    platform: "Shopee",
    category: "WEARABLES",
    rate: "15%",
    price: 459000,
    earn: 68850,
  },
  {
    id: 3,
    title: "Viral LED Ring Light",
    desc: "Professional 18-inch LED ring light with phone holder and tripod.",
    platform: "Tiktok",
    category: "CREATOR TOOLS",
    rate: "20%",
    price: 189000,
    earn: 37800,
  },
  {
    id: 4,
    title: "Minimalist Leather Wallet",
    desc: "Handcrafted genuine leather minimalist wallet with RFID protection.",
    platform: "Shopee",
    category: "FASHION",
    rate: "18%",
    price: 129000,
    earn: 23220,
  },
  {
    id: 5,
    title: "Complete Skincare Serum Set",
    desc: "Complete skincare serum set: vitamin C, hyaluronic acid, and retinol.",
    platform: "Tiktok",
    category: "BEAUTY",
    rate: "22%",
    price: 249000,
    earn: 54780,
  },
  {
    id: 6,
    title: "Portable Blender USB-C",
    desc: "Rechargeable portable blender for smoothies on the go.",
    platform: "Shopee",
    category: "HOME & LIVING",
    rate: "14%",
    price: 175000,
    earn: 24500,
  }
];

const testimonials = [
  {
    quote: "I made back the 100k training fee in my first week. The product gallery makes it so easy to find high-commission TikTok items that actually match my audience. My best month so far was 4.2 million in commissions.",
    name: "Dewi Anggraini",
    role: "Beauty Content Creator · Jakarta",
    monthly: "Rp4.200.000"
  },
  {
    quote: "The transparency is what sold me. I can see every transaction status - pending, valid, approved in real time. No guessing when my payout is coming. The CS mentor sessions genuinely helped me scale.",
    name: "Rizky Pratama",
    role: "Tech Reviewer · Bandung",
    monthly: "Rp6.800.000"
  },
  {
    quote: "What I love most is the unique affiliate links. I grab a product, get my link and images instantly, and share them in my stories. The dashboard shows exactly how much is pending and how much is approved. It just works.",
    name: "Sari Maharani",
    role: "Lifestyle Influencer · Surabaya",
    monthly: "Rp3.500.000"
  }
];

const faqs = [
  {
    q: "How do I become an affiliate?",
    a: "Sign up with your name, WhatsApp, email, Telegram, bank details, and location. Verify your email with an OTP code, then pay the one-time 100,000 IDR training fee to unlock the full program and premium product archive."
  },
  {
    q: "Why is there a 100.000 IDR training fee?",
    a: "The one-time fee provides lifetime access to structured setup guides, video tutorials, weekly CS mentoring sessions, and high-conversion exclusive affiliate links."
  },
  {
    q: "How do I get my affiliate links?",
    a: "Select any product from the gallery and click generate. Your customized tracking link and promo image assets will be generated instantly."
  },
  {
    q: "How are commissions tracked?",
    a: "Commissions are recorded in real time on your dashboard categorized by Pending, Valid, Approved, and Paid."
  },
  {
    q: "How do I withdraw my earnings?",
    a: "You can submit a withdrawal request directly to your registered bank account once your commission reaches the minimum threshold."
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [openFaq, setOpenFaq] = useState(0);

  // Cek session login saat web pertama kali dimuat
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        setCurrentPage(parsed.role || 'user');
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const navigateTo = (page) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentPage('home');
  };

  // Navigasi Kondisional Legal
  if (currentPage === 'terms') {
    return <TermsConditions onNavigate={navigateTo} />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicy onNavigate={navigateTo} />;
  }

  // Navigasi Kondisional Auth (Login, Register, Forgot Password)
  if (currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot') {
    return <AuthPages initialView={currentPage} onNavigate={navigateTo} />;
  }

  // Navigasi Khusus Sesuai Role
  if (currentPage === 'user') return <UserDashboard user={currentUser} onLogout={handleLogout} />;
  if (currentPage === 'mentor') return <MentorDashboard user={currentUser} onLogout={handleLogout} />;
  if (currentPage === 'admin') return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  if (currentPage === 'superadmin') return <SuperadminDashboard user={currentUser} onLogout={handleLogout} />;

  const filteredProducts = activeTab === 'All' 
    ? productsData 
    : productsData.filter(p => p.platform.toLowerCase() === activeTab.toLowerCase());

  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="bg-[#0f1d2e] p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kineti<span className="text-emerald-400">Affiliate</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#program" className="hover:text-emerald-400 transition">Program</a>
              <a href="#products" className="hover:text-emerald-400 transition">Products</a>
              <a href="#training" className="hover:text-emerald-400 transition">Training</a>
              <a href="#testimonials" className="hover:text-emerald-400 transition">Testimonials</a>
              <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
              <a href="#help" className="hover:text-emerald-400 transition">Help</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => navigateTo('login')}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition"
              >
                Log in
              </button>
              <button 
                onClick={() => navigateTo('register')}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
              >
                Sign up
              </button>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-[#0c121e] px-4 pt-2 pb-6 space-y-3">
            <a href="#program" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 font-medium">Program</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 font-medium">Products</a>
            <a href="#training" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 font-medium">Training</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 font-medium">Testimonials</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 font-medium">FAQ</a>
            <a href="#help" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 font-medium">Help</a>
            <div className="pt-4 flex flex-col gap-2">
              <button 
                onClick={() => { setMobileMenuOpen(false); navigateTo('login'); }}
                className="w-full py-2.5 rounded-lg border border-slate-700 font-semibold text-white bg-slate-800/40"
              >
                Log in
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); navigateTo('register'); }}
                className="w-full py-2.5 rounded-lg font-semibold bg-emerald-500 text-slate-950"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-14 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Commission Payouts[span_0](start_span)[span_0](end_span)
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Turn Shopee &amp; TikTok products into a <span className="text-emerald-400">high-performance</span> career.[span_1](start_span)[span_1](end_span)
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Join the affiliate program built for the next generation of digital entrepreneurs. Grab unique links, track every commission in real time, and build your digital legacy — one transaction at a time.[span_2](start_span)[span_2](end_span)
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button 
            onClick={() => navigateTo('register')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-2"
          >
            Start Earning Today <ArrowRight className="w-4 h-4" />[span_3](start_span)[span_3](end_span)
          </button>
          <a href="#program" className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/60 text-slate-300 font-semibold text-center">
            How It Works[span_4](start_span)[span_4](end_span)
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Shopee Affiliate[span_5](start_span)[span_5](end_span)</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> TikTok Shop[span_6](start_span)[span_6](end_span)</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> 100k IDR Training[span_7](start_span)[span_7](end_span)</span>
        </div>
      </section>

      {/* Live Ticker Card */}
      <div className="max-w-md mx-auto px-4 mb-20">
        <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-wider font-bold text-slate-400 uppercase">Commission Ticker[span_8](start_span)[span_8](end_span)</div>
            <div className="text-sm font-semibold text-white mt-0.5">Latest payout to <span className="text-emerald-400">Rizky P.[span_9](start_span)[span_9](end_span)</span></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Tiktok[span_10](start_span)[span_10](end_span)</div>
            <div className="text-sm font-extrabold text-emerald-400">+Rp120.000[span_11](start_span)[span_11](end_span)</div>
          </div>
        </div>
      </div>

      {/* How it Works / 4 Steps */}
      <section id="program" className="py-16 px-4 max-w-5xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase mb-2">The Affiliate Program[span_12](start_span)[span_12](end_span)</div>
          <h2 className="text-3xl font-bold text-white">A precision instrument for wealth creation[span_13](start_span)[span_13](end_span)</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            We've transformed affiliate marketing from a side hustle into a structured, transparent career path.[span_14](start_span)[span_14](end_span)
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { num: "01", title: "Select Products", desc: "Browse the curated Shopee & TikTok product gallery. Filter by platform, category, and commission share." },
            { num: "02", title: "Grab Your Unique Link", desc: "One click generates your unique affiliate link and downloads product images ready for social media." },
            { num: "03", title: "Track Every Sale", desc: "Watch commissions roll in with real-time tracking across pending, valid, and approved states." },
            { num: "04", title: "Withdraw Your Earnings", desc: "Request a direct withdrawal to your bank account with complete transparency and audit logs." },
          ].map((step, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#0f172a]/40 border border-slate-800 relative">
              <span className="text-3xl font-extrabold text-slate-800 absolute top-4 right-5">{step.num}[span_15](start_span)[span_15](end_span)</span>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}[span_16](start_span)[span_16](end_span)</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}[span_17](start_span)[span_17](end_span)</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Gallery */}
      <section id="products" className="py-16 px-4 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-8">
          <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase mb-2">Product Gallery[span_18](start_span)[span_18](end_span)</div>
          <h2 className="text-3xl font-bold text-white">Curated products ready for your affiliate links[span_19](start_span)[span_19](end_span)</h2>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {['All', 'Shopee', 'Tiktok'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-semibold rounded-full border transition ${
                activeTab === tab 
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                  : 'border-slate-800 bg-[#0f172a] text-slate-400 hover:text-white'
              }`}
            >
              {tab}[span_20](start_span)[span_20](end_span)
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{p.category}[span_21](start_span)[span_21](end_span)</span>
                  <span className="text-xs font-bold text-emerald-400">{p.platform} • {p.rate} commission[span_22](start_span)[span_22](end_span)</span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">{p.title}[span_23](start_span)[span_23](end_span)</h4>
                <p className="text-xs text-slate-400 mb-6">{p.desc}[span_24](start_span)[span_24](end_span)</p>
              </div>

              <div className="pt-4 border-t border-slate-800/70 flex items-center justify-between text-sm">
                <div>
                  <div className="text-[10px] text-slate-400">Price[span_25](start_span)[span_25](end_span)</div>
                  <div className="font-semibold text-slate-200">{formatRupiah(p.price)}[span_26](start_span)[span_26](end_span)</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-semibold">You earn[span_27](start_span)[span_27](end_span)</div>
                  <div className="font-bold text-emerald-400">{formatRupiah(p.earn)}[span_28](start_span)[span_28](end_span)</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 100k Training Section */}
      <section id="training" className="py-16 px-4 max-w-4xl mx-auto border-t border-slate-800/60">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1c] border border-emerald-500/20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">The Training Fee[span_29](start_span)[span_29](end_span)</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Unlock the premium archive for 100.000 IDR[span_30](start_span)[span_30](end_span)</h2>
            <p className="text-sm text-slate-400 mt-2">
              A one-time training fee of 100,000 IDR unlocks the full affiliate training program.[span_31](start_span)[span_31](end_span)
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300 mb-8">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Full access to video training library[span_32](start_span)[span_32](end_span)</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Step-by-step setup guides[span_33](start_span)[span_33](end_span)</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> High-converting templates[span_34](start_span)[span_34](end_span)</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Direct CS mentor support sessions[span_35](start_span)[span_35](end_span)</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Premium product archives[span_36](start_span)[span_36](end_span)</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Lifetime access[span_37](start_span)[span_37](end_span)</div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">One-time fee[span_38](start_span)[span_38](end_span)</div>
              <div className="text-2xl font-extrabold text-emerald-400">Rp100.000[span_39](start_span)[span_39](end_span)</div>
            </div>
            <button 
              onClick={() => navigateTo('register')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
            >
              Enroll &amp; Start Today
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Testimonials[span_40](start_span)[span_40](end_span)</div>
          <h2 className="text-3xl font-bold text-white">Real affiliates, real earnings[span_41](start_span)[span_41](end_span)</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#0f172a]/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">"{t.quote}[span_42](start_span)"[span_42](end_span)</p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{t.name}[span_43](start_span)[span_43](end_span)</div>
                  <div className="text-[11px] text-slate-400">{t.role}[span_44](start_span)[span_44](end_span)</div>
                </div>
                <div className="text-right font-extrabold text-emerald-400 text-sm">
                  {t.monthly}[span_45](start_span)[span_45](end_span)
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4 max-w-3xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Frequently Asked[span_46](start_span)[span_46](end_span)</div>
          <h2 className="text-3xl font-bold text-white">Everything you need to know[span_47](start_span)[span_47](end_span)</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-slate-800 bg-[#0f172a]/50 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full p-4 text-left font-semibold text-sm text-white flex justify-between items-center"
              >
                {faq.q}[span_48](start_span)[span_48](end_span)
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-90 text-emerald-400' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                  {faq.a}[span_49](start_span)[span_49](end_span)
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Help & Support */}
      <section id="help" className="py-16 px-4 max-w-4xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Help &amp; Support[span_50](start_span)[span_50](end_span)</div>
          <h2 className="text-3xl font-bold text-white">We're here to help you succeed[span_51](start_span)[span_51](end_span)</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f172a]/50 border border-slate-800 text-center">
            <MessageCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">WhatsApp[span_52](start_span)[span_52](end_span)</h4>
            <p className="text-[11px] text-slate-400 mb-2">Fastest response channel[span_53](start_span)[span_53](end_span)</p>
            <p className="text-xs font-semibold text-emerald-400">+62 812-3456-7890[span_54](start_span)[span_54](end_span)</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a]/50 border border-slate-800 text-center">
            <Send className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">Telegram[span_55](start_span)[span_55](end_span)</h4>
            <p className="text-[11px] text-slate-400 mb-2">Community &amp; updates[span_56](start_span)[span_56](end_span)</p>
            <p className="text-xs font-semibold text-emerald-400">@kinetiaffiliate[span_57](start_span)[span_57](end_span)</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a]/50 border border-slate-800 text-center">
            <Mail className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">Email[span_58](start_span)[span_58](end_span)</h4>
            <p className="text-[11px] text-slate-400 mb-2">Detailed inquiries[span_59](start_span)[span_59](end_span)</p>
            <p className="text-xs font-semibold text-emerald-400">help@kinetiaffiliate.com[span_60](start_span)[span_60](end_span)</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#05080f] py-12 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-base font-bold text-white">Kineti<span className="text-emerald-400">Affiliate[span_61](start_span)[span_61](end_span)</span></span>
            </div>
            <p className="max-w-xs text-slate-400">
              The affiliate platform for the next generation of digital entrepreneurs.[span_62](start_span)[span_62](end_span)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-slate-400">
            <div>
              <div className="font-bold text-white mb-2">Platform[span_63](start_span)[span_63](end_span)</div>
              <ul className="space-y-1">
                <li><a href="#program" className="hover:text-white">Program[span_64](start_span)[span_64](end_span)</a></li>
                <li><a href="#products" className="hover:text-white">Products[span_65](start_span)[span_65](end_span)</a></li>
                <li><a href="#training" className="hover:text-white">Training[span_66](start_span)[span_66](end_span)</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-2">Account[span_67](start_span)[span_67](end_span)</div>
              <ul className="space-y-1">
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('login')} 
                    className="hover:text-white text-left transition"
                  >
                    Log in[span_68](start_span)[span_68](end_span)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('register')} 
                    className="hover:text-white text-left transition"
                  >
                    Sign up[span_69](start_span)[span_69](end_span)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('forgot')} 
                    className="hover:text-white text-left transition"
                  >
                    Forgot Password[span_70](start_span)[span_70](end_span)
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-2">Legal[span_71](start_span)[span_71](end_span)</div>
              <ul className="space-y-1 text-slate-400">
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('terms')} 
                    className="hover:text-white text-left transition"
                  >
                    Terms &amp; Conditions[span_72](start_span)[span_72](end_span)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('privacy')} 
                    className="hover:text-white text-left transition"
                  >
                    Privacy Policy[span_73](start_span)[span_73](end_span)
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-900 text-center text-slate-600">
          © 2026 KinetiAffiliate. All rights reserved.[span_74](start_span)[span_74](end_span)
        </div>
      </footer>
    </div>
  );
}
