"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Tooltip,
  Button,
  Input,
  Textarea,
  Skeleton,
} from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import { strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import html2pdf from "html2pdf.js/dist/html2pdf.min";
import ReviewModal from "./ReviewModel";

function InfoIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

const ORDER_V2_API_BASE = "https://studio.webbytemplate.com/api/order/v2";
const PRODUCT_DOWNLOAD_API = "https://studio.webbytemplate.com/api/orders/productdownload";

function formatAccessDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getStatusDisplay(item) {
  if (item.expired || item.access_status === "Expired")
    return { label: "Expired", className: "bg-[#C32D0B33] text-[#C32D0B] border-[#C32D0B]" };
  const expiry = item.access_expired_date ? new Date(item.access_expired_date) : null;
  const daysLeft = expiry ? Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  if (daysLeft <= 30 && daysLeft > 0)
    return { label: "Expiring Soon", className: "bg-[#ED9A1233] text-[#ED9A12] border-[#ED9A12]" };
  return { label: "Active", className: "bg-[#257C6533] text-[#257C65] border-[#257C65]" };
}

const StarIcon = ({ filled, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" className={className}>
    <path
      d="M7.33775 0.604627C7.59968 -0.201519 8.74016 -0.201521 9.0021 0.604626L10.3309 4.69417C10.448 5.05469 10.784 5.29878 11.163 5.29878H15.463C16.3107 5.29878 16.6631 6.38344 15.9774 6.88167L12.4986 9.40914C12.1919 9.63196 12.0636 10.0269 12.1807 10.3874L13.5095 14.477C13.7714 15.2831 12.8488 15.9535 12.163 15.4552L8.68423 12.9278C8.37756 12.705 7.96229 12.705 7.65561 12.9278L4.17684 15.4552C3.49109 15.9535 2.56842 15.2831 2.83035 14.477L4.15912 10.3874C4.27626 10.0269 4.14794 9.63196 3.84126 9.40914L0.36249 6.88167C-0.323259 6.38344 0.0291688 5.29878 0.876802 5.29878H5.1768C5.55587 5.29878 5.89183 5.05469 6.00897 4.69417L7.33775 0.604627Z"
      fill={filled ? "#0043A2" : "#808080"}
      stroke={filled ? "#0043A2" : "#808080"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownloadPage = ({ title }) => {
  const formRef = useRef(null);
  const { authUser } = useAuth();
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [downloadsLoading, setDownloadsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

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
          licenseDescription = `${item.product_title} - ${item.extra_info[0]?.license?.title || "Regular License"
            }`;
          productPrice = item.total;
        }

        // Calculate GST per product
        const gstAmount = (productPrice * taxPercentage) / 100;

        return `
      <tr className="table-details">
        <td colspan="4" style="padding:0;">
          <table cellpadding="0" cellspacing="0" border="0" style="padding:0; margin:0;">
              <tr>
                  <td style="width: 20%;">${productName}: template</td>
                  <td style="width: 20%;">${productCode}</td>
                  <td className="product-description">
                  <p>${licenseDescription}</p></td>
                  <td style=" text-align:right; width: 20%;">${formatCurrency(productPrice)}</td>
              </tr>
          </table>
        </td>
      </tr>

      <tr className="table-details">
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

      <tr className="table-details">
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

      <tr className="table-details">
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
  <div className="pdf-box">
    <div className="header">
      <div>
        <h2 style="margin-bottom:10px;">Tax Invoice</h2>
        <div className="invoice-meta">
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

    <div className="info-boxes">
      <div className="box">
        <h6>Billed By</h6>
        <h4><strong>WebbyCrown Solutions</strong></h4>
        <p style="margin-bottom:8px;">517, Laxmi Enclave 2, opp. Gajera School, Katargam, Surat, Gujarat 395004</p>
        <p style="margin-bottom:5px;"><span style="color:black; margin-right:28px;">Email:</span> info@webbycrown.com</p>
        <p style="margin-bottom:5px;"><span style="color:black; margin-right:15px;">Phone:</span> +91 94286-77503</p>
        <p><span style="color:black; margin-right:16px;">GSTIN:</span> 24AACFW9641F1Z3</p>
      </div>
      <div className="box">
        <h6>Billed To</h6>
        <h4><strong>${billedToFullName}</strong></h4>
        <p style="margin-bottom:8px;">${billedToAddress}</p>
        <p style="margin-bottom:5px;"><span style="color:black; margin-right:28px;">Email:</span> ${billedToEmail}</p>
        <p style="margin-bottom:5px;"><span style="color:black; margin-right:15px;">Phone:</span> ${billedToContact}</p>
        <p><span style="color:black; margin-right:16px;">GSTIN:</span> ${billedToGSTIN}</p>
      </div>
    </div>

    <table className="items" cellpadding="0" cellspacing="0" border="0">
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

    <div className="info-boxes">
      <div className="box" style="display:flex; align-items:center; justify-content:space-between; gap:13px; padding:5px 15px 20px;">
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

  <div className="footer">
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

  const handleProductDownload = async (item) => {
    const userDocumentId = authUser?.documentId;
    const productDocumentId = item.product_document_id || item.product?.documentId;
    const licenseKey = item.license_key;
    const orderId = item.order_id;

    if (!userDocumentId || !licenseKey || !orderId) {
      toast.error("Missing required download information.");
      return;
    }
    if (!productDocumentId) {
      toast.error("Product document ID is missing. Please contact support.");
      return;
    }

    setDownloadingId(item.id);
    try {
      const res = await fetch(PRODUCT_DOWNLOAD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_document_id: userDocumentId,
          license_key: licenseKey,
          product_document_id: productDocumentId,
          order_id: orderId,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const disposition = res.headers.get("Content-Disposition");
        const filenameMatch = disposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        const filename = filenameMatch
          ? filenameMatch[1].replace(/['"]/g, "")
          : `product-${item.product_id || "download"}.zip`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Download started!");
      } else {
        const text = await res.text();
        let msg = "Download failed. Please try again.";
        try {
          const json = JSON.parse(text);
          msg = json?.message || json?.error || msg;
        } catch {
          if (text) msg = text;
        }
        toast.error(msg);
      }
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Something went wrong while downloading.");
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = [
    {
      title: "Order ID",
      field: "products",
      formatter: (cell) => {
        const data = cell.getData();
        return (
          data.documentId &&
          `<div className="flex items-center gap-2"> <span>${data.documentId}</span> </div>`
        );
      },
    },
    {
      title: "Product Name & Bundle",
      field: "product",
      hozAlign: "left",
      formatter: (cell) => {
        const data = cell.getData();

        // Single product → clickable link
        if (!data.multiProduct) {
          return `
        <div className="flex items-center gap-2 hover:text-primary">
          <a href="/product/${data.product_slug}"
             target="_blank"
             rel="noopener noreferrer"
             className="truncate max-w-[450px]"
             >
            ${data.products}
          </a>
        </div>`;
        }

        // Multi-product (bundle) → plain title + toggle button
        return `
      <div className="flex items-center gap-2">
        <span>${data.products}</span>
        <button className="toggle-children">
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
      title: "Status",
      field: "status",
      hozAlign: "center",
      vertAlign: "middle",
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
      <div className="flex items-center justify-center w-full h-full">
        <span className="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2 justify-center ${style}">
          <span className="w-2 h-2 rounded-full ${colorDot}"></span>
          ${value ? value.charAt(0).toUpperCase() + value.slice(1) : "N/A"}
        </span>
      </div>
    `;
      },
    },

    {
      title: "Download Invoice",
      field: "downloadInvoice",
      hozAlign: "center",
      width: 100,
      formatter: (cell) => {
        const data = cell.getData();

        // Only show button if status is "complete" AND it's NOT a "Multi-Product Order"
        const isComplete = data.status?.toLowerCase() === "complete";
        if (
          isComplete &&
          (data?.products == "Multi-Product Order" ||
            data?._children === null)
        ) {
          return `<button className="review-btn !px-3 !py-1 btn btn-primary !text-sm">Download Invoice</button>`;
        }
        return ""; // no button if not complete or for multi-orders
      },
      cellClick: async (e, cell) => {
        const orderData = cell.getRow().getData();
        const isComplete = orderData.status?.toLowerCase() === "complete";
        if (!isComplete) {
          toast.error("Invoice download is only available for completed orders.");
          return;
        }
        if (orderData.documentId) {
          await downloadInvoice(orderData);
        } else {
          toast.error("No invoice data found.");
        }
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
            const isMultipleProducts = item?.products?.length > 1;

            const redirectProduct = (products) =>
              products.map((p) => ({
                // id: p?.id, // ✅ numeric id
                order_id: item?.documentId,
                document_id: p?.product?.documentId, // ✅ strapi uid
                products: p.product_title || p.product?.title || "Untitled",
                price: p.product?.price,
                product_zip:
                  p.product?.product_zip_url || p.product?.product_zip || null,
                product_slug: p.product?.slug || null, // ✅ added slug
                status: item.order_status || "N/A", // ✅ inherit parent order status
              }));


            return {
              ...item,
              documentId: item.documentId || 1,
              status: item.order_status || "N/A",
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

  // Fetch order v2 downloads (product access list)
  useEffect(() => {
    const fetchDownloads = async () => {
      const userId = authUser?.documentId;
      if (!userId) {
        setDownloads([]);
        setDownloadsLoading(false);
        return;
      }
      setDownloadsLoading(true);
      try {
        const res = await fetch(`${ORDER_V2_API_BASE}/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (json?.result && Array.isArray(json.data)) {
          setDownloads(json.data);
        } else {
          setDownloads([]);
        }
      } catch (err) {
        toast.error("Failed to load downloads.");
        setDownloads([]);
      } finally {
        setDownloadsLoading(false);
      }
    };
    fetchDownloads();
  }, [authUser?.documentId]);

  return (
    <>
      <div className="min-h-[1000px]">
        <h1 className="h2 mb-2 mt-[30px]">{title}</h1>
        <p className="mb-5 ">Download and manage the products you’ve purchased.</p>


        <div className="mb-5">
          <div className="bg-white border border-primary/10 rounded-md md::p-4 p-3">
            <div className="sm:border-l-2 border-blue-300 xl:pl-[18px] lg:pl-4 sm:pl-3">
              <div className="flex items-center gap-2">
                <p className="text-black">
                  💡 Download access policy
                </p>
              </div>
              <ul className="mt-3 space-y-1 text-[#616161]">
                <li className="flex items-start gap-2 p2 text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                    <g clipPath="url(#clip0_9320_5934)">
                      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" />
                    </g>
                  </svg>
                  Purchased products can be downloaded for 6 months from the purchase date.
                </li>
                <li className="flex items-start gap-2 p2 text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                    <g clipPath="url(#clip0_9320_5934)">
                      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" />
                    </g>
                  </svg>
                  After this period, access expires and the product must be re-purchased.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {downloadsLoading ? (
          <div className="w-full overflow-x-auto bg-white border 2xl:px-5 2xl:py-6 lg:px-4 lg:py-5 px-3 sm:py-4 py-3 border-primary/10 rounded-[5px]">
            <table className="bg-white text-sm sm:min-w-[1040px] min-w-[990px] w-full">
              <thead>
                <tr className="bg-[#F4F7FB] text-left p2 !font-normal !text-black">
                  <th className="lg:px-5 px-4 sm:py-3 py-2 rounded-l-[5px]">Product</th>
                  <th className="lg:px-5 px-4 sm:py-3 py-2">Access Status</th>
                  <th className="lg:px-5 px-4 sm:py-3 py-2">Review</th>
                  <th className="lg:px-5 px-4 sm:py-3 py-2 text-right rounded-r-[5px]">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td className="lg:px-5 sm:px-4 px-3 sm:py-4 py-2">
                      <Skeleton className="h-5 w-3/4 max-w-[320px] rounded" />
                      <Skeleton className="h-4 w-28 rounded mt-2" />
                    </td>
                    <td className="lg:px-5 sm:px-4 px-3 sm:py-4 py-2">
                      <Skeleton className="h-7 w-20 rounded-full" />
                      <Skeleton className="h-4 w-36 rounded mt-2" />
                    </td>
                    <td className="lg:px-5 sm:px-4 px-3 sm:py-4 py-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <Skeleton key={j} className="h-4 w-4 rounded" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-40 rounded mt-2" />
                    </td>
                    <td className="lg:px-5 sm:px-4 px-3 sm:py-4 py-2 text-right">
                      <Skeleton className="h-10 w-28 rounded-md ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : downloads.length > 0 ? (
          <div className="w-full overflow-x-auto bg-white border 2xl:px-5 2xl:py-6 lg:px-4 lg:py-5 px-3 sm:py-4 py-3 border-primary/10 rounded-[5px]">
            <table className="bg-white text-sm sm:min-w-[1040px] min-w-[990px] w-full">
              <thead>
                <tr className="bg-[#F4F7FB] text-left p2 !font-normal !text-black">
                  <th className="lg:px-5 px-4 sm:py-3 py-2 rounded-l-[5px]">Product</th>
                  <th className="lg:px-5 px-4 sm:py-3 py-2">Access Status</th>
                  <th className="lg:px-5 px-4 sm:py-3 py-2">Review</th>
                  <th className="lg:px-5 px-4 sm:py-3 py-2 text-right rounded-r-[5px]">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {downloads.map((item) => {
                  const statusDisplay = getStatusDisplay(item);
                  const licenseTitle = item.extra_info?.[0]?.license?.title || "Regular License";
                  const isExpired = item.expired || item.access_status === "Expired";
                  return (
                    <tr key={item.id}>
                      <td className="lg:px-5 sm:px-4 px-3 sm:py-4 py-2">
                        <p className="font-bold">{(item.product_title || "").trim() || "—"}</p>
                        <div className="flex items-center gap-1 text-primary text-sm mt-1 w-fit">
                          {licenseTitle}
                          <Tooltip
                            content="License details are available in your invoice."
                            placement="top"
                            showArrow
                            classNames={{
                              base: "max-w-fit",
                              content:
                                "text-[14px] leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
                            }}
                          >
                            <span className="inline-flex items-center">
                              <InfoIcon className="text-primary" />
                            </span>
                          </Tooltip>
                        </div>
                      </td>

                      <td className="lg:px-5 sm:px-4 px-3 sm:py-4 py-2">
                        <span className={`w-fit flex items-center rounded-full border px-[10px] text-[13px] ${statusDisplay.className}`}>
                          {statusDisplay.label}
                        </span>
                        <p className="text-sm text-gray-200 mt-[6px]">
                          {isExpired
                            ? `Access expired on ${formatAccessDate(item.access_expired_date)}`
                            : `Access valid until ${formatAccessDate(item.access_expired_date)}`}
                        </p>
                      </td>

                      <td className="lg:px-5 sm:px-4 px-3 sm:py-4 py-2">
                        {item.existing_review ? (
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <StarIcon key={i} filled={i <= (item.existing_review?.rating || 0)} />
                            ))}
                          </div>
                        ) : item.can_add_review ? (
                          <>
                            <Button className="bg-transparent h-fit p-0" onClick={() => { setSelectedProduct(item); setIsOpen(true); }}>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <StarIcon key={i} filled={false} />
                                ))}
                              </div>
                            </Button>
                            <p className="text-sm text-gray-200 mt-2">Click to rate this product</p>
                          </>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-[14px] text-gray-200 flex items-center gap-1">
                              Already reviewed
                              <Tooltip
                                content="You have already submitted a review for this product, so you cannot add another one."
                                placement="top"
                                showArrow
                                classNames={{
                                  base: "max-w-[330px] w-full",
                                  content:
                                    "text-[14px] text-center leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
                                }}
                              >
                                <span className="inline-flex items-center">
                                  <InfoIcon className="text-primary" />
                                </span>
                              </Tooltip>
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="">
                        {isExpired ? (
                          <div className="flex items-center justify-end">
                            <span className="text-[14px] text-gray-200 flex items-center gap-1">
                              Expired
                              <Tooltip
                                content="Your access period has ended. Please re-purchase to download this product again."
                                placement="top"
                                showArrow
                                classNames={{
                                  base: "max-w-[330px] w-full ",
                                  content:
                                    "text-[14px] text-center leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
                                }}
                              >
                                <span className="inline-flex items-center">
                                  <InfoIcon className="text-primary" />
                                </span>
                              </Tooltip>
                            </span>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary ml-auto mr-0"
                            onClick={() => handleProductDownload(item)}
                            disabled={downloadingId === item.id}
                          >
                            {downloadingId === item.id ? "Downloading..." : "Download"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white border px-5 py-6 border-primary/10 rounded-[5px] mt-6">
            <div className="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="79" viewBox="0 0 96 79" fill="none" className="sm:w-[96px] sm:h-[79px] w-[73px] h-[60px]">
                <path d="M29.2113 46.0294C29.6525 45.5882 29.6525 44.8529 29.2113 44.4118L25.6819 40.8824L30.2407 36.3235C30.6819 35.8824 30.6819 35.1471 30.2407 34.7059C29.7995 34.2647 29.0642 34.2647 28.623 34.7059L24.0642 39.2647L19.9466 35.1471C19.5054 34.7059 18.7701 34.7059 18.3289 35.1471C17.8878 35.5882 17.8878 36.3235 18.3289 36.7647L22.4466 40.8824L18.3289 45C17.8878 45.4412 17.8878 46.1765 18.3289 46.6176C18.7701 47.0588 19.5054 47.0588 19.9466 46.6176L24.0642 42.5L27.5936 46.0294C28.1819 46.4706 28.7701 46.4706 29.2113 46.0294ZM28.7701 60.5882C28.3289 61.0294 28.3289 61.7647 28.9172 62.2059C29.3583 62.6471 30.0936 62.6471 30.5348 62.0588C37.7407 54.1176 50.0936 54.2647 57.1525 61.6176C57.5936 62.0588 58.3289 62.0588 58.7701 61.6176C59.2113 61.1765 59.2113 60.4412 58.7701 60C50.6819 51.7647 36.8583 51.6176 28.7701 60.5882Z" fill="#0043A2" />
                <path d="M83.7704 69.4117L87.5939 30.4411C87.741 28.8234 87.1527 27.2058 86.1233 26.0293C85.0939 24.8528 83.4763 24.1175 81.8586 24.1175V13.9705C81.8586 10.1469 78.9174 7.05871 75.0939 6.91165L13.1822 6.0293C9.21156 6.0293 6.27039 9.11753 6.12333 12.794V15.4411C4.35862 15.8822 3.03509 17.0587 2.2998 18.8234C1.41745 19.8528 0.82921 21.1764 0.535093 22.2058C-0.200201 24.8528 -0.0531427 27.6469 0.240975 30.4411C1.41745 43.3822 2.59392 56.1764 3.62333 69.1175C4.0645 74.7058 5.53509 77.0587 13.6233 77.4999C36.7116 78.6764 59.7998 78.5293 82.888 78.0881C83.7704 78.0881 84.7998 78.0881 85.5351 77.6469C86.4174 77.2058 87.0057 76.3234 86.8586 75.4411C86.4174 73.5293 83.1822 73.8234 81.2704 73.6764C82.5939 72.794 83.4763 71.3234 83.7704 69.4117ZM13.1822 8.38224L75.0939 9.26459C77.5939 9.26459 79.7998 11.4705 79.6527 13.9705V24.2646H58.0351C56.4174 24.2646 54.7998 23.5293 53.6233 22.3528L50.241 18.5293C48.4763 16.6175 45.9763 15.4411 43.3292 15.4411H8.32921V13.0881C8.32921 10.294 10.5351 8.23518 13.1822 8.38224ZM78.0351 72.4999H11.7116C9.94686 72.4999 8.32921 71.1764 8.18215 69.2646L3.91745 21.3234C3.77039 19.2646 5.38803 17.4999 7.44686 17.4999H43.3292C45.388 17.4999 47.2998 18.3822 48.6233 19.8528L52.0057 23.6764C53.4763 25.4411 55.6822 26.4705 58.0351 26.4705H81.8586C82.888 26.4705 83.7704 26.9117 84.5057 27.6469C85.241 28.3822 85.5351 29.4117 85.388 30.294L81.5645 69.2646C81.4174 71.0293 79.7998 72.4999 78.0351 72.4999Z" fill="#0043A2" />
                <path d="M62.594 38.9706L65.8293 35.7353C66.2705 35.2941 66.2705 34.5588 65.8293 34.1176C65.3881 33.6765 64.6528 33.6765 64.2116 34.1176L60.9763 37.3529L56.8587 33.2353C56.4175 32.7941 55.6822 32.7941 55.241 33.2353C54.7999 33.6765 54.7999 34.4118 55.241 34.8529L59.3587 38.9706L55.5352 42.7941C55.094 43.2353 55.094 43.9706 55.5352 44.4118C55.9763 44.8529 56.7116 44.8529 57.1528 44.4118L60.9763 40.5882L65.094 44.7059C65.5352 45.1471 66.2704 45.1471 66.7116 44.7059C67.1528 44.2647 67.1528 43.5294 66.7116 43.0882L62.594 38.9706ZM82.594 0.441176C81.2704 2.20588 80.241 3.97059 79.5057 6.02941C79.3587 6.61765 79.6528 7.20588 80.241 7.35294C80.8293 7.5 81.4175 7.20588 81.5646 6.61765C82.1528 4.85294 83.0352 3.08823 84.2116 1.61765C84.6528 1.17647 84.5057 0.441177 84.0646 0C83.6234 0 83.0352 -4.38269e-07 82.594 0.441176ZM92.0057 4.70588C91.7116 4.26471 90.9763 3.97059 90.5352 4.41177L83.6234 8.82353C83.1822 9.11765 83.0352 9.85294 83.3293 10.2941C83.6234 10.7353 84.3587 11.0294 84.7999 10.5882L91.7116 6.17647C92.1528 5.88235 92.2999 5.14706 92.0057 4.70588ZM94.0646 12.6471L86.2704 13.2353C85.6822 13.2353 85.241 13.8235 85.241 14.4118C85.241 15 85.8293 15.4412 86.4175 15.4412L94.2116 14.8529C94.7999 14.8529 95.241 14.2647 95.241 13.6765C95.094 13.0882 94.6528 12.6471 94.0646 12.6471Z" fill="#0043A2" />
              </svg>
              <h4 className="font-medium text-black text-center">You don't have any downloads yet</h4>
              <p className="p2 sm:mt-4 mt-2 text-center">
                Once you purchase a product, it will appear here for download.
              </p>
              <a href="/products" className="btn btn-primary sm:mt-[30px] mt-4">Browse products</a>
            </div>
          </div>
        )}
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
