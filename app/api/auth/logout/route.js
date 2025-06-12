import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    try {
        const cookieStore = await cookies()

        cookieStore.delete('authToken')
        cookieStore.delete('authUser')
        cookieStore.delete('cart_id')
        cookieStore.delete('wishlist_id')

        return NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json(
            { success: false, message: "Failed to logout" },
            { status: 500 }
        )
    }
}