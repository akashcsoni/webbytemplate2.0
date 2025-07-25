"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";
import { WishListProvider } from "@/contexts/WishListContext";

export function Providers({ children }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <Toaster position="top-right" />
      <AuthProvider>
        <CartProvider>
          <WishListProvider>
            {children}
          </WishListProvider>
        </CartProvider>
      </AuthProvider>
    </HeroUIProvider>
  );
}

