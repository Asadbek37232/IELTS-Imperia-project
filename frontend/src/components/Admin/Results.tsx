import { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Loading from '../Common/Loading';

interface AdminResult {
  id: string;
  totalScore: number;
  vocabScore: number | null;
  grammarScore: number | null;
  vocabCorrect: number | null;
  vocabTotal: number | null;
  grammarCorrect: number | null;
  grammarTotal: number | null;
  submittedAt: string;
  student: { fullName: string; username: string; phoneNumber: string };
  testSession: { title: string; pinCode: string };
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30'
    : score >= 60 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/30'
    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800/30';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-sm font-bold tabular-nums ${color}`}>
      {score.toFixed(1)}%
    </span>
  );
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminResults() {
  const [results, setResults] = useState<AdminResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getResults()
      .then(res => setResults(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Natijalar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{results.length} ta yozuv</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {results.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Hali natijalar yo'q</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">O'quvchi</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Test</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Umumiy</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Vocabulary</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Grammar</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {results.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {initials(r.student.fullName)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.student.fullName}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">@{r.student.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.testSession.title}</p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">PIN: {r.testSession.pinCode}</span>
                    </td>
                    <td className="px-5 py-4">
                      <ScoreBadge score={r.totalScore} />
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {r.vocabScore != null ? (
                        <div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{r.vocabScore.toFixed(1)}%</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">{r.vocabCorrect}/{r.vocabTotal}</span>
                        </div>
                      ) : <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {r.grammarScore != null ? (
                        <div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{r.grammarScore.toFixed(1)}%</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1.5">{r.grammarCorrect}/{r.grammarTotal}</span>
                        </div>
                      ) : <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(r.submittedAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
