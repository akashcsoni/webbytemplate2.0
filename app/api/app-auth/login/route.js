import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const user = searchParams.get("user");

  if (!token && !user) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });

  const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  };

  if (token) {
    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      ...cookieOptions,
    });
  }

  if (user) {
    response.cookies.set({
      name: "authUser",
      value: user,
      httpOnly: true,
      ...cookieOptions,
    });
  }

  return response;
}

