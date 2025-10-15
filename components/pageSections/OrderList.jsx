"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import DynamicTable from "@/components/common/table";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const ticketSupportPage = ({ title }) => {
  const router = useRouter();
  const { authUser } = useAuth();

  const [openTicket, setOpenTicket] = useState(null);
  const [filteredOrder, setFilteredOrder] = useState([]);
  // console.log(filteredOrder);
  const [hasPending, setHasPending] = useState(false);
  const [orderData, setOrderData] = useState();
  // console.log(orderData);
  // table

  // Get user ID from authUser cookie
  const getLoginUserId = () => {
    try {
      const authUserCookie = Cookies.get("authUser");
      if (authUserCookie) {
        const authUser = JSON.parse(decodeURIComponent(authUserCookie));
        return authUser?.documentId || authUser?.id;
      }
    } catch (error) {
      console.error("Error parsing authUser cookie:", error);
    }
    return null;
  };

  const LoginUserId = getLoginUserId();

  const columns = [
    {
      title: "Order",
      field: "Id",
      hozAlign: "center",
      width: 50,
      formatter: function (cell) {
        return `<div class="flex items-center gap-1 text-primary">${cell.getValue()}</div>`;
      },
      cellClick: async (e, cell) => {
        const orderData = cell.getRow().getData();
        // console.log(orderData);
        if (orderData.id) {
          await setOpenTicket(orderData?.id);
        } else {
          toast.error("No invoice data found.");
        }
      },
    },
    {
      title: "Date",
      field: "date",
      hozAlign: "center",
      formatter: "datetime",
      formatterParams: {
        inputFormat: "iso",
        outputFormat: "dd-MMM-yyyy",
        invalidPlaceholder: "",
      },
    },
    {
      title: "Status",
      field: "status",
      hozAlign: "center",
      formatter: function (cell) {
        const value = cell.getValue()?.toLowerCase();
        let style = "";
        let colorDot = "";

        switch (value) {
          case "pending":
            style = "bg-yellow-100 text-yellow-800 border border-yellow-400";
            colorDot = "bg-yellow-400";
            break;
          case "complete":
            style = "bg-green-100 text-green-800 border border-green-500";
            colorDot = "bg-green-500";
            break;
          case "hold":
            style = "bg-red-100 text-red-700 border border-red-500";
            colorDot = "bg-red-500";
            break;
          case "authorized":
            style = "bg-primary/20 text-primary border border-primary";
            colorDot = "bg-primary";
            break;
          case "rejected":
            style = "bg-red-100 text-red-600 border border-red-500";
            colorDot = "bg-red-500";
            break;
          default:
            style = "bg-gray-100 text-gray-800 border border-gray-400";
            colorDot = "bg-gray-400";
        }

        return `
      <span class="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2 justify-center ${style}">
        <span class="w-2 h-2 rounded-full ${colorDot}"></span>
        ${value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    `;
      },
    },
    {
      title: "Total",
      field: "total",
      hozAlign: "center",
      widthGrow: 1.5,
      formatter: function (cell) {
        const value = cell.getValue();
        if (value === null || value === undefined) {
          return "$0.00";
        }
        // Convert to number if it's a string
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        // Format as currency with 2 decimal places
        return `$${numValue.toFixed(2)}`;
      },
    },
    {
      title: "Action",
      field: "action",
      hozAlign: "center",
      width: 120,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();

        // Normalize case to handle lowercase 'pending'
        if (rowData.status?.toLowerCase() === "pending") {
          return `<button class="pay-now-btn text-blue-600 underline cursor-pointer">Pay Now</button>`;
        }
        return "";
      },
      cellClick: function (e, cell) {
        const rowData = cell.getRow().getData();
        // console.log(rowData);

        if (rowData.status?.toLowerCase() === "pending") {
          // console.log("Redirect to payment for order:", rowData);
          setOrderData(rowData);
          handlePayNow(rowData);
        }
      },
    },
    {
      title: "Invoice",
      field: "invoice",
      hozAlign: "center",
      width: 120,
      formatter: function (cell) {
        return `
      <button class="download-invoice-btn text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
        </svg>
        <span class="text-xs font-medium">Download</span>
      </button>
    `;
      },
    },
  ];

  const userID = authUser?.documentId;

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Check if we have a valid LoginUserId
        if (!LoginUserId) {
          console.warn("No LoginUserId available, skipping order fetch");
          setFilteredOrder([]);
          setHasPending(false);
          return;
        }

        const payload = {
          page_size: 10,
        };

        console.log(LoginUserId, "LoginUserId");

        const orderData = await strapiPost(
          `order/${LoginUserId}`,
          payload,
          themeConfig.TOKEN
        );

        console.log(orderData?.data, "order data for test");

        if (orderData?.data) {
          const formattedData = orderData.data.map((item) => ({
            Id: item.id,
            total: (item.total_price || 0) + (item.tax_amount || 0),
            status: item.order_status || "N/A",
            date: item.createdAt,
            documentId: item.documentId,
            products: item.products,
            billing_address: item.billing_address,
            user: item.user,
          }));

          setFilteredOrder(formattedData);

          // ✅ Check if any order has Pending status
          const anyPending = formattedData.some(
            (item) => item.status === "Pending"
          );
          setHasPending(anyPending);
        }
      } catch (err) {
        console.error("Failed to load order data:", err);
        setFilteredOrder([]);
        setHasPending(false);
      }
    };

    fetchOrderData();
  }, [LoginUserId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };
    document.head.appendChild(script); // Append to head instead of body
    
    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handlePayNow = async (orderData) => {
    try {
      // setpayNowLoading(true);

      if (!orderData || orderData.status.toLowerCase() !== "pending") {
        console.warn("No pending order found.");
        return;
      }

      const strapi_order_id = orderData?.Id;
      // console.log(orderData);
      const user_id = orderData?.user?.id;
      const total_amount = orderData?.total;
      // console.log(total_amount);
      const country = orderData?.billing_address?.country || "India"; // fallback

      if (!strapi_order_id || !user_id || !total_amount) {
        console.error("Missing order data for payment.");
        return;
      }

      // ✅ Razorpay Flow
      if (country === "India") {
        const razorpayOrderRes = await strapiPost("razorpay/create-order", {
          amount: total_amount,
          strapi_order_id,
          user_id,
        });

        const razorpayOrder = razorpayOrderRes.order;
        const razorpayKey = razorpayOrderRes.key_id;

        const options = {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "WebbyTemplate",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (razorpayResponse) {
            // console.log("✅ Razorpay Success", razorpayResponse);

            await strapiPost("razorpay/verify", {
              ...razorpayResponse,
              strapi_order_id,
              user_id,
            });

            router.push("/thank-you");
          },
          modal: {
            ondismiss: function () {
              console.log("User closed the payment popup");
            },
          },
          prefill: {
            name: orderData.user?.full_name || "",
            email: orderData.user?.email || "",
            contact: orderData.billing_address?.phone_no || "",
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new Razorpay(options);

        rzp.on("payment.failed", async function (response) {
          const razorpay_order_id = response.error.metadata?.order_id;

          if (razorpay_order_id) {
            await strapiPost("razorpay/fail", {
              razorpay_order_id,
              reason: response.error.description || "Payment failed",
              strapi_order_id,
            });
          }

          // console.log("❌ Razorpay payment failed", response);
        });

        rzp.open();
      }

      // ✅ Stripe Flow (for outside India)
      else {
        const stripeRes = await strapiPost("stripe/create-checkout-session", {
          amount: total_amount,
          strapi_order_id,
          user_id,
        });

        if (stripeRes?.url) {
          window.location.href = stripeRes.url;
        } else {
          throw new Error("Stripe session creation failed");
        }
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
    }
  };

  return (
    <div className="py-[27px] min-h-[717px]">
      <h1
        className={`h2 ${authUser?.author === true ? "sm:relative" : ""} mb-4`}
      >
        {title}
      </h1>
      <div className="flex w-full flex-col">
        {/* main-content */}

        <Card className="shadow-none px-0 overflow-hidden border border-gray-100">
          <CardBody className="p-0 ">
            <div>
              {/* Filter line */}
              <div className="border-b border-primary/10 pt-[18px]" />

              <Card className="shadow-none !max-w-full">
                <CardBody className="sm:px-5 px-4 py-5">
                  {filteredOrder ? (
                    <DynamicTable
                      // id={loading}
                      data={filteredOrder}
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
                      classes="download-table"
                      layout="fitColumns"
                      // "fitDataFill"
                      // : "fitColumns",
                    />
                  ) : (
                    !loading && (
                      <div className="flex justify-center items-center h-[343px]">
                        <p>No data is currently available.</p>
                      </div>
                    )
                  )}
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ticketSupportPage;
