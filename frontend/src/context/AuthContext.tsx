import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

interface User {
    id: string;
    name: string;
    email: string;
    preferences: {
        currency: string;
        timezone: string;
        theme: "light" | "dark";
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    updateProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * Initial authentication check on application load.
     * Verifies stored JWT token and fetches user profile.
     */
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await api.get("/user/profile");
                    setUser(res.data.data);
                } catch (error) {
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Automatically apply theme class to document element based on user preferences
    useEffect(() => {
        if (user?.preferences?.theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [user?.preferences?.theme]);

    /**
     * Authenticate user with credentials and store token.
     */
    const login = async (credentials: any) => {
        const res = await api.post("/auth/login", credentials);
        const { user, token } = res.data.data;
        localStorage.setItem("token", token);
        setUser(user);
    };

    /**
     * Register a new user and automatically log them in.
     */
    const register = async (userData: any) => {
        const res = await api.post("/auth/register", userData);
        const { user, token } = res.data.data;
        localStorage.setItem("token", token);
        setUser(user);
    };

    /**
     * Clear session and sensitive data.
     */
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    /**
     * Persist user profile updates and sync local state.
     */
    const updateProfile = async (userData: any) => {
        const res = await api.put("/user/profile", userData);
        setUser(res.data.data);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
