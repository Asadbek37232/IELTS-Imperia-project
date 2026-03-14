import { useEffect, useState } from 'react';
import { studentApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';
import TestJoin from './TestJoin';
import Modal from '../Common/Modal';

interface RecentResult {
  id: string; totalScore: number; vocabScore: number | null;
  grammarScore: number | null; submittedAt: string;
  testSession: { title: string };
}
interface DashboardData { totalTests: number; recentResults: RecentResult[]; }

function ScorePill({ label, score }: { label: string; score: number }) {
  const c = score >= 80
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10'
    : score >= 60
    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10'
    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c}`}>
      {label} {score.toFixed(0)}%
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const c = score >= 80
    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    : score >= 60
    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  return (
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 ${c}`}>
      {score.toFixed(0)}%
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    studentApi.getDashboard().then(res => setData(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-2xl shadow-blue-900/40">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl font-black mt-0.5">{user?.fullName} &#128075;</h1>
          <div className="mt-4 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-black leading-none">{data?.totalTests ?? 0}</p>
              <p className="text-blue-200 text-xs mt-0.5">Tests completed</p>
            </div>
          </div>
          <div className="mt-5">
            <button
              onClick={() => setShowJoin(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-2xl font-bold text-sm hover:bg-blue-50 active:scale-95 transition-all shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start a Test
            </button>
          </div>
        </div>
      </div>

      {/* Recent results */}
      {data?.recentResults && data.recentResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white">Recent Tests</h2>
            <a href="/student/results" className="text-sm text-blue-500 font-semibold hover:underline">See all</a>
          </div>
          <div className="space-y-2">
            {data.recentResults.map(r => (
              <a
                key={r.id}
                href={`/student/results/${r.id}`}
                className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ScoreBadge score={r.totalScore} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{r.testSession.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {r.vocabScore != null && <ScorePill label="Vocab" score={r.vocabScore} />}
                      {r.grammarScore != null && <ScorePill label="Grammar" score={r.grammarScore} />}
                    </div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {data?.totalTests === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-10 text-center">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="font-bold text-gray-900 dark:text-white">No tests yet!</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Press Start a Test and enter your PIN code to begin</p>
        </div>
      )}

      <Modal isOpen={showJoin} onClose={() => setShowJoin(false)} title="Enter Test PIN">
        <TestJoin onClose={() => setShowJoin(false)} />
      </Modal>
    </div>
  );
}
