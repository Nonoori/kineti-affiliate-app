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

  // Navigasi Legal
  if (currentPage === 'terms') {
    return <TermsConditions onNavigate={navigateTo} />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicy onNavigate={navigateTo} />;
  }

  // Navigasi Auth
  if (currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot') {
    return <AuthPages initialView={currentPage} onNavigate={navigateTo} />;
  }

  // Navigasi Dashboard Role
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

        {/* Mobile Menu */}
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
          Live Commission Payouts 
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Turn Shopee &amp; TikTok products into a <span className="text-emerald-400">high-performance</span> career. 
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Join the affiliate program built for the next generation of digital entrepreneurs. Grab unique links, track every commission in real time, and build your digital legacy — one transaction at a time. 
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button 
            onClick={() => navigateTo('register')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-2"
          >
            Start Earning Today <ArrowRight className="w-4 h-4" /> 
          </button>
          <a href="#program" className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/60 text-slate-300 font-semibold text-center">
            How It Works 
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Shopee Affiliate </span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> TikTok Shop </span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> 100k IDR Training </span>
        </div>
      </section>

      {/* Live Ticker Card */}
      <div className="max-w-md mx-auto px-4 mb-20">
        <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-wider font-bold text-slate-400 uppercase">Commission Ticker </div>
            <div className="text-sm font-semibold text-white mt-0.5">Latest payout to <span className="text-emerald-400">Rizky P. </span></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Tiktok </div>
            <div className="text-sm font-extrabold text-emerald-400">+Rp120.000 </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <section id="program" className="py-16 px-4 max-w-5xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-12">
          <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase mb-2">The Affiliate Program </div>
          <h2 className="text-3xl font-bold text-white">A precision instrument for wealth creation </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            We've transformed affiliate marketing from a side hustle into a structured, transparent career path. 
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
              <span className="text-3xl font-extrabold text-slate-800 absolute top-4 right-5">{step.num} </span>
              <h3 className="text-lg font-bold text-white mb-2">{step.title} </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc} </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Gallery */}
      <section id="products" className="py-16 px-4 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-8">
          <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase mb-2">Product Gallery </div>
          <h2 className="text-3xl font-bold text-white">Curated products ready for your affiliate links </h2>
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
              {tab} 
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{p.category} </span>
                  <span className="text-xs font-bold text-emerald-400">{p.platform} • {p.rate} commission </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">{p.title} </h4>
                <p className="text-xs text-slate-400 mb-6">{p.desc} </p>
              </div>

              <div className="pt-4 border-t border-slate-800/70 flex items-center justify-between text-sm">
                <div>
                  <div className="text-[10px] text-slate-400">Price </div>
                  <div className="font-semibold text-slate-200">{formatRupiah(p.price)} </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-semibold">You earn </div>
                  <div className="font-bold text-emerald-400">{formatRupiah(p.earn)} </div>
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
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">The Training Fee </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Unlock the premium archive for 100.000 IDR </h2>
            <p className="text-sm text-slate-400 mt-2">
              A one-time training fee of 100,000 IDR unlocks the full affiliate training program. 
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300 mb-8">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Full access to video training library </div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Step-by-step setup guides </div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> High-converting templates </div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Direct CS mentor support sessions </div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Premium product archives </div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0"/> Lifetime access </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">One-time fee </div>
              <div className="text-2xl font-extrabold text-emerald-400">Rp100.000 </div>
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
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Testimonials </div>
          <h2 className="text-3xl font-bold text-white">Real affiliates, real earnings </h2>
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
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">"{t.quote}"</p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{t.name} </div>
                  <div className="text-[11px] text-slate-400">{t.role} </div>
                </div>
                <div className="text-right font-extrabold text-emerald-400 text-sm">
                  {t.monthly} 
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4 max-w-3xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Frequently Asked </div>
          <h2 className="text-3xl font-bold text-white">Everything you need to know </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-slate-800 bg-[#0f172a]/50 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="w-full p-4 text-left font-semibold text-sm text-white flex justify-between items-center"
              >
                {faq.q} 
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-90 text-emerald-400' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                  {faq.a} 
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Help & Support */}
      <section id="help" className="py-16 px-4 max-w-4xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Help &amp; Support </div>
          <h2 className="text-3xl font-bold text-white">We're here to help you succeed </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f172a]/50 border border-slate-800 text-center">
            <MessageCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">WhatsApp </h4>
            <p className="text-[11px] text-slate-400 mb-2">Fastest response channel </p>
            <p className="text-xs font-semibold text-emerald-400">+62 812-3456-7890 </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a]/50 border border-slate-800 text-center">
            <Send className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">Telegram </h4>
            <p className="text-[11px] text-slate-400 mb-2">Community &amp; updates </p>
            <p className="text-xs font-semibold text-emerald-400">@kinetiaffiliate </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172a]/50 border border-slate-800 text-center">
            <Mail className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">Email </h4>
            <p className="text-[11px] text-slate-400 mb-2">Detailed inquiries </p>
            <p className="text-xs font-semibold text-emerald-400">help@kinetiaffiliate.com </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#05080f] py-12 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-base font-bold text-white">Kineti<span className="text-emerald-400">Affiliate </span></span>
            </div>
            <p className="max-w-xs text-slate-400">
              The affiliate platform for the next generation of digital entrepreneurs. 
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-slate-400">
            <div>
              <div className="font-bold text-white mb-2">Platform </div>
              <ul className="space-y-1">
                <li><a href="#program" className="hover:text-white">Program </a></li>
                <li><a href="#products" className="hover:text-white">Products </a></li>
                <li><a href="#training" className="hover:text-white">Training </a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-2">Account </div>
              <ul className="space-y-1">
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('login')} 
                    className="hover:text-white text-left transition"
                  >
                    Log in 
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('register')} 
                    className="hover:text-white text-left transition"
                  >
                    Sign up 
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('forgot')} 
                    className="hover:text-white text-left transition"
                  >
                    Forgot Password 
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-2">Legal </div>
              <ul className="space-y-1 text-slate-400">
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('terms')} 
                    className="hover:text-white text-left transition"
                  >
                    Terms &amp; Conditions 
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('privacy')} 
                    className="hover:text-white text-left transition"
                  >
                    Privacy Policy 
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-900 text-center text-slate-600">
          © 2026 KinetiAffiliate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
