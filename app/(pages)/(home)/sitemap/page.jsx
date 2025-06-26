import { Link } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="container">
      <div className="flex items-center justify-start gap-[10px] mt-[18px] mb-5">
        <p className="p2 !text-primary">Home</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <g clipPath="url(#clip0_5255_184)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.20444 4.99981L0.664062 1.46056L1.46056 0.664062L5.79519 4.99981L1.46056 9.33556L0.664062 8.54019L4.20444 4.99981ZM7.57944 4.99981L4.03906 1.46056L4.83556 0.664062L9.17019 4.99981L4.83556 9.33556L4.03906 8.54019L7.57944 4.99981Z"
              fill="#505050"
            />
          </g>
        </svg>
        <p className="p2">Site Map</p>
      </div>

      <div className="lg:mb-[100px] md:mb-[90px] sm:mb-20 mb-10">
        <h1 className="h2 lg:mb-[18px] mb-3">Site Map</h1>
        <p>
          Get Where You Want to Go and Maximize Your Site Exploration: Our HTML
          Sitemap is Your Ultimate Guide to Site Navigation
        </p>

        <div className="grid min-[500px]:grid-cols-2 grid-cols-1 w-full 1xl:mt-[60px] lg:mt-12 sm:mt-10 mt-6 gap-5">
          <div>
            <h3 className="1xl:mb-[22px] sm:mb-4 mb-2">Product Categories</h3>
            <div className="flex flex-col items-start">
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 1xl:mb-7 mb-3">
                {["HTML Templates", "Bootstrap", "TailwindCSS", "Email"].map(
                  (item) => (
                    <li
                      key={item}
                      className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                    >
                      <a href="#" className="hover:text-primary">
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 1xl:mb-7 mb-3">
                {["UI Templates", "Figma", "XD template"].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 1xl:mb-7 mb-3">
                {["Plugins", "Wordpress", "Woocommerce"].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 1xl:mb-7 mb-3">
                {["Headless Templates", "Next.js"].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 1xl:mb-7 mb-3">
                {["Themes", "Ghost Themes"].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="1xl:mb-[22px] sm:mb-4 mb-2">Company</h3>
            <div className="flex flex-col items-start">
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 1xl:mb-7 mb-3">
                {[
                  "My Account",
                  "Account Information",
                  "Password",
                  "Address",
                  "Orders",
                  "Downloads",
                ].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 mb-3">
                {["View Cart"].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 mb-3">
                {["Checkout"].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1 mb-3">
                {["Search"].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="site-map 1xl:space-y-3 sm:space-y-[10px] space-y-1">
                {[
                  "Information",
                  "Terms & Conditions",
                  "About Us",
                  "Privacy Policy",
                  "Contact Us",
                  "Blog",
                ].map((item) => (
                  <li
                    key={item}
                    className="relative pl-5 ml-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[13px] before:h-[13px] before:rounded-full before:border before:border-primary"
                  >
                    <a href="#" className="hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
