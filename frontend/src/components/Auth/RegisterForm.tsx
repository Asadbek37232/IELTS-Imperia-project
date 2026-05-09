import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess("Ro'yxatdan o'tildi! Login sahifasiga o'tilmoqda...");
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(axiosMsg || "Ro'yxatdan o'tishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 shadow-sm";
  const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1, marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-semibold overflow-hidden"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1, marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold overflow-hidden"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4 block">
        <div>
          <label className={labelClass}>Ism Familiya</label>
          <input type="text" value={form.fullName}
            onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
            className={inputClass} placeholder="To'liq ismingiz..." required minLength={2} />
        </div>
        <div>
          <label className={labelClass}>Telefon raqam</label>
          <input type="tel" value={form.phoneNumber}
            onChange={e => setForm(p => ({ ...p, phoneNumber: e.target.value }))}
            className={inputClass} placeholder="+998 90 123 45 67" required />
        </div>
        <div>
          <label className={labelClass}>Username</label>
          <input type="text" value={form.username}
            onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            className={inputClass} placeholder="Noyob username..." required minLength={3}
            pattern="^[a-zA-Z0-9_]+$" title="Only letters, numbers, underscores" />
        </div>
        <div>
          <label className={labelClass}>Parol</label>
          <input type="password" value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            className={inputClass} placeholder="Kamida 6 ta belgi..." required minLength={6} />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 rounded-xl font-black disabled:opacity-50 transition-all duration-200 flex justify-center items-center shadow-lg shadow-gray-900/10 dark:shadow-white/5 tracking-wide"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Hisobni yaratish'}
        </motion.button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
        Hisobingiz bormi?{' '}
        <Link to="/login" className="text-gray-900 dark:text-white font-bold hover:underline transition-all">
          Kirish
        </Link>
      </div>
    </div>
  );
}
