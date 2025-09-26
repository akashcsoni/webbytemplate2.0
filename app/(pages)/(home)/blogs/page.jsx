"use client";

import { Button } from "@heroui/react";
import React from "react";

const Page = () => {
  return (
    <div>
      <div className="lg:py-12 md:py-10 py-8">
        <div className="container">
          <div className="2xl:pb-10 2xl:mb-10 xl:pb-8 xl:mb-8 md:pb-7 md:mb-7 pb-6 mb-6 border-b border-[#00193E1A]">
            <h1 className="h2 lg:mb-[18px] mb-3">
              Welcome to WebbyTemplate Blogs
            </h1>
            <div className="relative flex items-center mb-5 border border-gray-100 rounded-[5px] overflow-hidden">
              <input
                type="text"
                placeholder="Find posts, tips or tutorials…"
                className="w-full rounded-l px-4 outline-none lg:h-10 h-9 p2"
              />
              <button className="bg-[#0156d5] text-white lg:py-3 py-2.5 px-[18px] rounded-r flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </button>
            </div>
            <div className="sm:space-y-[15px] space-y-[10px]">
              <p className="text-[#505050] leading-relaxed 2xl:text-lg 1xl:text-[17px] md:text-base text-sm">
                Exploring the intersection of design and technology through
                expert insights, template breakdowns, and creative inspiration
                for modern web builders.
              </p>
              <p className="text-[#505050] leading-relaxed 2xl:text-lg 1xl:text-[17px] md:text-base text-sm">
                Dive into the creative ecosystem that powers exceptional web
                experiences. Our blog serves as your comprehensive resource for
                staying ahead in the rapidly evolving world of digital design
                and development, where innovative templates meet cutting-edge
                technology.
              </p>
              <p className="text-[#505050] leading-relaxed 2xl:text-lg 1xl:text-[17px] md:text-base text-sm">
                Whether you're a seasoned developer, an aspiring designer, or an
                entrepreneur building your digital presence, this is your
                destination for actionable insights, behind-the-scenes stories
                from our global community of creators, and the latest trends
                shaping the future of web design.
              </p>
              <p className="text-[#505050] leading-relaxed 2xl:text-lg 1xl:text-[17px] md:text-base text-sm">
                Join thousands of creative professionals who turn to
                WebbyTemplate Blogs for inspiration, technical guidance, and
                industry expertise that transforms ideas into stunning digital
                realities.
              </p>
            </div>
          </div>

          <h3 className="lg:mb-6 mb-4">Explore Our Categories:</h3>
          <div className="flex flex-wrap lg:gap-4 sm:gap-[10px] gap-2 2xl:mb-10 xl:mb-9 md:mb-8 mb-6">
            <Button className="btn black-btn flex w-fit h-fit">
              Template Deep Dives
            </Button>
            <Button className="btn black-btn flex w-fit h-fit">
              Tech Insights
            </Button>
            <Button className="btn black-btn flex w-fit h-fit">
              Creative Process
            </Button>
            <Button className="btn black-btn flex w-fit h-fit">
              Success Stories
            </Button>
            <Button className="btn black-btn flex w-fit h-fit">
              Market Trends
            </Button>
          </div>

          {/* Product Section with HTML design */}
          <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-x-8 lg:gap-y-10 md:gap-x-7 gap-x-5 md:gap-y-[30px] gap-y-6">
            <div className="group relative">
              <a href="/product/yummy-restaurants-and-food-html-website-template">
                <div className="cursor-pointer relative rounded-lg overflow-hidden lg:mb-[22px] md:mb-[18px] mb-[14px] transition-transform duration-300 group-hover:shadow-lg border border-primary/10">
                  <img
                    alt="Yummy"
                    loading="lazy"
                    width={270}
                    height={345}
                    decoding="async"
                    className="w-full h-auto"
                    src="../images/blog-banner-1.webp"
                    style={{ color: "transparent" }}
                  />
                </div>
              </a>
              <div>
                <div className="flex flex-wrap justify-start md:gap-[10px] gap-[8px] lg:mb-4 md:mb-[14px] mb-2">
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>All Articles</span>
                  </span>
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>Community Voices</span>
                  </span>
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>Testimonials</span>
                  </span>
                </div>
                <h5 className="1xl:mb-4 lg:mb-3 mb-[10px]">
                  Building Trust: The Impact of Customer Testimonials in Metals
                  Marketing
                </h5>
                <div className="flex items-center gap-[10px]">
                  <div className="1xl:w-8 1xl:h-8 lg:w-[30px] lg:h-[30px] w-7 h-7 rounded-full overflow-hidden">
                    <img
                      src="../images/place_holder.png"
                      alt="logo"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="p2">Template Insight - Aug 17, 2025</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <a href="/product/yummy-restaurants-and-food-html-website-template">
                <div className="cursor-pointer relative rounded-lg overflow-hidden lg:mb-[22px] md:mb-[18px] mb-[14px] transition-transform duration-300 group-hover:shadow-lg border border-primary/10">
                  <img
                    alt="Yummy"
                    loading="lazy"
                    width={270}
                    height={345}
                    decoding="async"
                    className="w-full h-auto"
                    src="../images/blog-banner-1.webp"
                    style={{ color: "transparent" }}
                  />
                </div>
              </a>
              <div>
                <div className="flex flex-wrap justify-start md:gap-[10px] gap-[8px] lg:mb-4 md:mb-[14px] mb-2">
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>All Articles</span>
                  </span>
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>Community Voices</span>
                  </span>
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>Testimonials</span>
                  </span>
                </div>
                <h5 className="1xl:mb-4 lg:mb-3 mb-[10px]">
                  Building Trust: The Impact of Customer Testimonials in Metals
                  Marketing
                </h5>
                <div className="flex items-center gap-[10px]">
                  <div className="1xl:w-8 1xl:h-8 lg:w-[30px] lg:h-[30px] w-7 h-7 rounded-full overflow-hidden">
                    <img
                      src="../images/place_holder.png"
                      alt="logo"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="p2">Template Insight - Aug 17, 2025</p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <a href="/product/yummy-restaurants-and-food-html-website-template">
                <div className="cursor-pointer relative rounded-lg overflow-hidden lg:mb-[22px] md:mb-[18px] mb-[14px] transition-transform duration-300 group-hover:shadow-lg border border-primary/10">
                  <img
                    alt="Yummy"
                    loading="lazy"
                    width={270}
                    height={345}
                    decoding="async"
                    className="w-full h-auto"
                    src="../images/blog-banner-1.webp"
                    style={{ color: "transparent" }}
                  />
                </div>
              </a>
              <div>
                <div className="flex flex-wrap justify-start md:gap-[10px] gap-[8px] lg:mb-4 md:mb-[14px] mb-2">
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>All Articles</span>
                  </span>
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>Community Voices</span>
                  </span>
                  <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                    <span>Testimonials</span>
                  </span>
                </div>
                <h5 className="1xl:mb-4 lg:mb-3 mb-[10px]">
                  Building Trust: The Impact of Customer Testimonials in Metals
                  Marketing
                </h5>
                <div className="flex items-center gap-[10px]">
                  <div className="1xl:w-8 1xl:h-8 lg:w-[30px] lg:h-[30px] w-7 h-7 rounded-full overflow-hidden">
                    <img
                      src="../images/place_holder.png"
                      alt="logo"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="p2">Template Insight - Aug 17, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
