import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Loading from '../Common/Loading';

interface TestSession {
  id: string;
  title: string;
  pinCode: string;
  isActive: boolean;
  createdAt: string;
  _count: { results: number };
  sections: { sectionType: string; numberOfQuestions: number; timeAllocated: number; sectionOrder: number }[];
}

const sectionColor: Record<string, string> = {
  VOCABULARY: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800/40',
  GRAMMAR: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-800/40',
};

export default function AdminSettings() {
  const [tests, setTests] = useState<TestSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getTests()
      .then(res => setTests(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleTest = async (id: string) => {
    await adminApi.toggleTest(id);
    setTests(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Test Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tests.length} ta test</p>
        </div>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Hali testlar yaratilmagan</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Dashboard orqali yangi test yarating</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {tests.map(test => (
            <div key={test.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">

              <div className={`h-1 w-full ${test.isActive ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`} />

              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                      ${test.isActive ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <svg className={`w-5 h-5 ${test.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{test.title}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{test.id.slice(0, 10)}…</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 flex-shrink-0
                    ${test.isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${test.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                    {test.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </div>

                {/* PIN + Results */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                      Entry PIN
                    </p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-widest">{test.pinCode}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                      Natijalar
                    </p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">{test._count.results}</p>
                  </div>
                </div>

                {/* Sections */}
                <div className="flex flex-wrap gap-2">
                  {test.sections
                    .sort((a, b) => a.sectionOrder - b.sectionOrder)
                    .map(s => (
                      <span key={s.sectionOrder}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${sectionColor[s.sectionType] ?? 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                        {s.sectionType === 'VOCABULARY' ? 'Vocabulary' : 'Grammar'}
                        <span className="font-black">{s.numberOfQuestions}Q</span>
                        <span className="opacity-60">· {s.timeAllocated}m</span>
                      </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(test.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                  <button
                    onClick={() => toggleTest(test.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                      ${test.isActive
                        ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/20'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20'}`}>
                    {test.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
