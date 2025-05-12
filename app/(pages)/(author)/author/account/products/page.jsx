"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardBody, Link, Button, Image } from "@nextui-org/react";

const statuses = [
  { label: "Authorised", color: "text-primary", index: 1 },
  { label: "Pending for Review", color: "text-[#ED9A12]", index: 2 },
  { label: "Under Review", color: "text-[#257C65]", index: 3 },
  { label: "Declined", color: "text-[#C32D0B]", index: 4 },
];

const products = [
  {
    title: "Orion: Construction Company Figma UI Template Kit",
    price: 129.0,
    originalPrice: 150,
    tool: "Figma",
    lastUpdate: "More than 6 months ago",
    purchases: 50,
    itemSales: 6450,
    statusIndex: 0,
    image: "/images/cart-orion.png",
  },
  {
    title: "Orion: Construction Company Figma UI Template Kit",
    price: 129.0,
    originalPrice: 150,
    tool: "Figma",
    lastUpdate: "More than 3 months ago",
    purchases: 50,
    itemSales: 6450,
    statusIndex: 1,
    image: "/images/cart-orion.png",
  },
  {
    title: "Orion: Construction Company Figma UI Template Kit",
    price: 129.0,
    originalPrice: 150,
    tool: "Figma",
    lastUpdate: "More than 6 months ago",
    purchases: 50,
    itemSales: 6450,
    statusIndex: 2,
    image: "/images/cart-orion.png",
  },
  {
    title: "Orion: Construction Company Figma UI Template Kit",
    price: 129.0,
    originalPrice: 150,
    tool: "Figma",
    lastUpdate: "More than 3 months ago",
    purchases: 50,
    itemSales: 6450,
    statusIndex: 3,
    image: "/images/cart-orion.png",
  },
  {
    title: "Orion: Construction Company Figma UI Template Kit",
    price: 129.0,
    originalPrice: 150,
    tool: "Figma",
    lastUpdate: "More than 3 months ago",
    purchases: 50,
    itemSales: 6450,
    statusIndex: 0,
    image: "/images/cart-orion.png",
  },
];

// product list start
const ProductItem = ({
  image = "/images/cart-orion.png",
  title,
  price,
  originalPrice,
  tool,
  lastUpdate,
  purchases,
  itemSales,
  statusIndex = 0,
}) => (
  <div className="border-b border-gray-100 py-[18px]">
    <div className="flex md:flex-row flex-col gap-[18px] product-image">
      {/* product image */}
      <Image
        src={image}
        alt="Preview"
        width={100}
        height={120}
        className="rounded-[3px] md:!w-full w-[100px] md:!h-[120px] !h-full flex-shrink-0"
      />
      <div className="flex-1">
        <div className="flex lg:items-center items-start justify-between lg:flex-row flex-col gap-2 w-full">
          {/* product title */}
          <h3 className="sm:text-lg text-[17px] sm:leading-7 leading-6 font-medium !text-black">
            {title}
          </h3>
          {/* purchase and item sale */}
          <div className="text-sm text-muted-foreground flex items-center">
            <span className="flex items-center sm:gap-2 gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="xl:w-5 xl:h-5 w-[18px] h-[18px]"
              >
                <path
                  d="M6.91268 7.04716V4.09189C6.91268 2.45975 8.29594 1.13663 10.0023 1.13663C11.7086 1.13663 13.0919 2.45975 13.0919 4.09189V7.04716M3.82308 5.07698H16.1815L17.2113 17.8831H2.79321L3.82308 5.07698Z"
                  stroke="#0156D5"
                  strokeWidth="1.36397"
                  strokeLinecap="round"
                />
              </svg>
              <span className="2xl:text-[15px] text-sm text-gray-200">
                Purchases:{" "}
                <span className="text-black font-medium">{purchases}</span>
              </span>
            </span>
            <span className="xl:mx-3 lg:mx-2 mx-1.5 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100"></span>
            <span className="flex items-center sm:gap-2 gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="xl:w-5 xl:h-5 w-[18px] h-[18px]"
              >
                <path
                  d="M10.0001 18.3358C14.6026 18.3358 18.3334 14.6049 18.3334 10.0024C18.3334 5.39993 14.6026 1.6691 10.0001 1.6691C5.39758 1.6691 1.66675 5.39993 1.66675 10.0024C1.66675 14.6049 5.39758 18.3358 10.0001 18.3358Z"
                  stroke="#0156D5"
                  strokeWidth="1.26"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 7.08575C11.9292 6.51492 10.9242 6.11825 10 6.09325M10 6.09325C8.9 6.06325 7.91667 6.56075 7.91667 7.91909C7.91667 10.4191 12.5 9.16909 12.5 11.6691C12.5 13.0949 11.28 13.7074 10 13.6616M10 6.09325V4.58575M7.5 12.5024C8.03667 13.2191 9.03583 13.6274 10 13.6616M10 13.6616V15.4191"
                  stroke="#0156D5"
                  strokeWidth="1.26"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="2xl:text-[15px] text-sm text-gray-200">
                Item Sales:{" "}
                <span className="text-black font-medium">${itemSales}</span>
              </span>
            </span>
          </div>
        </div>
        {/* product's both price */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground 1xl:py-[14px] py-[11px]">
          <p className="text-primary font-medium">${price}.00</p>
          {originalPrice && (
            <>
              <span className="line-through text-sm text-gray-200">
                ${originalPrice}.00
              </span>
            </>
          )}
        </div>
        <div className="flex xl:items-center items-start xl:flex-row flex-col justify-between w-full">
          <div className="flex sm:items-center items-start sm:flex-row flex-col gap-y-2">
            {/* tool */}
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center border border-gray-100 rounded-full xl:w-7 xl:h-7 w-6 h-6">
                <Image
                  src="/logo/figma_logo.svg"
                  alt=""
                  width={10}
                  height={16}
                  className="opaimages-100"
                />
              </div>
              <span className="2xl:text-[15px] text-sm text-gray-200">
                {tool}
              </span>
            </div>
            <span className="xl:mx-3 mx-2 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100 sm:block hidden"></span>
            {/* updates */}
            <span className="flex items-center gap-x-2 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0"
              >
                <g clipPath="url(#clip0_3017_699)">
                  <path
                    d="M8.00366 15C11.8697 15 15.0037 11.866 15.0037 8C15.0037 4.13401 11.8697 1 8.00366 1C4.13767 1 1.00366 4.13401 1.00366 8C1.00366 11.866 4.13767 15 8.00366 15Z"
                    stroke="#0156D5"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.1037 10.8L8.41386 9.11019C8.15129 8.8477 8.00374 8.49166 8.00366 8.12039V3.79999"
                    stroke="#0156D5"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="2xl:text-[15px] text-sm text-gray-200">
                Last Update: <span className="text-primary">{lastUpdate}</span>
              </span>
            </span>
            <span className="xl:mx-3 mx-2 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100 sm:block hidden"></span>
            {/* status */}
            <span className="flex items-center gap-x-2 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0"
              >
                <g clipPath="url(#clip0_3166_55)">
                  <path
                    d="M15.1932 0.815347C14.67 0.293232 13.9611 0 13.222 0C12.4828 0 11.7739 0.293232 11.2507 0.815347L6.02598 6.04006C5.95848 6.10736 5.90755 6.18943 5.87723 6.27979L4.34055 10.8898C4.30434 10.9981 4.29901 11.1143 4.32514 11.2255C4.35128 11.3366 4.40785 11.4383 4.48851 11.519C4.56918 11.5998 4.67075 11.6566 4.78184 11.6829C4.89293 11.7092 5.00916 11.704 5.11749 11.668L9.72754 10.1313C9.81834 10.1012 9.90084 10.0502 9.96849 9.98258L15.1932 4.75786C15.7153 4.23468 16.0086 3.52574 16.0086 2.7866C16.0086 2.04747 15.7153 1.33852 15.1932 0.815347ZM12.1198 1.68449C12.4137 1.39977 12.8077 1.24199 13.2169 1.24522C13.626 1.24844 14.0175 1.41241 14.3068 1.70173C14.5961 1.99106 14.7601 2.38254 14.7633 2.79169C14.7666 3.20084 14.6088 3.59486 14.3241 3.88871L9.20138 9.01016L5.89444 10.1129L6.99716 6.80595L12.1198 1.68449ZM7.38195 2.47865C7.53275 2.47865 7.68273 2.48398 7.83189 2.49463L8.9174 1.40912C7.36146 1.0783 5.74026 1.25935 4.29564 1.92525C2.85101 2.59116 1.66036 3.70624 0.90129 5.10417C0.142224 6.5021 -0.144583 8.10796 0.0836501 9.68223C0.311884 11.2565 1.04293 12.7148 2.16774 13.8396C3.29254 14.9644 4.75084 15.6954 6.3251 15.9237C7.89936 16.1519 9.50522 15.8651 10.9032 15.106C12.3011 14.347 13.4162 13.1563 14.0821 11.7117C14.748 10.2671 14.929 8.64587 14.5982 7.08993L13.5127 8.17667C13.5233 8.32419 13.5287 8.47376 13.5287 8.62538C13.5287 9.84109 13.1682 11.0295 12.4928 12.0403C11.8174 13.0511 10.8574 13.839 9.7342 14.3042C8.61103 14.7694 7.37513 14.8912 6.18278 14.654C4.99043 14.4168 3.89519 13.8314 3.03555 12.9718C2.17592 12.1121 1.5905 11.0169 1.35333 9.82455C1.11615 8.6322 1.23788 7.3963 1.70311 6.27313C2.16834 5.14996 2.95618 4.18997 3.96701 3.51456C4.97783 2.83915 6.16624 2.47865 7.38195 2.47865Z"
                    fill="#0156D5"
                  />
                </g>
              </svg>
              <span className="2xl:text-[15px] text-sm text-gray-200">
                Status:
              </span>
              <div className="flex items-center gap-1">
                <span className={`${statuses[statusIndex].color}`}>
                  {statuses[statusIndex].label}
                </span>
                {/* declined icon */}
                {statusIndex === 3 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_3421_26)">
                      <path
                        d="M7.5 13.5938C10.8655 13.5938 13.5938 10.8655 13.5938 7.5C13.5938 4.13451 10.8655 1.40625 7.5 1.40625C4.13451 1.40625 1.40625 4.13451 1.40625 7.5C1.40625 10.8655 4.13451 13.5938 7.5 13.5938Z"
                        stroke="#C32D0B"
                        strokeWidth="1.4"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M3.19092 3.19104L11.8089 11.809"
                        stroke="#C32D0B"
                        strokeWidth="1.4"
                        strokeMiterlimit="10"
                      />
                    </g>
                  </svg>
                )}
              </div>
            </span>
          </div>
          {/* buttons */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {/* edit */}
            <Button
              size="sm"
              variant="flat"
              className="btn btn-outline-primary !border-primary/10 !py-2 !px-3 !text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="stroke-primary group-hover:stroke-white"
              >
                <path
                  d="M1.90469 9.47525L1.21875 12.219L3.96249 11.5331L11.9097 3.58581C12.1669 3.32855 12.3114 2.97967 12.3114 2.6159C12.3114 2.25213 12.1669 1.90325 11.9097 1.64599L11.7918 1.52801C11.5345 1.27082 11.1856 1.12634 10.8218 1.12634C10.4581 1.12634 10.1092 1.27082 9.85193 1.52801L1.90469 9.47525Z"
                  fill="white"
                  strokeWidth="1.54335"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.90469 9.47526L1.21875 12.219L3.96249 11.5331L10.8218 4.67371L8.76404 2.61591L1.90469 9.47526Z"
                  fill="#0156D5"
                />
                <path
                  d="M8.76372 2.61591L10.8215 4.67371L8.76372 2.61591ZM7.39185 12.219H12.8793H7.39185Z"
                  fill="#0156D5"
                />
                <path
                  d="M8.76372 2.61591L10.8215 4.67371M7.39185 12.219H12.8793"
                  strokeWidth="1.54335"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </Button>
            {/* download */}
            <Button
              size="sm"
              variant="flat"
              className="btn btn-outline-primary !border-primary/10 !py-2 !px-3 !text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="fill-primary group-hover:fill-white"
              >
                <g clipPath="url(#clip0_3007_2985)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.77804 6.33889V0.777778C7.77804 0.571498 7.6961 0.373667 7.55024 0.227806C7.40438 0.0819442 7.20655 0 7.00027 0C6.79399 0 6.59616 0.0819442 6.45029 0.227806C6.30443 0.373667 6.22249 0.571498 6.22249 0.777778V6.33889L4.49582 4.17978C4.43325 4.09648 4.35457 4.0266 4.26447 3.9743C4.17437 3.92199 4.07468 3.88831 3.97132 3.87527C3.86795 3.86224 3.76302 3.87009 3.66275 3.89839C3.56249 3.92668 3.46892 3.97483 3.38762 4.03997C3.30632 4.10512 3.23893 4.18594 3.18946 4.27763C3.13999 4.36932 3.10945 4.47001 3.09964 4.57373C3.08984 4.67745 3.10097 4.78209 3.13238 4.88142C3.16379 4.98076 3.21484 5.07277 3.28249 5.152L6.3936 9.04089C6.46648 9.13173 6.55883 9.20504 6.66383 9.25542C6.76883 9.3058 6.88381 9.33195 7.00027 9.33195C7.11673 9.33195 7.2317 9.3058 7.3367 9.25542C7.44171 9.20504 7.53405 9.13173 7.60693 9.04089L10.718 5.152C10.7857 5.07277 10.8367 4.98076 10.8682 4.88142C10.8996 4.78209 10.9107 4.67745 10.9009 4.57373C10.8911 4.47001 10.8605 4.36932 10.8111 4.27763C10.7616 4.18594 10.6942 4.10512 10.6129 4.03997C10.5316 3.97483 10.438 3.92668 10.3378 3.89839C10.2375 3.87009 10.1326 3.86224 10.0292 3.87527C9.92585 3.88831 9.82616 3.92199 9.73606 3.9743C9.64596 4.0266 9.56729 4.09648 9.50471 4.17978L7.77804 6.33889Z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.17767 10.0131L3.38956 7.77777H1.55556C1.143 7.77777 0.747335 7.94166 0.455612 8.23338C0.163888 8.52511 0 8.92077 0 9.33333V12.4444C0 12.857 0.163888 13.2527 0.455612 13.5444C0.747335 13.8361 1.143 14 1.55556 14H12.4444C12.857 14 13.2527 13.8361 13.5444 13.5444C13.8361 13.2527 14 12.857 14 12.4444V9.33333C14 8.92077 13.8361 8.52511 13.5444 8.23338C13.2527 7.94166 12.857 7.77777 12.4444 7.77777H10.6104L8.82156 10.0131C8.60295 10.2863 8.3257 10.5069 8.01033 10.6584C7.69495 10.81 7.34952 10.8887 6.99961 10.8887C6.6497 10.8887 6.30427 10.81 5.9889 10.6584C5.67352 10.5069 5.39627 10.2863 5.17767 10.0131ZM10.8889 10.1111C10.6826 10.1111 10.4848 10.193 10.3389 10.3389C10.1931 10.4848 10.1111 10.6826 10.1111 10.8889C10.1111 11.0952 10.1931 11.293 10.3389 11.4389C10.4848 11.5847 10.6826 11.6667 10.8889 11.6667H10.8967C11.1029 11.6667 11.3008 11.5847 11.4466 11.4389C11.5925 11.293 11.6744 11.0952 11.6744 10.8889C11.6744 10.6826 11.5925 10.4848 11.4466 10.3389C11.3008 10.193 11.1029 10.1111 10.8967 10.1111H10.8889Z"
                  />
                </g>
              </svg>
              Download
            </Button>
            {/* remove */}
            <Button
              size="sm"
              color="danger"
              variant="flat"
              className="btn btn-outline-primary !border-primary/10 !py-2 !px-3 !text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="fill-primary group-hover:fill-white"
              >
                <g clipPath="url(#clip0_3017_2)">
                  <path d="M5.6 2.8H8.4C8.4 2.4287 8.2525 2.0726 7.98995 1.81005C7.7274 1.5475 7.3713 1.4 7 1.4C6.6287 1.4 6.2726 1.5475 6.01005 1.81005C5.7475 2.0726 5.6 2.4287 5.6 2.8ZM4.2 2.8C4.2 2.05739 4.495 1.3452 5.0201 0.820101C5.5452 0.294999 6.25739 0 7 0C7.74261 0 8.4548 0.294999 8.9799 0.820101C9.505 1.3452 9.8 2.05739 9.8 2.8H13.3C13.4857 2.8 13.6637 2.87375 13.795 3.00503C13.9263 3.1363 14 3.31435 14 3.5C14 3.68565 13.9263 3.8637 13.795 3.99497C13.6637 4.12625 13.4857 4.2 13.3 4.2H12.6826L12.0624 11.438C12.0028 12.1369 11.683 12.788 11.1663 13.2624C10.6496 13.7369 9.97366 14.0001 9.2722 14H4.7278C4.02634 14.0001 3.35039 13.7369 2.8337 13.2624C2.31702 12.788 1.99722 12.1369 1.9376 11.438L1.3174 4.2H0.7C0.514348 4.2 0.336301 4.12625 0.205025 3.99497C0.0737498 3.8637 0 3.68565 0 3.5C0 3.31435 0.0737498 3.1363 0.205025 3.00503C0.336301 2.87375 0.514348 2.8 0.7 2.8H4.2ZM9.1 7C9.1 6.81435 9.02625 6.6363 8.89497 6.50503C8.7637 6.37375 8.58565 6.3 8.4 6.3C8.21435 6.3 8.0363 6.37375 7.90503 6.50503C7.77375 6.6363 7.7 6.81435 7.7 7V9.8C7.7 9.98565 7.77375 10.1637 7.90503 10.295C8.0363 10.4263 8.21435 10.5 8.4 10.5C8.58565 10.5 8.7637 10.4263 8.89497 10.295C9.02625 10.1637 9.1 9.98565 9.1 9.8V7ZM5.6 6.3C5.41435 6.3 5.2363 6.37375 5.10503 6.50503C4.97375 6.6363 4.9 6.81435 4.9 7V9.8C4.9 9.98565 4.97375 10.1637 5.10503 10.295C5.2363 10.4263 5.41435 10.5 5.6 10.5C5.78565 10.5 5.9637 10.4263 6.09497 10.295C6.22625 10.1637 6.3 9.98565 6.3 9.8V7C6.3 6.81435 6.22625 6.6363 6.09497 6.50503C5.9637 6.37375 5.78565 6.3 5.6 6.3Z" />
                </g>
              </svg>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
    {/* this will show when products is in declined state */}
    {statusIndex === 3 && (
      <div className="relative 1xl:pt-3 pt-2.5 mt-2 overflow-hidden z-10 before:content-[''] before:absolute before:top-1 before:right-auto before:left-5 1xl:before:w-4 1xl:before:h-5 before:w-3 before:h-3 before:bg-blue-300 before:rotate-45 before:border before:border-blue-300 before:rounded-[2px] before:overflow-hidden before:z-20">
        <div className="rounded-[4px] flex items-start gap-3 py-[14px] px-4 bg-blue-300 z-50 relative">
          <div className="border border-primary rounded-full md:p-1 p-0.5 md:w-[30px] md:h-[30px] w-7 h-7 flex items-center justify-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="fill-primary"
            >
              <path d="M0.75 12C0.75 5.78654 5.78654 0.75 12 0.75C18.2135 0.75 23.25 5.78654 23.25 12C23.25 18.2135 18.2135 23.25 12 23.25C5.78654 23.25 0.75 18.2135 0.75 12ZM12.8654 5.07692C12.8654 4.84741 12.7742 4.62729 12.6119 4.465C12.4496 4.30271 12.2295 4.21154 12 4.21154C11.7705 4.21154 11.5504 4.30271 11.3881 4.465C11.2258 4.62729 11.1346 4.84741 11.1346 5.07692V12C11.1346 12.1615 11.1808 12.3208 11.2662 12.4592L14.1508 17.0746C14.2726 17.2692 14.4667 17.4075 14.6904 17.459C14.9142 17.5105 15.1492 17.471 15.3438 17.3492C15.5385 17.2274 15.6767 17.0333 15.7282 16.8096C15.7797 16.5858 15.7403 16.3508 15.6185 16.1562L12.8654 11.7519V5.07692Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-[6px] overflow-auto">
            <p className="font-medium text-black break-all">
              Product currently waiting for review
            </p>
            <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 break-words">
              Hello, Thank you for uploading your product. Please check the
              review result: We found this template on another marketplace.
              Change exclusivity to non-exclusive https://webbytemplate.com/
              search/html-templates?feature=travel-agency Errors in W3
              Validator:
              <Link
                href="https://validator.w3.org/nu/?doc=https%3A%2F%2Fdemo.webbytemplate.com%2Fhtml-templates%2Ftailwind%2Fgroffon-travel-agency%2Flayouts%2Fhtml%2Findex-1.html&__cf_chl_tk=t214dgE_bvVReTrx1zRF0_OZ8dlw6DFlbSUqWU8WJTU-1746871006-1.0.1.1-K8Ye76vcdT7BcHhUmPyZ.e9NHDG1dMqIh73zeaw2SRo"
                className="text-gray-200 hover:text-primary"
              >
                https://validator.w3.org/nu/?doc=https%3A%2F%2Fdemo.webbytemplate.com%2Fhtml-templates%2Ftailwind%2Fgroffon
                travel-agency%2Flayouts%2Fhtml%2 Findex-1.html
              </Link>
              https://prnt.sc/uwTrggc879m9
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default function ProductsPage(props) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUpdate, setSelectedUpdate] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedLink, setSelectedLink] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  // tags
  const initial = props.initial || [];
  const [tags, setTags] = useState(initial);
  const [value, setValue] = useState("");
  // For multiple images
  const [images, setImages] = useState([]);
  // For single image
  const [singleImage, setSingleImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    productTitle: "",
    shortName: "",
    description: "",
    demoLink: "",
    images: "",
    link: "",
    category: "",
    format: "",
    existingProduct: "",
    tags: "",
    compatible: "",
    sell: "",
    price: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.productTitle.trim())
      newErrors.productTitle =
        "Special characters are not allowed in the product title..";
    if (!form.shortName.trim())
      newErrors.shortName =
        "Special characters are not allowed in the short name.";
    if (!form.description.trim())
      newErrors.description = "Links and Special characters are not allowed.";
    if (!form.demoLink.trim() || !/\S+@\S+\.\S+/.test(form.demoLink))
      newErrors.demoLink =
        "Please provide a full and valid URL (e.g., https://example.com)..";
    if (!form.link.trim())
      newErrors.link = "File type not supported. Please upload a [ZIP/etc.]..";
    newErrors.existingProduct =
      "If this new upload is a related format or version of an existing product (e.g., a Figma version of your WordPress theme), you can link it here..";
    if (!form.tags.trim())
      newErrors.tags = "Tag length must be between 0 and 30 characters..";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleUploadProduct = () => {
    const newErrors = {};

    if (validateForm()) {
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert("Form is valid. Proceeding with payment...");
      }
    }
  };

  const inputClass = (name) =>
    ` 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 border ${errors[name] ? "border-red-500" : "border-gray-100"} my-[5px] text-gray-300 placeholder:text-gray-300 rounded-[5px] 1xl:px-5 px-3 w-full outline-none`;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    const errorMsg = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  // dropdown start
  const [errors, setErrors] = useState({});

  // Simplified Dropdown component
  const Dropdown = ({ label, placeholder, options, selected, onSelect }) => {
    const isOpen = openDropdown === label;

    const handleSelect = (option) => {
      onSelect(option);
      setOpenDropdown(null);
    };

    const toggleDropdown = () => {
      setOpenDropdown(isOpen ? null : label);
    };

    return (
      <div className="relative">
        <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px] capitalize">
          {label}
        </label>
        <div
          className="border 2xl:text-base 1xl:text-[15px] text-sm leading-5 border-gray-100 text-gray-300 placeholder:text-gray-300 2xl:py-[11px] sm:py-[10px] py-2 rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center"
          onClick={toggleDropdown}
        >
          <span className={`${!selected ? "text-gray-300" : "text-gray-800"}`}>
            {selected || (placeholder && ` ${placeholder}`)}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-10">
            <ul className="text-gray-800">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    // Log when any of the dropdowns' categorys change
    console.log("Status selected:", selectedStatus);
    console.log("Update selected:", selectedUpdate);
    console.log("Sort selected:", selectedSort);
  }, [selectedStatus, selectedUpdate, selectedSort]);

  const hasSpecialChars = /[^a-zA-Z0-9 ]/;

  const validateField = (field, value) => {
    if (!value) return "This field is required";

    if (hasSpecialChars.test(value)) {
      return "Special characters are not allowed";
    }

    if (value.length > 20) {
      return "Maximum 20 characters allowed";
    }

    return "";
  };
  // dropdown end

  // upload image
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e, isMultiple = true) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    isMultiple ? handleFiles(files) : handleSingleFile(files);
  };

  const handleFileChange = (e, isMultiple = true) => {
    const files = Array.from(e.target.files);
    isMultiple ? handleFiles(files) : handleSingleFile(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/gif"].includes(file.type),
    );
    const imagePreviews = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));
    setImages((prev) => [...prev, ...imagePreviews]);
  };

  const handleSingleFile = (files) => {
    const file = files.find((f) =>
      ["image/jpeg", "image/png", "image/gif"].includes(f.type),
    );
    if (file) {
      setSingleImage({
        file,
        url: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      });
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // tags start
  const addTag = () => {
    const v = value.trim();
    if (v && !tags.includes(v)) {
      const updated = [...tags, v];
      setTags(updated);
      props.onChange?.(updated);
    }
    setValue("");
  };

  const removeTag = (i) => {
    const updated = tags.filter((_, j) => j !== i);
    setTags(updated);
    props.onChange?.(updated);
  };
  // tags end

  const removeSingleImage = () => setSingleImage(null);
  return (
    <div>
      {step === 1 && (
        <div>
          {/* main page heading */}
          <div className="flex items-center justify-between flex-wrap w-full py-[27px] gap-y-3">
            <h1 className="h2">Your Products</h1>
            <div>
              <button
                onClick={() => setStep(2)}
                className="btn btn-primary 2xl:!px-5 !px-[18px] !py-[7px] flex items-center gap-[10px] group h-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  className="stroke-white group-hover:stroke-primary transition-all"
                >
                  <g clipPath="url(#clip0_3270_1050)">
                    <path
                      d="M1.38281 10.9412V12.4706C1.38281 12.8762 1.54395 13.2652 1.83077 13.552C2.11759 13.8389 2.5066 14 2.91222 14H12.0887C12.4943 14 12.8833 13.8389 13.1702 13.552C13.457 13.2652 13.6181 12.8762 13.6181 12.4706V10.9412M3.67693 4.82353L7.50046 1M7.50046 1L11.324 4.82353M7.50046 1V10.1765"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                Add a New Product
              </button>
            </div>
          </div>

          <div className="border border-primary/10 rounded-md overflow-hidden bg-white">
            {/* sub heading */}
            <div className="border-b border-primary/10">
              <p className="text-black py-[6px] sm:px-5 px-4">Products List</p>
            </div>

            {/* Filter Fields */}
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]">
              <div className="">
                <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Type product name"
                  className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 border border-gray-100 text-gray-300 placeholder:text-gray-300 2xl:py-[11px] sm:py-[10px] py-2 rounded-[5px] 1xl:px-5 px-3 w-full outline-none"
                />
              </div>
              <div className="">
                <Dropdown
                  label="Select status"
                  placeholder="Select status"
                  options={["Select status", "All", "Active", "Processing"]}
                  selected={selectedStatus}
                  onSelect={(value) =>
                    setSelectedStatus(value === "Select status" ? "" : value)
                  }
                />
              </div>
              <div className="">
                <Dropdown
                  label="Sort by"
                  placeholder="Recent products"
                  options={[
                    "Recent products",
                    "E-commerce",
                    "Blog products",
                    "New Arrivals",
                  ]}
                  selected={selectedSort}
                  onSelect={(value) =>
                    setSelectedSort(value === "Select sort" ? "" : value)
                  }
                />
              </div>
              <div className="">
                <Dropdown
                  label="Updated"
                  placeholder="All"
                  options={["All", "Last Week", "Last month", "Last Year"]}
                  selected={selectedUpdate}
                  onSelect={(value) =>
                    setSelectedUpdate(value === "Select category" ? "" : value)
                  }
                />
              </div>
            </div>

            {/* Filter tags */}
            <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap py-[26px] border-b border-primary/10">
              <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5  !text-black">
                Applied Filters:
              </p>
              <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                  Name: <span className="!text-black">Orion Construction</span>
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 9 9"
                  fill="none"
                  className="px-2 flex-shrink-0 cursor-pointer"
                >
                  <path
                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                    fill="black"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                  Status: <span className="!text-black">Authorised</span>
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 9 9"
                  fill="none"
                  className="px-2 flex-shrink-0 cursor-pointer"
                >
                  <path
                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                    fill="black"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                  Sort by: <span className="!text-black">Newest</span>
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 9 9"
                  fill="none"
                  className="px-2 flex-shrink-0 cursor-pointer"
                >
                  <path
                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                    fill="black"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                  Sort by: <span className="!text-black">Last 30 Days</span>
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 9 9"
                  fill="none"
                  className="px-2 flex-shrink-0 cursor-pointer"
                >
                  <path
                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                    fill="black"
                  />
                </svg>
              </div>
              <Link
                href="javascript:;"
                className="2xl:!text-base sm:!text-[15px] !text-sm all-btn inline-flex items-center border-b border-transparent hover:border-primary gap-2 hover:opaimages-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="none"
                >
                  <path
                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                    fill="#0156D5"
                  />
                </svg>
                Clear All
              </Link>
            </div>
            {/* Products list */}
            <Card className="!shadow-none !max-w-full">
              <CardBody className="sm:px-5 px-4 pt-0 pb-5">
                {products.map((product, index) => (
                  <ProductItem key={index} {...product} />
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="flex items-center justify-between w-full">
            <h1 className="h2 py-[30px]">Add a New Product</h1>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-4 md:flex-row flex-col items-start justify-between">
              {/* Billing Details */}
              <div className="xl:w-2/3 md:w-[60%] w-full bg-white border-primary/10 border rounded-md overflow-hidden">
                <div className="border-b border-primary/10 bg-white">
                  <p className="text-black py-[6px] px-5">
                    General Information
                  </p>
                </div>
                <div className="pt-4 pb-9 px-5">
                  <div className="flex flex-col sm:gap-5 gap-3">
                    {/* product title */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Product Title
                      </label>
                      <div
                        className={`flex items-center ${inputClass("productTitle")}`}
                      >
                        <input
                          type="text"
                          placeholder="Enter product title"
                          value={form.productTitle}
                          onChange={(e) =>
                            handleChange("productTitle", e.target.value)
                          }
                          className="w-full outline-none h-full 2xl:py-[14px] sm:py-[10px] py-2 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200"
                        />
                        {errors.productTitle && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_3537_158)">
                              <path
                                d="M8 16.0012C10.1217 16.0012 12.1566 15.1584 13.6569 13.6581C15.1571 12.1578 16 10.123 16 8.00122C16 5.87949 15.1571 3.84466 13.6569 2.34437C12.1566 0.844075 10.1217 0.0012207 8 0.0012207C5.87827 0.0012207 3.84344 0.844075 2.34315 2.34437C0.842855 3.84466 0 5.87949 0 8.00122C0 10.123 0.842855 12.1578 2.34315 13.6581C3.84344 15.1584 5.87827 16.0012 8 16.0012ZM6.8 11.6012C6.8 11.283 6.92643 10.9777 7.15147 10.7527C7.37652 10.5276 7.68174 10.4012 8 10.4012C8.31826 10.4012 8.62348 10.5276 8.84853 10.7527C9.07357 10.9777 9.2 11.283 9.2 11.6012C9.2 11.9195 9.07357 12.2247 8.84853 12.4497C8.62348 12.6748 8.31826 12.8012 8 12.8012C7.68174 12.8012 7.37652 12.6748 7.15147 12.4497C6.92643 12.2247 6.8 11.9195 6.8 11.6012ZM7.2128 3.85722C7.2462 3.67277 7.34331 3.5059 7.48718 3.38574C7.63105 3.26558 7.81255 3.19976 8 3.19976C8.18745 3.19976 8.36895 3.26558 8.51282 3.38574C8.65669 3.5059 8.7538 3.67277 8.7872 3.85722L8.8 4.00122V8.00122L8.7872 8.14522C8.7538 8.32967 8.65669 8.49654 8.51282 8.6167C8.36895 8.73686 8.18745 8.80269 8 8.80269C7.81255 8.80269 7.63105 8.73686 7.48718 8.6167C7.34331 8.49654 7.2462 8.32967 7.2128 8.14522L7.2 8.00122V4.00122L7.2128 3.85722Z"
                                fill="#C32D0B"
                              />
                            </g>
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Maximum 20 characters; no special symbols
                        </p>
                      </div>
                      {errors.productTitle && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.productTitle}
                        </p>
                      )}
                    </div>

                    {/* Short Name */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Short Name
                      </label>
                      <div
                        className={`flex items-center ${inputClass("shortName")}`}
                      >
                        <input
                          type="text"
                          placeholder="Enter short name"
                          value={form.shortName}
                          onChange={(e) =>
                            handleChange("shortName", e.target.value)
                          }
                          className="w-full outline-none h-full 2xl:py-[14px] sm:py-[10px] py-2 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200"
                        />
                        {errors.shortName && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_3537_158)">
                              <path
                                d="M8 16.0012C10.1217 16.0012 12.1566 15.1584 13.6569 13.6581C15.1571 12.1578 16 10.123 16 8.00122C16 5.87949 15.1571 3.84466 13.6569 2.34437C12.1566 0.844075 10.1217 0.0012207 8 0.0012207C5.87827 0.0012207 3.84344 0.844075 2.34315 2.34437C0.842855 3.84466 0 5.87949 0 8.00122C0 10.123 0.842855 12.1578 2.34315 13.6581C3.84344 15.1584 5.87827 16.0012 8 16.0012ZM6.8 11.6012C6.8 11.283 6.92643 10.9777 7.15147 10.7527C7.37652 10.5276 7.68174 10.4012 8 10.4012C8.31826 10.4012 8.62348 10.5276 8.84853 10.7527C9.07357 10.9777 9.2 11.283 9.2 11.6012C9.2 11.9195 9.07357 12.2247 8.84853 12.4497C8.62348 12.6748 8.31826 12.8012 8 12.8012C7.68174 12.8012 7.37652 12.6748 7.15147 12.4497C6.92643 12.2247 6.8 11.9195 6.8 11.6012ZM7.2128 3.85722C7.2462 3.67277 7.34331 3.5059 7.48718 3.38574C7.63105 3.26558 7.81255 3.19976 8 3.19976C8.18745 3.19976 8.36895 3.26558 8.51282 3.38574C8.65669 3.5059 8.7538 3.67277 8.7872 3.85722L8.8 4.00122V8.00122L8.7872 8.14522C8.7538 8.32967 8.65669 8.49654 8.51282 8.6167C8.36895 8.73686 8.18745 8.80269 8 8.80269C7.81255 8.80269 7.63105 8.73686 7.48718 8.6167C7.34331 8.49654 7.2462 8.32967 7.2128 8.14522L7.2 8.00122V4.00122L7.2128 3.85722Z"
                                fill="#C32D0B"
                              />
                            </g>
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Maximum 20 characters; no special symbols
                        </p>
                      </div>
                      {errors.shortName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.shortName}
                        </p>
                      )}
                    </div>

                    {/* Product Description / Detailed Description */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Product Description / Detailed Description
                      </label>
                      <div
                        className={`relative overflow-hidden flex items-start h-[120px] !px-0 ${inputClass("description")}`}
                      >
                        <textarea
                          placeholder="Enter product description"
                          value={form.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                          className="w-full outline-none h-full 2xl:py-[14px] sm:py-[10px] py-2 1xl:px-5 px-3 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200"
                        ></textarea>
                        {errors.description && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="absolute right-4 top-4"
                          >
                            <g clip-path="url(#clip0_3537_158)">
                              <path
                                d="M8 16.0012C10.1217 16.0012 12.1566 15.1584 13.6569 13.6581C15.1571 12.1578 16 10.123 16 8.00122C16 5.87949 15.1571 3.84466 13.6569 2.34437C12.1566 0.844075 10.1217 0.0012207 8 0.0012207C5.87827 0.0012207 3.84344 0.844075 2.34315 2.34437C0.842855 3.84466 0 5.87949 0 8.00122C0 10.123 0.842855 12.1578 2.34315 13.6581C3.84344 15.1584 5.87827 16.0012 8 16.0012ZM6.8 11.6012C6.8 11.283 6.92643 10.9777 7.15147 10.7527C7.37652 10.5276 7.68174 10.4012 8 10.4012C8.31826 10.4012 8.62348 10.5276 8.84853 10.7527C9.07357 10.9777 9.2 11.283 9.2 11.6012C9.2 11.9195 9.07357 12.2247 8.84853 12.4497C8.62348 12.6748 8.31826 12.8012 8 12.8012C7.68174 12.8012 7.37652 12.6748 7.15147 12.4497C6.92643 12.2247 6.8 11.9195 6.8 11.6012ZM7.2128 3.85722C7.2462 3.67277 7.34331 3.5059 7.48718 3.38574C7.63105 3.26558 7.81255 3.19976 8 3.19976C8.18745 3.19976 8.36895 3.26558 8.51282 3.38574C8.65669 3.5059 8.7538 3.67277 8.7872 3.85722L8.8 4.00122V8.00122L8.7872 8.14522C8.7538 8.32967 8.65669 8.49654 8.51282 8.6167C8.36895 8.73686 8.18745 8.80269 8 8.80269C7.81255 8.80269 7.63105 8.73686 7.48718 8.6167C7.34331 8.49654 7.2462 8.32967 7.2128 8.14522L7.2 8.00122V4.00122L7.2128 3.85722Z"
                                fill="#C32D0B"
                              />
                            </g>
                          </svg>
                        )}
                      </div>

                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Maximum 1000 characters; no links or special symbols
                        </p>
                      </div>
                      {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Live Demo Link */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Live Demo Link
                      </label>
                      <div
                        className={`flex items-center ${inputClass("demoLink")}`}
                      >
                        <input
                          type="text"
                          placeholder="Enter link"
                          value={form.demoLink}
                          onChange={(e) =>
                            handleChange("demoLink", e.target.value)
                          }
                          className="w-full outline-none h-full 2xl:py-[14px] sm:py-[10px] py-2 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200"
                        />
                        {errors.demoLink && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_3537_158)">
                              <path
                                d="M8 16.0012C10.1217 16.0012 12.1566 15.1584 13.6569 13.6581C15.1571 12.1578 16 10.123 16 8.00122C16 5.87949 15.1571 3.84466 13.6569 2.34437C12.1566 0.844075 10.1217 0.0012207 8 0.0012207C5.87827 0.0012207 3.84344 0.844075 2.34315 2.34437C0.842855 3.84466 0 5.87949 0 8.00122C0 10.123 0.842855 12.1578 2.34315 13.6581C3.84344 15.1584 5.87827 16.0012 8 16.0012ZM6.8 11.6012C6.8 11.283 6.92643 10.9777 7.15147 10.7527C7.37652 10.5276 7.68174 10.4012 8 10.4012C8.31826 10.4012 8.62348 10.5276 8.84853 10.7527C9.07357 10.9777 9.2 11.283 9.2 11.6012C9.2 11.9195 9.07357 12.2247 8.84853 12.4497C8.62348 12.6748 8.31826 12.8012 8 12.8012C7.68174 12.8012 7.37652 12.6748 7.15147 12.4497C6.92643 12.2247 6.8 11.9195 6.8 11.6012ZM7.2128 3.85722C7.2462 3.67277 7.34331 3.5059 7.48718 3.38574C7.63105 3.26558 7.81255 3.19976 8 3.19976C8.18745 3.19976 8.36895 3.26558 8.51282 3.38574C8.65669 3.5059 8.7538 3.67277 8.7872 3.85722L8.8 4.00122V8.00122L8.7872 8.14522C8.7538 8.32967 8.65669 8.49654 8.51282 8.6167C8.36895 8.73686 8.18745 8.80269 8 8.80269C7.81255 8.80269 7.63105 8.73686 7.48718 8.6167C7.34331 8.49654 7.2462 8.32967 7.2128 8.14522L7.2 8.00122V4.00122L7.2128 3.85722Z"
                                fill="#C32D0B"
                              />
                            </g>
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Valid URL format
                        </p>
                      </div>
                      {errors.demoLink && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.demoLink}
                        </p>
                      )}
                    </div>

                    {/* Grid Images */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Grid Images
                      </label>
                      <div>
                        {/* Upload Box */}
                        <div
                          className={`border border-[#B9C0CB] my-[5px] rounded-[5px] border-dashed sm:h-[200px] h-[170px] flex items-center justify-center cursor-pointer transition-all ${
                            isDragging ? "bg-blue-50" : ""
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                        >
                          <input
                            type="file"
                            id="fileInput"
                            hidden
                            multiple
                            accept="image/png,image/jpeg,image/gif"
                            onChange={handleFileChange}
                          />
                          <div className="flex flex-col items-center justify-center pointer-events-none">
                            {/* SVG Icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="50"
                              height="51"
                              viewBox="0 0 50 51"
                              fill="none"
                              className="sm:w-[50px] sm:h-[50px] w-11 h-11"
                            >
                              <path
                                d="M44.2712 27.7516V18.3766C44.2712 15.614 43.1737 12.9644 41.2202 11.0109C39.2667 9.05743 36.6172 7.95996 33.8545 7.95996H16.1462C13.3835 7.95996 10.734 9.05743 8.78046 11.0109C6.82696 12.9644 5.72949 15.614 5.72949 18.3766V32.96C5.72949 34.3279 5.99893 35.6824 6.52241 36.9463C7.0459 38.2101 7.81319 39.3584 8.78046 40.3257C10.734 42.2792 13.3835 43.3766 16.1462 43.3766H29.1878"
                                stroke="#0156D5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6.27148 36.085L11.9798 29.4183C12.7295 28.6738 13.7134 28.2111 14.765 28.1086C15.8166 28.0061 16.8713 28.27 17.7507 28.8558C18.63 29.4416 19.6847 29.7056 20.7363 29.6031C21.7879 29.5006 22.7718 29.0379 23.5215 28.2933L28.3756 23.4392C29.7704 22.0396 31.6171 21.1812 33.5861 21.0172C35.5552 20.8531 37.5185 21.394 39.1257 22.5433L44.2715 26.5225M16.6882 21.8558C17.1423 21.8531 17.5915 21.7609 18.01 21.5846C18.4285 21.4083 18.8083 21.1512 19.1275 20.8282C19.4467 20.5051 19.6991 20.1223 19.8704 19.7017C20.0416 19.2811 20.1284 18.8308 20.1256 18.3767C20.1229 17.9225 20.0308 17.4733 19.8544 17.0548C19.6781 16.6363 19.4211 16.2565 19.098 15.9373C18.7749 15.6181 18.3921 15.3657 17.9715 15.1944C17.5509 15.0232 17.1006 14.9364 16.6465 14.9391C15.7293 14.9447 14.8518 15.3143 14.2072 15.9668C13.5625 16.6193 13.2035 17.5011 13.209 18.4183C13.2145 19.3355 13.5842 20.213 14.2366 20.8576C14.8891 21.5023 15.7709 21.8613 16.6882 21.8558Z"
                                stroke="#0156D5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M38.9736 31.9183V42.3349"
                                stroke="#0156D5"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                              />
                              <path
                                d="M43.7505 36.3037L39.6525 32.2058C39.5635 32.1164 39.4577 32.0454 39.3411 31.9969C39.2246 31.9485 39.0996 31.9236 38.9734 31.9236C38.8472 31.9236 38.7222 31.9485 38.6056 31.9969C38.4891 32.0454 38.3833 32.1164 38.2942 32.2058L34.1963 36.3037"
                                stroke="#0156D5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <p className="text-black mt-2">
                              Drag and drop files, or{" "}
                              <span className="text-primary underline">
                                Browse
                              </span>
                            </p>
                            <p className="sm:text-sm text-[13px] text-gray-400">
                              Supports: JPG, PNG, or GIF
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-[5px] mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                              stroke="#505050"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                              stroke="#505050"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="text-sm text-gray-200">
                            Minimum resolution: 800x800 pixels; maximum file
                            size: 5MB
                          </p>
                        </div>
                        {/* Preview Grid */}
                        {images.length > 0 && (
                          <div className="grid grid-cols-10 gap-4 mt-4">
                            {images.map((img) => (
                              <div
                                key={img.id}
                                className="relative group rounded-[5px] p-1 bg-blue-300/50 border border-primary/10 w-[78px] h-[92px]"
                              >
                                <img
                                  src={img.url}
                                  alt="preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => removeImage(img.id)}
                                  className="absolute -top-2 -right-2 border-2 border-white bg-primary rounded-full p-1 text-white transition"
                                  title="Remove image"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Product */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Upload Product
                      </label>
                      <input
                        type="file"
                        placeholder="Enter product title"
                        value={form.link}
                        onChange={(e) => handleChange("link", e.target.value)}
                        className={`2xl:py-[14px] sm:py-[10px] py-2 ${inputClass("Link")}`}
                      />
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          File type must be ZIP; maximum size: 2GB
                        </p>
                      </div>
                      {errors.link && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.link}
                        </p>
                      )}
                    </div>

                    {/* Product Category */}
                    <div>
                      <Dropdown
                        label="Select Product Category"
                        placeholder="Select Product Category"
                        options={[
                          "Select Product Category",
                          "WooCommerce Theme",
                          "WordPress Theme",
                          "UI/UX Theme",
                        ]}
                        selected={selectedProduct}
                        onSelect={(value) =>
                          setSelectedProduct(
                            value === "Select product" ? "" : value,
                          )
                        }
                      />
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Select from predefined options
                        </p>
                      </div>
                    </div>

                    {/* File Format */}
                    <div>
                      <Dropdown
                        label="Select Format"
                        placeholder="Select Format"
                        options={["Select Format", "PNG", "JPG", "GIF"]}
                        selected={selectedFormat}
                        onSelect={(value) =>
                          setSelectedFormat(
                            value === "Select Format" ? "" : value,
                          )
                        }
                      />
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Select from predefined options
                        </p>
                      </div>
                    </div>

                    {/* Link to an Existing Product */}
                    <div>
                      <Dropdown
                        label="Select option"
                        placeholder="Select option"
                        options={[
                          "Select option",
                          "E-commerce UI Kit",
                          "Blog UI Kit",
                          "UI/UX Kit",
                        ]}
                        selected={selectedLink}
                        onSelect={(value) =>
                          setSelectedLink(value === "Select Link" ? "" : value)
                        }
                      />
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Maximum 10 tags, separated by commas; 30 characters
                          max per tag
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="2xl:py-[14px] sm:py-[10px] py-2 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Tags
                      </label>
                      <div
                        className={`flex items-center flex-wrap gap-2 2xl:py-[11px] sm:py-[10px] py-2 ${inputClass("tags")}`}
                      >
                        {tags.map((tag, i) => (
                          <span
                            key={i}
                            className="border border-gray-100 shadow-gray-inset bg-[#F5F5F5] px-3 py-[3px] rounded-[3px] text-[15px] font-normal text-black flex items-center w-fit"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(i)}
                              className="ml-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="8"
                                height="8"
                                viewBox="0 0 8 8"
                                fill="none"
                              >
                                <path
                                  d="M4 4.00134L1 1.00134M4 4.00134L7 7.00134M4 4.00134L7 1.00134M4 4.00134L1 7.00134"
                                  stroke="black"
                                  strokeWidth="1.3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </span>
                        ))}

                        <input
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onKeyDown={(e) =>
                            ["Enter", ","].includes(e.key) &&
                            (e.preventDefault(), addTag())
                          }
                          className="outline-none bg-transparent"
                          placeholder={value ? "" : "Type tags"}
                        />
                      </div>
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Maximum 20 characters; no special symbols
                        </p>
                      </div>
                      {errors.tags && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.tags}
                        </p>
                      )}
                    </div>

                    {/*Compatible With */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Compatible Width
                      </label>
                      <input
                        type="text"
                        placeholder="Type compatible width"
                        value={form.compatible}
                        onChange={(e) =>
                          handleChange("compatible", e.target.value)
                        }
                        className={`2xl:py-[11px] sm:py-[10px] py-2 ${inputClass("compatible")}`}
                      />
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Minimum resolution: 800x800 pixels; maximum file size:
                          5MB
                        </p>
                      </div>
                      {errors.compatible && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.compatible}
                        </p>
                      )}
                    </div>

                    {/* Sell Exclusivity.  */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Sell Exclusivity.
                      </label>
                      <div className="flex xl:flex-nowrap flex-wrap items-center justify-between gap-[10px] mb-3 mt-[6px]">
                        <div className="flex items-center gap-[10px]">
                          <input
                            name="sell"
                            type="radio"
                            placeholder="Enter product title"
                            value={form.sell}
                            onChange={(e) =>
                              handleChange("sell", e.target.value)
                            }
                            className="xl:w-5 xl:h-5 w-4 h-4"
                          />
                          <span className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200">
                            I will sell this products exclusively on
                            WebbyTemplate.
                          </span>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <input
                            name="sell"
                            type="radio"
                            placeholder="Enter product title"
                            value={form.sell}
                            onChange={(e) =>
                              handleChange("sell", e.target.value)
                            }
                            className="xl:w-5 xl:h-5 w-4 h-4"
                          />
                          <span className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200">
                            I will sell my products on WebbyTemplate and other
                            marketplaces.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Select one option only
                        </p>
                      </div>
                      {errors.sell && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.sell}
                        </p>
                      )}
                    </div>

                    {/* Product Price / Suggested Pricing */}
                    <div>
                      <label className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black mb-[6px]">
                        Product Price / Suggested Pricing
                      </label>
                      <input
                        type="number"
                        placeholder="Type amount"
                        value={form.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className={`2xl:py-[11px] sm:py-[10px] py-2 ${inputClass("price")}`}
                      />
                      <div className="flex items-center gap-[5px] mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                            stroke="#505050"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-gray-200">
                          Positive number; maximum two decimal places
                        </p>
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onPress={handleUploadProduct}
                    className="group btn btn-primary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto sm:mt-7 mt-5"
                  >
                    Upload Product
                  </Button>
                </div>
              </div>

              {/* Cart Total */}
              <div className="border border-primary/10 rounded-md overflow-hidden bg-white xl:w-1/3 md:w-[40%] w-full">
                {/* sub heading */}
                <div className="border-b border-primary/10">
                  <p className="text-black py-[6px] px-5">
                    General Information
                  </p>
                </div>
                <div className="py-4 px-5 space-y-2">
                  <p className="text-black">Product images</p>
                  <div>
                    <div
                      className={`border border-[#B9C0CB] rounded-[5px] border-dashed h-[200px] flex items-center justify-center cursor-pointer transition-all ${
                        isDragging ? "bg-blue-50" : ""
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, false)}
                      onClick={() =>
                        document.getElementById("singleInput").click()
                      }
                    >
                      <input
                        type="file"
                        id="singleInput"
                        hidden
                        accept="image/png,image/jpeg,image/gif"
                        onChange={(e) => handleFileChange(e, false)}
                      />
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="50"
                          height="51"
                          viewBox="0 0 50 51"
                          fill="none"
                        >
                          <path
                            d="M44.2712 27.7516V18.3766C44.2712 15.614 43.1737 12.9644 41.2202 11.0109C39.2667 9.05743 36.6172 7.95996 33.8545 7.95996H16.1462C13.3835 7.95996 10.734 9.05743 8.78046 11.0109C6.82696 12.9644 5.72949 15.614 5.72949 18.3766V32.96C5.72949 34.3279 5.99893 35.6824 6.52241 36.9463C7.0459 38.2101 7.81319 39.3584 8.78046 40.3257C10.734 42.2792 13.3835 43.3766 16.1462 43.3766H29.1878"
                            stroke="#0156D5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.27148 36.085L11.9798 29.4183C12.7295 28.6738 13.7134 28.2111 14.765 28.1086C15.8166 28.0061 16.8713 28.27 17.7507 28.8558C18.63 29.4416 19.6847 29.7056 20.7363 29.6031C21.7879 29.5006 22.7718 29.0379 23.5215 28.2933L28.3756 23.4392C29.7704 22.0396 31.6171 21.1812 33.5861 21.0172C35.5552 20.8531 37.5185 21.394 39.1257 22.5433L44.2715 26.5225M16.6882 21.8558C17.1423 21.8531 17.5915 21.7609 18.01 21.5846C18.4285 21.4083 18.8083 21.1512 19.1275 20.8282C19.4467 20.5051 19.6991 20.1223 19.8704 19.7017C20.0416 19.2811 20.1284 18.8308 20.1256 18.3767C20.1229 17.9225 20.0308 17.4733 19.8544 17.0548C19.6781 16.6363 19.4211 16.2565 19.098 15.9373C18.7749 15.6181 18.3921 15.3657 17.9715 15.1944C17.5509 15.0232 17.1006 14.9364 16.6465 14.9391C15.7293 14.9447 14.8518 15.3143 14.2072 15.9668C13.5625 16.6193 13.2035 17.5011 13.209 18.4183C13.2145 19.3355 13.5842 20.213 14.2366 20.8576C14.8891 21.5023 15.7709 21.8613 16.6882 21.8558Z"
                            stroke="#0156D5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M38.9736 31.9183V42.3349"
                            stroke="#0156D5"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                          />
                          <path
                            d="M43.7505 36.3037L39.6525 32.2058C39.5635 32.1164 39.4577 32.0454 39.3411 31.9969C39.2246 31.9485 39.0996 31.9236 38.9734 31.9236C38.8472 31.9236 38.7222 31.9485 38.6056 31.9969C38.4891 32.0454 38.3833 32.1164 38.2942 32.2058L34.1963 36.3037"
                            stroke="#0156D5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-black mt-2">
                          Drag and drop files, or{" "}
                          <span className="text-primary underline">Browse</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Supports: JPG, PNG, or GIF
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[5px] mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
                          stroke="#505050"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
                          stroke="#505050"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-sm text-gray-200">
                        Minimum resolution: 800x800 pixels; maximum file size:
                        5MB
                      </p>
                    </div>
                    {singleImage && (
                      <div className="relative w-[120px] h-[140px] mt-4 p-1 bg-blue-300/50 border border-primary/10 rounded-[5px]">
                        <img
                          src={singleImage.url}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={removeSingleImage}
                          className="absolute -top-2 -right-2 border-2 border-white bg-primary rounded-full p-1 text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
