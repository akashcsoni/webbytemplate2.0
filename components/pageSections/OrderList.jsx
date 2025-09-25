"use client";

import React, { useEffect, useState } from "react";
import { Eye, Download, DollarSign } from "lucide-react";
import { strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";

const OrderList = ({ title }) => {
  const orders = [
    {
      id: 1191,
      date: "August 07, 2025",
      status: "Pending",
      total: "$49.00 for 3 items",
    },
    {
      id: 1157,
      date: "July 05, 2025",
      status: "Pending",
      total: "$12.00 for 1 item",
    },
  ];

  const [order, setOrder] = useState([]);

  useEffect(() => {
    const fetchOrderData = async (id) => {
      // setLoading(true);

      let page_size = 10;

      try {
        const payload = {
          page_size,
          // ...filterData,
        };

        const orderData = await strapiPost(
          `order/eglduil4qz1b9t14k1mnegst`,
          payload,
          themeConfig.TOKEN
        );

        setOrder(orderData?.data);

        // if (orderData?.data) {
        //   const formattedData = orderData.data.map((item) => {
        //     const isMultipleProducts = item?.products?.length > 1;

        //     const redirectProduct = (products) =>
        //       products.map((p) => ({
        //         products: p.product_title || p.product?.title || "Untitled",
        //         price: p.product?.price,
        //         product_zip:
        //           p.product?.product_zip_url ||
        //           p.product?.product_zip?.url ||
        //           null,
        //       }));

        //     return {
        //       ...item,
        //       documentId: item.documentId,
        //       _children: isMultipleProducts
        //         ? redirectProduct(item.products)
        //         : null,
        //       multiProduct: isMultipleProducts,
        //       product: !isMultipleProducts ? item.products : [],
        //       price: !isMultipleProducts ? item.products?.price : {},
        //       products: !isMultipleProducts
        //         ? item.products?.[0]?.product?.title ||
        //           item.products?.[0]?.product_title ||
        //           "Untitled"
        //         : "Multi-Product Order",
        //       updatedAt: item.updatedAt,
        //       product_zip: !isMultipleProducts
        //         ? item.products?.[0]?.product?.product_zip_url ||
        //           item.products?.[0]?.product?.product_zip?.url
        //         : null,
        //       downloadInvoice:
        //         item.products?.[0]?.product?.product_zip_url ||
        //         item.products?.[0]?.product?.product_zip?.url,
        //     };
        //   });
        //   setFilteredOrder(formattedData);
        // }
      } catch (err) {
        // toast.error("Failed to load product data.");
        // setFilteredOrder([]);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
        <thead className="bg-green-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Order
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Total
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {order.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-blue-900 font-semibold">
                #{order.id}
              </td>
              <td className="px-6 py-4 text-gray-700">{order.publishedAt}</td>
              <td className="px-6 py-4">
                <span className="inline-block bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
                  {order.order_status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-700">{order.total_price}</td>
              <td className="px-6 py-4 space-x-4">
                <button className="text-green-800 text-sm font-medium hover:underline inline-flex items-center gap-1">
                  <Download size={14} />
                  Invoice PDF
                </button>
                <button className="text-green-800 text-sm font-medium hover:underline inline-flex items-center gap-1">
                  <Eye size={14} />
                  View
                </button>
                {order.order_status === "complete" ? (
                  ""
                ) : (
                  <button className="bg-orange-100 text-orange-600 font-semibold text-sm px-3 py-1 rounded-full inline-flex items-center gap-1 hover:bg-orange-200">
                    <DollarSign size={14} />
                    Pay Now
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
