import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Interfaz simplificada para usuario
interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  session: { user: User } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario desde localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setSession({ user: userData });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulación de autenticación - REEMPLAZAR CON TU BASE DE DATOS
    try {
      // Credenciales de demo
      if (email === "admin@smartroom.com" && password === "admin123") {
        const userData: User = {
          id: "demo-user-id",
          email: email,
          name: "Usuario Demo"
        };
        
        setUser(userData);
        setSession({ user: userData });
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        return { error: null };
      }
      
      // Aquí debes agregar la lógica para conectar con tu base de datos
      return { 
        error: { message: "Credenciales inválidas. Usa las credenciales de demo o conecta tu base de datos." }
      };
    } catch (error: any) {
      return { error: { message: error.message || "Error de autenticación" } };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    // Simulación de registro - REEMPLAZAR CON TU BASE DE DATOS
    try {
      const userData: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: name || email
      };
      
      setUser(userData);
      setSession({ user: userData });
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Aquí debes agregar la lógica para guardar en tu base de datos
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || "Error en el registro" } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};