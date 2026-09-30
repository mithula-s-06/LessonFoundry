import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('lf_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('lf_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('lf_token');
      if (storedToken) {
        try {
          const res = await authApi.getCurrentUser();
          setUser(res.data);
          localStorage.setItem('lf_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Auth check failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('lf_token', token);
    localStorage.setItem('lf_user', JSON.stringify(user));
    return user;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem('lf_token', token);
    localStorage.setItem('lf_user', JSON.stringify(user));
    return user;
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('lf_user', JSON.stringify(newUser));
    return newUser;
  };

  const updateProfile = async (data) => {
    const res = await authApi.updateProfile(data);
    const updatedUser = res.data;
    updateUser(updatedUser);
    return updatedUser;
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch (ignored) {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('lf_token');
    localStorage.removeItem('lf_user');
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
