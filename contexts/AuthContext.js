"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {

    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [authMode, setAuthMode] = useState("login") // "login" or "otp"
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authUser, setauthUser] = useState(null)
    const [authToken, setauthToken] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [identifier, setIdentifier] = useState("") // Store email/phone for OTP verification

    // Check if user is already logged in by hitting a secure API route

    const fetchSession = async () => {
        try {
            const res = await fetch("/api/auth/session", {
                method: "GET",
            }) // Adjust to your endpoint
            if (res.ok) {
                const data = await res.json()
                if (data.userDataFromAPI && data.authToken) {
                    setauthUser(data.userDataFromAPI)
                    setauthToken(data.authToken)
                    setIsAuthenticated(true)
                    closeAuth();
                }
            }
        } catch (error) {
            console.error("Failed to fetch session:", error)
        } finally {
            setAuthLoading(false)
        }
    }

    useEffect(() => {
        fetchSession()
    }, [])

    const openAuth = (mode = "login") => {
        setAuthMode(mode)
        setIsAuthOpen(true)
    }

    const closeAuth = () => {
        setIsAuthOpen(false)
        setAuthMode("login")
        setIdentifier("")
    }

    const switchToOtp = (email) => {
        setAuthMode("otp")
        setIdentifier(email)
    }

    const login = () => {
        fetchSession();
        setIsAuthenticated(true)
    }

    const logout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            })

            if (!res.ok) throw new Error("Logout failed")

            const data = await res.json()
            if (!data.success) throw new Error(data.message || "Logout failed")
        } catch (error) {
            console.error("Error during logout:", error)
        }

        setauthUser(null)
        setauthToken(null)
        setIsAuthenticated(false)
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthOpen,
                authMode,
                isAuthenticated,
                authUser,
                authToken,
                authLoading,
                identifier,
                openAuth,
                closeAuth,
                switchToOtp,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
