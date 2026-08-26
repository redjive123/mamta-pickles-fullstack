import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mamta_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mamta_token') || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    if (token && !user) {
      api.getProfile(token)
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('mamta_user', JSON.stringify(profile));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    setToken(data.token);
    localStorage.setItem('mamta_user', JSON.stringify(data));
    localStorage.setItem('mamta_token', data.token);
    setIsAuthModalOpen(false);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    setToken(data.token);
    localStorage.setItem('mamta_user', JSON.stringify(data));
    localStorage.setItem('mamta_token', data.token);
    setIsAuthModalOpen(false);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mamta_user');
    localStorage.removeItem('mamta_token');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
