import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, Salesman } from '../api/salesman';

interface AuthValue {
  user: Salesman | null;
  token: string | null;
  login: (employee_id: string, password: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthValue;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Salesman | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('anpmart_salesman_user') || 'null');
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('anpmart_salesman_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem('anpmart_salesman_token', token);
    else localStorage.removeItem('anpmart_salesman_token');
    if (user) localStorage.setItem('anpmart_salesman_user', JSON.stringify(user));
    else localStorage.removeItem('anpmart_salesman_user');
  }, [token, user]);

  const login = async (employee_id: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiLogin(employee_id, password);
      setToken(data.token);
      setUser(data.salesman);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthValue>(() => ({ user, token, login, logout, loading }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
