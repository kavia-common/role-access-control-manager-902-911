import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions to the application. */
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rbac_token');
    if (!token) {
      setInitializing(false);
      return;
    }
    api.me()
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('rbac_token');
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    /** Logs in the user and stores JWT in localStorage. */
    const res = await api.login(email, password);
    if (res?.token) {
      localStorage.setItem('rbac_token', res.token);
      const me = await api.me();
      setUser(me);
    } else {
      throw new Error('Invalid login response');
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Clears auth token and user information. */
    localStorage.removeItem('rbac_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
