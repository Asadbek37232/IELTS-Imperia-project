import { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import Loading from '../Common/Loading';
import CreateTest from './CreateTest';
import Modal from '../Common/Modal';

interface DashboardData {
  totalTests: number;
  totalStudents: number;
  liveCount: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await adminApi.getDashboard();
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Boshqaruv paneli</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Yangi test
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Jami testlar</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">{data?.totalTests ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Yaratilgan testlar soni</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Jami o'quvchilar</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">{data?.totalStudents ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Test topshirgan o'quvchilar</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hozir online</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">{data?.liveCount ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              {(data?.liveCount ?? 0) > 0 && <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
              <span className="text-xs font-medium text-orange-500 dark:text-orange-400">
                {(data?.liveCount ?? 0) > 0 ? 'Test jarayonida' : "Faol sessiya yo'q"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-lg">Yangi test yarating</h3>
            <p className="text-blue-100 text-sm mt-1">Vocabulary va Grammar bo'limlari bilan test yaratib, PIN orqali o'quvchilarga ulashing.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Test yaratish
          </button>
        </div>
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Yangi test yaratish" size="lg">
        <CreateTest onSuccess={() => { setShowCreate(false); fetchDashboard(); }} />
      </Modal>
    </div>
  );
}
