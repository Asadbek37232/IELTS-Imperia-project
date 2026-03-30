import { useEffect, useRef, useState } from 'react';
import { CurrentSection } from '../../types';

interface Props {
  section: CurrentSection;
  sectionNumber: number;
  totalSections: number;
  onStart: () => void;
}

const BREAK_SECONDS = 60;

export default function SectionTransitionModal({ section, sectionNumber, totalSections, onStart }: Props) {
  const [seconds, setSeconds] = useState(BREAK_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [onStart]);

  const isPractice = section.sectionType === 'PRACTICE_TEST';
  const isVocab = section.subject === 'VOCABULARY';

  const questionCount = isPractice
    ? (section.questions?.length ?? 0)
    : (section.exercises?.length ?? 0);

  const countLabel = isPractice ? 'ta savol' : 'ta mashq';

  const progress = ((BREAK_SECONDS - seconds) / BREAK_SECONDS) * 100;

  const subjectColor = isVocab
    ? 'text-blue-500 dark:text-blue-400'
    : 'text-indigo-500 dark:text-indigo-400';

  const ringColor = isVocab
    ? 'stroke-blue-500'
    : 'stroke-indigo-500';

  const size = 80;
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - (seconds / BREAK_SECONDS));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Top accent bar */}
        <div className={`h-1.5 w-full ${isVocab ? 'bg-blue-500' : 'bg-indigo-500'}`} />

        <div className="p-8 space-y-6">

          {/* Section number */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Bo'lim {sectionNumber} / {totalSections}
            </span>
            {isPractice && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                Practice Test
              </span>
            )}
          </div>

          {/* Subject — very large */}
          <div>
            <h1 className={`text-6xl font-black tracking-tight leading-none ${subjectColor}`}>
              {isVocab ? 'Vocabulary' : 'Grammar'}
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                {isPractice ? 'Savollar' : 'Mashqlar'}
              </p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {questionCount}
                <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">{countLabel}</span>
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                Vaqt
              </p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {section.timeAllocated ?? Math.round((new Date(section.deadline).getTime() - Date.now()) / 60000)}
                <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">daqiqa</span>
              </p>
            </div>
          </div>

          {/* Tip */}
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            Keyingi bo'lim boshlashdan oldin biroz dam oling.
          </p>

          {/* Countdown ring + button row */}
          <div className="flex items-center justify-between gap-4">

            {/* SVG countdown ring */}
            <div className="relative flex-shrink-0">
              <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                  className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="6" />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                  className={ringColor} strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dash}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center rotate-0">
                <span className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{seconds}</span>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={() => { clearInterval(intervalRef.current!); onStart(); }}
              className={`flex-1 py-4 rounded-2xl font-black text-white text-lg transition-all active:scale-95 shadow-lg ${
                isVocab
                  ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'
                  : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30'
              }`}
            >
              Boshlash →
            </button>
          </div>

          {/* Skip break */}
          <button
            onClick={() => { clearInterval(intervalRef.current!); onStart(); }}
            className="w-full text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors py-1 font-semibold"
          >
            Skip the break
          </button>

        </div>
      </div>
    </div>
  );
}
