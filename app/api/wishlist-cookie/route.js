import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
}

export async function GET() {
    const cookieStore = await cookies()
    const wishlistId = cookieStore.get("wishlist_id")?.value || null

    return NextResponse.json({ wishlistId })
}

export async function POST(request) {
    const { wishlistId } = await request.json()

    // Set the cookie
    const response = NextResponse.json({ success: true })

    // Set cookie with 30-day expiration

    response.cookies.set({
        name: "wishlist_id",
        value: wishlistId,
        httpOnly: true, // Protect this token
        ...cookieOptions,
    })

    return response
}

export async function DELETE() {
    // Delete the cookie
    const response = NextResponse.json({ success: true })

    response.cookies.delete("wishlist_id")

    return response
}
