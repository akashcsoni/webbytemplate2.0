"use client";

import React, {
  useRef,
  useState,
  useEffect,
  createContext,
  Suspense,
} from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
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
import Loading from "../../loading";

const ChartContainers = ({ children, config, className }) => {
  return <div className={`bg-white p-4 ${className}`}>{children}</div>;
};

// dropdown start
const TimeDropdown = ({ selectedTime, setSelectedTime }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        setIsOpen(false);
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
              isOpen ? "rotate-180" : "rotate-0"
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

        {isOpen && (
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

export default function DashboardPage() {
  const [selectedTime, setSelectedTime] = useState("");
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
      title: "Product Name",
      field: "product",
      hozAlign: "center",
      widthGrow: 2,
    },
    { title: "Buyer Name", field: "buyer", hozAlign: "center", widthGrow: 1 },
    {
      title: "License Type",
      field: "license",
      hozAlign: "center",
      widthGrow: 1.5,
    },
    { title: "Price", field: "price", hozAlign: "center", widthGrow: 1.5 },
    { title: "Date Sold", field: "date", hozAlign: "center" },
    {
      title: "Status",
      field: "status",
      hozAlign: "center",
      width: 100,
      formatter: function (cell) {
        const value = cell.getValue();
        const style =
          value === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-600";
        return `<span class="px-3 py-1 text-xs font-medium rounded-full ${style}">${value}</span>`;
      },
    },
    { title: "Earnings", field: "earnings", hozAlign: "center" },
  ];
  // table data
  const recent_selling_products_data = [
    {
      no: 1,
      product: "Modern Portfolio Template",
      buyer: "Sarah J.",
      license: "Regular License",
      price: "$19.00",
      date: "Apr 20, 2025",
      status: "Completed",
      earnings: "$15.20",
    },
    {
      no: 2,
      product: "eCommerce UI Kit",
      buyer: "Mark T.",
      license: "Extended License",
      price: "$120.00",
      date: "Apr 19, 2025",
      status: "Completed",
      earnings: "$96.00",
    },
    {
      no: 3,
      product: "Minimal Blog Template",
      buyer: "Laura K.",
      license: "Regular License",
      price: "$15.00",
      date: "Apr 19, 2025",
      status: "Refunded",
      earnings: "$0.00",
    },
    {
      no: 4,
      product: "Dashboard Admin Panel",
      buyer: "DevCorp Ltd.",
      license: "Extended License",
      price: "$150.00",
      date: "Apr 18, 2025",
      status: "Completed",
      earnings: "$120.00",
    },
    {
      no: 7,
      product: "Creative Agency Template",
      buyer: "Alan W.",
      license: "Regular License",
      price: "$22.00",
      date: "Apr 16, 2025",
      status: "Completed",
      earnings: "$17.60",
    },
    {
      no: 6,
      product: "Multi-Purpose Template Pack",
      buyer: "Emma G.",
      license: "Regular License",
      price: "$25.00",
      date: "Apr 16, 2025",
      status: "Completed",
      earnings: "$20.00",
    },
    {
      no: 5,
      product: "Startup Landing Page",
      buyer: "Jason B.",
      license: "Regular License",
      price: "$17.00",
      date: "Apr 17, 2025",
      status: "Refunded",
      earnings: "$0.00",
    },
    {
      no: 8,
      product: "Crypto Dashboard UI",
      buyer: "Binance Labs",
      license: "Extended License",
      price: "$180.00",
      date: "Apr 15, 2025",
      status: "Completed",
      earnings: "$144.00",
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <div className="py-[27px]">
        <div className="flex items-start justify-between sm:flex-nowrap flex-wrap mb-6 ">
          {/* Heading */}
          <h1 className="h2 sm:absolute mb-4">Dashboard</h1>
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
                  <CardBody className="p-0 ">
                    <div>
                      <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
                        <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
                          <p className="text-black">Profit and Balance</p>
                          <p className="p2 !text-[#777777]">
                            Last reviewing Jan, 23
                          </p>
                        </div>
                        <div className="flex flex-wrap lg:flex-nowrap lg:divide-x divide-primary/10 2xl:py-7 lg:py-6 2xl:px-5 lg:px-4">
                          <div className="w-full sm:w-1/2 lg:w-[23%] sm:p-4 p-3 lg:py-0">
                            <div className="flex flex-col gap-2">
                              <p className="p2">This month</p>
                              <div className="flex items-center justify-between w-full">
                                <p className="font-bold text-black">
                                  $12,256,000
                                </p>
                                <div className="flex items-center gap-[3px]">
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
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-1/2 lg:w-[25%] sm:p-4 p-3 lg:py-0 lg:pl-4 lg:border-0 sm:border-l sm:border-t-0 border-t border-primary/10">
                            <div className="flex flex-col gap-2">
                              <p className="p2">Last 30 days</p>
                              <div className="flex items-center justify-between w-full">
                                <p className="font-bold text-black">
                                  $60,561.55
                                </p>
                                <div className="flex items-center gap-[3px]">
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
                                  <p className="p2">719</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-1/2 lg:w-[25%] sm:p-4 p-3 lg:py-0 lg:pl-4 lg:border-0 border-t border-primary/10">
                            <div className="flex flex-col gap-2">
                              <p className="p2">Total Earnings</p>
                              <div className="flex items-center justify-between w-full">
                                <p className="font-bold text-black">
                                  $32,158.377
                                </p>
                                <div className="flex items-center gap-[3px]">
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
                                  <p className="p2">523</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-1/2 lg:w-[28%] sm:p-4 p-3 lg:py-0 lg:pl-4 lg:border-0 sm:border-l border-t border-primary/10">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col gap-2">
                                <p className="p2">Available</p>
                                <p className="font-bold text-black">
                                  $15,479.238
                                </p>
                              </div>
                              <div>
                                <Link
                                  href="javascript:;"
                                  className="btn btn-primary h-auto flex items-center justify-center xl:gap-[10px] gap-1"
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
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start lg:flex-row flex-col gap-5 my-[20px] overflow-hidden">
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
                      </div>

                      {/* recent selling products */}
                      <div className="my-[20px] border border-primary/10 rounded-md overflow-hidden">
                        <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white">
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

                        <div className="bg-white rounded-md shadow overflow-x-auto md:py-5 py-4">
                          <ReactTabulator
                            data={recent_selling_products_data}
                            columns={columns}
                            resizableRows={false}
                            resizableRowGuide={false}
                            resizableColumnGuide={false}
                            columnDefaults={{
                              resizable: false,
                            }}
                            // autoResize={false}
                            // autoColumns={true}
                            // responsiveLayout={"collapse"}
                            layout="fitColumns"
                            className="tabulator container"
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
                    <ReactTabulator
                      data={recent_selling_products_data}
                      columns={columns}
                      resizableRows={false}
                      resizableRowGuide={false}
                      resizableColumnGuide={false}
                      columnDefaults={{
                        resizable: false,
                      }}
                      // autoResize={false}
                      // autoColumns={true}
                      // responsiveLayout={"collapse"}
                      layout="fitColumns"
                      className="tabulator container"
                    />
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
