import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  signup: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    enabled: isInitialized,
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        return { success: true, user: data.user };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Login failed" 
      };
    }
  };

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await apiRequest("POST", "/api/auth/signup", { 
        name, 
        email, 
        password, 
        role 
      });
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        return { success: true, user: data.user };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Signup failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    queryClient.setQueryData(["/api/auth/me"], null);
    queryClient.clear();
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading: !isInitialized || isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
