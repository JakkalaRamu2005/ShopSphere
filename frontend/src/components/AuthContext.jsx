import { useEffect } from "react";
import { createContext, useState, useContext } from "react";
import API_URL from "../config/api";

const AuthContext = createContext();


const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/auth/profile`, {
            method: "GET",
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
                setIsLoggedIn(true);
                setUser(data.user);
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUser(null);
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
            console.log(data);

            if (res.ok) {
                setIsLoggedIn(true);
                // Fetch user profile after login
                const profileRes = await fetch(`${API_URL}/auth/profile`, {
                    method: "GET",
                    credentials: "include",
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setUser(profileData.user);
                }
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "An error occurred. Please try again" };
        }
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading, login, user, updateUser }}>{children}</AuthContext.Provider>
    )

}

export default AuthProvider

export const useAuth = () => useContext(AuthContext);
