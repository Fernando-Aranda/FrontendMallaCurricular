import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { login as mockLogin, logout as mockLogout, type User } from '../services/mockAuthService';


// 1. Definimos el tipo para el valor del contexto
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 2. Creamos el contexto con el tipo definido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Definimos el tipo para las props del Provider
interface AuthProviderProps {
  children: ReactNode;
}

// El resto del archivo se mantiene exactamente igual...
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token: receivedToken, user: userData } = await mockLogin(email, password);
      
      setToken(receivedToken);
      setUser(userData);
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    mockLogout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};