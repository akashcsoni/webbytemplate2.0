import { IP_API_URL, themeConfig, TRACKING_API_URL } from "@/config/theamConfig";

/**
 * ✅ Generic tracking function (used internally by all events)
 */
async function trackEvent({
  user_id = null,
  action,
  message,
  referer = "",
}) {
  // Skip tracking in development/localhost mode
  const hostname = window.location.hostname;
  const isDevelopment = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.0.') ||
    hostname.includes('localhost');
  
  if (isDevelopment) {
    console.log('🚫 Tracking skipped (development mode):', { action, message });
    return;
  }

  try {
    const current_url = window.location.href;
    const finalReferer = referer || document.referrer || "";

    // Fetch public IP
    const ipRes = await fetch(IP_API_URL);
    const ipData = await ipRes.json();

    // Fallback to guest_id if no user logged in
    const guest_id = user_id ? "0" : getGuestId();

    const data = {
      guest_id,
      ip_address: ipData.ip || "",
      referer: finalReferer,
      current_url,
      action,
      message,
      user_id: user_id || null,
    };

    const res = await fetch(TRACKING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${themeConfig.TOKEN}`,
      },
      body: JSON.stringify({ data }),
    });

    if (!res.ok) {
      console.error("Failed to track event:", await res.text());
    }
  } catch (err) {
    console.error("Tracking error:", err);
  }
}

/**
 * ✅ Track when user views a page
 */
export async function trackPageView({
  user_id = null,
  action = "page_view",
  message = "User viewed a page",
  referer = "",
}) {
  await trackEvent({ user_id, action, message, referer });
}

/**
 * ✅ Track when user adds an item to the cart
 */
export async function trackAddToCart({ user_id = null, product_id }) {
  const action = "add_to_cart";
  const message = `Item added to cart ${product_id}`;
  await trackEvent({ user_id, action, message });
}

/**
 * ✅ (Optional) Track when user removes an item from cart
 */
export async function trackRemoveFromCart({ user_id = null, product_id }) {
  const action = "remove_from_cart";
  const message = `Item removed from cart ${product_id}`;
  await trackEvent({ user_id, action, message });
}

// for user checkout

export async function trackCheckout({ user_id = null }) {
  const action = "checkout";
  const message = "User checkout for product";
  await trackEvent({ user_id, action, message });
}

/**
 * ✅ Track when user successfully places an order
 */
export async function trackOrderPlaced({ user_id = null }) {
  const action = "order_place";
  const message = "Order placed successfully";
  const current_url = window.location.href;
  await trackEvent({ user_id, action, message, referer: current_url });
}

/**
 * ✅ Helper: store guest ID persistently for anonymous users
 */
function getGuestId() {
  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }
  return guestId;
}
