import { useTimer } from '../../hooks/useTimer';

interface TimerProps {
  deadline: string;
  onExpire: () => void;
  label?: string;
}

export default function Timer({ deadline, onExpire, label = 'Time Remaining' }: TimerProps) {
  const { display, isWarning, isCritical } = useTimer(deadline, onExpire);

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-bold transition-all
      ${isCritical
        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 animate-pulse'
        : isWarning
        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{label}: {display}</span>
    </div>
  );
}
