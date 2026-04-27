import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import { saveToken, getToken, removeToken } from '../utils/tokenStorage';
import { connectSocket, disconnectSocket } from '../services/socketClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { fullName: string; phoneNumber: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
  refetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setToken(null);
    disconnectSocket();
  }, []);

  useEffect(() => {
    const stored = getToken();
    if (!stored) { setIsLoading(false); return; }

    authApi.getMe()
      .then(res => {
        setUser(res.data.data);
        connectSocket();
      })
      .catch(() => logout())
      .finally(() => setIsLoading(false));
  }, [logout]);

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    const { token: t, user: u } = res.data.data;
    saveToken(t);
    setToken(t);
    setUser(u);
    connectSocket();
  };

  const register = async (data: { fullName: string; phoneNumber: string; username: string; password: string }) => {
    await authApi.register(data);
  };

  const refetchMe = async () => {
    const res = await authApi.getMe();
    setUser(res.data.data);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
