"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
    useEffect(() => {
        // Add noindex meta tags to prevent search engines from indexing 404 pages
        const robotsMeta = document.querySelector('meta[name="robots"]');
        const googlebotMeta = document.querySelector('meta[name="googlebot"]');
        
        if (robotsMeta) {
            robotsMeta.setAttribute('content', 'noindex, nofollow');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'robots';
            meta.content = 'noindex, nofollow';
            document.head.appendChild(meta);
        }
        
        if (googlebotMeta) {
            googlebotMeta.setAttribute('content', 'noindex, nofollow');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'googlebot';
            meta.content = 'noindex, nofollow';
            document.head.appendChild(meta);
        }
        
        // Update page title
        document.title = '404 - Page Not Found | WebbyTemplate';
    }, []);

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            if (typeof document !== 'undefined') {
                                let robotsMeta = document.querySelector('meta[name="robots"]');
                                if (!robotsMeta) {
                                    robotsMeta = document.createElement('meta');
                                    robotsMeta.name = 'robots';
                                    document.head.appendChild(robotsMeta);
                                }
                                robotsMeta.content = 'noindex, nofollow';
                                
                                let googlebotMeta = document.querySelector('meta[name="googlebot"]');
                                if (!googlebotMeta) {
                                    googlebotMeta = document.createElement('meta');
                                    googlebotMeta.name = 'googlebot';
                                    document.head.appendChild(googlebotMeta);
                                }
                                googlebotMeta.content = 'noindex, nofollow';
                            }
                        })();
                    `,
                }}
            />
            <div className="container">
                <div className="flex flex-col items-center justify-center text-center w-full h-full lg:pt-[50px] lg:pb-[100px] sm:pt-10 pt-7 sm:pb-20 pb-10">
                <Image
                    src="/images/404.png"
                    width="400"
                    height="400"
                    alt="404-Page Not Found"
                    className="2xl:mb-[35px] lg:mb-[25px] md:mb-4 sm:mb-3 mb-2 2xl:w-[400px] 2xl:h-[400px] lg:w-[350px] lg:h-[350px] md:w-[300px] md:h-[300px] sm:w-[250px] sm:h-[250px] w-[200px] h-[200px]"
                />
                <h1 className="2xl:mb-[18px] lg:mb-[10px] md:mb-2 mb-1.5">
                    Oops! Page Not Found
                </h1>
                <p className="2xl:mb-[38px] mb-[20px] w-[484px] max-w-full">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link href="/" className="btn btn-primary">
                    Go back home
                </Link>
                </div>
            </div>
        </>
    );
};

