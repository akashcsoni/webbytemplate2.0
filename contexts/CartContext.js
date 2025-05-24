"use client"

import { themeConfig } from "@/config/theamConfig"
import { strapiDelete, strapiGet, strapiPost, strapiPut } from "@/lib/api/strapiClient"
import { usePathname } from "next/navigation"
import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
    const pathname = usePathname()

    const [isCartOpen, setIsCartOpen] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [cartId, setCartId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [authUser, setAuthUser] = useState(null)
    const [authToken, setAuthToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)

    const isLoggedIn = isAuthenticated
    const userId = authUser?.documentId || authUser?.id

    // Fetch auth session
    const fetchSession = async () => {
        try {
            const res = await fetch("/api/auth/session")
            if (res.ok) {
                const data = await res.json()
                if (data.authUser && data.authToken) {
                    setAuthUser(data.authUser)
                    setAuthToken(data.authToken)
                    setIsAuthenticated(true)
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
    }, [pathname])

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
            const token = authToken || themeConfig.TOKEN
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
            const token = authToken || themeConfig.TOKEN

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

    useEffect(() => {
        if (!authLoading) {
            initializeCart()
        }
    }, [isLoggedIn, userId, authLoading, pathname])

    const createNewCart = async (includeUser = false) => {
        try {
            const token = authToken || themeConfig.TOKEN
            const payload = { products: [] }
            if (includeUser && userId) payload.user = userId

            const res = await strapiPost("carts", payload, token)
            if (res?.data?.id) {
                // Return the new cart ID for further fetching
                return res.data.id
            }
        } catch (err) {
            console.error("Error creating cart:", err)
            setError("Failed to create cart")
        }
        return null
    }

    const addToCart = async (product) => {
        try {
            let currentId = cartId
            if (!currentId) {
                currentId = await createNewCart(isLoggedIn)
                if (!currentId) return
                await fetchCartById(currentId)
            }
            const cartData = {
                products: [product]
            }

            if (userId) {
                cartData.user = userId
            }

            console.log(cartData, 'cartData')
            console.log(cartItems, 'cartItems')

            // const res = await strapiPut(`carts/${currentId}`, cartData, authToken || themeConfig.TOKEN)
            // if (res?.data?.result && res?.data?.products) setCartItems(res.products)

            // if (res?.data?.result && res?.data?.products) {
            //     const { id, totalPrice, products } = res?.data
            //     setCartId(id)
            //     setTotalPrice(totalPrice || 0)
            //     setCartItems(products || [])
            // }
        } catch (err) {
            console.error("Error adding to cart:", err)
            setError("Failed to add item to cart")
        }
    }

    const removeFromCart = async (productId) => {
        if (!cartId) return
        try {
            const res = await strapiDelete(`carts/${cartId}/remove-product/${productId}`, authToken || themeConfig.TOKEN)
            if (res?.products) setCartItems(res.products)
        } catch (err) {
            console.error("Error removing from cart:", err)
            setError("Failed to remove item from cart")
        }
    }

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isCartOpen)
    }, [isCartOpen])

    const openCart = () => setIsCartOpen(true)
    const closeCart = () => setIsCartOpen(false)
    const toggleCart = () => setIsCartOpen((prev) => !prev)

    return (
        <CartContext.Provider
            value={{
                isCartOpen,
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
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
