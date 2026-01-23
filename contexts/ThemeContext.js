"use client"

import { themeConfig } from "@/config/theamConfig"
import { strapiGet } from "@/lib/api/strapiClient"
import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext(undefined)

export function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [cartId, setCartId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [authUser, setAuthUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const isLoggedIn = isAuthenticated
    const userId = authUser?.documentId || authUser?.id

    // Fetch auth session
    const fetchSession = async () => {
        try {
            const res = await fetch("/api/app-auth/session")
            if (res.ok) {
                const data = await res.json()
                if (data.authUser && data.authToken) {
                    setAuthUser(data.authUser)
                    // setAuthToken(data.authToken)
                    setIsAuthenticated(true)
                }
            }
        } catch (error) {
            console.error("Failed to fetch session:", error)
        } 
    }

    const getCartIdFromCookie = async () => {
        try {
            const res = await fetch("/api/cart-cookie")
            const data = await res.json()
            return data.cartId || null
        } catch (err) {
            console.error("Error getting cart ID from cookie:", err)
            return null
        }
    }

    const setCartIdInCookie = async (id) => {
        try {
            await fetch("/api/cart-cookie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartId: id }),
            })
        } catch (err) {
            console.error("Error setting cart ID:", err)
        }
    }

    // Helper to fetch full cart details by ID
    const fetchCartById = async (id) => {
        try {
            const token = themeConfig.TOKEN
            const res = await strapiGet(`carts/${id}`, { token })
            if (res?.data) {
                setCartId(res.data.id)
                setTotalPrice(res.data.totalPrice || 0)
                setCartItems(res.data.products || [])
                await setCartIdInCookie(res.data.id)
            }
        } catch (error) {
            console.error("Failed to fetch cart by ID:", error)
        }
    }

    const initializeCart = async () => {
        setIsLoading(true)
        try {
            const existingCartId = await getCartIdFromCookie()
            const token = themeConfig.TOKEN

            if (isLoggedIn) {
                try {
                    const res = await strapiPost(`cart/${userId}`, {}, token)
                    if (res?.data) {
                        const { id, totalPrice, products } = res.data
                        setCartId(id)
                        setTotalPrice(totalPrice || 0)
                        setCartItems(products || [])
                        await setCartIdInCookie(id)
                    } else {
                        const newCartId = await createNewCart(true)
                        if (newCartId) await fetchCartById(newCartId)
                    }
                } catch {
                    const newCartId = await createNewCart(true)
                    if (newCartId) await fetchCartById(newCartId)
                }
            } else if (existingCartId) {
                try {
                    const res = await strapiGet(`carts/${existingCartId}`, { token })
                    if (res?.data) {
                        const { id, totalPrice, products } = res.data
                        setCartId(id)
                        setTotalPrice(totalPrice || 0)
                        setCartItems(products || [])
                        await setCartIdInCookie(id)
                    } else {
                        const newCartId = await createNewCart(false)
                        if (newCartId) await fetchCartById(newCartId)
                    }
                } catch {
                    const newCartId = await createNewCart(false)
                    if (newCartId) await fetchCartById(newCartId)
                }
            } else {
                const newCartId = await createNewCart(false)
                if (newCartId) await fetchCartById(newCartId)
            }
        } catch (err) {
            console.error("Cart init error:", err)
            setError("Failed to initialize cart")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ThemeContext.Provider
            value={{
                cartItems,
                cartId,
                totalPrice,
                isLoading,
                error,
                isAuthenticated,
                authUser,
                openCart,
                closeCart,
                toggleCart,
                addToCart,
                removeFromCart,
                fetchSession,
                initializeCart
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a CartProvider")
    }
    return context
}
