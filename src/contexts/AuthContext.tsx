
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Define types
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  rg?: string;
  isAdmin: boolean;
  purchasedTickets: string[];
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage keys
const USER_STORAGE_KEY = 'casa-rifa-mania-user';
const USERS_STORAGE_KEY = 'casa-rifa-mania-users';

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    // Initialize users array in localStorage if it doesn't exist
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      // Create default admin user
      const adminUser: User = {
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@example.com',
        phone: '(11) 99999-9999',
        isAdmin: true,
        purchasedTickets: []
      };
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const user = users.find((u: User) => u.email === email);
      
      // In a real app, we would hash the password. For simplicity, we're just checking the email.
      if (user) {
        setUser(user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo de volta, ${user.name}!`,
        });
        navigate(user.isAdmin ? '/admin' : '/dashboard');
      } else {
        throw new Error('Usuário não encontrado ou senha incorreta.');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      
      // Check if email already exists
      if (users.some((u: User) => u.email === email)) {
        throw new Error('Este email já está em uso.');
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        isAdmin: false,
        purchasedTickets: []
      };
      
      // Add user to users array
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Log in the new user
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      toast({
        title: "Registro realizado com sucesso!",
        description: `Bem-vindo, ${name}!`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    navigate('/');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
