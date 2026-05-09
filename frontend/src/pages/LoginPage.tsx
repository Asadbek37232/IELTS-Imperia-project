import { motion } from 'framer-motion';
import LoginForm from '../components/Auth/LoginForm';
import Logo from '../components/Common/Logo';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col md:flex-row font-sans selection:bg-blue-500/30 text-gray-900 dark:text-white transition-colors duration-300">

      {/* Left Panel - Branding (Serious & Professional) */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-gray-50 dark:bg-gradient-to-br dark:from-[#111111] dark:to-[#0a0a0a] border-r border-gray-200 dark:border-white/5 items-center justify-center p-12 lg:p-20">
        {/* Subtle grid pattern for professional technical look */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Subtle Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-2xl"
        >
          <Logo className="h-28 lg:h-40 mb-12 drop-shadow-xl" wrapDark />
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-gray-900 dark:text-white mb-8">
            IELTS Imperia <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-white dark:to-gray-500 block mt-2">
              Mock platformasi.
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl lg:text-2xl leading-relaxed max-w-xl font-medium">
            O'quv markazimizning rasmiy onlayn test tizimiga xush kelibsiz. Tizimga kirish uchun o'zingizga berilgan akkauntdan foydalaning va navbatdagi testni yechishni boshlang.
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-[420px] relative z-10"
        >
          <div className="md:hidden mb-10 flex justify-center">
            <Logo className="h-20 drop-shadow-md" wrapDark />
          </div>
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Platformaga kirish</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium font-sans">Boshqaruv elementlari va xavfsiz test o'tish markazi.</p>
          </div>

          <LoginForm />

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">
              Powered by <span className="text-gray-800 dark:text-white">TriCorp Agency</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
