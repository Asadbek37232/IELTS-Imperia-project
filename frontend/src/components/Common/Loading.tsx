export default function Loading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/40" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">{text}</p>
    </div>
  );
}
