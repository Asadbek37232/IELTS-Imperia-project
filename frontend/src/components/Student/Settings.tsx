import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function StudentSettings() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const fields = [
    { label: 'Full Name', value: user?.fullName },
    { label: 'Username', value: `@${user?.username}` },
    { label: 'Phone Number', value: user?.phoneNumber || '—' },
    { label: 'Role', value: user?.role },
  ];

  return (
    <div className="space-y-5 max-w-lg animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">Profile Information</h2>
        </div>
        <div className="p-2">
          {fields.map(field => (
            <div key={field.label} className="flex justify-between items-center px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <span className="text-sm text-gray-500 dark:text-gray-400">{field.label}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{field.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">Appearance</h2>
        </div>
        <div className="p-2">
          <div className="flex justify-between items-center px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{isDark ? 'Currently dark' : 'Currently light'}</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isDark ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${isDark ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={logout}
        className="w-full py-3.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors border border-red-100 dark:border-red-900/40 text-sm"
      >
        Sign Out
      </button>
    </div>
  );
}
