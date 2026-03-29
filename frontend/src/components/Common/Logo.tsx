import { useState } from 'react';

interface Props {
  className?: string;   // img height class, e.g. "h-8"
  wrapDark?: boolean;   // wrap in white bg for dark mode
}

export default function Logo({ className = 'h-8', wrapDark = true }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // Text fallback — always visible in any mode
    return (
      <span className="font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-0.5 select-none" style={{ fontSize: '1.1rem' }}>
        <span className="text-red-600">IELTS</span>
        <span className="ml-1">Imperia</span>
      </span>
    );
  }

  const img = (
    <img
      src="/logo.png"
      alt="IELTS Imperia"
      className={`${className} w-auto object-contain`}
      onError={() => setFailed(true)}
    />
  );

  if (!wrapDark) return img;

  return (
    <div className="rounded-lg dark:bg-white dark:px-2 dark:py-1 transition-colors inline-flex">
      {img}
    </div>
  );
}
