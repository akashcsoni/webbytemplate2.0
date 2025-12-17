import { NextResponse } from "next/server";
import { isValidSlug } from "@/lib/utils/slugValidation";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Skip all processing for static files, API routes, and Next.js internal routes
  const hasFileExtension = pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|json|xml|txt|pdf|zip|woff|woff2|ttf|eot|html)$/);
  const isApiRoute = pathname.startsWith('/api');
  const isNextInternal = pathname.startsWith('/_next');
  const isFavicon = pathname.startsWith('/favicon');

  if (hasFileExtension || isApiRoute || isNextInternal || isFavicon) {
    return NextResponse.next();
  }

  // Validate URL patterns for product, category, and blog routes
  // Valid patterns (with trailing slash):
  // - /product/{slug}/
  // - /category/{slug}/
  // - /category/{slug}/{subslug}/
  // - /blog/{slug}/
  // - /blogs (static)
  // Note: pathname now has trailing slash after redirect above
  if (pathname.startsWith('/product/') || pathname.startsWith('/category/') || pathname.startsWith('/blog/')) {
    const pathSegments = pathname.split('/').filter(Boolean);

    // Check for invalid patterns
    let isInvalidPattern = false;

    if (pathname.startsWith('/product/')) {
      // /product/{slug}/ - exactly 2 segments (product, slug)
      // Invalid: /product/ or /product/{slug}/{anything}/
      if (pathSegments.length !== 2 || pathSegments[0] !== 'product') {
        isInvalidPattern = true;
      }
    } else if (pathname.startsWith('/category/')) {
      // /category/{slug}/ - exactly 2 segments (category, slug)
      // /category/{slug}/{subslug}/ - exactly 3 segments (category, slug, subslug)
      // Invalid: /category/ or /category/{slug}/{subslug}/{anything}/
      if (pathSegments.length < 2 || pathSegments.length > 3 || pathSegments[0] !== 'category') {
        isInvalidPattern = true;
      }
    } else if (pathname.startsWith('/blog/')) {
      // /blog/{slug}/ - exactly 2 segments (blog, slug)
      // /blogs is handled separately (static route)
      // Invalid: /blog/ or /blog/{slug}/{anything}/
      if (pathSegments.length !== 2 || pathSegments[0] !== 'blog') {
        isInvalidPattern = true;
      }
    }

    if (isInvalidPattern) {
      const notFoundUrl = new URL('/404', request.url);
      const response = NextResponse.rewrite(notFoundUrl);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }
  }

  // Validate slug format for dynamic routes to prevent invalid URLs from being crawled
  // This applies to all dynamic routes: /[pageSlug], /[pageSlug]/[itemSlug], /[pageSlug]/[itemSlug]/[categorySlug]
  const pathSegments = pathname.split('/').filter(Boolean);

  // Skip validation for static routes, API routes, and known static paths
  const isStaticRoute = pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname === '/' ||
    pathname === '/blogs' ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|json|xml|html)$/);

  // Skip slug validation for /search/ routes since search queries can contain spaces and special characters
  // Handle both with and without trailing slash
  const isSearchRoute = pathname.startsWith('/search/') || pathname === '/search';

  if (!isStaticRoute && !isSearchRoute && pathSegments.length > 0) {
    // Validate all path segments (slugs) in the URL
    // Decode URL-encoded characters (e.g., %20 for space) before validation
    const invalidSlugs = pathSegments.filter(slug => {
      try {
        // Decode URL-encoded characters (e.g., %20 -> space, %2B -> +)
        const decodedSlug = decodeURIComponent(slug);
        return !isValidSlug(decodedSlug);
      } catch (e) {
        // If decoding fails, treat as invalid
        return true;
      }
    });

    if (invalidSlugs.length > 0) {
      // Return proper 404 status for invalid slugs
      // This shows the PageNotFound component and prevents invalid URLs from being indexed
      const notFoundUrl = new URL('/404', request.url);
      const response = NextResponse.rewrite(notFoundUrl);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }
  }

  // Handle non-www redirect
  const isNonWww = request.nextUrl.hostname === 'webbytemplate.com';
  if (isNonWww) {
    return NextResponse.redirect(
      new URL(`https://www.webbytemplate.com${pathname}${request.nextUrl.search}`, request.url),
      301
    );
  }

  // Only apply authentication checks for /user/* routes
  const isUserPath = pathname.startsWith("/user/");
  const isThankYouPage = pathname.startsWith("/thank-you/");
  const urlWorkspace = isUserPath
    ? url.pathname.split("/user/")[1]?.split("/")[0]
    : null;

  // Get cookies
  const accessToken = request.cookies.get("authToken")?.value || null;
  const userData = request.cookies.get("authUser")?.value || null;

  let documentId = null;
  let isLogin = false;
  let apiValidation = null;
  let position = false; // default

  if (isThankYouPage && !accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // for checkout test

  if (pathname.startsWith("/checkout")) {
    const cartFlag = request.cookies.get("cartHasItems")?.value;
    if (!cartFlag || cartFlag === "false") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }


  if (isUserPath) {
    isLogin = Boolean(accessToken && userData);

    try {
      if (userData) {
        const parsedUser = JSON.parse(userData);
        documentId = parsedUser?.documentId || parsedUser?.id || null;
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

          if (apiValidation?.documentId || apiValidation?.id) {
            documentId = apiValidation.documentId || apiValidation.id;
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
      isLogin && documentId && urlWorkspace && documentId !== urlWorkspace;

    if (notValidWorkspace) {
      return NextResponse.redirect(
        new URL(`/user/${documentId}/dashboard`, request.url)
      );
    }

    // Redirect base /user path to dashboard if logged in
    if (
      (pathname === "/user" ||
        pathname === "/user/" ||
        pathname === `/user/${documentId}` ||
        pathname === `/user/${documentId}/`) &&
      isLogin
    ) {
      return NextResponse.redirect(
        new URL(`/user/${documentId}/dashboard`, request.url)
      );
    }

    // If not logged in, block access to /user/* paths
    if (!isLogin) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    // Author-only route restriction
    const authorOnlyPaths = ["dashboard", "products", "paymentTax"];

    const isRestrictedForBuyer = authorOnlyPaths.some((segment) =>
      pathname.includes(`/user/${documentId}/${segment}`)
    );

    if (position !== true && isRestrictedForBuyer) {
      return NextResponse.redirect(
        new URL(`/user/${documentId}/setting`, request.url)
      );
    }

    // Check if user is trying to access become-an-author page
    // Handle both with and without trailing slash, and check if user is already an author
    const isBecomeAuthorPath = pathname.includes('/become-an-author');
    const isAuthorTryingToBecomeAuthor = position === true && isBecomeAuthorPath;

    if (isAuthorTryingToBecomeAuthor && documentId) {
      // Redirect to authenticated user's dashboard
      return NextResponse.redirect(
        new URL(`/user/${documentId}/dashboard`, request.url)
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)",
  ],
};