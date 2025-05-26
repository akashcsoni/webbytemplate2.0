import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
    const cookieStore = await cookies()  // ✅ Await this
    const authTokenCookie = cookieStore.get("authToken")
    const authUserCookie = cookieStore.get("authUser")

    if (authTokenCookie && authUserCookie) {
        try {
            const authToken = decodeURIComponent(authTokenCookie.value)
            const authUser = JSON.parse(decodeURIComponent(authUserCookie.value))

            return NextResponse.json({ authToken, authUser }, { status: 200 })
        } catch (e) {
            return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
        }
    } else {
        return NextResponse.json(
            { authUser: null, authToken: null, error: "authUser & authToken not found" },
            { status: 200 }
        )
    }
}