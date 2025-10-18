"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Autocomplete,
  AutocompleteItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import Link from "next/link";
import "react-tabulator/lib/styles.css";
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart as RechartsPieChart,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
} from "recharts";

import {
  ChartTooltip,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ReactTabulator } from "react-tabulator";
import DynamicTable from "../common/table";
import { strapiGet, strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { debounce } from "lodash";
import { Button } from "@heroui/button";

const ChartContainers = ({ children, config, className }) => {
  return <div className={`bg-white p-4 ${className}`}>{children}</div>;
};

// dropdown start
const TimeDropdown = ({ selectedTime, setSelectedTime }) => {
  const [isOpend, setIsOpend] = useState(false);

  const timeRef = useRef(null);

  const toggleDropdown = () => setIsOpend(!isOpend);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setIsOpend(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        setIsOpend(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative sm:px-2" ref={timeRef}>
      <div className="relative xl:w-[110px] sm:w-[100px] w-[95px]">
        <div
          onClick={toggleDropdown}
          className="text-gray-300 placeholder:text-gray-300 rounded-[5px] w-full cursor-pointer flex justify-between items-center"
        >
          <span className="text-gray-200">{selectedTime || "This Month"}</span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
              isOpend ? "rotate-180" : "rotate-0"
            }`}
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

        {isOpend && (
          <div className="absolute left-0 right-0 mt-2 border border-primary/10 bg-white rounded-b-md shadow-lg z-50">
            <ul className="text-gray-800">
              {["This Year", "This Month", "Today"].map((time) => (
                <li
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-white text-[15px] ${
                    selectedTime === time ? "bg-primary text-white" : ""
                  }`}
                >
                  {time}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
// dropdown end

export default function DashboardPage({ title }) {
  const [selectedTime, setSelectedTime] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [activePage, setActivePage] = useState(1);
  const [filterData, setFilterData] = useState({});
  const [SummaryOrderData, setSummaryOrderData] = useState([]);
  const [wallet, setWallet] = useState({});
  const [WithdrawAmount, setWithdrawAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const { authUser } = useAuth();
  const formRef = useRef(null);

  const loginUserId = authUser?.id;

  // line-chart
  const data = [
    { day: "01", sales: 120, traffic: 150 },
    { day: "02", sales: 140, traffic: 160 },
    { day: "03", sales: 160, traffic: 170 },
    { day: "04", sales: 180, traffic: 190 },
    { day: "05", sales: 200, traffic: 220 },
    { day: "06", sales: 220, traffic: 260 },
    { day: "07", sales: 240, traffic: 320 },
    { day: "08", sales: 250, traffic: 370 },
    { day: "09", sales: 220, traffic: 350 },
    { day: "10", sales: 190, traffic: 310 },
    { day: "11", sales: 170, traffic: 270 },
    { day: "12", sales: 150, traffic: 230 },
    { day: "13", sales: 130, traffic: 220 },
    { day: "14", sales: 180, traffic: 250 },
    { day: "15", sales: 230, traffic: 280 },
    { day: "16", sales: 280, traffic: 310 },
    { day: "17", sales: 550, traffic: 410 },
    { day: "18", sales: 520, traffic: 400 },
    { day: "19", sales: 490, traffic: 380 },
    { day: "20", sales: 460, traffic: 350 },
    { day: "21", sales: 380, traffic: 330 },
    { day: "22", sales: 400, traffic: 340 },
    { day: "23", sales: 420, traffic: 350 },
    { day: "24", sales: 440, traffic: 360 },
    { day: "25", sales: 460, traffic: 370 },
    { day: "26", sales: 480, traffic: 390 },
    { day: "27", sales: 500, traffic: 410 },
    { day: "28", sales: 450, traffic: 380 },
    { day: "29", sales: 400, traffic: 350 },
    { day: "30", sales: 10, traffic: 15 },
  ];
  const ratings = [100, 200, 300, 400, 500, 600];

  // pie-chart
  const pie_data = [
    { name: "eCommerce", value: 45, color: "#0066FF" },
    { name: "Business Site", value: 39, color: "#1E7F65" },
    { name: "Other Site", value: 16, color: "#C13515" },
  ];

  const CustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Debounced setter using useCallback to ensure it's stable
  const debouncedInputChange = useCallback(
    debounce((name, value) => {
      setFilterData((prev) => ({ ...prev, [name]: value }));
      setActivePage(1);
    }, 300),
    [] // you can add dependencies if needed
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    debouncedInputChange(name, value);
  };

  const handleStatusChange = (value) => {
    if (value !== undefined) {
      setFilterData((prev) => ({ ...prev, feetype: value }));
      setActivePage(1);
    }
  };

  const removeFilter = (key) => {
    setFilterData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const clearAllFilters = (e) => {
    e.preventDefault();
    setFilterData({});
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const page_size = 10;

  useEffect(() => {
    const fetchProductData = async (id) => {
      try {
        setFilteredProducts([]);

        // Prepare the payload as JSON
        const payload = {
          page_size,
          ...filterData,
        };

        // Call the API using the utility function
        const response = await strapiPost(
          `/wallet/user/${id}/find`,
          payload,
          themeConfig.TOKEN
        );

        if (response.data) {
          const productsData = response.data || [];



          const userWallets = productsData.filter(
            (item) => item?.vendor_id?.id === loginUserId
          );

          setFilteredProducts(userWallets);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setFilteredProducts([]);
      }
    };

    if (authUser?.documentId) {
      fetchProductData(authUser?.documentId);
    }
  }, [filterData, authUser, activePage]);

  useEffect(() => {
    const fetchSummaryProductData = async (id) => {
      try {
        // setFilteredProducts([]);

        // Prepare the payload as JSON
        const payload = {
          page_size,
          ...filterData,
        };

        // Call the API using the utility function
        const response = await strapiPost(
          `/orders/products/${id}`,
          payload,
          themeConfig.TOKEN
        );


        setSummaryOrderData(response);

        if (response.data) {
          const productsData = response || [];


          // const userWallets = productsData.filter(
          //   (item) => item?.vendor_id?.id === loginUserId
          // );

          // setFilteredProducts(userWallets);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        // setFilteredProducts([]);
      }
    };

    if (authUser?.documentId) {
      fetchSummaryProductData(authUser?.documentId);
    }
  }, [filterData, authUser, activePage]);

  const CustomLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="flex justify-center sm:gap-6 gap-4 gap-y-2 mt-4 sm:flex-nowrap flex-wrap">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-sm">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  // const getWalletData = async (userId) => {
  //   try {
  //     const walletData = await strapiGet(`wallets`, {
  //       params: { populate: "*" },
  //       token: themeConfig.TOKEN,
  //     });


  //     const allWallets = walletData || [];

  //     const userWallets = allWallets.filter(
  //       (item) => item?.vendor_id?.id === userId
  //     );

  //     setwalletData(userWallets);
  //   } catch (error) {
  //     toast.error("Failed to load product data.");
  //   }
  // };

  // useEffect(() => {
  //   if (loginUserId) {
  //     getWalletData(loginUserId);
  //   }
  // }, [loginUserId]);

  // table
  const columns = [
    {
      title: "No.",
      field: "no",
      hozAlign: "center",
      width: 50,
      formatter: function (cell) {
        return `<div class="number">${cell.getValue()}</div>`;
      },
    },
    {
      title: "Date",
      field: "date",
      hozAlign: "center",
      widthGrow: 2,
    },
    {
      title: "Order ID",
      field: "order_id",
      hozAlign: "center",
      widthGrow: 2,
    },
    {
      title: "Type",
      field: "type",
      hozAlign: "center",
      widthGrow: 2,
    },
    {
      title: "Product Name",
      field: "transaction_product",
      hozAlign: "center",
      widthGrow: 2,
    },
    { title: "Price", field: "price", hozAlign: "center", widthGrow: 1.5 },
    { title: "Amount", field: "amount", hozAlign: "center", widthGrow: 1.5 },
  ];

  const tableData = filteredProducts
    .filter((item) => item.product_id) // ✅ only include items with product_id
    .map((item, index) => ({
      no: index + 1,
      date: new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      order_id: item.order_id?.documentId || "N/A",
      type: item?.for || "N/A",
      transaction_product: item.product_id?.title || "N/A", // safe access
      price: `$${item.amounts?.toFixed(2) || "0.00"}`,
      amount: `$${item.amounts?.toFixed(2) || "0.00"}`,
    }));

  const statuses = [
    {
      label: "Author Fee",
      value: "author fee",
      color: "text-primary",
    },
    {
      label: "Sell",
      value: "sell",
      color: "text-[#ED9A12]",
    },
    {
      label: "Payout",
      value: "payout",
      color: "text-[#257C65]",
    },
  ];

  // order summary logic

  const summarycolums = [
    {
      title: "No.",
      field: "no",
      hozAlign: "center",
      width: 50,
      formatter: function (cell) {
        return `<div class="number">${cell.getValue()}</div>`;
      },
    },
    {
      title: "Product Name",
      field: "product",
      hozAlign: "center",
      widthGrow: 2,
    },
    {
      title: "Buyer Name",
      field: "buyer",
      hozAlign: "center",
      widthGrow: 2,
    },
    {
      title: "License-Type",
      field: "liIcense",
      hozAlign: "center",
      widthGrow: 2,
    },
    { title: "Price", field: "price", hozAlign: "center", widthGrow: 1.5 },
    {
      title: "Date-Sold",
      field: "date",
      hozAlign: "center",
      widthGrow: 2,
    },
    {
      title: "Status",
      field: "status",
      hozAlign: "center",
      widthGrow: 2,
    },
  ];

  const tableSummaryData = SummaryOrderData.map((item, index) => ({
    no: index + 1,
    date: new Date(item?.date_sold).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    product: item?.productTitle, // static for now
    buyer: item?.buyer_name,
    liIcense: item?.license_title,
    status: item?.status,
    price: `$${item?.price?.toFixed(2) || "0.00"}`,
    // order_id: item.order_id?.documentId || "N/A",
    // type: item?.for || "N/A",
    // amount: `$${item.amounts?.toFixed(2) || "0.00"}`,
  }));

  // const loginUserId

  const getUserData = async (id) => {
    if (!id) {
      console.warn("No loginUserId provided to getUserData");
      return;
    }

    try {
      const userData = await strapiGet(`users/${id}`, {
        params: { populate: "*" },
        token: themeConfig.TOKEN,
      });

      setWallet(userData?.wallet_setting);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (loginUserId) {
      getUserData(loginUserId);
    }
  }, [loginUserId]);

  const WalletSetting = [
    {
      title: "Open Amount",
      value: wallet?.open_amount || 0,
    },
    {
      title: "Review Amount",
      value: wallet?.review_amount || 0,
    },
    {
      title: "Hold Amount",
      value: wallet?.hold_amount || 0,
    },
    {
      title: "Refund Amount",
      value: wallet?.refund_amount || 0,
    },
  ];

  // 🔑 One function handles multiple field types
  const handleInfoClick = (value) => {
    setWithdrawAmount(value);
    onOpen();
  };

  const handleFullClick = () => {
    setAmount(WithdrawAmount);
  };

  const handleWithdraw = async () => {
    // Validation
    if (!amount) {
      setError("Please enter an amount.");
      return;
    }
    if (amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    if (amount > WithdrawAmount) {
      setError("Amount cannot be greater than available withdraw amount.");
      return;
    }

    // ✅ If validation passes
    setError("");
    setSuccess(true);

    try {
      const payload = {
        data: {
          // 🔑 wrap fields inside `data`
          payment_type: "Stripe",
          Email: "admin@gmail.com",
          note: "Withdraw Amount",
          user: 68,
          transaction_id: "242gyhasgd2",
          withdraw_amount: amount,
        },
      };

      const response = await strapiPost(
        `/withdraws`, // Strapi v5 collection API
        payload,
        themeConfig.TOKEN
      );

      // You can show toast or popup here
    } catch (err) {
      console.error("Error creating withdraw:", err);
      setError("Failed to create withdraw request. Please try again.");
    }
  };

  const resetWithdrawState = () => {
    setError("");
    setSuccess(false);
    setAmount("");
  };

  const handleClose = () => {
    resetWithdrawState();
    onOpenChange(); // call parent close handler
  };

  const handleModalOpenChange = (open) => {
    if (!open) {
      resetWithdrawState();
    }
    onOpenChange();
  };

  return (
    <>
      <div className="py-[27px] min-h-[1200px]">
        <div className="flex items-start justify-between sm:flex-nowrap flex-wrap mb-6 ">
          {/* Heading */}
          <h1 className="h2 sm:absolute mb-4">{title}</h1>
          <div className="flex w-full flex-col">
            {/* main-content */}
            <Tabs
              aria-label="Options"
              classNames={{
                // Align tab group to the right
                base: " bg-transparent",
                tabList:
                  "2xl:w-[510px] xl:w-[480px] lg:w-[400px] w-[350px] h-max ms-auto gap-0 p-0 overflow-hidden rounded-[5px] bg-white border border-primary/10 divide-x divide-primary/10 hover:1text-primary mb-5",
                // Tab button base styles
                tab: "relative lg:h-auto 2xl:px-5 lg:px-4 px-3 2xl:py-[11px] xl:py-[9px] lg:py-[7px] py-[5px] rounded-none 2xl:text-base text-[15px] md:leading-[25px] leading-5 hover:text-primary transition group-data-[selected=true]:bg-primary group-data-[selected=true]:text-white",
                // Selected tab state
                tabContent:
                  "group-data-[selected=true]:text-white data-hover-unselected:text-primary !hover:text-primary",
                // Underline indicator
                cursor:
                  "bg-transparent bg-primary p-0 h-auto rounded-none hover:text-primary",
              }}
            >
              <Tab key="summary" title="Summary" className="p-0">
                <Card className="shadow-none px-0  bg-transparent">
                  <CardBody className="p-0">
                    <div>
                      <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
                        <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
                          <p className="text-black">Profit and Balance</p>
                          <p className="p2 !text-[#777777]">
                            Last reviewing Jan, 23
                          </p>
                        </div>
                        <div className="flex flex-wrap lg:flex-nowrap lg:divide-x divide-primary/10 2xl:py-7 lg:py-6 2xl:px-5 lg:px-4">
                          {WalletSetting &&
                            WalletSetting.map((data, index) => {
                              return (
                                <div
                                  className="w-full sm:w-1/2 lg:w-[23%] sm:p-4 p-3 lg:py-0"
                                  key={index}
                                >
                                  <div className="flex flex-col gap-2">
                                    <p className="p2">{data?.title}</p>
                                    <div className="flex items-center justify-between w-full">
                                      <p className="font-bold text-black">
                                        ${data?.value}
                                      </p>
                                      {/* <div className="flex items-center gap-[3px]">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="22"
                                          height="22"
                                          viewBox="0 0 22 22"
                                          fill="none"
                                        >
                                          <path
                                            d="M7.7474 7.75V4.5C7.7474 2.70507 9.20247 1.25 10.9974 1.25C12.7923 1.25 14.2474 2.70507 14.2474 4.5V7.75M4.4974 5.58333H17.4974L18.5807 19.6667H3.41406L4.4974 5.58333Z"
                                            stroke="#0156D5"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                        <p className="p2">960</p>
                                      </div> */}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                          <div className="w-full sm:w-1/2 lg:w-[28%] sm:p-4 p-3 lg:py-0 lg:pl-4 lg:border-0 sm:border-l border-t border-primary/10">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col gap-2">
                                <p className="p2">Available</p>
                                <p className="font-bold text-black">
                                  ${WalletSetting?.[0]?.value}
                                </p>
                              </div>
                              <div>
                                <button
                                  className="btn btn-primary h-auto flex items-center justify-center xl:gap-[10px] gap-1"
                                  onClick={() =>
                                    handleInfoClick(WalletSetting?.[0]?.value)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                    className="xl:w-6 xl:h-6 w-5 h-5"
                                  >
                                    <g clipPath="url(#clip0_2580_205)">
                                      <path
                                        d="M14.4074 2.72815C14.4407 2.68611 14.4819 2.65107 14.5287 2.62503C14.5756 2.59899 14.6271 2.58248 14.6803 2.57644C14.7336 2.5704 14.7875 2.57495 14.8389 2.58983C14.8904 2.60471 14.9384 2.62963 14.9802 2.66315L15.8577 3.36677L12.6492 7.4504H14.7162L17.1277 4.3824L19.1622 6.01227C19.2048 6.0464 19.2401 6.08878 19.266 6.13687C19.2919 6.18496 19.3078 6.23777 19.3128 6.29216C19.3178 6.34654 19.3118 6.40137 19.2951 6.45338C19.2785 6.50538 19.2515 6.55349 19.2158 6.59483L18.4781 7.4504H20.6019C20.8817 7.0277 20.9933 6.51569 20.9148 6.01492C20.8363 5.51415 20.5734 5.06082 20.1778 4.74396L15.9959 1.39483C15.787 1.22757 15.5471 1.10324 15.29 1.02898C15.0328 0.954723 14.7636 0.932004 14.4977 0.962129C14.2318 0.992255 13.9744 1.07463 13.7404 1.20452C13.5065 1.33441 13.3004 1.50926 13.1342 1.71902L8.59481 7.4504H10.6675L14.4074 2.72815ZM16.0625 14.7629C15.847 14.7629 15.6403 14.8485 15.488 15.0009C15.3356 15.1532 15.25 15.3599 15.25 15.5754C15.25 15.7909 15.3356 15.9975 15.488 16.1499C15.6403 16.3023 15.847 16.3879 16.0625 16.3879H18.5C18.7155 16.3879 18.9222 16.3023 19.0745 16.1499C19.2269 15.9975 19.3125 15.7909 19.3125 15.5754C19.3125 15.3599 19.2269 15.1532 19.0745 15.0009C18.9222 14.8485 18.7155 14.7629 18.5 14.7629H16.0625ZM3.875 5.0129C3.22853 5.0129 2.60855 5.2697 2.15143 5.72682C1.69431 6.18394 1.4375 6.80393 1.4375 7.4504V19.2316C1.4375 20.2013 1.82271 21.1313 2.50839 21.817C3.19407 22.5027 4.12405 22.8879 5.09375 22.8879H18.9062C19.8759 22.8879 20.8059 22.5027 21.4916 21.817C22.1773 21.1313 22.5625 20.2013 22.5625 19.2316V11.9191C22.5625 10.9494 22.1773 10.0195 21.4916 9.33379C20.8059 8.64811 19.8759 8.2629 18.9062 8.2629H3.875C3.65951 8.2629 3.45285 8.17729 3.30048 8.02492C3.1481 7.87255 3.0625 7.66589 3.0625 7.4504C3.0625 7.23491 3.1481 7.02825 3.30048 6.87587C3.45285 6.7235 3.65951 6.6379 3.875 6.6379H7.59625L8.893 5.0129H3.875ZM3.0625 19.2316V9.74977C3.31681 9.83915 3.59063 9.8879 3.875 9.8879H18.9062C19.445 9.8879 19.9616 10.1019 20.3426 10.4828C20.7235 10.8638 20.9375 11.3804 20.9375 11.9191V19.2316C20.9375 19.7704 20.7235 20.287 20.3426 20.668C19.9616 21.0489 19.445 21.2629 18.9062 21.2629H5.09375C4.55503 21.2629 4.03837 21.0489 3.65744 20.668C3.27651 20.287 3.0625 19.7704 3.0625 19.2316Z"
                                        fill="white"
                                      />
                                    </g>
                                  </svg>
                                  Withdraw
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex items-start lg:flex-row flex-col gap-5 my-[20px] overflow-hidden">
                        <div className="border border-primary/10 rounded-md overflow-hidden xl:w-2/3 lg:w-3/5 w-full">
                          <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-2 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white">
                            <p className="text-black">Performance analytics</p>
                            <div className="flex flex-wrap justify-center gap-y-6">
                              {[0].map((index) => (
                                <TimeDropdown
                                  key={index}
                                  selectedTime={selectedTime}
                                  setSelectedTime={setSelectedTime}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="line-chart relative z-0 overflow-visible">
                            <ChartContainers
                              config={{
                                sales: {
                                  label: "Sales",
                                  color: "#0156D5", // Blue for sales
                                },
                                traffic: {
                                  label: "Traffic",
                                  color: "#C32D0B", // Red for traffic
                                },
                              }}
                              className="relative h-[318px]"
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={data}
                                  margin={{
                                    top: 0,
                                    right: 15,
                                    left: -25,
                                    bottom: -25,
                                  }}
                                >
                                  <XAxis
                                    dataKey="day"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                  />
                                  <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    ticks={ratings}
                                    domain={[0, 700]}
                                  />
                                  <Tooltip />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#0156D5" // Blue for sales
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="traffic"
                                    stroke="#C32D0B" // Red for traffic
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </ChartContainers>
                          </div>
                        </div>

                        <div className="xl:w-1/3 lg:w-2/5 w-full border border-primary/10 rounded-md overflow-hidden pie-chart">
                          <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white">
                            <p className="text-black">Performance analytics</p>
                            <div className="flex flex-wrap justify-center gap-y-6">
                              {[0].map((index) => (
                                <TimeDropdown
                                  key={index}
                                  selectedTime={selectedTime}
                                  setSelectedTime={setSelectedTime}
                                />
                              ))}
                            </div>
                          </div>
                          {pie_data && (
                            <ChartContainer
                              config={{
                                search: {
                                  label: "Search",
                                  color: "hsl(var(--chart-1))",
                                },
                                social: {
                                  label: "Social",
                                  color: "hsl(var(--chart-2))",
                                },
                                direct: {
                                  label: "Direct",
                                  color: "hsl(var(--chart-3))",
                                },
                                referral: {
                                  label: "Referral",
                                  color: "hsl(var(--chart-4))",
                                },
                              }}
                              className="h-[318px] !pb-5 aspect-auto bg-white"
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                  <ChartTooltip
                                    content={<ChartTooltipContent />}
                                  />
                                  <Pie
                                    data={pie_data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={CustomizedLabel}
                                    outerRadius={100}
                                    dataKey="value"
                                    nameKey="name"
                                  >
                                    {pie_data.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                      />
                                    ))}
                                  </Pie>
                                  <Legend content={CustomLegend} />
                                </RechartsPieChart>
                              </ResponsiveContainer>
                            </ChartContainer>
                          )}
                        </div>
                      </div> */}

                      {/* recent selling products */}
                      <div className="my-[20px] p-3 bg-white border border-primary/10 rounded-md overflow-hidden">
                        <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full sm:px-5 px-3 py-[6px] mb-2 bg-white">
                          <p className="text-black">Recent Selling Products</p>
                          <div className="flex flex-wrap justify-center gap-y-6">
                            {[0].map((index) => (
                              <TimeDropdown
                                key={index}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="bg-white overflow-x-auto">
                          <DynamicTable
                            data={tableSummaryData}
                            columns={summarycolums}
                          />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="transactions" title="Transactions">
                <Card>
                  <CardBody>
                    {/* Filter Fields */}
                    <form
                      ref={formRef}
                      className="grid items-end lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px] mb-5"
                    >
                      <div>
                        <Input
                          isRequired={false}
                          name="orderid"
                          classNames={{
                            input:
                              "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                            inputWrapper:
                              "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                            label:
                              "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                          }}
                          onChange={handleInputChange}
                          label="Order Id "
                          labelPlacement="outside"
                          placeholder="Enter order id"
                          type="text"
                          variant="bordered"
                        />
                      </div>
                      <div>
                        <Input
                          isRequired={false}
                          name="search"
                          classNames={{
                            input:
                              "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                            inputWrapper:
                              "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                            label:
                              "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                          }}
                          onChange={handleInputChange}
                          label="Product Name"
                          labelPlacement="outside"
                          placeholder="Enter product name"
                          type="text"
                          variant="bordered"
                        />
                      </div>
                      <div>
                        <Autocomplete
                          name="feetype"
                          className="!bg-white custom-auto-complete"
                          classNames={{
                            mainWrapper: "!bg-white",
                            innerWrapper:
                              "border !border-gray-100 !bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center",
                            input:
                              "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                            inputWrapper: "!bg-transparent",
                          }}
                          label="State"
                          items={statuses}
                          labelPlacement="outside"
                          placeholder="Select State"
                          // selectedKey={filterData?.status || ""}
                          onSelectionChange={handleStatusChange}
                        >
                          {(item) => (
                            <AutocompleteItem
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>
                      </div>
                    </form>

                    {/* Filter tags */}

                    {filterData &&
                      Object.values(filterData).some(
                        (value) =>
                          value !== null && value !== "" && value !== undefined
                      ) && (
                        <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap py-[26px]">
                          <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5  !text-black">
                            Applied Filters:
                          </p>

                          {Object.entries(filterData).map(([key, value]) => {
                            if (
                              !value ||
                              value === undefined ||
                              value === null ||
                              value === ""
                            )
                              return null;
                            return (
                              <div
                                key={key}
                                className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0"
                              >
                                <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                                  {key}:{" "}
                                  <span className="!text-black">{value}</span>
                                </p>
                                <button onClick={() => removeFilter(key)}>
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
                                </button>
                              </div>
                            );
                          })}

                          <Link
                            href="/"
                            onClick={clearAllFilters}
                            className="2xl:!text-base sm:!text-[15px] !text-sm all-btn inline-flex items-center border-b border-transparent hover:border-primary gap-2 hover:opacity-100"
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
                            </svg>{" "}
                            Clear All
                          </Link>
                        </div>
                      )}

                    <DynamicTable
                      data={tableData}
                      columns={columns}
                      options={{
                        responsiveLayout: true,
                        rowHeader: {
                          formatter: "rownum",
                          headerSort: false,
                          hozAlign: "center",
                          resizable: false,
                          frozen: true,
                        },
                      }}
                      className="pt-5"
                    />
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={handleModalOpenChange}>
        <ModalContent className="!p-0 !bg-white rounded-xl shadow-xl max-w-md mx-auto">
          <ModalHeader className="!pt-8 !pb-2 !px-8 flex-col !items-start">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Withdraw</h2>
              {/* <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button> */}
            </div>
          </ModalHeader>

          <ModalBody className="!px-8 !pt-2 !pb-8">
            {!success ? (
              <>
                <div className="mb-8">
                  <p className="text-sm text-black mb-2">Available Amount:</p>
                  <p className="text-xl font-bold text-blue-600">
                    ${WithdrawAmount || 0}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-3">
                    Amount *
                  </label>
                  <div className="relative">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <div className="px-4 py-4 text-gray-400 font-normal">
                        $
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 bg-transparent text-black placeholder:text-gray-400 py-4 px-2 focus:outline-none font-medium text-lg"
                      />
                      <button
                        onClick={handleFullClick}
                        className="px-5 py-4 text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors border-l border-gray-200"
                      >
                        Max
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                <div className="mt-8">
                  <Button
                    onClick={handleWithdraw}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg text-lg transition-colors"
                  >
                    Withdraw
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mb-8">
                  {/* Success Checkmark Icon */}
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <svg
                      className="w-10 h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {/* Circular border */}
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-black mb-3">
                    Withdrawal Successful
                  </h2>

                  {/* Date and Time */}
                  <p className="text-gray-500 text-sm mb-8">
                    {new Date().toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                    ,{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4 bg-gray-50 rounded-lg p-6">
                  {/* Withdrawn Amount */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Withdrawn Amount :
                    </span>
                    <span className="text-black font-medium">
                      ${amount || "0.00"}
                    </span>
                  </div>

                  {/* Withdrawal Fee */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Withdrawal Fee :
                    </span>
                    <span className="text-black font-medium">- $15.30</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-300 my-4"></div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Total :</span>
                    <span className="text-blue-600 font-bold text-lg">
                      ${(parseFloat(amount || 0) - 15.3).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
