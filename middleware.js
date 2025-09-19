import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Only apply authentication checks for /user/* routes
  const isUserPath = pathname.startsWith("/user/");
  const isThankYouPage = pathname.startsWith("/thank-you/");
  const urlWorkspace = isUserPath
    ? url.pathname.split("/user/")[1]?.split("/")[0]
    : null;

  // Get cookies
  const accessToken = request.cookies.get("authToken")?.value || null;
  const userData = request.cookies.get("authUser")?.value || null;

  let username = null;
  let isLogin = false;
  let apiValidation = null;
  let position = false; // default

  if (isThankYouPage && !accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isUserPath) {
    isLogin = Boolean(accessToken && userData);

    try {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        username = parsedUser?.username || null;
        position = parsedUser?.author || false;
      }
    } catch (err) {
      console.error("Invalid JSON in authUser cookie:", err);
    }

    // Call API to validate token and get additional user data
    if (accessToken && isLogin) {
      try {
        const apiResponse = await fetch(
          `https://studio.webbytemplate.com/api/users/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (apiResponse.ok) {
          apiValidation = await apiResponse.json();
          isLogin = apiValidation ? true : false;

          if (apiValidation?.username) {
            username = apiValidation.username;
          }

          if (apiValidation?.author) {
            position = apiValidation?.author;
          }
        } else {
          // Token is invalid
          isLogin = false;
          const response = NextResponse.redirect(new URL(`/`, request.url));
          response.cookies.delete("authToken");
          response.cookies.delete("authUser");
          return response;
        }
      } catch (error) {
        console.error("API validation error:", error);
        isLogin = Boolean(accessToken && userData);
      }
    }

    // Redirect if logged in user is accessing another user's workspace
    const notValidWorkspace =
      isLogin && username && urlWorkspace && username !== urlWorkspace;

    if (notValidWorkspace) {
      return NextResponse.redirect(
        new URL(`/user/${username}/dashboard`, request.url)
      );
    }

    // Redirect base /user path to dashboard if logged in
    if (
      (pathname === "/user" ||
        pathname === "/user/" ||
        pathname === `/user/${username}` ||
        pathname === `/user/${username}/`) &&
      isLogin
    ) {
      return NextResponse.redirect(
        new URL(`/user/${username}/dashboard`, request.url)
      );
    }

    // If not logged in, block access to /user/* paths
    if (!isLogin) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    // Author-only route restriction
    const authorOnlyPaths = ["dashboard", "products", "paymentTax"];

    const isRestrictedForBuyer = authorOnlyPaths.some((segment) =>
      pathname.includes(`/user/${username}/${segment}`)
    );

    if (position !== true && isRestrictedForBuyer) {
      return NextResponse.redirect(
        new URL(`/user/${username}/setting`, request.url)
      );
    }

    const isAuthorTryingToBecomeAuthor =
      position === true && pathname === `/user/${username}/become-an-author`;

    if (isAuthorTryingToBecomeAuthor) {
      return NextResponse.redirect(
        new URL(`/user/${username}/dashboard`, request.url)
      );
    }
  }

  // Add custom headers with API validation results
  const response = NextResponse.next();

  if (apiValidation) {
    response.headers.set("X-User-Validated", "true");
    response.headers.set("X-User-ID", apiValidation.user?.id || "");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
