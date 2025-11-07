import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: '404 - Page Not Found | WebbyTemplate',
    description: 'The page you are looking for does not exist.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function GlobalNotFound() {
    return <div className="container">
        <div className="flex flex-col items-center justify-center text-center w-full h-full lg:pt-[50px] lg:pb-[100px] sm:pt-10 pt-7 sm:pb-20 pb-10">
            <Image
                src="/images/404.png"
                width="400"
                height="400"
                alt="404-Page Not Found"
                className="2xl:mb-[35px] lg:mb-[25px] md:mb-4 sm:mb-3 mb-2 2xl:w-[400px] 2xl:h-[400px] lg:w-[350px] lg:h-[350px] md:w-[300px] md:h-[300px] sm:w-[250px] sm:h-[250px] w-[200px] h-[200px]"
            />
            <h2 className="2xl:mb-[18px] lg:mb-[10px] md:mb-2 mb-1.5">
                Oops! Page Not Found
            </h2>
            <p className="2xl:mb-[38px] mb-[20px] w-[484px] max-w-full">
                The page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link href="/" className="btn btn-primary">
                Go back home
            </Link>
        </div>
    </div>;
};

