import { createContext, useContext, useState, type ReactNode } from "react";
import type { StaffUser } from "../types";
import { staffUsers } from "../data/dummy";

interface AuthContextType {
  user: StaffUser | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);

  const login = (userId: string) => {
    const found = staffUsers.find((u) => u.id === userId) ?? null;
    setUser(found);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
