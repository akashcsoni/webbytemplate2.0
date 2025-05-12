"use client";

import { useState } from "react";
import { Slider } from "@heroui/react";

const DropdownSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        className="flex items-center justify-between w-full mb-4 focus:outline-none border-y border-gray-100 xl:py-[11px] py-2 px-[5px]"
        onClick={() => setOpen(!open)}
      >
        <p className="font-medium text-black">{title}</p>
        <span className="text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transform transition-transform duration-300 ease-in-out ${
              open ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

export default function SidebarPage() {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative">
      {/* Toggle button for mobile */}
      <button
        onClick={() => setShowSidebar(true)}
        className="lg:hidden p-2 border mb-4"
      >
        ☰ Filters
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-50 p-4 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:w-1/4 lg:p-0 lg:shadow-none lg:block
        `}
      >
        <h5 className="mb-[15px] px-[5px]">Filter</h5>

        <div className="xl:space-y-[30px] space-y-7">
          <DropdownSection title="Categories">
            <ul className="text-sm">
              {[
                { name: "All Categories", value: 87 },
                { name: "Headless Templates", value: 18 },
                { name: "HTML Templates", value: 41 },
                { name: "Plugins", value: 9 },
                { name: "UI Kits", value: 5 },
                { name: "UI Templates", value: 18 },
              ].map((cat) => (
                <li
                  key={cat.name}
                  className="flex justify-between items-center px-2 py-[7px] rounded hover:bg-gray-100 cursor-pointer"
                >
                  <span className="p2">{cat.name}</span>
                  <span className="p2">{cat.value}</span>
                </li>
              ))}
            </ul>
          </DropdownSection>

          <DropdownSection title="Tags">
            <ul className="text-sm 1xl:space-y-[18px] space-y-3">
              {[
                { label: "AccordionSlide", count: 1 },
                { label: "Bank template", count: 2 },
                { label: "Admin dashboard", count: 5 },
                { label: "Clothes website templates", count: 1 },
                { label: "Digital marketing", count: 4 },
                { label: "Doctor portfolio", count: 2 },
                { label: "Distance Rate Shipping", count: 3 },
              ].map(({ label, count }) => (
                <li key={label} className="flex items-center justify-between">
                  <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        value={label}
                        className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={11}
                        height={11}
                        viewBox="0 0 24 24"
                        className="absolute"
                      >
                        <path
                          fill="white"
                          d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                          strokeWidth={3}
                          stroke="white"
                        ></path>
                      </svg>
                    </div>
                    <span className="p2">{label}</span>
                  </label>
                  <span className="p2">{count}</span>
                </li>
              ))}
            </ul>
          </DropdownSection>

          <DropdownSection title="Price">
            <div className="flex flex-col gap-2 w-full h-full items-start justify-center">
              <div className="w-full max-w-md">
                <Slider
                  aria-label="Select a budget"
                  formatOptions={{ style: "currency", currency: "USD" }}
                  maxValue={1000}
                  minValue={0}
                  size="sm"
                  value={priceRange} // changed
                  onChange={setPriceRange} // changed
                  step={10}
                />
                <div className="flex justify-between text-sm text-gray-700 mt-2">
                  <span>${priceRange[0]}</span> <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </DropdownSection>

          <DropdownSection title="On Sale">
            <label className="text-sm flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={11}
                  height={11}
                  viewBox="0 0 24 24"
                  className="absolute"
                >
                  <path
                    fill="white"
                    d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                    strokeWidth={3}
                    stroke="white"
                  ></path>
                </svg>
              </div>
              Yes
            </label>
          </DropdownSection>

          <DropdownSection title="Sales">
            <ul className="text-sm 1xl:space-y-[18px] space-y-3">
              {[
                { name: "No Sales", value: 1 },
                { name: "Low", value: 2 },
                { name: "Medium", value: 5 },
                { name: "High", value: 1 },
                { name: "Top Sellers", value: 4 },
              ].map((sale, index) => (
                <li
                  key={sale.name}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        value={sale.name} // Use sale.name for the checkbox value
                        className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={11}
                        height={11}
                        viewBox="0 0 24 24"
                        className="absolute"
                      >
                        <path
                          fill="white"
                          d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                          strokeWidth={3}
                          stroke="white"
                        ></path>
                      </svg>
                    </div>
                    <span className="p2">{sale.name}</span>
                  </label>
                  <span className="p2">{sale.value}</span>
                </li>
              ))}
            </ul>
          </DropdownSection>

          <DropdownSection title="Features">
            <ul className="text-sm 1xl:space-y-[18px] space-y-3">
              {[
                { name: "10+ Email Templates", value: 1 },
                { name: "10+ Emails", value: 2 },
                { name: "100% customized", value: 5 },
                { name: "12+ pages", value: 1 },
                { name: "2+ Homepage Layouts", value: 4 },
              ].map((features, index) => (
                <li
                  key={features.name}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        value={features.name} // Use features.name for the checkbox value
                        className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={11}
                        height={11}
                        viewBox="0 0 24 24"
                        className="absolute"
                      >
                        <path
                          fill="white"
                          d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                          strokeWidth={3}
                          stroke="white"
                        ></path>
                      </svg>
                    </div>
                    <span className="p2">{features.name}</span>
                  </label>
                  <span className="p2">{features.value}</span>
                </li>
              ))}
            </ul>
          </DropdownSection>
        </div>
      </aside>

      {/* Dummy Content */}
      <main className="lg:ml-1/4 p-4">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p>This is your product listing or other page content.</p>
      </main>
    </div>
  );
}
