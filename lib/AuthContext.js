"use client";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Directly set initial values from localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("isLogin") === "true";
        }
        return false;
    });

    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            const mobile = localStorage.getItem("mobileNumber");
            return mobile ? { mobile } : null;
        }
        return null;
    });

    const [showLoginModal, setShowLoginModal] = useState(false);

    const login = (mobileNumber) => {
        setUser({ mobile: mobileNumber });
        setIsLoggedIn(true);
        setShowLoginModal(false);

        localStorage.setItem("mobileNumber", mobileNumber);
        localStorage.setItem("isLogin", "true");
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);

        localStorage.removeItem("mobileNumber");
        localStorage.removeItem("isLogin");
    };

    const openLoginModal = () => {
        setShowLoginModal(true);
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                showLoginModal,
                login,
                logout,
                openLoginModal,
                closeLoginModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);