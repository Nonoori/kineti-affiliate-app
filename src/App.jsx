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
  ArrowRight, MessageCircle, Send, Mail, Star, LogIn 
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);

  // Cek session login saat web dibuka
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCurrentUser(parsed);
      setCurrentPage(parsed.role || 'user');
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

  // Navigasi Kondisional Halaman Penuh
  if (currentPage === 'terms') return <TermsConditions onNavigate={navigateTo} />;
  if (currentPage === 'privacy') return <PrivacyPolicy onNavigate={navigateTo} />;
  if (currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot') {
    return <AuthPages initialView={currentPage} onNavigate={navigateTo} />;
  }

  // Navigasi Khusus Sesuai Role
  if (currentPage === 'user') return <UserDashboard user={currentUser} onLogout={handleLogout} />;
  if (currentPage === 'mentor') return <MentorDashboard user={currentUser} onLogout={handleLogout} />;
  if (currentPage === 'admin') return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  if (currentPage === 'superadmin') return <SuperadminDashboard user={currentUser} onLogout={handleLogout} />;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      {/* Landing Page KinetiAffiliate Navbar */}
      <nav className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
            <span className="text-xl font-bold text-white">Kineti<span className="text-emerald-400">Affiliate</span></span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('login')}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white transition"
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
        </div>
      </nav>

      {/* Hero Section CTA */}
      <section className="pt-20 pb-16 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
          Turn Shopee &amp; TikTok products into a <span className="text-emerald-400">high-performance</span> career[span_23](start_span)[span_23](end_span).
        </h1>
        <p className="mt-6 text-slate-400 max-w-xl mx-auto text-sm">
          Platform afiliasi terstruktur dengan pelacakan komisi real-time dan pendampingan mentor[span_24](start_span)[span_24](end_span).
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button 
            onClick={() => navigateTo('register')}
            className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-2"
          >
            Start Earning Today[span_25](start_span)[span_25](end_span) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer Legal */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <div className="flex justify-center gap-6 mb-2 text-slate-400">
          <button onClick={() => navigateTo('terms')} className="hover:text-white">Terms &amp; Conditions</button>
          <button onClick={() => navigateTo('privacy')} className="hover:text-white">Privacy Policy</button>
        </div>
        © 2026 KinetiAffiliate. All rights reserved.
      </footer>
    </div>
  );
}
