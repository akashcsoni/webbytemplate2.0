'use client'
import { useEffect } from "react";
import { Image } from "@heroui/react";

export default function PageLoader() {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="overflow-hidden absolute top-0 left-0 z-50">
            <div className="min-h-screen min-w-[100vw] bg-primary flex items-center justify-center overflow-hidden">
                <Image
                    src="/logo/only-logo.svg"
                    width="140"
                    height="140"
                    className="animate-zoom"
                />
            </div>
        </div>
    );
}