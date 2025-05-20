"use client"

import { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"

const AuthContext = createContext(undefined)

// Cookie options
const COOKIE_OPTIONS = {
    expires: 7, // 7 days
    path: "/",
    sameSite: "strict",
}

export function AuthProvider({ children }) {
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [authMode, setAuthMode] = useState("login") // "login" or "otp"
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [identifier, setIdentifier] = useState("") // Store email/phone for OTP verification

    // Check if user is already logged in on mount
    useEffect(() => {
        const token = Cookies.get("auth_token")
        const userData = Cookies.get("user_data")

        if (token && userData) {
            try {
                setUser(JSON.parse(userData))
                setIsAuthenticated(true)
            } catch (error) {
                console.error("Error parsing user data:", error)
                // Clear invalid data
                Cookies.remove("auth_token")
                Cookies.remove("user_data")
            }
        }

        setLoading(false)
    }, [])

    const openAuth = (mode = "login") => {
        setAuthMode(mode)
        setIsAuthOpen(true)
    }

    const closeAuth = () => {
        setIsAuthOpen(false)
        // Reset state when modal is closed
        setAuthMode("login")
        setIdentifier("")
    }

    const switchToOtp = (email) => {
        setAuthMode("otp")
        setIdentifier(email)
    }

    // Login function
    const login = (userData, token) => {
        // Store token in cookie
        Cookies.set("auth_token", token, COOKIE_OPTIONS)

        // Store user data in cookie (as JSON string)
        Cookies.set("user_data", JSON.stringify(userData), COOKIE_OPTIONS)

        // Update state
        setUser(userData)
        setIsAuthenticated(true)
        closeAuth()
    }

    // Logout function
    const logout = () => {
        // Remove cookies
        Cookies.remove("auth_token")
        Cookies.remove("user_data")

        // Update state
        setUser(null)
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthOpen,
                authMode,
                isAuthenticated,
                user,
                loading,
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
