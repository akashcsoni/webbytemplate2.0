import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies(); // ✅ Await is necessary here
    const authTokenCookie = cookieStore.get("authToken");
    const authUserCookie = cookieStore.get("authUser");

    if (authTokenCookie && authUserCookie) {
        try {
            const authToken = decodeURIComponent(authTokenCookie.value);
            const authUser = JSON.parse(decodeURIComponent(authUserCookie.value));

            const res = await fetch("https://studio.webbytemplate.com/api/users/me?populate=*", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch user data from external API");
            }

            const userData = await res.json();

            return NextResponse.json(
                {
                    authToken,
                    authUser,
                    userDataFromAPI: userData,
                },
                { status: 200 }
            );
        } catch (e) {
            return NextResponse.json(
                { error: "Invalid user data or API error", message: e.message },
                { status: 400 }
            );
        }
    } else {
        return NextResponse.json(
            { authUser: null, authToken: null, error: "authUser & authToken not found" },
            { status: 200 }
        );
    }
}
