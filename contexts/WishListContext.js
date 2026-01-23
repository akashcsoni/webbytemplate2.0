"use client";

import { themeConfig } from "@/config/theamConfig";
import { strapiGet, strapiPost, strapiPut } from "@/lib/api/strapiClient";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const WishListContext = createContext(undefined);

export function WishListProvider({ children }) {
  const pathname = usePathname();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [wishlistId, setWishListId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authUser, setAuthUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const isLoggedIn = isAuthenticated;
  const userId = authUser?.documentId || authUser?.id;
  const user_Id = authUser?.id;

  const cart_id = Cookies.get("cart_id");

  // Fetch auth session
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/app-auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.authUser && data.authToken) {
          setAuthUser(data.authUser);
          // setAuthToken(data.authToken)
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const getWishlistIdFromCookie = async () => {
    try {
      const res = await fetch("/api/wishlist-cookie");
      const data = await res.json();
      return data.wishlistId || null;
    } catch (err) {
      console.error("Error getting wishlist Id from cookie:", err);
      return null;
    }
  };

  const setWishlistIdInCookie = async (id) => {
    try {
      await fetch("/api/wishlist-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlistId: id }),
      });
    } catch (err) {
      console.error("Error setting wishlist ID:", err);
    }
  };

  // Helper to fetch full wishlist details by ID
  const fetchWishlistById = async (id) => {
    try {
      const token = themeConfig.TOKEN;
      const res = await strapiGet(`wishlists/${id}`, { token });
      if (res?.data) {
        setWishListId(res.data.id);
        setTotalPrice(res.data.totalPrice || 0);
        setWishlistItems(res.data.products || []);
        await setWishlistIdInCookie(res.data.id);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist by ID:", error);
    }
  };

  const initializeWishlist = async () => {
    setIsLoading(true);
    try {
      const existingWishlistId = await getWishlistIdFromCookie();
      const token = themeConfig.TOKEN;

      if (isLoggedIn) {
        try {
          const res = await strapiPost(`wishlist/${userId}`, {}, token);
          if (res?.data) {
            const { id, totalPrice, products } = res.data;
            setWishListId(id);
            setTotalPrice(totalPrice || 0);
            setWishlistItems(products || []);
            await setWishlistIdInCookie(id);
          } else {
            const newWishlistId = await createNewWishlist(true);
            if (newWishlistId) await fetchWishlistById(newWishlistId);
          }
        } catch {
          const newWishlistId = await createNewWishlist(true);
          if (newWishlistId) await fetchWishlistById(newWishlistId);
        }
      } else if (existingWishlistId) {
        try {
          const res = await strapiGet(`wishlists/${existingWishlistId}`, {
            token,
          });
          if (res?.data) {
            const { id, totalPrice, products } = res.data;
            setWishListId(id);
            setTotalPrice(totalPrice || 0);
            setWishlistItems(products || []);
            await setWishlistIdInCookie(id);
          } else {
            const newWishlistId = await createNewWishlist(false);
            if (newWishlistId) await fetchWishlistById(newWishlistId);
          }
        } catch {
          const newWishlistId = await createNewWishlist(false);
          if (newWishlistId) await fetchWishlistById(newWishlistId);
        }
      } else {
        const newWishlistId = await createNewWishlist(false);
        if (newWishlistId) await fetchWishlistById(newWishlistId);
      }
    } catch (err) {
      console.error("Wishlist init error:", err);
      setError("Failed to initialize wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      initializeWishlist();
    }
  }, [isLoggedIn, userId, authLoading, pathname]);

  // Listen for storage events to sync wishlist across tabs
  useEffect(() => {
    const handleStorageChange = async (e) => {
      // When wishlist is updated in another tab, refresh the wishlist
      if (e.key === "wishlistUpdated" && wishlistId) {
        // Small delay to ensure the server has processed the update
        setTimeout(async () => {
          await fetchWishlistById(wishlistId);
        }, 100);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [wishlistId]);

  const createNewWishlist = async (includeUser = false) => {
    try {
      const token = themeConfig.TOKEN;
      const payload = { products: [] };
      if (includeUser && userId) payload.user = userId;

      const res = await strapiPost("wishlists", payload, token);
      if (res?.data?.id) {
        return res.data.id;
      }
    } catch (err) {
      console.error("Error creating wishlist:", err);
      setError("Failed to create wishlist");
    }
    return null;
  };

  const addToWishlist = async (product) => {
    try {
      let currentId = wishlistId;

      // If no wishlist exists, create one
      if (!currentId) {
        currentId = await createNewWishlist(isLoggedIn);
        if (!currentId) {
          console.error("Failed to create new wishlist");
          return;
        }
        await fetchWishlistById(currentId);
      }

      if (!product) {
        console.error("Product data is missing");
        return;
      }

      // Always fetch the latest wishlist from server to avoid stale state across tabs
      let latestWishlistItems = [];
      try {
        const token = themeConfig.TOKEN;
        const res = await strapiGet(`wishlists/${currentId}`, { token });
        if (res?.data?.products) {
          latestWishlistItems = res.data.products;
        }
      } catch (fetchError) {
        console.warn("Failed to fetch latest wishlist, using local state:", fetchError);
        // Fallback to local state if fetch fails
        latestWishlistItems = wishlistItems;
      }

      // Normalize latest wishlist items
      const normalizedWishlist = latestWishlistItems.map((item) => ({
        product: item.product?.documentId || item.product?.id,
        extra_info:
          item.extra_info?.map((info) => ({
            price: info.price,
            license: info.license?.documentId || info.license?.id,
          })) || [],
      }));

      // Check if product already exists in wishlist
      const existingIndex = normalizedWishlist.findIndex(
        (item) =>
          item.product ===
          (product.product?.documentId ||
            product.product?.id ||
            product.product)
      );

      // Update or add the product
      if (existingIndex !== -1) {
        normalizedWishlist[existingIndex] = product;
      } else {
        normalizedWishlist.push(product);
      }

      // Prepare the wishlist data
      const wishlistData = {
        products: normalizedWishlist,
        ...(userId && { user: userId }),
      };


      // Update the wishlist
      const res = await strapiPut(
        `wishlists/${currentId}`,
        wishlistData,
        themeConfig.TOKEN
      );

      if (res?.data) {
        const { id, totalPrice, products } = res.data;
        setWishListId(id);
        setTotalPrice(totalPrice || 0);
        setWishlistItems(products || []);

        // Notify other tabs that wishlist has been updated
        try {
          localStorage.setItem("wishlistUpdated", Date.now().toString());
        } catch (e) {
          // Ignore localStorage errors (e.g., in incognito mode)
        }
      } else {
        console.error("Invalid response from wishlist update:", res);
        throw new Error("Failed to update wishlist");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError("Failed to add item to wishlist");
      throw err; // Re-throw to handle in the component
    }
  };

  const clearToWishlist = async () => {
    try {
      setIsLoading(true);

      let currentId = wishlistId;

      // If no wishlist exists, create one
      if (!currentId) {
        currentId = await createNewWishlist(isLoggedIn);
        if (!currentId) {
          console.error("Failed to create new wishlist");
          return;
        }
        await fetchWishlistById(currentId);
      }

      // Prepare the wishlist data
      const wishlistData = {
        products: [],
        ...(userId && { user: userId }),
      };


      // Update the wishlist
      const res = await strapiPut(
        `wishlists/${currentId}`,
        wishlistData,
        themeConfig.TOKEN
      );

      if (res?.data) {
        const { id, totalPrice, products } = res.data;
        setWishListId(id);
        setTotalPrice(totalPrice || 0);
        setWishlistItems(products || []);

        // Notify other tabs that wishlist has been updated
        try {
          localStorage.setItem("wishlistUpdated", Date.now().toString());
        } catch (e) {
          // Ignore localStorage errors (e.g., in incognito mode)
        }
      } else {
        console.error("Invalid response from wishlist update:", res);
        throw new Error("Failed to update wishlist");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError("Failed to add item to wishlist");
      throw err; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };

  const wishlistTocart = async () => {
    try {
      setIsLoading(true);

      const payload = {
        cart_id: cart_id,
        wishlist_id: wishlistId,
      };

      const res = await strapiPost(
        `wishlist/merge-cart`,
        payload,
        themeConfig.TOKEN
      );

      if (res?.result) {
        setWishListId(null);
        setTotalPrice(0);
        setWishlistItems([]);

        // Notify other tabs that wishlist has been updated
        try {
          localStorage.setItem("wishlistUpdated", Date.now().toString());
        } catch (e) {
          // Ignore localStorage errors (e.g., in incognito mode)
        }
      } else {
        console.error("Invalid response from wishlist update:", res);
        throw new Error("Failed to update wishlist");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError("Failed to add item to wishlist");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!wishlistId) return;

    if (productId) {
      const productData = {
        productId: productId,
      };

      try {
        const res = await strapiPost(
          `/wishlist-item-remove/${wishlistId}`,
          productData,
          themeConfig.TOKEN
        );
        if (res?.result && res?.data?.products) {
          const { id, totalPrice, products } = res?.data;
          setWishListId(id);
          setTotalPrice(totalPrice || 0);
          setWishlistItems(products || []);

          // Notify other tabs that wishlist has been updated
          try {
            localStorage.setItem("wishlistUpdated", Date.now().toString());
          } catch (e) {
            // Ignore localStorage errors (e.g., in incognito mode)
          }
        }
      } catch (err) {
        console.error("Error removing from wishlist:", err);
        setError("Failed to remove item from wishlist");
      }
    } else {
      console.error("Product Document Id Missing");
    }
  };

  return (
    <WishListContext.Provider
      value={{
        wishlistItems,
        wishlistId,
        totalPrice,
        isLoading,
        setIsLoading,
        error,
        isAuthenticated,
        authUser,
        addToWishlist,
        removeFromWishlist,
        clearToWishlist,
        wishlistTocart,
        fetchSession,
        initializeWishlist,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishListContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishListProvider");
  }
  return context;
}
