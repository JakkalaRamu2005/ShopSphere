import { useEffect } from "react";
import { createContext, useState, useContext } from "react";
import API_URL from "../config/api";

const AuthContext = createContext();


const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(`${API_URL}/auth/profile`, {
            method: "GET",
            headers: headers,
            credentials: "include",
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Not authenticated');
                }
            })
            .then(data => {
                if (data.success && data.user) {
                    setIsLoggedIn(true);
                    setUser(data.user);
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUser(null);
                // Don't remove token here as it might be a temporary network error
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);

    const login = async (credentials) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok && data.token) {
                // Save token to localStorage
                localStorage.setItem('token', data.token);

                setIsLoggedIn(true);
                setUser(data.user);

                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "An error occurred. Please try again" };
        }
    }

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout request error:", error);
        } finally {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null);
        }
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading, login, logout, user, updateUser }}>{children}</AuthContext.Provider>
    )

}

export default AuthProvider

export const useAuth = () => useContext(AuthContext);
