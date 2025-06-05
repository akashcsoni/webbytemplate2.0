"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardBody, DatePicker, Input, Link } from "@heroui/react";
import DynamicTable from "@/components/common/table";
import { useAuth } from "@/contexts/AuthContext";
import { strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import html2pdf from "html2pdf.js/dist/html2pdf.min";

const DownloadPage = ({ title }) => {
  const formRef = useRef(null);
  const { authUser } = useAuth();
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);

  const generateInvoiceHTML = (orderData) => {
    const totalSalesPrice = orderData.multiProduct
      ? orderData?._children?.reduce((total, item) => {
          return (
            total + (item.price?.sales_price || item.price?.regular_price || 0)
          );
        }, 0)
      : orderData?.product?.reduce((total, item) => {
          return (
            total + (item.price?.sales_price || item.price?.regular_price || 0)
          );
        }, 0);
    // 2. Calculate 18% GST
    const gst = totalSalesPrice * 0.18;

    // 3. Final total with GST
    const finalTotal = totalSalesPrice + gst;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <title>Invoice</title>
          <style type="text/css">
            body,
            table,
            p,
            td,
            th {
              font-family: Proxima Nova, sans-serif, system-ui, -apple-system,
                BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans,
                sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol,
                Noto Color Emoji;
            }
            html {
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            @page {
              size: 210mm 297mm;
            }
          </style>
        </head>

        <body>
          <div style="padding: 25px">
            <table
              align="center"
              style="
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                vertical-align: middle;
                font-family: 'Proxima Nova', sans-serif;
              "
            >
              <tr>
                <td
                  style="
                    width: 40%;
                    padding-right: 10px;
                    vertical-align: top;
                    text-align: left;
                  "
                >
                  <table>
                    <tbody>
                      <tr>
                        <td align="center" style="vertical-align: middle">
                          <div
                            style="
                              width: 65px;
                              height: 65px;
                              background-color: #0156d5;
                              border-radius: 8px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              color: white;
                              font-weight: bold;
                              font-size: 18px;
                            "
                          >
                            <img
                              src="https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/Favicon_1_a677acbd8e.png"
                              alt="LOGO"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style="width: 60%; padding-left: 10px">
                  <h2
                    style="
                      text-align: right;
                      font-weight: 700;
                      margin: 0;
                      padding: 0;
                      font-size: 20px;
                      font-family: 'Proxima Nova', sans-serif;
                    "
                  >
                    Invoice
                  </h2>
                  <table
                    align="center"
                    style="
                      width: 100%;
                      border-collapse: collapse;
                      border-spacing: 0;
                      vertical-align: middle;
                      font-family: 'Proxima Nova', sans-serif;
                    "
                  >
                    <tr>
                      <td align="right" style="width: 40%; padding: 15px 0">
                        <table
                          align="right"
                          style="
                            vertical-align: top;
                            border-collapse: collapse;
                            border-spacing: 0;
                            font-family: 'Proxima Nova', sans-serif;
                          "
                        >
                          <tr>
                            <td
                              style="
                                width: 40%;
                                vertical-align: top;
                                text-align: left;
                                font-family: 'Proxima Nova', sans-serif;
                              "
                            >
                              <p
                                style="
                                  margin: 0;
                                  padding-right: 10px;
                                  font-family: 'Proxima Nova', sans-serif;
                                  font-weight: 700;
                                  font-size: 13px;
                                  color: #000;
                                  line-height: 18px;
                                "
                              >
                                Invoice No:
                              </p>
                            </td>
                            <td
                              style="
                                width: 60%;
                                vertical-align: top;
                                text-align: right;
                                font-family: 'Proxima Nova', sans-serif;
                              "
                            >
                              <p
                                style="
                                  margin: 0;
                                  padding: 0;
                                  font-family: 'Proxima Nova', sans-serif;
                                  font-weight: 400;
                                  font-size: 13px;
                                  color: #000;
                                  line-height: 18px;
                                "
                              >
                                #${orderData.documentId}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="
                                width: 40%;
                                vertical-align: top;
                                text-align: left;
                                font-family: 'Proxima Nova', sans-serif;
                              "
                            >
                              <p
                                style="
                                  margin: 0;
                                  padding-right: 10px;
                                  font-family: 'Proxima Nova', sans-serif;
                                  font-weight: 700;
                                  font-size: 13px;
                                  color: #000;
                                  line-height: 18px;
                                "
                              >
                                Invoice Date:
                              </p>
                            </td>
                            <td
                              style="
                                width: 60%;
                                vertical-align: top;
                                text-align: right;
                                font-family: 'Proxima Nova', sans-serif;
                              "
                            >
                              <p
                                style="
                                  margin: 0;
                                  padding: 0;
                                  font-family: 'Proxima Nova', sans-serif;
                                  font-weight: 400;
                                  font-size: 13px;
                                  color: #000;
                                  line-height: 18px;
                                "
                              >
                                ${orderData.updatedAt}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table
              align="center"
              style="
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                margin-top: 20px;
                vertical-align: top;
                background: #fff;
                font-family: 'Proxima Nova', sans-serif;
              "
            >
              <tbody>
                <tr>
                  <td
                    style="
                      width: 50%;
                      padding-right: 10px;
                      vertical-align: top;
                      text-align: left;
                    "
                  >
                    <h5
                      style="
                        font-weight: 700;
                        margin: 0;
                        padding: 0;
                        font-size: 14px;
                        margin-bottom: 5px;
                        font-family: 'Proxima Nova', sans-serif;
                      "
                    >
                      From
                    </h5>
                    <h4
                      style="
                        font-weight: 700;
                        margin: 0;
                        padding: 0;
                        font-size: 16px;
                        margin-bottom: 5px;
                        font-family: 'Proxima Nova', sans-serif;
                      "
                    >
                      WebbyCrown Solutions
                    </h4>
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 400;
                        margin-bottom: 3px;
                        font-size: 13px;
                        color: #000;
                        line-height: 18px;
                      "
                    >
                      5th Floor, Shop No 517,518,519, Laxmi Enclave-2,
                    </p>
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 400;
                        margin-bottom: 3px;
                        font-size: 13px;
                        color: #000;
                        line-height: 18px;
                      "
                    >
                      Opp. Gajera School,
                    </p>
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 400;
                        margin-bottom: 3px;
                        font-size: 13px;
                        color: #000;
                        line-height: 18px;
                      "
                    >
                      Katargam, Surat, Gujarat,
                    </p>
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 400;
                        margin-bottom: 3px;
                        font-size: 13px;
                        color: #000;
                        line-height: 18px;
                      "
                    >
                      395004,
                    </p>
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 400;
                        margin-bottom: 3px;
                        font-size: 13px;
                        color: #000;
                        line-height: 18px;
                      "
                    >
                      India.
                    </p>
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 400;
                        margin-bottom: 3px;
                        font-size: 13px;
                        color: #000;
                        line-height: 18px;
                      "
                    >
                      <b>GSTIN:</b> 24AACFW9641F1Z3
                    </p>
                  </td>
                  <td style="width: 50%; padding-left: 10px; vertical-align: top">
                    <table
                      style="
                        width: 100%;
                        vertical-align: top;
                        border-collapse: collapse;
                        border-spacing: 0;
                        font-family: 'Proxima Nova', sans-serif;
                      "
                    >
                      <tr>
                        <td
                          style="
                            text-align: right;
                            font-family: 'Proxima Nova', sans-serif;
                          "
                        >
                          <h5
                            style="
                              font-weight: 700;
                              margin: 0;
                              padding: 0;
                              font-size: 14px;
                              margin-bottom: 5px;
                              font-family: 'Proxima Nova', sans-serif;
                            "
                          >
                            Bill To
                          </h5>
                          <h4
                            style="
                              font-weight: 700;
                              margin: 0;
                              padding: 0;
                              font-size: 16px;
                              margin-bottom: 5px;
                              font-family: 'Proxima Nova', sans-serif;
                            "
                          >
                            ${orderData?.user?.full_name}
                          </h4>
                          <p
                            style="
                              margin: 0;
                              padding: 0;
                              font-family: 'Proxima Nova', sans-serif;
                              margin-bottom: 3px;
                              font-weight: 400;
                              font-size: 13px;
                              color: #000;
                              line-height: 18px;
                            "
                          >
                            ${orderData?.user?.email}
                          </p>

                          <p
                            style="
                              margin: 0;
                              padding: 0;
                              font-family: 'Proxima Nova', sans-serif;
                              margin-bottom: 3px;
                              font-weight: 400;
                              font-size: 13px;
                              color: #000;
                              line-height: 18px;
                            "
                          >
                            ${orderData?.billing_address?.address},
                          </p>
                          <p
                            style="
                              margin: 0;
                              padding: 0;
                              font-family: 'Proxima Nova', sans-serif;
                              margin-bottom: 3px;
                              font-weight: 400;
                              font-size: 13px;
                              color: #000;
                              line-height: 18px;
                            "
                          >
                            ${orderData?.billing_address?.pincode},
                            </p>
                            <p
                            style="
                            margin: 0;
                              padding: 0;
                              font-family: 'Proxima Nova', sans-serif;
                              margin-bottom: 3px;
                              font-weight: 400;
                              font-size: 13px;
                              color: #000;
                              line-height: 18px;
                            "
                            >
                            ${orderData?.billing_address?.city}, ${orderData?.billing_address?.state},
                            </p>
                            <p
                            style="
                              margin: 0;
                              padding: 0;
                              font-family: 'Proxima Nova', sans-serif;
                              margin-bottom: 3px;
                              font-weight: 400;
                              font-size: 13px;
                              color: #000;
                              line-height: 18px;
                            ">
                            ${orderData?.billing_address?.country},
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              align="center"
              style="
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                background: #fff;
                font-family: 'Proxima Nova', sans-serif;
                margin-top: 30px;
              "
            >
              <thead>
                <tr>
                  <th
                    style="
                      text-align: left;
                      padding: 10px 10px;
                      background: #0156d5;
                      font-family: 'Proxima Nova', sans-serif;
                      vertical-align: middle;
                      width: 300px;
                      min-width: 300px;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 700;
                        font-size: 13px;
                        color: #ffffff;
                      "
                    >
                      DESCRIPTION
                    </p>
                  </th>
                  <th
                    style="
                      text-align: center;
                      padding: 10px 10px;
                      background: #0156d5;
                      font-family: 'Proxima Nova', sans-serif;
                      vertical-align: middle;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 700;
                        font-size: 13px;
                        color: #ffffff;
                      "
                    >
                      RATE
                    </p>
                  </th>

                  <th
                    style="
                      text-align: center;
                      padding: 10px 10px;
                      background: #0156d5;
                      font-family: 'Proxima Nova', sans-serif;
                      vertical-align: middle;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 700;
                        font-size: 13px;
                        color: #ffffff;
                      "
                    >
                      TAX
                    </p>
                  </th>
                  <th
                    style="
                      text-align: right;
                      padding: 10px 10px;
                      background: #0156d5;
                      font-family: 'Proxima Nova', sans-serif;
                      vertical-align: middle;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        padding: 0;
                        font-family: 'Proxima Nova', sans-serif;
                        font-weight: 700;
                        font-size: 13px;
                        color: #ffffff;
                      "
                    >
                      AMOUNT
                    </p>
                  </th>
                </tr>
              </thead>

              ${
                !orderData?.multiProduct &&
                orderData?.product?.map((item, index) => {
                  return `<tbody>
                    <tr>
                      <td
                        style="
                          text-align: left;
                          padding: 15px 10px;
                          font-family: 'Proxima Nova', sans-serif;
                          vertical-align: top;
                          width: 300px;
                          min-width: 300px;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            padding: 0;
                            font-family: 'Proxima Nova', sans-serif;
                            font-weight: 400;
                            font-size: 13px;
                            color: #000;
                            line-height: 18px;
                          "
                        >
                          ${item?.product_title}
                        </p>                        
                      </td>
                      <td
                        style="
                          text-align: center;
                          padding: 15px 10px;
                          font-family: 'Proxima Nova', sans-serif;
                          vertical-align: top;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            padding: 0;
                            font-family: 'Proxima Nova', sans-serif;
                            font-weight: 400;
                            font-size: 13px;
                            color: #000;
                            line-height: 18px;
                          "
                        >
                          $${totalSalesPrice?.toFixed(2)}
                        </p>
                      </td>

                      <td
                        style="
                          text-align: center;
                          padding: 15px 10px;
                          font-family: 'Proxima Nova', sans-serif;
                          vertical-align: top;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            padding: 0;
                            font-family: 'Proxima Nova', sans-serif;
                            font-weight: 400;
                            font-size: 13px;
                            color: #000;
                            line-height: 18px;
                          "
                        >
                          18.00%
                        </p>
                      </td>
                      <td
                        style="
                          text-align: right;
                          padding: 15px 10px;
                          font-family: 'Proxima Nova', sans-serif;
                          vertical-align: top;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            padding: 0;
                            font-family: 'Proxima Nova', sans-serif;
                            font-weight: 400;
                            font-size: 13px;
                            color: #000;
                            line-height: 18px;
                          "
                        >
                          $${finalTotal?.toFixed(2)}
                        </p>
                      </td>
                    </tr>                    
                  </tbody>`;
                })
              }
              ${
                orderData?.multiProduct &&
                `<tbody>
                  <tr>
                    <td
                      style="
                        text-align: left;
                        padding: 15px 10px;
                        font-family: 'Proxima Nova', sans-serif;
                        vertical-align: top;
                        width: 300px;
                        min-width: 300px;
                        border-bottom: 1px solid #eee;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          padding: 0;
                          font-family: 'Proxima Nova', sans-serif;
                          font-weight: 400;
                          font-size: 13px;
                          color: #000;
                          line-height: 18px;
                        "
                      >
                        ${orderData?.products}
                      </p>
                      <table>
                        <tbody>
                      ${orderData?._children.map((item) => {
                        return `
                            <tr>
                              <td style="text-decoration: initial">
                                <p
                                  style="
                                    margin: 0;
                                    padding: 0;
                                    font-family: 'Proxima Nova', sans-serif;
                                    font-weight: 400;
                                    font-size: 13px;
                                    color: #000;
                                    line-height: 18px;
                                  "
                                >
                                  &#187
                                </p>
                              </td>
                              <td>
                                <p
                                  style="
                                    margin: 0;
                                    padding: 0;
                                    font-family: 'Proxima Nova', sans-serif;
                                    font-weight: 400;
                                    font-size: 13px;
                                    color: #000;
                                    line-height: 18px;
                                  "
                                >
                                  ${item?.products}
                                </p>
                              </td>
                              <td style="width: 100px; min-width: 100px">
                                <p
                                  style="
                                    margin: 0;
                                    padding: 0;
                                    font-family: 'Proxima Nova', sans-serif;
                                    font-weight: 400;
                                    font-size: 13px;
                                    color: #000;
                                    line-height: 18px;
                                  "
                                >
                                  : $${item.price?.sales_price ? item.price?.sales_price : item.price?.regular_price}
                                </p>
                              </td>
                            </tr>                              
                            `;
                      })}                           
                        </tbody>
                      </table>
                    </td>
                    <td
                      style="
                        text-align: center;
                        padding: 15px 10px;
                        font-family: 'Proxima Nova', sans-serif;
                        vertical-align: top;
                        border-bottom: 1px solid #eee;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          padding: 0;
                          font-family: 'Proxima Nova', sans-serif;
                          font-weight: 400;
                          font-size: 13px;
                          color: #000;
                          line-height: 18px;
                        "
                      >
                        $${totalSalesPrice.toFixed(2)}
                      </p>
                    </td>

                    <td
                      style="
                        text-align: center;
                        padding: 15px 10px;
                        font-family: 'Proxima Nova', sans-serif;
                        vertical-align: top;
                        border-bottom: 1px solid #eee;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          padding: 0;
                          font-family: 'Proxima Nova', sans-serif;
                          font-weight: 400;
                          font-size: 13px;
                          color: #000;
                          line-height: 18px;
                        "
                      >
                        18.00%
                      </p>
                    </td>
                    <td
                      style="
                        text-align: right;
                        padding: 15px 10px;
                        font-family: 'Proxima Nova', sans-serif;
                        vertical-align: top;
                        border-bottom: 1px solid #eee;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          padding: 0;
                          font-family: 'Proxima Nova', sans-serif;
                          font-weight: 400;
                          font-size: 13px;
                          color: #000;
                          line-height: 18px;
                        "
                      >
                        $${finalTotal.toFixed(2)}
                      </p>
                    </td>
                  </tr>  
                </tbody>`
              }              
              <tfoot>
                <tr>
                  <td
                    colspan="4"
                    style="
                      text-align: left;
                      font-family: 'Proxima Nova', sans-serif;
                      vertical-align: top;
                    "
                  >
                    <table
                      align="center"
                      style="
                        width: 100%;
                        border-collapse: collapse;
                        border-spacing: 0;
                        font-family: 'Proxima Nova', sans-serif;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              padding: 10px 10px;
                              border-bottom: 1px solid #eee;
                              font-family: 'Proxima Nova', sans-serif;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                padding: 0;
                                font-family: 'Proxima Nova', sans-serif;
                                font-weight: 400;
                                font-size: 13px;
                                color: #000;
                                line-height: 18px;
                              "
                            >
                              Subtotal:
                            </p>
                          </td>

                          <td
                            style="
                              text-align: right;
                              padding: 10px 10px;
                              border-bottom: 1px solid #eee;
                              font-family: 'Proxima Nova', sans-serif;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                padding: 0;
                                font-family: 'Proxima Nova', sans-serif;
                                font-weight: 400;
                                font-size: 13px;
                                color: #000;
                                line-height: 18px;
                              "
                            >
                              USD $${totalSalesPrice.toFixed(2)}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              padding: 10px 10px;
                              border-bottom: 1px solid #eee;
                              font-family: 'Proxima Nova', sans-serif;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                padding: 0;
                                font-family: 'Proxima Nova', sans-serif;
                                font-weight: 400;
                                font-size: 13px;
                                color: #000;
                                line-height: 18px;
                              "
                            >
                              Tax (18%):
                            </p>
                          </td>
                          <td
                            style="
                              text-align: right;
                              padding: 10px 10px;
                              border-bottom: 1px solid #eee;
                              font-family: 'Proxima Nova', sans-serif;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                padding: 0;
                                font-family: 'Proxima Nova', sans-serif;
                                font-weight: 400;
                                font-size: 13px;
                                color: #000;
                                line-height: 18px;
                              "
                            >
                              USD $${gst.toFixed(2)}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              padding: 10px 10px;
                              border-bottom: 1px solid #eee;
                              font-family: 'Proxima Nova', sans-serif;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                padding: 0;
                                font-family: 'Proxima Nova', sans-serif;
                                font-weight: 400;
                                font-size: 13px;
                                color: #000;
                                line-height: 18px;
                              "
                            >
                              Discount:
                            </p>
                          </td>
                          <td
                            style="
                              text-align: right;
                              padding: 10px 10px;
                              border-bottom: 1px solid #eee;
                              font-family: 'Proxima Nova', sans-serif;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                padding: 0;
                                font-family: 'Proxima Nova', sans-serif;
                                font-weight: 400;
                                font-size: 13px;
                                color: #000;
                                line-height: 18px;
                              "
                            >
                              USD $0.00
                            </p>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            style="
                              text-align: left;
                              padding: 10px 10px;
                              font-family: 'Proxima Nova', sans-serif;
                              background-color: #eee;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                padding: 0;
                                font-family: 'Proxima Nova', sans-serif;
                                font-weight: 700;
                                font-size: 13px;
                                color: #000;
                                line-height: 18px;
                              "
                            >
                              Total:
                            </p>
                          </td>

                          <td
                            style="
                              text-align: right;
                              padding: 10px 10px;
                              font-family: 'Proxima Nova', sans-serif;
                              background-color: #eee;
                            "
                          >
                            <p
                              style="
                                margin: 0;
                                padding: 0;
                                font-family: 'Proxima Nova', sans-serif;
                                font-weight: 700;
                                font-size: 13px;
                                color: #000;
                                line-height: 18px;
                              "
                            >
                              USD $${finalTotal.toFixed(2)}
                            </p>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </body>
      </html>
    `;
  };

  const downloadInvoice = async (orderData) => {
    try {
      const invoiceHTML = generateInvoiceHTML(orderData);

      const opt = {
        margin: 0.5,
        filename: `invoice-${orderData.documentId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(invoiceHTML).save();
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download invoice. Please try again.");
    }
  };

  const columns = [
    {
      title: "Order ID",
      field: "documentId",
      formatter: (cell) => {
        const data = cell.getData();
        return (
          data.documentId &&
          `<div class="flex items-center gap-2"> <span>${data.documentId}</span> </div>`
        );
      },
    },
    {
      title: "Product Name & Bundle",
      field: "products",
      hozAlign: "left",
      formatter: (cell) => {
        const data = cell.getData();
        return (
          data.products &&
          `<div class="flex items-center gap-2">
            <span>${data.products}</span>
            ${
              data.multiProduct
                ? `<button class="toggle-children">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" class="">
                      <path d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.15385V11.2708L5.53846 8.50154L4.56508 9.49846L8.50223 13.4349L9.00069 13.9334L9.49915 13.4349L13.4356 9.49777L12.4615 8.50154L9.69231 11.2708V4.15385H8.30769Z" fill="#0156D5" />
                    </svg>
                  </button>`
                : ""
            }
          </div>`
        );
      },
      cellClick: (e, cell) => {
        const row = cell.getRow();
        if (e.target.closest("svg")) {
          row.treeToggle();
          return;
        }
      },
    },
    {
      title: "Download Link",
      field: "product_zip",
      hozAlign: "center",
      formatter: (cell) => {
        const data = cell.getData();
        return data.product_zip
          ? `<div class="flex items-center gap-2"><button class="btn btn-primary !py-1 !px-4">Download</button></div>`
          : "";
      },
      cellClick: (e, cell) => {
        const url = cell.getRow().getData().product_zip;
        url ? window.open(url, "_blank") : alert("No download link found.");
      },
    },
    {
      title: "Download Invoice",
      field: "downloadInvoice",
      hozAlign: "center",
      width: 300,
      formatter: (cell) => {
        const data = cell.getData();
        return data.downloadInvoice
          ? `<button class="btn btn-primary !py-1 !px-4">Download Invoice</button>`
          : "";
      },
      cellClick: async (e, cell) => {
        const orderData = cell.getRow().getData();
        if (orderData.documentId) {
          await downloadInvoice(orderData);
        } else {
          toast.error("No invoice data found.");
        }
      },
    },
    {
      title: "Date Purchased",
      field: "updatedAt",
      hozAlign: "center",
      formatter: "datetime",
      formatterParams: {
        inputFormat: "iso",
        outputFormat: "dd-MMM-yyyy",
        invalidPlaceholder: "",
      },
    },
  ];

  const debouncedInputChange = useCallback(
    debounce((name, value) => {
      setFilterData((prev) => ({ ...prev, [name]: value }));
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    debouncedInputChange(name, value);
  };

  const removeFilter = (key) => {
    // Update state
    setFilterData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const clearAllFilters = (e) => {
    e.preventDefault();
    setFilterData({});
    formRef.current?.reset();
  };

  const page_size = 10;

  useEffect(() => {
    const fetchOrderData = async (id) => {
      try {
        setLoading(true);
        const payload = {
          page_size,
          ...filterData,
        };

        const orderData = await strapiPost(
          `order/${id}`,
          payload,
          themeConfig.TOKEN
        );

        if (orderData?.data) {
          const formattedData = orderData.data.map((item) => {
            const isMultipleProducts = item?.products?.length > 1;

            const redirectProduct = (products) =>
              products.map((p) => ({
                products: p.product_title || p.product?.title || "Untitled",
                price: p.product?.price,
                product_zip:
                  p.product?.product_zip_url ||
                  p.product?.product_zip?.url ||
                  null,
              }));

            return {
              ...item,
              documentId: item.documentId,
              _children: isMultipleProducts
                ? redirectProduct(item.products)
                : null,
              multiProduct: isMultipleProducts,
              product: !isMultipleProducts ? item.products : [],
              price: !isMultipleProducts ? item.products?.price : {},
              products: !isMultipleProducts
                ? item.products?.[0]?.product?.title ||
                  item.products?.[0]?.product_title ||
                  "Untitled"
                : "Multi-Product Order",
              updatedAt: item.updatedAt,
              product_zip: !isMultipleProducts
                ? item.products?.[0]?.product?.product_zip_url ||
                  item.products?.[0]?.product?.product_zip?.url
                : null,
              downloadInvoice:
                item.products?.[0]?.product?.product_zip_url ||
                item.products?.[0]?.product?.product_zip?.url,
            };
          });

          setFilteredOrder(formattedData);
        }
      } catch (err) {
        console.error("Failed to fetch product data:", err);
        toast.error("Failed to load product data.");
        setFilteredOrder([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData(authUser?.documentId);
  }, [filterData, authUser?.documentId]);

  return (
    <div className="min-h-[1000px]">
      <h1 className="h2 mb-5 mt-[30px]">{title}</h1>
      <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
        <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 px-3 py-[6px] bg-white">
          <p className="text-black">Downloads for invoices</p>
        </div>

        {/* Filter Inputs */}
        <form
          ref={formRef}
          className="grid items-end lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]"
        >
          <Input
            name="documentId"
            classNames={{
              input:
                "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
              inputWrapper:
                "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
              label:
                "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
            }}
            defaultValue={filterData?.documentId || ""}
            onChange={handleInputChange}
            label="Order ID"
            labelPlacement="outside"
            placeholder="Enter order ID"
            type="text"
            variant="bordered"
          />

          <Input
            name="products"
            classNames={{
              input:
                "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
              inputWrapper:
                "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
              label:
                "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
            }}
            defaultValue={filterData?.products || ""}
            onChange={handleInputChange}
            label="Product Name or Number"
            labelPlacement="outside"
            placeholder="Enter product name"
            type="text"
            variant="bordered"
          />

          <I18nProvider locale="en-IN">
            <DatePicker
              name="purchased_date"
              classNames={{
                cell: "2xl:!text-sm !text-xs",
                input:
                  "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                inputWrapper:
                  "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border border-gray-100 outline-none flex !bg-white",
                label:
                  "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
              }}
              defaultValue={
                filterData?.purchased_date
                  ? parseDate(
                      filterData.purchased_date.split("-").reverse().join("-")
                    )
                  : null
              }
              labelPlacement="outside"
              label="Date Purchased"
              onChange={(e) => {
                if (!e) return; // 💥 prevent crash if e is null

                const date = e.toDate(getLocalTimeZone());
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}-${month}-${year}`;

                const data = {
                  target: {
                    name: "purchased_date",
                    value: formattedDate,
                  },
                };
                handleInputChange(data);
              }}
            />
          </I18nProvider>
        </form>

        {filterData &&
          Object.values(filterData).some(
            (value) => value !== null && value !== "" && value !== undefined
          ) && (
            <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap pt-[18px]">
              <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black">
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
                    <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 text-primary capitalize sm:px-2 px-1">
                      {key}: <span className="!text-black">{value}</span>
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

        {/* Filter line */}
        <div className="border-b border-primary/10 pt-[18px]" />

        <Card className="!shadow-none !max-w-full">
          <CardBody className="sm:px-5 px-4 py-5">
            {/* {!loading ? ( */}
            {filteredOrder ? (
              <DynamicTable
                data={filteredOrder}
                columns={columns}
                layout="fitDataFill"
                classes="download-table"
                loading={loading}
                options={{ dataTree: true, dataTreeStartExpanded: true }}
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
    </div>
  );
};

export default DownloadPage;
