import LoginForm from '../components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
            <span className="text-white text-2xl font-black">IE</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">IELTS Platform</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
