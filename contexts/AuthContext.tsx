import React, { createContext, useState, useContext, useEffect } from 'react';
import { PortalRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: PortalRole;
  customer_id?: string;
  org_id?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development (will be replaced with real auth backend)
const MOCK_USERS: AuthUser[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: PortalRole.Admin,
    org_id: 'ORG-001'
  },
  {
    id: '2',
    email: 'approver@company.com',
    name: 'QA Approver',
    role: PortalRole.Approver,
    org_id: 'ORG-001'
  },
  {
    id: '3',
    email: 'tech@company.com',
    name: 'Technician',
    role: PortalRole.Technician,
    org_id: 'ORG-001'
  },
  {
    id: '4',
    email: 'client@bistro.com',
    name: 'Restaurant Owner',
    role: PortalRole.CustomerOwner,
    customer_id: 'C-001'
  },
  {
    id: '5',
    email: 'client@museum.com',
    name: 'Museum Curator',
    role: PortalRole.CustomerOwner,
    customer_id: 'C-002'
  }
];

const AUTH_STORAGE_KEY = 'managed_capture_auth_user';
const AUTH_SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for persisted session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        const storedTime = parsed.timestamp;
        const now = Date.now();

        if (now - storedTime < AUTH_SESSION_TIMEOUT) {
          setUser(parsed.user);
        } else {
          // Session expired
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock auth: check if email exists in MOCK_USERS
    // Password validation is intentionally skipped for MVP (mock auth)
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      // Persist session
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: foundUser,
          timestamp: Date.now()
        })
      );
      setUser(foundUser);
      setError(null);
    } else {
      setError(`User not found: ${email}`);
      setUser(null);
    }

    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
