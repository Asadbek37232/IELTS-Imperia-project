import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TestProvider } from './context/TestContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import StudentPage from './pages/StudentPage';
import Loading from './components/Common/Loading';

function AppRoutes() {
  const { user, token, isLoading } = useAuth();

  // If we're loading OR we have a token but user data hasn't arrived yet, keep showing Loading
  if (isLoading || (token && !user)) {
    return <Loading text="Xavfsiz ulanish..." />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {user.role === 'ADMIN' ? (
        <>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </>
      ) : (
        <>
          <Route path="/student/*" element={<StudentPage />} />
          <Route path="*" element={<Navigate to="/student" replace />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TestProvider>
            <AppRoutes />
          </TestProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
