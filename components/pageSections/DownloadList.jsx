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
import ReviewModal from "./ReviewModel";

const DownloadPage = ({ title }) => {
  const formRef = useRef(null);
  const { authUser } = useAuth();
  const [filteredOrder, setFilteredOrder] = useState([]);

  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const generateInvoiceHTML = (orderData) => {
    const productsList = orderData.multiProduct
      ? orderData._children
      : orderData.product;

    const subtotal = productsList.reduce((total, item) => {
      let price = 0;
      if (orderData.multiProduct) {
        price = item.price?.sales_price || item.price?.regular_price || 0;
      } else {
        price = item.total || 0;
      }
      return total + price;
    }, 0);

    const taxPercentage = orderData.tax_percentage || 0;
    const totalGST = (subtotal * taxPercentage) / 100;
    const finalTotal = subtotal + totalGST; // ✅ fixed total includes GST

    function formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-GB", options);
    }

    function formatCurrency(amount) {
      return `$${(amount || 0).toFixed(2)}`;
    }

    console.log(orderData, "this is for user data");

    const billedToFullName =
      orderData.user.full_name ||
      orderData.billing_address.first_name +
        " " +
        orderData.billing_address.last_name;

    const billedToAddress = `${orderData.billing_address.address}, ${orderData.billing_address.city}, ${orderData.billing_address.state} ${orderData.billing_address.pincode}, ${orderData.billing_address.country}`;

    let billedToEmail = "N/A";
    try {
      if (
        orderData.transactions &&
        orderData.transactions[0] &&
        orderData.transactions[0].description
      ) {
        billedToEmail =
          JSON.parse(orderData.transactions[0].description).email ||
          orderData.user.username;
      } else {
        billedToEmail = orderData.user.username;
      }
    } catch (e) {
      billedToEmail = orderData.user.username;
    }

    const billedToContact = orderData.billing_address.phone_no || "N/A";
    const billedToGSTIN = orderData.billing_address.gst_number || "N/A";

    // --- Generate product rows with GST line inside each ---
    const productRows = productsList
      .map((item) => {
        let productName, productCode, licenseDescription, productPrice;

        if (orderData.multiProduct) {
          productName = item.products.split(":")[0] || "Product";
          productCode = item.document_id
            ? item.document_id.substring(0, 8)
            : "N/A";
          licenseDescription = item.products;
          productPrice =
            item.price?.sales_price || item.price?.regular_price || 0;
        } else {
          productName = item.product_title.split(":")[0] || "Product";
          productCode = item.product.documentId
            ? item.product.documentId.substring(0, 8)
            : "N/A";
          licenseDescription = `${item.product_title} - ${
            item.extra_info[0]?.license?.title || "Regular License"
          }`;
          productPrice = item.total;
        }

        // Calculate GST per product
        const gstAmount = (productPrice * taxPercentage) / 100;

        return `
      <tr class="table-details">
        <td colspan="4" style="padding:0;">
          <table cellpadding="0" cellspacing="0" border="0" style="padding:0; margin:0;">
              <tr>
                  <td style="width: 20%;">${productName}: template</td>
                  <td style="width: 20%;">${productCode}</td>
                  <td class="product-description">
                  <p>${licenseDescription}</p></td>
                  <td style=" text-align:right; width: 20%;">${formatCurrency(productPrice)}</td>
              </tr>
          </table>
        </td>
      </tr>

      <tr class="table-details">
        <td colspan="4"  style="padding:0;">
          <table cellpadding="0" cellspacing="0" border="0" style="padding:0; margin:0;">
              <tr>
                  <td style="width: 20%;"></td>
                  <td style="width: 20%;"></td>
                  <td style="width: 40%;">GST% @ ${taxPercentage.toFixed(1)}%</td>
                  <td style=" text-align:right; width: 20%;">${formatCurrency(gstAmount)}</td>
              </tr>
          </table>
        </td>
      </tr>

      <tr class="table-details">
        <td colspan="4"  style="padding:0;">
          <table cellpadding="0" cellspacing="0" border="0" style="padding:0; margin:0;">
              <tr>
                  <td style="width: 20%;"></td>
                  <td style="width: 20%;"></td>
                  <td style="width: 40%;">VAT%</td>
                  <td style=" text-align:right; width: 20%;">$0.00</td>
              </tr>
          </table>
        </td>
      </tr>

      <tr class="table-details">
        <td colspan="4"  style="padding:0;">
          <table cellpadding="0" cellspacing="0" border="0" style="padding:0; margin:0;">
            <tr>
              <td style="border-bottom:1px solid #D3DEEF; width:20%;" ></td>
              <td style="border-bottom:1px solid #D3DEEF; width:20%;"></td>
              <td style="padding-top:5px;border-bottom:1px solid #D3DEEF; width:40%;">TDS%</td>
              <td style="padding-top:5px; text-align:right;border-bottom:1px solid #D3DEEF; width: 20%;">$0.00</td>
            </tr>
          </table>
        </td>
      </tr>
      `;
      })
      .join("");

    const paymentMethod =
      orderData.transactions[0]?.payment_gateway === "razorpay"
        ? "Paid via Credit Card"
        : "Paid via Other Method";

    const totalRowFooter = `
    <tr>
      <td colspan="2" style="text-align:left;">
        ${paymentMethod}
      </td>
      <td colspan="2" style="text-align:right; font-weight:500; color:black;">
        Invoice Total:
        <span style="color:#0156D5">USD ${formatCurrency(finalTotal)}</span>
      </td>
    </tr>
  `;

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice</title>
<style>
  body { font-family:'Proxima Nova', Arial, sans-serif; margin:0; padding:0; line-height:normal; }
  .pdf-box { max-width:1110px; margin:auto; padding:20px 20px 0 20px; }
  h2 { font-size:30px; margin:0; padding:0; }
  p { font-size:16px; line-height:24px; color:#505050; margin:0; }
  table { width:100%; border-collapse:collapse; line-height:normal; }
  .header { display:flex; justify-content:space-between; align-items:start; margin-bottom:40px; }
  .info-boxes { display:flex; gap:20px; margin-bottom:16px; }
  .box { flex:1; border:1px solid #D3DEEF; border-radius:6px; padding:20px; font-size:13px; background:#E6EFFB33; }
  .box h6 { margin:0 0 10px 0; color:#0043A2; font-size:18px; }
  .box h4 { margin:0 0 8px 0; color:#000; font-size:20px; }
  .product-description { width:40%; word-wrap:break-word; white-space:normal; }
  table.items { border:1px solid #D3DEEF; border-radius:12px; margin-bottom:16px; }
  th { background:#0043A2; color:#fff; font-size:16px; padding:5px 15px 20px; text-align:left; font-weight:500; }
  td { font-size:16px; padding:5px 15px 20px; color:#505050; vertical-align:center; }
  table tr.table-details td { padding:0px 15px 10px; }
  .footer { margin-top:20px; text-align:center; font-size:11px; color:#666; background:#E6EFFB; padding:12px 16px; }
</style>
</head>

<body>
  <div class="pdf-box">
    <div class="header">
      <div>
        <h2 style="margin-bottom:10px;">Tax Invoice</h2>
        <div class="invoice-meta">
          <p>Date: ${formatDate(orderData.date_purchase)}</p>
          <p>Invoice No: ${orderData.id}</p>
          <p>Order No: ${orderData.documentId}</p>
        </div>
      </div>
      <div>
        <img width="271" height="56"
          src="https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/main_logo_bcd605c0ae.png"
          alt="LOGO" />
      </div>
    </div>

    <div class="info-boxes">
      <div class="box">
        <h6>Billed By</h6>
        <h4><strong>WebbyCrown Solutions</strong></h4>
        <p style="margin-bottom:8px;">517, Laxmi Enclave 2, opp. Gajera School, Katargam, Surat, Gujarat 395004</p>
        <p style="margin-bottom:5px;"><span style="color:black; margin-right:28px;">Email:</span> info@webbycrown.com</p>
        <p style="margin-bottom:5px;"><span style="color:black; margin-right:15px;">Phone:</span> +91 94286-77503</p>
        <p><span style="color:black; margin-right:16px;">GSTIN:</span> 24AACFW9641F1Z3</p>
      </div>
      <div class="box">
        <h6>Billed To</h6>
        <h4><strong>${billedToFullName}</strong></h4>
        <p style="margin-bottom:8px;">${billedToAddress}</p>
        <p style="margin-bottom:5px;"><span style="color:black; margin-right:28px;">Email:</span> ${billedToEmail}</p>
        <p style="margin-bottom:5px;"><span style="color:black; margin-right:15px;">Phone:</span> ${billedToContact}</p>
        <p><span style="color:black; margin-right:16px;">GSTIN:</span> ${billedToGSTIN}</p>
      </div>
    </div>

    <table class="items" cellpadding="0" cellspacing="0" border="0">
      <thead>
        <tr>
          <th style="width: 20%;">Product Name</th>
          <th style="width: 20%;">Product Code</th>
          <th style="width: 40%;">Description</th>
          <th style="text-align:right; width: 20%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${productRows}
      </tbody>
      <tfoot>
        ${totalRowFooter}
      </tfoot>
    </table>

    <div class="info-boxes">
      <div class="box" style="display:flex; align-items:center; justify-content:space-between; gap:13px; padding:5px 15px 20px;">
        <div>
          <h6>Note:</h6>
          <p>Thanks for buying from WebbyTemplate</p>
        </div>
        <div>
          <p style="margin-bottom:8px; color:black; font-weight:500;">Have questions or need support?</p>
          <p style="margin-bottom:8px;">Reach out to us at support@webbytemplate.com.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>To learn more, please review our
      <a style="color:#0043A2" href="https://webbytemplate.com/privacy-policy">Privacy Policy</a>,
      <a style="color:#0043A2" href="https://webbytemplate.com/terms-and-conditions">Terms Conditions</a>.
    </p>
  </div>
</body>
</html>`;
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

        // Single product → clickable link
        if (!data.multiProduct) {
          return `
        <div class="flex items-center gap-2 hover:text-primary">
          <a href="/product/${data.product_slug}"
             target="_blank"
             rel="noopener noreferrer"
             class="truncate max-w-[450px]"
             >
            ${data.products}
          </a>
        </div>`;
        }

        // Multi-product (bundle) → plain title + toggle button
        return `
      <div class="flex items-center gap-2">
        <span>${data.products}</span>
        <button class="toggle-children">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
               viewBox="0 0 18 18" fill="none">
            <path d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.15385V11.2708L5.53846 8.50154L4.56508 9.49846L8.50223 13.4349L9.00069 13.9334L9.49915 13.4349L13.4356 9.49777L12.4615 8.50154L9.69231 11.2708V4.15385H8.30769Z"
              fill="#0156D5" />
          </svg>
        </button>
      </div>`;
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

        // console.log(data, "this is for download");

        return data.product_zip
          ? `<div class="flex items-center gap-2 truncate"><button class="btn btn-primary !py-1 !px-4">Download</button></div>`
          : "";
      },
      cellClick: (e, cell) => {
        const url = cell.getRow().getData()?.product_zip;
        url ? window.open(url, "_blank") : alert("No download link found.");
      },
    },
    {
      title: "Download Invoice",
      field: "downloadInvoice",
      hozAlign: "center",
      width: 100,
      formatter: (cell) => {
        const data = cell.getData();
        // console.log(data, "this is for data");

        // ✅ Only show button if it's NOT a "Multi-Product Order"
        if (
          data?.products == "Multi-Product Order" ||
          data?._children === null
        ) {
          return `<button class="review-btn !px-3 !py-1 btn btn-primary !text-sm">Download Invoice</button>`;
        }
        return ""; // no button for multi-orders
      },
      cellClick: async (e, cell) => {
        // console.log(cell.getRow().getData(), "cells data");
        const orderData = cell.getRow().getData();
        // console.log(orderData, "orderDataorderDataorderDataorderDataorderData");
        if (orderData.documentId) {
          await downloadInvoice(orderData);
        } else {
          toast.error("No invoice data found.");
        }
      },
    },
    {
      title: "Date Purchased",
      field: "date_purchase",
      hozAlign: "center",
      formatter: "datetime",
      formatterParams: {
        inputFormat: "iso",
        outputFormat: "dd-MMM-yyyy",
        invalidPlaceholder: "",
      },
    },

    {
      title: "Product Review",
      field: "review",
      hozAlign: "center",
      formatter: (cell) => {
        const rowData = cell.getRow().getData();

        // ✅ Only show button if it's NOT a "Multi-Product Order"
        if (rowData?.products !== "Multi-Product Order") {
          return `<button class="review-btn !px-3 !py-1 btn btn-primary !text-sm">Add Review</button>`;
        }
        return ""; // no button for multi-orders
      },
      cellClick: (e, cell) => {
        const rowData = cell.getRow().getData();

        // console.log(rowData, "rowData?.products !== ");

        // if (rowData?.products !== "Multi-Product Order") {
        setSelectedProduct(rowData);
        setIsOpen(true);
        // }
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

  const page_size = 1;

  useEffect(() => {
    const fetchOrderData = async (id) => {
      setLoading(true);
      try {
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
            // console.log(item, "console -> ");
            const isMultipleProducts = item?.products?.length > 1;

            const redirectProduct = (products) =>
              // console.log(products);
              products.map((p) => ({
                // id: p?.id, // ✅ numeric id
                order_id: item?.documentId,
                document_id: p?.product?.documentId, // ✅ strapi uid
                products: p.product_title || p.product?.title || "Untitled",
                price: p.product?.price,
                product_zip:
                  p.product?.product_zip_url || p.product?.product_zip || null,
                product_slug: p.product?.slug || null, // ✅ added slug
              }));

            // console.log(item, "guyfsdyufysudfyuasdf");

            return {
              ...item,
              documentId: item.documentId || 1,
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
              date_purchase: item.updatedAt,
              product_slug: !isMultipleProducts
                ? item.products?.[0]?.product?.slug
                : item.products?.[0]?.product?.slug,
            };
          });
          setFilteredOrder(formattedData);
        }
      } catch (err) {
        toast.error("Failed to load product data.");
        setFilteredOrder([]);
      } finally {
        setLoading(false);
      }
    };
    if (authUser) {
      fetchOrderData(authUser?.documentId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filterData, authUser?.documentId]);

  return (
    <>
      <div className="min-h-[1000px]">
        <h1 className="h2 mb-5 mt-[30px]">{title}</h1>
        <div className="border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white">
          <div className="flex items-center justify-between sm:flex-nowrap flex-wrap gap-1.5 w-full border-b border-primary/10 sm:px-5 h-[37px] px-3 py-[6px] bg-white">
            <span className="text-black">Downloads for invoices</span>
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
              {loading && (
                <div className="p-4">
                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-100 bg-white text-sm">
                      <tbody className="divide-y divide-gray-100">
                        {[...Array(10)].map((_, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-64 bg-gray-100 animate-pulse rounded mb-1" />
                              <div className="h-4 w-56 bg-gray-100 animate-pulse rounded" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-8 w-20 bg-gray-100 animate-pulse rounded" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-8 w-28 bg-gray-100 animate-pulse rounded" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-20 bg-gray-100 animate-pulse rounded" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {filteredOrder ? (
                <DynamicTable
                  id={loading}
                  data={filteredOrder}
                  columns={columns}
                  layout="fitDataFill"
                  classes="download-table"
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

      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default DownloadPage;
