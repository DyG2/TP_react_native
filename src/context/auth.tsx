import { createContext, use, useState, type PropsWithChildren } from 'react';

// Compte de démonstration : pas de backend, l'authentification est simulée côté client.
export const DEMO_ACCOUNT = { email: 'admin@ecole.com', password: 'admin123' };

type AuthContextValue = {
  userEmail: string | null;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const signIn = (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (normalized !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) return false;
    setUserEmail(normalized);
    return true;
  };

  const signOut = () => setUserEmail(null);

  return <AuthContext value={{ userEmail, signIn, signOut }}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
