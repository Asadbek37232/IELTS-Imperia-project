import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../services/api';
import { Result } from '../../types';
import Loading from '../Common/Loading';

export default function MyResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    studentApi.getResults()
      .then(res => setResults(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const scoreColor = (s: number) =>
    s >= 80 ? 'text-emerald-500 dark:text-emerald-400' :
    s >= 60 ? 'text-amber-500 dark:text-amber-400' :
              'text-red-500 dark:text-red-400';

  const scoreBg = (s: number) =>
    s >= 80 ? 'bg-emerald-500' :
    s >= 60 ? 'bg-amber-500' :
              'bg-red-500';

  const scoreRing = (s: number) =>
    s >= 80 ? 'ring-emerald-200 dark:ring-emerald-800' :
    s >= 60 ? 'ring-amber-200 dark:ring-amber-800' :
              'ring-red-200 dark:ring-red-800';

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Results</h1>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold">
          {results.length} test{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {results.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-14 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-bold text-gray-800 dark:text-gray-200">No results yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Complete a test to see your results here</p>
          <button
            onClick={() => navigate('/student')}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-2xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => navigate(`/student/results/${r.id}`)}
              className="w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 text-left hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-200 group animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Score circle */}
                <div className={`relative flex-shrink-0 w-14 h-14 rounded-2xl ring-4 ${scoreRing(r.totalScore)} bg-white dark:bg-gray-800 flex items-center justify-center`}>
                  <span className={`text-lg font-black ${scoreColor(r.totalScore)}`}>
                    {r.totalScore.toFixed(0)}
                  </span>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${scoreBg(r.totalScore)} rounded-full border-2 border-white dark:border-gray-900`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate">{r.testSession.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(r.submittedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  {/* Section scores */}
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {r.vocabScore != null && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Vocab: <span className={`font-bold ${scoreColor(r.vocabScore)}`}>{r.vocabScore.toFixed(0)}%</span>
                          <span className="text-gray-400 ml-1">({r.vocabCorrect}/{r.vocabTotal})</span>
                        </span>
                      </div>
                    )}
                    {r.grammarScore != null && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Grammar: <span className={`font-bold ${scoreColor(r.grammarScore)}`}>{r.grammarScore.toFixed(0)}%</span>
                          <span className="text-gray-400 ml-1">({r.grammarCorrect}/{r.grammarTotal})</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Bottom progress bar */}
              <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${scoreBg(r.totalScore)}`}
                  style={{ width: `${r.totalScore}%` }} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
