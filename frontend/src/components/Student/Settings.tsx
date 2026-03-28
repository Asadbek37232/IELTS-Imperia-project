import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function StudentSettings() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 800);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("Yangi parollar mos kelmadi!");
      return;
    }
    alert("Parol o'zgartirish hozircha faol emas (Demo)");
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const inputClass = "w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all";
  const labelClass = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl mix-blend-overlay pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-500/30 rounded-full blur-3xl mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl font-black text-white shadow-2xl flex-shrink-0">
              {user?.fullName?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{user?.fullName}</h1>
              <p className="text-blue-100 mt-2 font-medium bg-black/20 inline-block px-4 py-1.5 rounded-full text-sm backdrop-blur-sm border border-white/10">
                @{user?.username} • IELTS iMperia
              </p>
            </div>
          </div>

          <div className="flex w-full sm:w-auto mt-4 sm:mt-0">
            <button onClick={logout} className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-red-600 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Tizimdan chiqish
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column: Profile Editing */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8 text-gray-900 dark:text-white">
              <h2 className="text-xl font-black">Shaxsiy Ma'lumotlar</h2>
              {isSaved && <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900 font-bold animate-pulse text-xs">Ajoyib! Saqlandi</span>}
            </div>

            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Ism Familiya</label>
                  <input type="text" className={inputClass} value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Tutingan ism (Username)</label>
                  <input type="text" className={inputClass} value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Telefon raqam</label>
                  <input type="text" className={inputClass} value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-transform active:scale-95 disabled:opacity-50">
                  {isSaving ? 'Saqlanmoqda...' : "O'zgarishlarni saqlash"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8">Xavfsizlik (Parol almashtirish)</h2>
            <form onSubmit={handlePasswordSave} className="space-y-6">
              <div>
                <label className={labelClass}>Joriy parol</label>
                <input type="password" required className={inputClass} value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Yangi parol</label>
                  <input type="password" required className={inputClass} value={passwordData.new} onChange={e => setPasswordData({ ...passwordData, new: e.target.value })} placeholder="••••••••" />
                </div>
                <div>
                  <label className={labelClass}>Yangi parolni tasdiqlang</label>
                  <input type="password" required className={inputClass} value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} placeholder="••••••••" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg transition-transform active:scale-95">
                  Parolni yangilash
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Preferences & Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Tizim Sozlamalari</h2>

            <div className="space-y-4">
              <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent dark:border-gray-700/50 group focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${isDark ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white text-amber-500 border border-gray-200'}`}>
                    {isDark ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Dizayn mavzusi</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{isDark ? 'Tungi rejim faollashgan' : 'Kunduzgi rejim faollashgan'}</p>
                  </div>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-colors border ${isDark ? 'bg-blue-600 border-blue-500' : 'bg-gray-300 border-gray-400'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${isDark ? 'translate-x-8' : 'translate-x-1'}`} />
                </div>
              </button>

              {/* Mock Notification setting */}
              <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-transparent dark:border-gray-700/30 opacity-60 grayscale cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Bildirishnomalar</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Tez orada qo'shiladi</p>
                  </div>
                </div>
                <div className="w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-700 relative">
                  <div className="absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 mt-1">Akkaunt Holati</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tizimdagi rol</span>
                <span className="text-xs tracking-wider font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/50">TALABA</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Raqam</span>
                <span className="text-xs font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                  #{user?.id ? user.id.slice(0, 8).toUpperCase() : 'NO-ID'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Platforma</span>
                <span className="text-sm font-black text-gray-900 dark:text-white">
                  IELTS iMperia v1.0
                </span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/40 p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-white dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 shadow-sm border border-red-100 dark:border-red-900">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-red-700 dark:text-red-400 font-black text-lg mb-2">Akkauntni o'chirish</h3>
            <p className="text-xs text-red-600/70 dark:text-red-400/70 mb-6 leading-relaxed">Diqqat! Bu amalni bekor qilib bo'lmaydi va barcha imtihon natijalaringiz ma'lumotlar bazasidan butunlay o'chiriladi.</p>
            <button onClick={() => alert("Profilni o'chirish funktsiyasi faqat Adminga bog'lanish orqali amalga oshiriladi.")} className="w-full font-bold text-red-600 dark:text-red-400 bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 py-3 rounded-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors">
              Akkauntni o'chirish
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
