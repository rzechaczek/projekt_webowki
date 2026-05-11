import React, {
    createContext,
    useContext,
    useState,
    useCallback,
} from 'react';
import type { User, AuthResponse } from '../types';

interface AuthContextValue {
    user: User | null;
    token: string | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem('token'),
    );

    const login = useCallback((data: AuthResponse) => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.access_token);
        setUser(data.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
        user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
    }}
>
    {children}
    </AuthContext.Provider>
);
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return ctx;
}