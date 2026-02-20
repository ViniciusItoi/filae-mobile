/**
 * Auth Context
 * Manages authentication state across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services';
import { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  // Log authentication state changes
  useEffect(() => {
    console.log('🔄 AuthContext: isAuthenticated =', !!user, ', user =', user);
  }, [user]);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AuthService.getCurrentUser();
      const isAuth = await AuthService.isAuthenticated();

      if (storedUser && isAuth) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: LoginRequest) => {
    try {
      console.log('🔐 AuthContext: Iniciando login...');
      const response = await AuthService.login(credentials);
      console.log('✅ AuthContext: Login bem-sucedido, user:', response.user);
      setUser(response.user);
      console.log('✅ AuthContext: Estado do user atualizado');
    } catch (error) {
      console.error('❌ AuthContext: Erro no login:', error);
      throw error;
    }
  };

  const signUp = async (data: RegisterRequest) => {
    try {
      await AuthService.register(data);
      // Auto login after registration
      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 AuthContext: Fazendo logout...');
      await AuthService.logout();
      console.log('✅ AuthContext: Logout do service concluído');
      setUser(null);
      console.log('✅ AuthContext: User state atualizado para null');
    } catch (error) {
      console.error('❌ AuthContext: Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

