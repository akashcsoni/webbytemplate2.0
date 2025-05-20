"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            title: "Orion: Construction Company Figma UI Template Kit",
            price: 129,
            image: "/images/orion.png",
        },
        {
            id: 2,
            title: "Diazelo: Fashion & Clothing eCommerce XD Template",
            price: 79,
            image: "/images/diazelo.png",
        },
        {
            id: 3,
            title: "Syndicate: Business Consulting HTML Website Template",
            price: 56,
            image: "/images/syndicate.png",
        },
        {
            id: 4,
            title: "Journeya: Travel Agency HTML Website Template",
            price: 149,
            image: "/images/journeya.png",
        },
    ])

    const openCart = () => setIsCartOpen(true)
    const closeCart = () => setIsCartOpen(false)
    const toggleCart = () => setIsCartOpen((prev) => !prev)

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)

    // Handle body overflow when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.classList.add("overflow-hidden")
        } else {
            document.body.classList.remove("overflow-hidden")
        }
    }, [isCartOpen])

    return (
        <CartContext.Provider
            value={{
                isCartOpen,
                cartItems,
                subtotal,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
