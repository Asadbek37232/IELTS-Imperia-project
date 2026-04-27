export default function Loading({ text = 'Yuklanmoqda...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-900 dark:text-white font-black text-xl tracking-tighter uppercase">IELTS iMperia</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">{text}</p>
      </div>
    </div>
  );
}
