"use client";

import React, { useState, useRef } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  DatePicker,
  Input,
  Link,
  Button,
  Textarea,
} from "@heroui/react";
import DynamicTable from "@/components/common/table";
import { useAuth } from "@/contexts/AuthContext";

const ticketSupportPage = () => {
  const { authUser } = useAuth();
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const [formData, setFormData] = useState({
    orderId: "",
    product: "",
    dates: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the specific field's error as soon as the user types
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic
    console.log({ productId, message, file });
  };

  // table
  const columns = [
    {
      title: "Ticket Number",
      field: "ticketNumber",
      hozAlign: "center",
      width: 50,
      formatter: function (cell) {
        return `<div class="flex items-center gap-1">Ticket<span class="text-primary">${cell.getValue()}</span></div>`;
      },
    },
    {
      title: "Product Name",
      field: "productName",
      hozAlign: "center",
      widthGrow: 2,
    },
    {
      title: "Description",
      field: "description",
      hozAlign: "center",
      widthGrow: 1.5,
      formatter: function (cell) {
        return `<div class="text-primary">${cell.getValue()}</div>`;
      },
    },
    { title: "Created by", field: "createdBy", hozAlign: "center" },
    {
      title: "Status",
      field: "status",
      hozAlign: "center",
      width: 120,
      formatter: function (cell) {
        const value = cell.getValue();
        let style = "";
        switch (value) {
          case "Authorized":
            style = "bg-primary/20 text-primary border border-primary";
            break;
          case "Pending":
            style = "bg-[#257C6533] text-[#257C65] border border-[#257C65]";
            break;
          case "Rejected":
            style = "bg-red-100 text-red-600 border border-red-500";
            break;
          default:
            style = "bg-[#C32D0B33] text-[#C32D0B] border border-[#C32D0B]";
        }

        return `<span class="px-3 py-1 text-xs font-semibold rounded-full ${style}">${value}</span>`;
      },
    },
    { title: "Date", field: "dates", hozAlign: "center" },
  ];
  // table data
  const recent_selling_products_data = [
    {
      ticketNumber: "#12345",
      productName: "Orion conduction",
      description:
        "I am trying to upload a ZIP file to my vendor dashboard, but it keeps failing with...",
      createdBy: "Roshan Saxena",
      status: "Authorized",
      dates: "05 May 25",
    },
    {
      ticketNumber: "#12345",
      productName: "Orion conduction",
      description:
        "I am trying to upload a ZIP file to my vendor dashboard, but it keeps failing with...",
      createdBy: "Roshan Saxena",
      status: "Pending",
      dates: "05 May 25",
    },
    {
      ticketNumber: "#12345",
      productName: "Orion conduction",
      description:
        "I am trying to upload a ZIP file to my vendor dashboard, but it keeps failing with...",
      createdBy: "Roshan Saxena",
      status: "Closed",
      dates: "05 May 25",
    },
    {
      ticketNumber: "#12345",
      productName: "Orion conduction",
      description:
        "I am trying to upload a ZIP file to my vendor dashboard, but it keeps failing with...",
      createdBy: "Roshan Saxena",
      status: "Authorized",
      dates: "05 May 25",
    },
  ];

  return (
    <div className="py-[27px] min-h-[717px]">
      <h1 className={`h2 ${authUser?.position === "author" ? "sm:absolute" : ""} mb-4`}>Get Support</h1>
      <div className="flex w-full flex-col">
        {/* main-content */}
        {authUser?.position === "author" ? (
          <Tabs
            aria-label="Options"
            classNames={{
              // Align tab group to the right
              base: "bg-transparent",
              tabList:
                "h-max ms-auto gap-0 p-0 overflow-hidden rounded-[5px] bg-white border border-primary/10 hover:!text-primary mb-5",
              // Tab button base styles
              tab: "relative lg:h-auto 2xl:px-5 lg:px-4 px-3 2xl:py-[11px] xl:py-[9px] lg:py-[7px] py-[5px] rounded-none 2xl:text-base text-[15px] md:leading-[25px] leading-5 hover:text-primary transition group-data-[selected=true]:bg-primary group-data-[selected=true]:text-white",
              // Selected tab state
              tabContent:
                "group-data-[selected=true]:text-white data-hover-unselected:text-primary data-hover:text-primary",
              // Underline indicator
              cursor:
                "bg-transparent btn bg-primary p-0 h-auto !rounded-none hover:text-primary",
            }}
          >
            <Tab key="author" title="Author" className="p-0">
              <Card className="shadow-none px-0 overflow-hidden border border-gray-100">
                <CardBody className="p-0 ">
                  <div>
                    <div className="flex w-full flex-col">
                      <Tabs
                        aria-label="Options"
                        classNames={{
                          // Align tab group to the right
                          base: "bg-transparent",
                          tabList:
                            "h-max gap-0 p-0 overflow-hidden rounded-none text-lg bg-white border-b border-primary/10 w-full",
                          // Tab button base styles
                          tab: "relative lg:h-auto w-auto 2xl:px-5 lg:px-4 px-3 2xl:py-[11px] xl:py-[9px] lg:py-[7px] py-[5px] rounded-none 2xl:text-lg text-[15px] md:leading-[25px] leading-5 transition group-data-[selected=true]:text-primary",
                          // Selected tab state
                          tabContent:
                            "group-data-[selected=true]:text-primary data-hover-unselected:text-primary hover:text-primary hover:opacity-100",
                          // Underline indicator
                          cursor:
                            "bg-transparent btn bg-transparent p-0 h-auto !rounded-none hover:text-primary border-b-2 border-primary shadow-none",
                          panel: "!shadow-none",
                        }}
                      >
                        <Tab
                          key="checkTicketStatus"
                          title="Check Ticket Status"
                          className="p-0"
                        >
                          <Card className="shadow-none px-0">
                            <CardBody className="p-0">
                              <div className="grid items-end xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]">
                                <div>
                                  <Input
                                    isRequired={false}
                                    name="Ticket Number"
                                    classNames={{
                                      input:
                                        "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                      inputWrapper:
                                        "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                      label:
                                        "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                    }}
                                    value={formData.ticketNumber}
                                    onChange={handleChange}
                                    label="Ticket Number"
                                    labelPlacement="outside"
                                    placeholder="Enter ticket number"
                                    type="text"
                                    variant="bordered"
                                  />
                                </div>
                                <div>
                                  <Input
                                    isRequired={false}
                                    name="productName"
                                    classNames={{
                                      input:
                                        "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                      inputWrapper:
                                        "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                      label:
                                        "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                    }}
                                    value={formData.productName}
                                    onChange={handleChange}
                                    label="Product Name"
                                    labelPlacement="outside"
                                    placeholder="Enter product name"
                                    type="text"
                                    variant="bordered"
                                  />
                                </div>
                                <div>
                                  <Input
                                    isRequired={false}
                                    name="status"
                                    classNames={{
                                      input:
                                        "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                      inputWrapper:
                                        "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                      label:
                                        "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                    }}
                                    value={formData.status}
                                    onChange={handleChange}
                                    label="Status"
                                    labelPlacement="outside"
                                    placeholder="Select status"
                                    type="text"
                                    variant="bordered"
                                  />
                                </div>
                                <div className="relative">
                                  <DatePicker
                                    classNames={{
                                      cell: "2xl:!text-sm !text-xs",
                                      input:
                                        "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                      inputWrapper:
                                        "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border border-gray-100 outline-none flex !bg-white",
                                      label:
                                        "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                    }}
                                    label="Date Purchased"
                                    labelPlacement="outside"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap py-[26px]">
                                {/* border-b border-primary/10 */}
                                <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5  !text-black">
                                  Applied Filters:
                                </p>
                                <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                                  <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                                    Tkt No:
                                    <span className="!text-black">#12345</span>
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
                                    Pro Name:
                                    <span className="!text-black">
                                      Orion conduction
                                    </span>
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
                                    Status:
                                    <span className="!text-black">Pending</span>
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
                                    Date:
                                    <span className="!text-black">
                                      2 march, 2025
                                    </span>
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

                              <DynamicTable
                                data={recent_selling_products_data}
                                columns={columns}
                                layout="fitColumns"
                              />
                            </CardBody>
                          </Card>
                        </Tab>
                        <Tab
                          key="RaiseANewTicket"
                          title="Raise a New ticket"
                          className="p-0"
                        >
                          <Card className="shadow-none px-0">
                            <CardBody className="p-12">
                              <div className="bg-white">
                                <div className="flex flex-utems-start justify-between w-full gap-[105px]">
                                  <div className="bg-white w-3/5">
                                    <form
                                      onSubmit={handleSubmit}
                                      className="space-y-[7px]"
                                    >
                                      <div className="flex items-start gap-[30px]">
                                        <div className="overflow-hidden grid justify-items-center gap-[7px] flex-shrink-0">
                                          <div className="w-6 h-6 bg-primary border-2 border-primary rounded-full flex items-center justify-center">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="20"
                                              height="20"
                                              viewBox="0 0 20 20"
                                              fill="none"
                                            >
                                              <path
                                                d="M7.95783 12.625L15.0203 5.5625C15.187 5.39583 15.3814 5.3125 15.6037 5.3125C15.8259 5.3125 16.0203 5.39583 16.187 5.5625C16.3537 5.72917 16.437 5.92722 16.437 6.15667C16.437 6.38611 16.3537 6.58389 16.187 6.75L8.54117 14.4167C8.3745 14.5833 8.18005 14.6667 7.95783 14.6667C7.73561 14.6667 7.54117 14.5833 7.3745 14.4167L3.79117 10.8333C3.6245 10.6667 3.5445 10.4689 3.55117 10.24C3.55783 10.0111 3.64478 9.81306 3.812 9.64583C3.97922 9.47861 4.17728 9.39528 4.40617 9.39583C4.63505 9.39639 4.83283 9.47972 4.9995 9.64583L7.95783 12.625Z"
                                                fill="white"
                                              />
                                            </svg>
                                          </div>
                                          <div className="h-20 border border-blue-300 w-[2px]"></div>
                                        </div>
                                        <div className="w-full">
                                          <Input
                                            isRequired={false}
                                            name="product"
                                            classNames={{
                                              base: "",
                                              input:
                                                "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                              inputWrapper:
                                                "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                              label:
                                                "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                            }}
                                            value={formData.product}
                                            onChange={handleChange}
                                            label="Product Id / Product Name"
                                            labelPlacement="outside"
                                            placeholder="Enter product Id / product name"
                                            type="text"
                                            variant="bordered"
                                          />
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-[30px]">
                                        <div className="overflow-hidden grid justify-items-center gap-[7px] flex-shrink-0">
                                          <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="20"
                                              height="20"
                                              viewBox="0 0 20 20"
                                              fill="none"
                                            >
                                              <path
                                                d="M7.95783 12.625L15.0203 5.5625C15.187 5.39583 15.3814 5.3125 15.6037 5.3125C15.8259 5.3125 16.0203 5.39583 16.187 5.5625C16.3537 5.72917 16.437 5.92722 16.437 6.15667C16.437 6.38611 16.3537 6.58389 16.187 6.75L8.54117 14.4167C8.3745 14.5833 8.18005 14.6667 7.95783 14.6667C7.73561 14.6667 7.54117 14.5833 7.3745 14.4167L3.79117 10.8333C3.6245 10.6667 3.5445 10.4689 3.55117 10.24C3.55783 10.0111 3.64478 9.81306 3.812 9.64583C3.97922 9.47861 4.17728 9.39528 4.40617 9.39583C4.63505 9.39639 4.83283 9.47972 4.9995 9.64583L7.95783 12.625Z"
                                                fill="white"
                                              />
                                            </svg>
                                          </div>
                                          <div className="h-[165px] border border-blue-300 w-[2px]"></div>
                                        </div>
                                        <div className="w-full">
                                          <Textarea
                                            classNames={{
                                              inputWrapper:
                                                "w-full border border-primary/10 xl:py-3 py-2 xl:px-5 md:px-4 px-3 lg:!h-[120px] md:!h-[110px] !h-[100px] focus:outline-none !bg-white rounded-[5px]",
                                              base: "!bg-white",
                                              input:
                                                "xl:!text-base md:!text-[15px] !text-sm placeholder:!text-gray-300 !font-normal",
                                              label:
                                                "2xl:text-base md:text-[15px] text-sm ",
                                            }}
                                            description={
                                              <div className="flex items-center gap-[5px]">
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
                                                <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
                                                  Maximum 500 characters; no
                                                  links or special symbols
                                                </p>
                                              </div>
                                            }
                                            defaultValue={formData.bio}
                                            onChange={handleChange}
                                            label="About Bio"
                                            labelPlacement="outside"
                                            placeholder="Write about bio..."
                                            type="text"
                                            variant="bordered"
                                          />
                                        </div>
                                      </div>

                                      <div className="flex items-stretch gap-[30px] w-full ">
                                        <div className="overflow-hidden grid justify-items-center gap-[7px] flex-shrink-0">
                                          <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="20"
                                              height="20"
                                              viewBox="0 0 20 20"
                                              fill="none"
                                            >
                                              <path
                                                d="M7.95783 12.625L15.0203 5.5625C15.187 5.39583 15.3814 5.3125 15.6037 5.3125C15.8259 5.3125 16.0203 5.39583 16.187 5.5625C16.3537 5.72917 16.437 5.92722 16.437 6.15667C16.437 6.38611 16.3537 6.58389 16.187 6.75L8.54117 14.4167C8.3745 14.5833 8.18005 14.6667 7.95783 14.6667C7.73561 14.6667 7.54117 14.5833 7.3745 14.4167L3.79117 10.8333C3.6245 10.6667 3.5445 10.4689 3.55117 10.24C3.55783 10.0111 3.64478 9.81306 3.812 9.64583C3.97922 9.47861 4.17728 9.39528 4.40617 9.39583C4.63505 9.39639 4.83283 9.47972 4.9995 9.64583L7.95783 12.625Z"
                                                fill="white"
                                              />
                                            </svg>
                                          </div>
                                          <div className="h-[165px] border border-blue-300 w-[2px]"></div>
                                        </div>

                                        <div className="flex flex-col justify-between items-start w-full h-auto">
                                          <div className="flex flex-col gap-2 w-full">
                                            <div className="flex flex-col items-start gap-[6px] w-full">
                                              {/* Hidden File Input */}
                                              <label>Attachment</label>
                                              <Input
                                                ref={fileInputRef}
                                                type="file"
                                                onChange={handleFileChange}
                                                className="hidden"
                                              />
                                              <div className="flex items-center justify-start w-full rounded px-3 py-[9px] !font-normal border border-gray-100 gap-[18px] outline-none">
                                                {/* Custom Upload Button */}
                                                <button
                                                  type="button"
                                                  onClick={handleClick}
                                                  className="px-4 py-1 text-sm rounded-[3px] border border-gray-100 shadow-gray-inset bg-[#F5F5F5] text-black flex items-center justify-center gap-[6px]"
                                                >
                                                  <svg
                                                    width="17"
                                                    height="17"
                                                    viewBox="0 0 17 17"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <path
                                                      d="M8.4769 14.3464L8.47415 8.15626M14.1546 12.0478C14.7053 11.6605 15.1183 11.1078 15.3337 10.4699C15.549 9.83193 15.5554 9.14199 15.352 8.50016C14.9349 7.18304 13.6566 6.46121 12.2752 6.46259H11.477C11.2866 5.71998 10.9301 5.03027 10.4345 4.44538C9.93886 3.86049 9.31701 3.39565 8.61574 3.08588C7.91447 2.77612 7.15206 2.62948 6.38592 2.65702C5.61977 2.68456 4.86986 2.88555 4.19264 3.24487C3.51542 3.60419 2.92855 4.11247 2.4762 4.73144C2.02386 5.35041 1.71784 6.06393 1.58117 6.81829C1.44451 7.57265 1.48077 8.34819 1.68723 9.0865C1.89368 9.82482 2.26494 10.5067 2.77307 11.0807"
                                                      stroke="black"
                                                      strokeWidth="1.4"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                    <path
                                                      d="M10.6622 9.75055L8.4737 7.56201L6.28516 9.75055"
                                                      stroke="black"
                                                      strokeWidth="1.4"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                  </svg>
                                                  Upload files
                                                </button>

                                                {/* File name text */}
                                                <span className="text-sm text-gray-500">
                                                  {fileName ||
                                                    "No file uploaded."}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <Button
                                            type="submit"
                                            className="!py-3 !px-[36px] btn btn-primary "
                                          >
                                            Send
                                          </Button>
                                        </div>
                                      </div>
                                    </form>
                                  </div>

                                  <div className="bg-white w-2/5">
                                    <h3 className="p !text-black mb-4 border-b border-gray-100 pr-7 pb-5">
                                      Before reaching out, check our FAQ section
                                      — it might save you time!
                                    </h3>
                                    <ul className="space-y-[18px]">
                                      <li className="flex-col flex gap-[6px]">
                                        <p className="p2 !text-black">
                                          Q. Where can I access my purchased
                                          files?
                                        </p>
                                        <div className="flex items-start justify-start gap-[5px] pl-5 text-[15px] text-gray-200">
                                          <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-shrink-0"
                                          >
                                            <path
                                              d="M10.6667 12.6667L14 9.33332L10.6667 5.99999"
                                              stroke="#505050"
                                              strokeWidth="1.3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M14 9.33331L8.66667 9.33331C4.98467 9.33331 2 6.34865 2 2.66665L2 1.99998"
                                              stroke="#505050"
                                              strokeWidth="1.3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                          A. Easily find your downloads in your
                                          WebbyTemplate downloads.
                                        </div>
                                      </li>
                                      <li className="flex-col flex gap-[6px]">
                                        <p className="p2 !text-black">
                                          Q. Can I use the template for multiple
                                          projects?
                                        </p>
                                        <div className="flex items-start justify-start gap-[5px] pl-5 text-[15px] text-gray-200">
                                          <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-shrink-0"
                                          >
                                            <path
                                              d="M10.6667 12.6667L14 9.33332L10.6667 5.99999"
                                              stroke="#505050"
                                              strokeWidth="1.3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M14 9.33331L8.66667 9.33331C4.98467 9.33331 2 6.34865 2 2.66665L2 1.99998"
                                              stroke="#505050"
                                              strokeWidth="1.3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                          A. Please check the description type.
                                          Most templates require a separate
                                          description for each project.
                                        </div>
                                      </li>
                                      <li className="flex-col flex gap-[6px]">
                                        <p className="p2 !text-black">
                                          Q. What if I need a refund?
                                        </p>
                                        <div className="flex items-start justify-start gap-[5px] pl-5 text-[15px] text-gray-200">
                                          <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-shrink-0"
                                          >
                                            <path
                                              d="M10.6667 12.6667L14 9.33332L10.6667 5.99999"
                                              stroke="#505050"
                                              strokeWidth="1.3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M14 9.33331L8.66667 9.33331C4.98467 9.33331 2 6.34865 2 2.66665L2 1.99998"
                                              stroke="#505050"
                                              strokeWidth="1.3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                          A. You can request a refund through
                                          the support center within the eligible
                                          timeframe stated in our refund policy.
                                        </div>
                                      </li>
                                      <li className="flex-col flex gap-[6px]">
                                        <p className="p2 !text-black">
                                          Q. How do I contact the product
                                          author?
                                        </p>
                                        <div className="flex items-start justify-start gap-[5px] pl-5 text-[15px] text-gray-200">
                                          <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-shrink-0"
                                          >
                                            <path
                                              d="M10.6667 12.6667L14 9.33332L10.6667 5.99999"
                                              stroke="#505050"
                                              strokeWidth="1.3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M14 9.33331L8.66667 9.33331C4.98467 9.33331 2 6.34865 2 2.66665L2 1.99998"
                                              stroke="#505050"
                                              strokeWidth="1.3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                          A. Use the support message box
                                          provided on your purchase detail page.
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                      </Tabs>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="client" title="Client">
              <Card>
                <CardBody>
                  <div className="grid items-end xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]">
                    <div>
                      <Input
                        isRequired={false}
                        name="Ticket Number"
                        classNames={{
                          input:
                            "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                          inputWrapper:
                            "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                          label:
                            "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                        }}
                        value={formData.ticketNumber}
                        onChange={handleChange}
                        label="Ticket Number"
                        labelPlacement="outside"
                        placeholder="Enter ticket number"
                        type="text"
                        variant="bordered"
                      />
                    </div>
                    <div>
                      <Input
                        isRequired={false}
                        name="productName"
                        classNames={{
                          input:
                            "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                          inputWrapper:
                            "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                          label:
                            "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                        }}
                        value={formData.productName}
                        onChange={handleChange}
                        label="Product Name"
                        labelPlacement="outside"
                        placeholder="Enter product name"
                        type="text"
                        variant="bordered"
                      />
                    </div>
                    <div>
                      <Input
                        isRequired={false}
                        name="status"
                        classNames={{
                          input:
                            "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                          inputWrapper:
                            "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                          label:
                            "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                        }}
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                        labelPlacement="outside"
                        placeholder="Select status"
                        type="text"
                        variant="bordered"
                      />
                    </div>
                    <div className="relative">
                      <DatePicker
                        classNames={{
                          cell: "2xl:!text-sm !text-xs",
                          input:
                            "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                          inputWrapper:
                            "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border border-gray-100 outline-none flex !bg-white",
                          label:
                            "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                        }}
                        label="Date Purchased"
                        labelPlacement="outside"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap py-[26px]">
                    {/* border-b border-primary/10 */}
                    <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5  !text-black">
                      Applied Filters:
                    </p>
                    <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                      <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                        Tkt No:
                        <span className="!text-black">#12345</span>
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
                        Pro Name:
                        <span className="!text-black">Orion conduction</span>
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
                        Status:
                        <span className="!text-black">Pending</span>
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
                        Date:
                        <span className="!text-black">2 march, 2025</span>
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

                  <DynamicTable
                    data={recent_selling_products_data}
                    columns={columns}
                    layout="fitColumns"
                  />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        ) : (
          <Card className="shadow-none px-0 overflow-hidden border border-gray-100">
            <CardBody className="p-0 ">
              <div>
                <div className="flex w-full flex-col">
                  <Tabs
                    aria-label="Options"
                    classNames={{
                      // Align tab group to the right
                      base: "bg-transparent",
                      tabList:
                        "h-max gap-0 p-0 overflow-hidden rounded-none text-lg bg-white border-b border-primary/10 w-full",
                      // Tab button base styles
                      tab: "relative lg:h-auto w-auto 2xl:px-5 lg:px-4 px-3 2xl:py-[11px] xl:py-[9px] lg:py-[7px] py-[5px] rounded-none 2xl:text-lg text-[15px] md:leading-[25px] leading-5 transition group-data-[selected=true]:text-primary",
                      // Selected tab state
                      tabContent:
                        "group-data-[selected=true]:text-primary data-hover-unselected:text-primary hover:text-primary hover:opacity-100",
                      // Underline indicator
                      cursor:
                        "bg-transparent btn bg-transparent p-0 h-auto !rounded-none hover:text-primary border-b-2 border-primary shadow-none",
                      panel: "!shadow-none",
                    }}
                  >
                    <Tab
                      key="checkTicketStatus"
                      title="Check Ticket Status"
                      className="p-0"
                    >
                      <Card className="shadow-none px-0">
                        <CardBody className="p-0">
                          <div className="grid items-end xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]">
                            <div>
                              <Input
                                isRequired={false}
                                name="Ticket Number"
                                classNames={{
                                  input:
                                    "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                  inputWrapper:
                                    "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                  label:
                                    "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                }}
                                value={formData.ticketNumber}
                                onChange={handleChange}
                                label="Ticket Number"
                                labelPlacement="outside"
                                placeholder="Enter ticket number"
                                type="text"
                                variant="bordered"
                              />
                            </div>
                            <div>
                              <Input
                                isRequired={false}
                                name="productName"
                                classNames={{
                                  input:
                                    "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                  inputWrapper:
                                    "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                  label:
                                    "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                }}
                                value={formData.productName}
                                onChange={handleChange}
                                label="Product Name"
                                labelPlacement="outside"
                                placeholder="Enter product name"
                                type="text"
                                variant="bordered"
                              />
                            </div>
                            <div>
                              <Input
                                isRequired={false}
                                name="status"
                                classNames={{
                                  input:
                                    "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                  inputWrapper:
                                    "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                  label:
                                    "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                }}
                                value={formData.status}
                                onChange={handleChange}
                                label="Status"
                                labelPlacement="outside"
                                placeholder="Select status"
                                type="text"
                                variant="bordered"
                              />
                            </div>
                            <div className="relative">
                              <DatePicker
                                classNames={{
                                  cell: "2xl:!text-sm !text-xs",
                                  input:
                                    "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                  inputWrapper:
                                    "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border border-gray-100 outline-none flex !bg-white",
                                  label:
                                    "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                }}
                                label="Date Purchased"
                                labelPlacement="outside"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap py-[26px]">
                            {/* border-b border-primary/10 */}
                            <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5  !text-black">
                              Applied Filters:
                            </p>
                            <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                              <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                                Tkt No:
                                <span className="!text-black">#12345</span>
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
                                Pro Name:
                                <span className="!text-black">
                                  Orion conduction
                                </span>
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
                                Status:
                                <span className="!text-black">Pending</span>
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
                                Date:
                                <span className="!text-black">
                                  2 march, 2025
                                </span>
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

                          <DynamicTable
                            data={recent_selling_products_data}
                            columns={columns}
                            layout="fitColumns"
                          />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab
                      key="RaiseANewTicket"
                      title="Raise a New ticket"
                      className="p-0"
                    >
                      <Card className="shadow-none px-0">
                        <CardBody className="p-12">
                          <div className="bg-white">
                            <div className="flex flex-utems-start justify-between w-full gap-[105px]">
                              <div className="bg-white w-3/5">
                                <form
                                  onSubmit={handleSubmit}
                                  className="space-y-[7px]"
                                >
                                  <div className="flex items-start gap-[30px]">
                                    <div className="overflow-hidden grid justify-items-center gap-[7px] flex-shrink-0">
                                      <div className="w-6 h-6 bg-primary border-2 border-primary rounded-full flex items-center justify-center">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          viewBox="0 0 20 20"
                                          fill="none"
                                        >
                                          <path
                                            d="M7.95783 12.625L15.0203 5.5625C15.187 5.39583 15.3814 5.3125 15.6037 5.3125C15.8259 5.3125 16.0203 5.39583 16.187 5.5625C16.3537 5.72917 16.437 5.92722 16.437 6.15667C16.437 6.38611 16.3537 6.58389 16.187 6.75L8.54117 14.4167C8.3745 14.5833 8.18005 14.6667 7.95783 14.6667C7.73561 14.6667 7.54117 14.5833 7.3745 14.4167L3.79117 10.8333C3.6245 10.6667 3.5445 10.4689 3.55117 10.24C3.55783 10.0111 3.64478 9.81306 3.812 9.64583C3.97922 9.47861 4.17728 9.39528 4.40617 9.39583C4.63505 9.39639 4.83283 9.47972 4.9995 9.64583L7.95783 12.625Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                      <div className="h-20 border border-blue-300 w-[2px]"></div>
                                    </div>
                                    <div className="w-full">
                                      <Input
                                        isRequired={false}
                                        name="product"
                                        classNames={{
                                          base: "",
                                          input:
                                            "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                          inputWrapper:
                                            "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                          label:
                                            "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                        }}
                                        value={formData.product}
                                        onChange={handleChange}
                                        label="Product Id / Product Name"
                                        labelPlacement="outside"
                                        placeholder="Enter product Id / product name"
                                        type="text"
                                        variant="bordered"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-[30px]">
                                    <div className="overflow-hidden grid justify-items-center gap-[7px] flex-shrink-0">
                                      <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          viewBox="0 0 20 20"
                                          fill="none"
                                        >
                                          <path
                                            d="M7.95783 12.625L15.0203 5.5625C15.187 5.39583 15.3814 5.3125 15.6037 5.3125C15.8259 5.3125 16.0203 5.39583 16.187 5.5625C16.3537 5.72917 16.437 5.92722 16.437 6.15667C16.437 6.38611 16.3537 6.58389 16.187 6.75L8.54117 14.4167C8.3745 14.5833 8.18005 14.6667 7.95783 14.6667C7.73561 14.6667 7.54117 14.5833 7.3745 14.4167L3.79117 10.8333C3.6245 10.6667 3.5445 10.4689 3.55117 10.24C3.55783 10.0111 3.64478 9.81306 3.812 9.64583C3.97922 9.47861 4.17728 9.39528 4.40617 9.39583C4.63505 9.39639 4.83283 9.47972 4.9995 9.64583L7.95783 12.625Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                      <div className="h-[165px] border border-blue-300 w-[2px]"></div>
                                    </div>
                                    <div className="w-full">
                                      <Textarea
                                        classNames={{
                                          inputWrapper:
                                            "w-full border border-primary/10 xl:py-3 py-2 xl:px-5 md:px-4 px-3 lg:!h-[120px] md:!h-[110px] !h-[100px] focus:outline-none !bg-white rounded-[5px]",
                                          base: "!bg-white",
                                          input:
                                            "xl:!text-base md:!text-[15px] !text-sm placeholder:!text-gray-300 !font-normal",
                                          label:
                                            "2xl:text-base md:text-[15px] text-sm ",
                                        }}
                                        description={
                                          <div className="flex items-center gap-[5px]">
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
                                            <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
                                              Maximum 500 characters; no links
                                              or special symbols
                                            </p>
                                          </div>
                                        }
                                        defaultValue={formData.bio}
                                        onChange={handleChange}
                                        label="About Bio"
                                        labelPlacement="outside"
                                        placeholder="Write about bio..."
                                        type="text"
                                        variant="bordered"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-stretch gap-[30px] w-full ">
                                    <div className="overflow-hidden grid justify-items-center gap-[7px] flex-shrink-0">
                                      <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          viewBox="0 0 20 20"
                                          fill="none"
                                        >
                                          <path
                                            d="M7.95783 12.625L15.0203 5.5625C15.187 5.39583 15.3814 5.3125 15.6037 5.3125C15.8259 5.3125 16.0203 5.39583 16.187 5.5625C16.3537 5.72917 16.437 5.92722 16.437 6.15667C16.437 6.38611 16.3537 6.58389 16.187 6.75L8.54117 14.4167C8.3745 14.5833 8.18005 14.6667 7.95783 14.6667C7.73561 14.6667 7.54117 14.5833 7.3745 14.4167L3.79117 10.8333C3.6245 10.6667 3.5445 10.4689 3.55117 10.24C3.55783 10.0111 3.64478 9.81306 3.812 9.64583C3.97922 9.47861 4.17728 9.39528 4.40617 9.39583C4.63505 9.39639 4.83283 9.47972 4.9995 9.64583L7.95783 12.625Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </div>
                                      <div className="h-[165px] border border-blue-300 w-[2px]"></div>
                                    </div>

                                    <div className="flex flex-col justify-between items-start w-full h-auto">
                                      <div className="flex flex-col gap-2 w-full">
                                        <div className="flex flex-col items-start gap-[6px] w-full">
                                          {/* Hidden File Input */}
                                          <label>Attachment</label>
                                          <Input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                          />
                                          <div className="flex items-center justify-start w-full rounded px-3 py-[9px] !font-normal border border-gray-100 gap-[18px] outline-none">
                                            {/* Custom Upload Button */}
                                            <button
                                              type="button"
                                              onClick={handleClick}
                                              className="px-4 py-1 text-sm rounded-[3px] border border-gray-100 shadow-gray-inset bg-[#F5F5F5] text-black flex items-center justify-center gap-[6px]"
                                            >
                                              <svg
                                                width="17"
                                                height="17"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M8.4769 14.3464L8.47415 8.15626M14.1546 12.0478C14.7053 11.6605 15.1183 11.1078 15.3337 10.4699C15.549 9.83193 15.5554 9.14199 15.352 8.50016C14.9349 7.18304 13.6566 6.46121 12.2752 6.46259H11.477C11.2866 5.71998 10.9301 5.03027 10.4345 4.44538C9.93886 3.86049 9.31701 3.39565 8.61574 3.08588C7.91447 2.77612 7.15206 2.62948 6.38592 2.65702C5.61977 2.68456 4.86986 2.88555 4.19264 3.24487C3.51542 3.60419 2.92855 4.11247 2.4762 4.73144C2.02386 5.35041 1.71784 6.06393 1.58117 6.81829C1.44451 7.57265 1.48077 8.34819 1.68723 9.0865C1.89368 9.82482 2.26494 10.5067 2.77307 11.0807"
                                                  stroke="black"
                                                  strokeWidth="1.4"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M10.6622 9.75055L8.4737 7.56201L6.28516 9.75055"
                                                  stroke="black"
                                                  strokeWidth="1.4"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                              Upload files
                                            </button>

                                            {/* File name text */}
                                            <span className="text-sm text-gray-500">
                                              {fileName || "No file uploaded."}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <Button
                                        type="submit"
                                        className="!py-3 !px-[36px] btn btn-primary "
                                      >
                                        Send
                                      </Button>
                                    </div>
                                  </div>
                                </form>
                              </div>

                              <div className="bg-white w-2/5">
                                <h3 className="p !text-black mb-4 border-b border-gray-100 pr-7 pb-5">
                                  Before reaching out, check our FAQ section —
                                  it might save you time!
                                </h3>
                                <ul className="space-y-[18px]">
                                  <li className="flex-col flex gap-[6px]">
                                    <p className="p2 !text-black">
                                      Q. Where can I access my purchased files?
                                    </p>
                                    <div className="flex items-start justify-start gap-[5px] pl-5 text-[15px] text-gray-200">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="flex-shrink-0"
                                      >
                                        <path
                                          d="M10.6667 12.6667L14 9.33332L10.6667 5.99999"
                                          stroke="#505050"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M14 9.33331L8.66667 9.33331C4.98467 9.33331 2 6.34865 2 2.66665L2 1.99998"
                                          stroke="#505050"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      A. Easily find your downloads in your
                                      WebbyTemplate downloads.
                                    </div>
                                  </li>
                                  <li className="flex-col flex gap-[6px]">
                                    <p className="p2 !text-black">
                                      Q. Can I use the template for multiple
                                      projects?
                                    </p>
                                    <div className="flex items-start justify-start gap-[5px] pl-5 text-[15px] text-gray-200">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="flex-shrink-0"
                                      >
                                        <path
                                          d="M10.6667 12.6667L14 9.33332L10.6667 5.99999"
                                          stroke="#505050"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M14 9.33331L8.66667 9.33331C4.98467 9.33331 2 6.34865 2 2.66665L2 1.99998"
                                          stroke="#505050"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      A. Please check the description type. Most
                                      templates require a separate description
                                      for each project.
                                    </div>
                                  </li>
                                  <li className="flex-col flex gap-[6px]">
                                    <p className="p2 !text-black">
                                      Q. What if I need a refund?
                                    </p>
                                    <div className="flex items-start justify-start gap-[5px] pl-5 text-[15px] text-gray-200">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="flex-shrink-0"
                                      >
                                        <path
                                          d="M10.6667 12.6667L14 9.33332L10.6667 5.99999"
                                          stroke="#505050"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M14 9.33331L8.66667 9.33331C4.98467 9.33331 2 6.34865 2 2.66665L2 1.99998"
                                          stroke="#505050"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      A. You can request a refund through the
                                      support center within the eligible
                                      timeframe stated in our refund policy.
                                    </div>
                                  </li>
                                  <li className="flex-col flex gap-[6px]">
                                    <p className="p2 !text-black">
                                      Q. How do I contact the product author?
                                    </p>
                                    <div className="flex items-start justify-start gap-[5px] pl-5 text-[15px] text-gray-200">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="flex-shrink-0"
                                      >
                                        <path
                                          d="M10.6667 12.6667L14 9.33332L10.6667 5.99999"
                                          stroke="#505050"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M14 9.33331L8.66667 9.33331C4.98467 9.33331 2 6.34865 2 2.66665L2 1.99998"
                                          stroke="#505050"
                                          strokeWidth="1.3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      A. Use the support message box provided on
                                      your purchase detail page.
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ticketSupportPage;
