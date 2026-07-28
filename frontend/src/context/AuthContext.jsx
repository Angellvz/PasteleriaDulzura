import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem('dulzura_admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.usuario);
      } catch (error) {
        console.error('Sesión no válida:', error);
        localStorage.removeItem('dulzura_admin_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  const login = async (usuario, password) => {
    const response = await api.post('/auth/login', { usuario, password });
    const { token, usuario: userData } = response.data;
    localStorage.setItem('dulzura_admin_token', token);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('dulzura_admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
