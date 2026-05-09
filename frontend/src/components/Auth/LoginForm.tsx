import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ForgotPasswordFlow from './ForgotPasswordFlow';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(axiosMsg || msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1, marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-semibold overflow-hidden"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5 block">
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            className="w-full px-4 py-3.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 shadow-sm"
            placeholder="Foydalanuvchi nomi..."
            required
            autoComplete="username"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Parol</label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 outline-none focus:underline"
            >
              Unutdingizmi?
            </button>
          </div>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            className="w-full px-4 py-3.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 shadow-sm"
            placeholder="Xavfsiz parolingiz..."
            required
            autoComplete="current-password"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 rounded-xl font-black disabled:opacity-50 transition-all duration-200 flex justify-center items-center shadow-lg shadow-gray-900/10 dark:shadow-white/5 tracking-wide"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Kirish'}
        </motion.button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
        Akkauntingiz yo'qmi?{' '}
        <Link to="/register" className="text-gray-900 dark:text-white font-bold hover:underline transition-all">
          Ro'yxatdan o'tish
        </Link>
      </div>

      {showForgot && <ForgotPasswordFlow onBack={() => setShowForgot(false)} />}
    </div>
  );
}
