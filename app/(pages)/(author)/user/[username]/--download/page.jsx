"use client";

import { DatePicker, Input, Link } from "@heroui/react";
import React, { useState } from "react";
import DynamicTable from "@/components/common/table";

const downloadPage = () => {
  // const [showCalendar, setShowCalendar] = useState(false);
  // const [isToggled, setIsToggled] = useState(false);
  const [formData, setFormData] = useState({
    orderId: "",
    product: "",
    date: "",
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

  // tabulator
  const columns = [
    { title: "Order ID", field: "OrderId" },
    {
      title: "Product Name & Bundle",
      field: "productNameBundle",
      hozAlign: "left",
      formatter: function (cell, formatterParams, onRendered) {
        const data = cell.getData();
        return (
          data.productName &&
          `<div class="flex items-center gap-2">
            <span>${data.productName}</span>
            ${
              data.multiProduct &&
              `<button class="toggle-children" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                       class="rotate"
                  >
                    <g clip-path="url(#clip0_3467_322)">
                      <path
                        d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.15385V11.2708L5.53846 8.50154L4.56508 9.49846L8.50223 13.4349L9.00069 13.9334L9.49915 13.4349L13.4356 9.49777L12.4615 8.50154L9.69231 11.2708V4.15385H8.30769Z"
                        fill="#0156D5"
                      />
                    </g>
                  </svg>
                </button>`
            }
            </div>
          `
        );
      },
      cellClick: function (e, cell) {
        const row = cell.getRow();

        // If download icon is clicked
        const isDownloadIconClicked = e.target.closest("svg");
        if (isDownloadIconClicked) {
          const children = row.getData()._children;
          if (children && children.length > 0) {
            row.treeToggle(); // Correct function for dataTree toggle
          }
          return;
        }

        // Otherwise, open download link
        const rowData = row.getData();
        if (rowData.downloadLink) {
          window.open(rowData.downloadLink, "_blank");
        }
      },
    },
    {
      title: "Download Link",
      field: "downloadLink",
      hozAlign: "center",
      formatter: function (cell, formatterParams, onRendered) {
        const data = cell.getData();
        return (
          data.downloadLink &&
          `<button class="btn btn-primary !py-1 !px-4">Download</button>`
        );
      },
      cellClick: function (e, cell) {
        const rowData = cell.getRow().getData();
        const downloadUrl = rowData.downloadLink;

        // Trigger the actual download
        if (downloadUrl) {
          window.open(downloadUrl, "_blank");
        } else {
          alert("No download link found.");
        }
      },
    },
    {
      title: "Download Invoice",
      field: "downloadInvoice",
      hozAlign: "center",
      formatter: function (cell, formatterParams, onRendered) {
        const data = cell.getData();
        return (
          data.downloadInvoice &&
          `<button class="btn btn-primary !py-1 !px-4">Download Invoice</button>`
        );
      },
      cellClick: function (e, cell) {
        const rowData = cell.getRow().getData();
        const downloadUrl = rowData.downloadInvoice;

        // Trigger the actual download
        if (downloadUrl) {
          window.open(downloadUrl, "_blank");
        } else {
          alert("No download link found.");
        }
      },
      width: 300,
    },
    { title: "Date Purchased", field: "date", hozAlign: "center" },
  ];

  let data = [
    {
      id: 1,
      OrderId: "#67890",
      productName: "Multi-Product Order",
      multiProduct: "true",
      downloadLink: "",
      downloadInvoice: "invoice",
      date: "May 01, 2025",
      _children: [
        {
          id: 2,
          OrderId: "",
          productName: "Syndicate: Business Consulting HTML Website Template",
          multiProduct: "",
          downloadLink: "download",
          downloadInvoice: "",
        },
        {
          id: 3,
          OrderId: "",
          productName: "Medicare: Medical, Hospital, Clinic HTML Template",
          multiProduct: "",
          downloadLink: "download",
          downloadInvoice: "",
        },
      ],
    },
    {
      id: 4,
      OrderId: "#12345",
      productName: "QuickBasket: Fashion eCommerce TailwindCSS Template",
      multiProduct: "",
      downloadLink: "download",
      downloadInvoice: "invoice",
    },
    {
      id: 5,
      OrderId: "#78305",
      productName: "Milli: Magazine Website Figma UI Template Kit ",
      downloadLink: "download",
      multiProduct: "",
      downloadInvoice: "invoice",
      date: "May 01, 2025",
    },
  ];

  return (
    <div>
      <h1 className="h2 mb-5 mt-[30px]">Downloads</h1>
      <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
        <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white overflow-hidden">
          <p className="text-black">Downloads for invoices</p>
        </div>
        {/* Filter Fields */}
        <div className="grid items-end lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]">
          <div>
            <Input
              isRequired={false}
              name="orderId"
              classNames={{
                input:
                  "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                inputWrapper:
                  "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                label:
                  "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
              }}
              value={formData.orderId}
              onChange={handleChange}
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
              name="product"
              classNames={{
                input:
                  "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                inputWrapper:
                  "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                label:
                  "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
              }}
              value={formData.product}
              onChange={handleChange}
              label="Product Name or Number"
              labelPlacement="outside"
              placeholder="Enter product name"
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

        {/* Filter tags */}
        <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap py-[26px]">
          <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5  !text-black">
            Applied Filters:
          </p>
          <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
            <p className=" 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
              Order Id: <span className="!text-black"> #67890</span>
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
              P. Name/No: <span className="!text-black">QuickBasket</span>
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
              Date: <span className="!text-black">2 march, 2025</span>
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
          data={data}
          columns={columns}
          layout={"fitDataFill"}
          options={{
            dataTree: true,
            dataTreeStartExpanded: true,
          }}
        />
      </div>
    </div>
  );
};

export default downloadPage;
