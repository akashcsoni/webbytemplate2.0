"use client";

import React, { use, useEffect, useState } from "react";
import { strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import html2pdf from "html2pdf.js/dist/html2pdf.min";
import toast from "react-hot-toast";

export default function CheckoutPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState({});
  const authToken = Cookies.get("authToken");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  // console.log(sessionId);
  const [status, setStatus] = useState("Verifying payment...");

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getProductList = async () => {
    try {
      const payload = {
        documentId: id,
        authToken: authToken,
      };

      const productData = await strapiPost(
        `orders/document-id`,
        payload,
        themeConfig.TOKEN
      );

      if (productData?.data) {
        setOrder(productData?.data);
      }
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      // ✅ Check if it's a 404 and redirect
      if (err?.response?.status === 404) {
        router.push("/"); // 👈 Redirect to homepage
      }
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  useEffect(() => {
    const verifyStripePayment = async () => {
      if (!sessionId) {
        setStatus("❌ Missing session ID");
        return;
      }

      try {
        const res = await strapiPost(
          "stripe/verify", // ✅ no /api prefix
          { session_id: sessionId },
          themeConfig.TOKEN // ❗optional, only if auth required
        );

        // if (res?.success) {
        //   setStatus("✅ Payment successful! Transaction saved.");
        // } else {
        //   setStatus("⚠️ Payment verified but something went wrong.");
        // }
      } catch (err) {
        console.error("Stripe verification failed:", err);
        setStatus("❌ Stripe verification failed.");
      }
    };

    verifyStripePayment();
  }, [sessionId]);

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

    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: "2-digit", month: "short", year: "numeric" };
      const formattedDate = date.toLocaleDateString("en-GB", options);

      return formattedDate;
    }

    return `  
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Invoice</title>
    <style>
        body {
            font-family: 'Proxima Nova', Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .pdf-box {
            max-width: 1110px;
            margin: auto;
            padding: 20px 20px 0 20px;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            margin: 0;
            padding: 0;
        }

        h2 {
            font-size: 30px;
        }

        p {
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
            color: #505050;
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 20px;
        }

        /* .invoice-meta p {
            margin-bottom: px;
        } */

        .info-boxes {
            display: flex;
            gap: 20px;
            margin-bottom: 16px;
        }

        .box {
            flex: 1;
            border: 1px solid #D3DEEF;
            border-radius: 6px;
            padding: 20px;
            font-size: 13px;
            background: #E6EFFB33;
        }

        .box h6 {
            margin-top: 0px;
            margin-bottom: 10px;
            font-weight: 400;
            color: #0043A2;
            font-size: 18px;
        }

        .box h4 {
            margin-top: 0px;
            margin-bottom: 8px;
            color: #000000;
            font-size: 20px;
        }

        .product-description {
            width: 40%;
            word-wrap: break-word;
            white-space: normal;
        }

        table {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            border: 1px solid #D3DEEF;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 16px;
        }

        th {
            margin-top: 0;
            white-space: nowrap;
            background: #0043A2;
            color: #fff;
            font-size: 16px;
            padding: 10px 15px;
            text-align: left;
            font-weight: 500;
        }

        td {
            margin: 0;
            font-size: 16px;
            padding: 10px 15px;
            font-weight: 400;
            color: #505050;
            vertical-align: top;
            /* border-bottom: 1px solid #eee; */
        }

        .totals {
            margin-top: 20px;
        }

        .totals td {
            font-size: 13px;
            padding: 6px 10px;
        }

        .totals tr:last-child td {
            font-weight: bold;
            background: #f4f4f4;
        }

        .note {
            margin-top: 20px;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 6px;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #666;
            background: #E6EFFB;
            padding: 12px 16px;
        }

        .footer a {
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="pdf-box">

        <!-- Header -->
        <div class="header">
            <div>
                <h2 style="margin-bottom:10px;">Tax Invoice</h2>
                <div class="invoice-meta">
                    <p>Date: 28 Apr 2025</p>
                    <p>Invoice No: IVIP55367467</p>
                    <p>Order No: 201762078</p>
                </div>
            </div>
            <div>
                <img src="https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/Favicon_1_a677acbd8e.png"
                    alt="LOGO" />
            </div>
        </div>

        <!-- Info -->
        <div class="info-boxes">
            <div class="box">
                <h6>Billed By</h6>
                <h4><strong>WebbyCrown Solutions</strong></h4>
                <p style="margin-bottom:8px;">517, Laxmi Enclave 2, opp. Gajera School, Katargam, Surat, Gujarat 395004
                </p>
                <p style="margin-bottom:5px;"><span style="color:black; margin-right:28px;">Email:</span>
                    info@webbycrown.com</p>
                <p style="margin-bottom:5px;"><span style="color:black; margin-right:15px;">Phone:</span> +91
                    63527-72383</p>
                <p><span style="color:black; margin-right:16px;">GSTIN:</span> 22AAAA00051225</p>
            </div>
            <div class="box">
                <h6>Billed To</h6>
                <h4><strong>Rohit Ghoghari</strong></h4>
                <p style="margin-bottom:8px;">45, Chamunda nagr soc, sagar-puna road, Surat, Gujarat 395010, India</p>
                <p style="margin-bottom:5px;"><span style="color:black; margin-right:28px;">Email:</span>
                    rvghoghari@gmail.com</p>
                <p style="margin-bottom:5px;"><span style="color:black; margin-right:15px;">Phone:</span> +91
                    63527-72383</p>
                <p><span style="color:black; margin-right:16px;">GSTIN:</span> 22AAAA00051Z25</p>
            </div>
        </div>

        <table class="items">
            <thead>
                <tr>
                    <th style="width: 20%;">Product Name</th>
                    <th style="width: 20%;">Product Code</th>
                    <th style="width: 40%;">Description</th>
                    <th style="text-align:right; width: 20%;">Amount</th>
                </tr>
            </thead>

            <tbody>
                <!-- Product 1 -->

                <tr>
                    <td>Orian: template</td>
                    <td>Or553525</td>
                    <td class="product-description">Lestin - Directory Listing WordPress Theme -
                        Regular License</td>
                    <td style=" text-align:right;">$25</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td style="padding:5px 15px;">GST% @ 18.0%</td>
                    <td style=" text-align:right; padding:5px 15px;">$3.4</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td style="padding:5px 15px;">VAT%</td>
                    <td style=" text-align:right; padding:5px 15px;">$2.5</td>
                </tr>
                <tr>
                    <td style="border-bottom:1px solid #D3DEEF;"></td>
                    <td style="border-bottom:1px solid #D3DEEF;"></td>
                    <td style="padding-top:5px;border-bottom:1px solid #D3DEEF;">TDS%</td>
                    <td style="padding-top:5px; text-align:right;border-bottom:1px solid #D3DEEF;">$1.1</td>
                </tr>

                <!-- Product 2 -->
                <tr>
                    <td>Orian: template</td>
                    <td>Or553525</td>
                    <td class="product-description">Lestin - Directory Listing WordPress Theme -
                        Regular License</td>
                    <td style=" text-align:right;">$25</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td style="padding:5px 15px;">GST% @ 18.0%</td>
                    <td style=" text-align:right; padding:5px 15px;">$3.4</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td style="padding:5px 15px;">VAT%</td>
                    <td style=" text-align:right; padding:5px 15px;">$2.5</td>
                </tr>
                <tr>
                    <td style="border-bottom:1px solid #D3DEEF;"></td>
                    <td style="border-bottom:1px solid #D3DEEF;"></td>
                    <td style="padding-top:5px;border-bottom:1px solid #D3DEEF;">TDS%</td>
                    <td style="padding-top:5px; text-align:right;border-bottom:1px solid #D3DEEF;">$1.1</td>
                </tr>
            </tbody>

            <tfoot>
                <tr>
                    <td colspan="2" style="text-align:left;">
                        Paid via Credit Card</td>
                    <td colspan="2" style="text-align:right; font-weight:500; color:black;">Invoice Total:
                        <span style="color:#0156D5"> USD $34.49</span>
                    </td>
                </tr>
            </tfoot>
        </table>


        <!-- Note -->
        <div class="info-boxes">
            <div class="box"
                style="display:flex; align-items:center; justify-content:space-between; gap:13px; padding:15px;">
                <div>
                    <h6>Note:</h6>

                    <p>Thanks for buying from (Author Name) from WebbyTemplate</p>

                </div>
                <div>
                    <p style="margin-bottom:8px; color:black; font-weight:500;">Have questions or need support?</p>
                    <p style="margin-bottom:8px;">Reach out to us at support@yourwebsite.com.</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
    </div>
    <div class="footer">
        <p>
            To learn more, please review our
            <a href="#">Privacy Policy</a>,
            <a href="#">Terms of Service</a>, or
            <a href="#">Tax & VAT Policy</a>.
        </p>
    </div>
</body>

</html>
`;
  };

  return (
    <div className="container">
      {/* Checkout Title */}
      <div className="flex items-center justify-center 1xl:pt-[70px] xl:pt-[60px] md:pt-[50px] sm:pt-[40px] pt-7">
        <div className="lg:w-[706px] w-[600px] max-w-full flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 98 98"
            fill="none"
            className="1xl:mb-[38px] xl:mb-7 md:mb-6 mb-4 1xl:w-[98px] md:w-[92px] w-[74px]"
          >
            <path
              d="M91.71 29.8336C91.5303 31.6096 91.361 33.3883 91.1709 35.1617C90.973 37.0263 91.4392 38.6956 92.5694 40.193C93.5277 41.4638 94.4964 42.732 95.3949 44.0445C97.9053 47.7086 97.9079 50.4508 95.4131 54.1096C94.6995 55.1565 93.9678 56.2008 93.1423 57.1591C91.2725 59.3284 90.9183 61.8076 91.2855 64.5498C91.5433 66.4716 91.6813 68.4274 91.6397 70.3623C91.5902 72.6748 90.3714 74.4716 88.3818 75.5862C86.5173 76.6305 84.5511 77.5029 82.585 78.3492C80.5615 79.2216 79.1475 80.6175 78.3142 82.6513C77.71 84.1201 77.085 85.5862 76.3792 87.0081C74.5303 90.7399 72.0876 92.0628 67.9287 91.6591C66.2438 91.4951 64.5615 91.3206 62.8792 91.1539C61.085 90.9768 59.4678 91.4221 58.0173 92.5029C56.6371 93.5315 55.2412 94.5446 53.835 95.5393C50.6032 97.8258 47.3662 97.7711 44.1501 95.5003C43.0615 94.732 41.9444 93.9899 40.9365 93.1227C38.7621 91.2555 36.2829 90.8961 33.5355 91.2529C31.5772 91.5081 29.585 91.6409 27.6136 91.5992C25.4522 91.555 23.7386 90.4274 22.6371 88.6044C21.7334 87.1149 20.9105 85.5393 20.3193 83.9039C19.1996 80.8076 17.1891 78.7555 14.0589 77.7138C12.8949 77.3258 11.7699 76.7789 10.6813 76.2034C7.26205 74.3987 5.98081 71.9873 6.34279 68.1461C6.50685 66.4013 6.68914 64.6565 6.86623 62.9143C7.04852 61.1227 6.59799 59.5081 5.52247 58.0576C4.51466 56.7008 3.4782 55.3623 2.53289 53.9664C0.160495 50.4664 0.157886 47.732 2.51205 44.2294C3.27247 43.0992 4.06675 41.9768 4.94956 40.943C6.78811 38.7893 7.14747 36.3284 6.74643 33.6331C6.52247 32.1253 6.3506 30.6018 6.29591 29.081C6.18394 25.9664 7.51726 23.607 10.3115 22.1774C11.9574 21.3362 13.6553 20.5836 15.361 19.8727C17.4261 19.0133 18.8792 17.607 19.7204 15.5315C20.3063 14.0888 20.9235 12.6565 21.611 11.2607C23.4756 7.46381 25.8923 6.13308 30.1058 6.52371C31.822 6.68256 33.5381 6.86745 35.2542 7.03152C36.9782 7.19558 38.5381 6.76069 39.9417 5.73985C41.5199 4.59402 43.0746 3.41173 44.7022 2.3362C47.5824 0.432558 50.5147 0.471622 53.3897 2.36225C54.6657 3.20079 55.9339 4.07058 57.098 5.05496C59.2855 6.89871 61.7621 7.3336 64.5016 6.89871C65.8167 6.69037 67.1501 6.55235 68.4782 6.4612C71.8949 6.22683 74.5225 7.51329 76.0876 10.6279C76.8871 12.2216 77.6136 13.8544 78.2959 15.5029C79.1501 17.568 80.5667 19.0029 82.6449 19.8544C84.2985 20.5315 85.9521 21.2242 87.5303 22.0576C90.7412 23.7555 92.0095 26.2086 91.71 29.8336ZM8.96779 68.9091C8.82196 71.1435 9.76987 72.7451 11.7751 73.7112C12.973 74.2893 14.1657 74.9065 15.4157 75.3518C18.9964 76.6253 21.3897 79.0159 22.6709 82.5862C23.1084 83.8024 23.697 84.969 24.249 86.1409C25.2777 88.3232 27.0511 89.2034 29.4079 88.9899C30.736 88.8701 32.0641 88.7399 33.3845 88.5498C36.6214 88.0784 39.5954 88.5862 42.2048 90.6982C43.2907 91.5758 44.4235 92.4039 45.5798 93.1878C48.2126 94.969 49.7621 94.9794 52.3871 93.2112C53.6527 92.357 54.861 91.4195 56.0824 90.5003C58.1996 88.9065 60.5563 88.1669 63.2126 88.443C64.8636 88.6149 66.512 88.7919 68.1631 88.9586C71.1396 89.2607 72.5589 88.5081 73.9001 85.8206C74.5068 84.6018 75.0641 83.3544 75.5511 82.0836C76.7646 78.9221 78.9339 76.7659 82.1058 75.5628C83.4391 75.0576 84.7282 74.4274 86.0303 73.8362C88.3506 72.7789 89.2386 70.9274 88.9808 68.4586C88.8532 67.232 88.7517 66.0003 88.5668 64.7815C88.0537 61.443 88.6084 58.3961 90.8115 55.7216C91.6787 54.6695 92.4418 53.5315 93.2543 52.4378C94.9209 50.193 94.9105 47.9534 93.2464 45.7138C92.3167 44.4612 91.3975 43.2008 90.4626 41.9534C88.8949 39.8623 88.1709 37.5367 88.4469 34.9221C88.624 33.2425 88.8011 31.5654 88.9626 29.8857C89.2464 26.9612 88.4912 25.5706 85.8402 24.2451C84.7673 23.7086 83.6709 23.1982 82.5433 22.7919C78.973 21.5081 76.5798 19.1096 75.3142 15.5341C74.8819 14.3154 74.2803 13.1565 73.7256 11.9846C72.7308 9.88568 71.0251 8.98464 68.7386 9.16954C67.3454 9.28152 65.9496 9.41954 64.5667 9.62006C61.322 10.094 58.3688 9.53673 55.7542 7.44037C54.4886 6.42475 53.1501 5.49506 51.8011 4.58881C49.9287 3.32839 48.0094 3.34923 46.1475 4.62266C44.7803 5.55756 43.4183 6.51068 42.1188 7.53673C39.5459 9.57318 36.6371 10.0654 33.4704 9.63048C31.9261 9.41694 30.3688 9.25027 28.8115 9.17214C26.887 9.07579 25.3845 9.88568 24.4964 11.6227C23.8194 12.9508 23.1501 14.2945 22.6318 15.6878C21.3272 19.206 18.9391 21.5524 15.4027 22.8284C13.973 23.344 12.6032 24.0471 11.2568 24.7581C9.70737 25.5758 8.9808 26.9586 9.00424 28.6852C9.01986 29.7867 9.05633 30.9065 9.26987 31.9794C10.1345 36.3206 9.43133 40.2268 6.34539 43.5784C5.66831 44.3128 5.14487 45.193 4.56674 46.0159C3.12924 48.0654 3.13186 50.1253 4.57456 52.1643C5.5329 53.5159 6.51466 54.8518 7.50945 56.1747C9.05372 58.2346 9.81674 60.5159 9.56153 63.0992C9.37143 65.0341 9.16571 66.9716 8.96779 68.9091Z"
              fill="#0156D5"
            />
            <path
              d="M44.8412 51.2764C45.1693 50.7842 45.3386 50.4118 45.6094 50.141C50.8698 44.8727 56.1329 39.6019 61.4193 34.3597C64.2318 31.5707 68.4141 31.5967 70.9766 34.3649C73.1459 36.7035 73.2969 40.2556 71.3204 42.7608C71 43.167 70.6329 43.5394 70.2657 43.9066C63.4324 50.7295 56.5964 57.5524 49.7605 64.3727C46.5183 67.6071 42.9324 67.6123 39.6771 64.3727C35.5521 60.266 31.4297 56.1592 27.3204 52.0368C25.4584 50.1696 24.8646 47.9092 25.6407 45.4118C26.3803 43.0264 28.0678 41.5134 30.5339 41.0108C32.8751 40.5342 34.9011 41.2347 36.5886 42.917C39.0079 45.3259 41.4271 47.7347 43.8412 50.1488C44.0964 50.4014 44.3178 50.6852 44.8412 51.2764ZM28.0652 47.3181C28.0339 48.5082 28.5574 49.4352 29.3777 50.2529C33.5079 54.3571 37.6251 58.4717 41.7501 62.5811C43.7214 64.5472 45.7136 64.5472 47.6902 62.5785C54.599 55.6878 61.5053 48.7972 68.4115 41.9014C68.6876 41.6253 68.9688 41.3519 69.2032 41.042C70.8047 38.9196 69.7995 35.8779 67.2344 35.1644C65.6771 34.7295 64.3829 35.2399 63.2527 36.3701C57.5313 42.1019 51.7943 47.8181 46.06 53.5368C45.0079 54.5863 44.4167 54.5811 43.3568 53.5264C41.6042 51.7816 39.8594 50.0342 38.1068 48.2894C36.862 47.0498 35.6511 45.7738 34.3621 44.5837C33.1746 43.4873 31.7475 43.2816 30.2787 43.9378C28.849 44.5759 28.1146 45.7425 28.0652 47.3181Z"
              fill="#0156D5"
            />
          </svg>
          <h2 className="text-center">Thank You for Your Order!</h2>
        </div>
      </div>

      <section className="1xl:mt-[50px] sm:mt-[40px] mt-7 mb-[80px]">
        {/* Order Success */}
        <div>
          <div className="flex items-center justify-between w-full flex-wrap 1xl:py-[11px] py-2 sm:px-[22px] px-4 bg-blue-300 rounded-t-[5px] gap-4">
            <div className="flex items-center gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                className="stroke-primary"
              >
                <g clipPath="url(#clip0_5551_1025)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.53125 8.42188H1.34063C0.378125 8.42188 0.34375 9.14375 0.34375 10.0719V18.425C0.34375 19.3188 0.378125 20.075 1.34063 20.075H6.53125C7.49375 20.075 7.52813 19.3531 7.52813 18.425V10.0719C7.52813 9.17812 7.49375 8.42188 6.53125 8.42188Z"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7.46094 18.8374H7.94219C9.24844 18.8031 10.1078 20.7968 11.1047 20.7968H18.8734C19.8359 20.7968 20.0422 19.3531 20.0078 18.7343C20.0078 18.7343 21.2109 18.1843 20.6609 15.9843C20.7297 15.9499 21.3484 15.3656 21.3484 14.2312C21.3484 13.0968 20.6953 12.5468 20.6953 12.5468C20.6953 12.5468 21.3484 11.8249 21.3484 10.7593C21.3484 9.6937 20.4203 9.10932 19.4578 9.10932H16.6047C14.1297 9.10932 14.3359 7.7687 14.3359 7.7687C14.3359 7.7687 14.0609 4.29682 13.1672 2.6812C12.0672 0.687446 9.86719 1.34057 10.6922 3.95307C11.3109 5.87807 8.52656 8.76557 7.49531 9.72807"
                    strokeWidth="1.5"
                  />
                </g>
              </svg>
              <p className="!text-black">
                Thank you, your order has been received.
              </p>
            </div>
            <div className="flex justify-end items-start gap-2 flex-wrap">
              <button className="!border-[#00193E1A] btn btn-outline-primary !py-[2px] !px-3 gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <g clipPath="url(#clip0_5593_24)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.77951 6.33889V0.777778C7.77951 0.571498 7.69756 0.373667 7.5517 0.227806C7.40584 0.0819442 7.20801 0 7.00173 0C6.79545 0 6.59762 0.0819442 6.45176 0.227806C6.3059 0.373667 6.22395 0.571498 6.22395 0.777778V6.33889L4.49729 4.17978C4.43471 4.09648 4.35604 4.0266 4.26594 3.9743C4.17584 3.92199 4.07615 3.88831 3.97278 3.87527C3.86942 3.86224 3.76449 3.87009 3.66422 3.89839C3.56395 3.92668 3.47039 3.97483 3.38909 4.03997C3.30778 4.10512 3.2404 4.18594 3.19093 4.27763C3.14146 4.36932 3.11091 4.47001 3.10111 4.57373C3.0913 4.67745 3.10244 4.78209 3.13384 4.88142C3.16525 4.98076 3.2163 5.07277 3.28395 5.152L6.39506 9.04089C6.46794 9.13173 6.56029 9.20504 6.66529 9.25542C6.7703 9.3058 6.88527 9.33195 7.00173 9.33195C7.11819 9.33195 7.23317 9.3058 7.33817 9.25542C7.44317 9.20504 7.53552 9.13173 7.6084 9.04089L10.7195 5.152C10.7872 5.07277 10.8382 4.98076 10.8696 4.88142C10.901 4.78209 10.9122 4.67745 10.9024 4.57373C10.8925 4.47001 10.862 4.36932 10.8125 4.27763C10.7631 4.18594 10.6957 4.10512 10.6144 4.03997C10.5331 3.97483 10.4395 3.92668 10.3392 3.89839C10.239 3.87009 10.134 3.86224 10.0307 3.87527C9.92732 3.88831 9.82763 3.92199 9.73753 3.9743C9.64743 4.0266 9.56875 4.09648 9.50618 4.17978L7.77951 6.33889Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.17767 10.0132L3.38956 7.77783H1.55556C1.143 7.77783 0.747335 7.94172 0.455612 8.23344C0.163888 8.52517 0 8.92083 0 9.33339V12.4445C0 12.8571 0.163888 13.2527 0.455612 13.5444C0.747335 13.8362 1.143 14.0001 1.55556 14.0001H12.4444C12.857 14.0001 13.2527 13.8362 13.5444 13.5444C13.8361 13.2527 14 12.8571 14 12.4445V9.33339C14 8.92083 13.8361 8.52517 13.5444 8.23344C13.2527 7.94172 12.857 7.77783 12.4444 7.77783H10.6104L8.82156 10.0132C8.60295 10.2864 8.3257 10.5069 8.01033 10.6585C7.69495 10.8101 7.34952 10.8888 6.99961 10.8888C6.6497 10.8888 6.30427 10.8101 5.9889 10.6585C5.67352 10.5069 5.39627 10.2864 5.17767 10.0132ZM10.8889 10.1112C10.6826 10.1112 10.4848 10.1931 10.3389 10.339C10.1931 10.4848 10.1111 10.6827 10.1111 10.8889C10.1111 11.0952 10.1931 11.2931 10.3389 11.4389C10.4848 11.5848 10.6826 11.6667 10.8889 11.6667H10.8967C11.1029 11.6667 11.3008 11.5848 11.4466 11.4389C11.5925 11.2931 11.6744 11.0952 11.6744 10.8889C11.6744 10.6827 11.5925 10.4848 11.4466 10.339C11.3008 10.1931 11.1029 10.1112 10.8967 10.1112H10.8889Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
                Download List
              </button>
              <button
                className="!border-[#00193E1A] btn btn-outline-primary !py-[2px] !px-3 gap-2"
                onClick={() => downloadInvoice(order)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M6.6 0L6.6819 0.00489998C6.83815 0.0233267 6.98364 0.0938555 7.09489 0.205108C7.20614 0.31636 7.27667 0.461848 7.2951 0.6181L7.3 0.7V3.5L7.3035 3.605C7.32855 3.93832 7.47203 4.25168 7.708 4.48842C7.94397 4.72516 8.25686 4.86967 8.5901 4.8958L8.7 4.9H11.5L11.5819 4.9049C11.7382 4.92333 11.8836 4.99386 11.9949 5.10511C12.1061 5.21636 12.1767 5.36185 12.1951 5.5181L12.2 5.6V11.9C12.2 12.4356 11.9954 12.9511 11.6279 13.3408C11.2604 13.7305 10.7579 13.9651 10.2232 13.9965L10.1 14H3.1C2.56435 14 2.04894 13.7954 1.65922 13.4279C1.2695 13.0604 1.03492 12.5579 1.0035 12.0232L1 11.9V2.1C0.99997 1.56435 1.20463 1.04894 1.5721 0.659217C1.93957 0.269495 2.44207 0.0349247 2.9768 0.00350008L3.1 0H6.6ZM9.4 10.5H8C7.81435 10.5 7.6363 10.5737 7.50502 10.705C7.37375 10.8363 7.3 11.0143 7.3 11.2C7.3 11.3857 7.37375 11.5637 7.50502 11.695C7.6363 11.8263 7.81435 11.9 8 11.9H9.4C9.58565 11.9 9.7637 11.8263 9.89497 11.695C10.0262 11.5637 10.1 11.3857 10.1 11.2C10.1 11.0143 10.0262 10.8363 9.89497 10.705C9.7637 10.5737 9.58565 10.5 9.4 10.5ZM9.4 7.7H3.8C3.61435 7.7 3.4363 7.77375 3.30503 7.90503C3.17375 8.0363 3.1 8.21435 3.1 8.4C3.1 8.58565 3.17375 8.7637 3.30503 8.89497C3.4363 9.02625 3.61435 9.1 3.8 9.1H9.4C9.58565 9.1 9.7637 9.02625 9.89497 8.89497C10.0262 8.7637 10.1 8.58565 10.1 8.4C10.1 8.21435 10.0262 8.0363 9.89497 7.90503C9.7637 7.77375 9.58565 7.7 9.4 7.7ZM4.5 2.8H3.8C3.61435 2.8 3.4363 2.87375 3.30503 3.00503C3.17375 3.1363 3.1 3.31435 3.1 3.5C3.1 3.68565 3.17375 3.8637 3.30503 3.99497C3.4363 4.12625 3.61435 4.2 3.8 4.2H4.5C4.68565 4.2 4.8637 4.12625 4.99497 3.99497C5.12625 3.8637 5.2 3.68565 5.2 3.5C5.2 3.31435 5.12625 3.1363 4.99497 3.00503C4.8637 2.87375 4.68565 2.8 4.5 2.8Z"
                    fill="currentColor"
                  />
                  <path
                    d="M11.5038 3.49992H8.70383L8.70312 0.699219L11.5038 3.49992Z"
                    fill="currentColor"
                  />
                </svg>
                Invoice
              </button>
            </div>
          </div>

          {/* Header Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:mb-[30px] mb-6 border border-[#00193E1A] rounded-b-[5px] overflow-hidden">
            <div className="xl:py-5 pl-7 2xl:pr-[50px] 1xl:pr-[40px] xl:pr-7 py-4 pr-6 border-b lg:border-b-0 sm:border-r border-[#00193E1A]">
              <p>Order Number:</p>
              <h5>#{order?.id}</h5>
            </div>
            <div className="xl:py-5 pl-7 2xl:pr-[50px] 1xl:pr-[40px] xl:pr-7 py-4 pr-6 border-b lg:border-b-0 lg:border-r border-[#00193E1A]">
              <p>Date:</p>
              <h5>{formatDate(order?.createdAt)}</h5>
            </div>
            <div className="xl:py-5 pl-7 2xl:pr-[50px] 1xl:pr-[40px] xl:pr-7 py-4 pr-6 sm:border-r sm:border-b-0 border-b border-[#00193E1A]">
              <p>Total:</p>
              <h5>${(order?.total_price + order?.tax_amount)?.toFixed(2)}</h5>
            </div>
            <div className="xl:py-5 pl-7 2xl:pr-[50px] 1xl:pr-[40px] xl:pr-7 py-4 pr-6">
              <p>Email:</p>
              <h5>{order?.user?.email}</h5>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="flex items-start lg:flex-row flex-col w-full xl:gap-[30px] gap-6">
          {/* Left: Product Details */}
          <div className="2xl:w-[60%] lg:w-[65%] w-full rounded-[5px] overflow-hidden">
            <div className="flex items-center justify-between w-full 1xl:py-[11px] py-2 sm:px-[22px] px-4 bg-blue-300 rounded-t-[5px]">
              <p className="text-black">Order Detail</p>
            </div>

            <div className="border border-[#00193E1A] divide-y divide-[#00193E1A] 2xl:px-6 sm:px-5 px-3 rounded-b-[5px] overflow-hidden">
              <div className="divide-y divide-[#00193E1A]">
                {order?.products &&
                  order?.products?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex sm:py-5 py-3 sm:gap-4 gap-3"
                      >
                        <img
                          src={item?.product?.grid_image?.url}
                          alt={item.title}
                          className="sm:w-[90px] sm:h-[108px] w-[75px] h-[95px] object-cover rounded-[4px]"
                        />
                        <div className="flex flex-col items-start justify-between h-auto gap-1 flex-grow">
                          <p className="font-medium text-black max-w-[295px] w-full">
                            {item?.product_title}
                          </p>
                          <div className="flex items-center justify-between w-full gap-2">
                            <p className="text-primary">
                              ${item?.total?.toFixed(2)}
                            </p>
                            <button className="!border-[#00193E1A] btn btn-outline-primary !py-[2px] !px-3 gap-2 h-fit my-auto sm:!hidden !flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_5593_24)">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.77951 6.33889V0.777778C7.77951 0.571498 7.69756 0.373667 7.5517 0.227806C7.40584 0.0819442 7.20801 0 7.00173 0C6.79545 0 6.59762 0.0819442 6.45176 0.227806C6.3059 0.373667 6.22395 0.571498 6.22395 0.777778V6.33889L4.49729 4.17978C4.43471 4.09648 4.35604 4.0266 4.26594 3.9743C4.17584 3.92199 4.07615 3.88831 3.97278 3.87527C3.86942 3.86224 3.76449 3.87009 3.66422 3.89839C3.56395 3.92668 3.47039 3.97483 3.38909 4.03997C3.30778 4.10512 3.2404 4.18594 3.19093 4.27763C3.14146 4.36932 3.11091 4.47001 3.10111 4.57373C3.0913 4.67745 3.10244 4.78209 3.13384 4.88142C3.16525 4.98076 3.2163 5.07277 3.28395 5.152L6.39506 9.04089C6.46794 9.13173 6.56029 9.20504 6.66529 9.25542C6.7703 9.3058 6.88527 9.33195 7.00173 9.33195C7.11819 9.33195 7.23317 9.3058 7.33817 9.25542C7.44317 9.20504 7.53552 9.13173 7.6084 9.04089L10.7195 5.152C10.7872 5.07277 10.8382 4.98076 10.8696 4.88142C10.901 4.78209 10.9122 4.67745 10.9024 4.57373C10.8925 4.47001 10.862 4.36932 10.8125 4.27763C10.7631 4.18594 10.6957 4.10512 10.6144 4.03997C10.5331 3.97483 10.4395 3.92668 10.3392 3.89839C10.239 3.87009 10.134 3.86224 10.0307 3.87527C9.92732 3.88831 9.82763 3.92199 9.73753 3.9743C9.64743 4.0266 9.56875 4.09648 9.50618 4.17978L7.77951 6.33889Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.17767 10.0132L3.38956 7.77783H1.55556C1.143 7.77783 0.747335 7.94172 0.455612 8.23344C0.163888 8.52517 0 8.92083 0 9.33339V12.4445C0 12.8571 0.163888 13.2527 0.455612 13.5444C0.747335 13.8362 1.143 14.0001 1.55556 14.0001H12.4444C12.857 14.0001 13.2527 13.8362 13.5444 13.5444C13.8361 13.2527 14 12.8571 14 12.4445V9.33339C14 8.92083 13.8361 8.52517 13.5444 8.23344C13.2527 7.94172 12.857 7.77783 12.4444 7.77783H10.6104L8.82156 10.0132C8.60295 10.2864 8.3257 10.5069 8.01033 10.6585C7.69495 10.8101 7.34952 10.8888 6.99961 10.8888C6.6497 10.8888 6.30427 10.8101 5.9889 10.6585C5.67352 10.5069 5.39627 10.2864 5.17767 10.0132ZM10.8889 10.1112C10.6826 10.1112 10.4848 10.1931 10.3389 10.339C10.1931 10.4848 10.1111 10.6827 10.1111 10.8889C10.1111 11.0952 10.1931 11.2931 10.3389 11.4389C10.4848 11.5848 10.6826 11.6667 10.8889 11.6667H10.8967C11.1029 11.6667 11.3008 11.5848 11.4466 11.4389C11.5925 11.2931 11.6744 11.0952 11.6744 10.8889C11.6744 10.6827 11.5925 10.4848 11.4466 10.339C11.3008 10.1931 11.1029 10.1112 10.8967 10.1112H10.8889Z"
                                    fill="currentColor"
                                  />
                                </g>
                              </svg>
                              Download
                            </button>
                          </div>
                        </div>
                        <button className="!border-[#00193E1A] btn btn-outline-primary !py-[2px] !px-3 gap-2 h-fit my-auto sm:!flex !hidden">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_5593_24)">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.77951 6.33889V0.777778C7.77951 0.571498 7.69756 0.373667 7.5517 0.227806C7.40584 0.0819442 7.20801 0 7.00173 0C6.79545 0 6.59762 0.0819442 6.45176 0.227806C6.3059 0.373667 6.22395 0.571498 6.22395 0.777778V6.33889L4.49729 4.17978C4.43471 4.09648 4.35604 4.0266 4.26594 3.9743C4.17584 3.92199 4.07615 3.88831 3.97278 3.87527C3.86942 3.86224 3.76449 3.87009 3.66422 3.89839C3.56395 3.92668 3.47039 3.97483 3.38909 4.03997C3.30778 4.10512 3.2404 4.18594 3.19093 4.27763C3.14146 4.36932 3.11091 4.47001 3.10111 4.57373C3.0913 4.67745 3.10244 4.78209 3.13384 4.88142C3.16525 4.98076 3.2163 5.07277 3.28395 5.152L6.39506 9.04089C6.46794 9.13173 6.56029 9.20504 6.66529 9.25542C6.7703 9.3058 6.88527 9.33195 7.00173 9.33195C7.11819 9.33195 7.23317 9.3058 7.33817 9.25542C7.44317 9.20504 7.53552 9.13173 7.6084 9.04089L10.7195 5.152C10.7872 5.07277 10.8382 4.98076 10.8696 4.88142C10.901 4.78209 10.9122 4.67745 10.9024 4.57373C10.8925 4.47001 10.862 4.36932 10.8125 4.27763C10.7631 4.18594 10.6957 4.10512 10.6144 4.03997C10.5331 3.97483 10.4395 3.92668 10.3392 3.89839C10.239 3.87009 10.134 3.86224 10.0307 3.87527C9.92732 3.88831 9.82763 3.92199 9.73753 3.9743C9.64743 4.0266 9.56875 4.09648 9.50618 4.17978L7.77951 6.33889Z"
                                fill="currentColor"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.17767 10.0132L3.38956 7.77783H1.55556C1.143 7.77783 0.747335 7.94172 0.455612 8.23344C0.163888 8.52517 0 8.92083 0 9.33339V12.4445C0 12.8571 0.163888 13.2527 0.455612 13.5444C0.747335 13.8362 1.143 14.0001 1.55556 14.0001H12.4444C12.857 14.0001 13.2527 13.8362 13.5444 13.5444C13.8361 13.2527 14 12.8571 14 12.4445V9.33339C14 8.92083 13.8361 8.52517 13.5444 8.23344C13.2527 7.94172 12.857 7.77783 12.4444 7.77783H10.6104L8.82156 10.0132C8.60295 10.2864 8.3257 10.5069 8.01033 10.6585C7.69495 10.8101 7.34952 10.8888 6.99961 10.8888C6.6497 10.8888 6.30427 10.8101 5.9889 10.6585C5.67352 10.5069 5.39627 10.2864 5.17767 10.0132ZM10.8889 10.1112C10.6826 10.1112 10.4848 10.1931 10.3389 10.339C10.1931 10.4848 10.1111 10.6827 10.1111 10.8889C10.1111 11.0952 10.1931 11.2931 10.3389 11.4389C10.4848 11.5848 10.6826 11.6667 10.8889 11.6667H10.8967C11.1029 11.6667 11.3008 11.5848 11.4466 11.4389C11.5925 11.2931 11.6744 11.0952 11.6744 10.8889C11.6744 10.6827 11.5925 10.4848 11.4466 10.339C11.3008 10.1931 11.1029 10.1112 10.8967 10.1112H10.8889Z"
                                fill="currentColor"
                              />
                            </g>
                          </svg>
                          Download
                        </button>
                      </div>
                    );
                  })}
              </div>

              <div className="2xl:py-6 sm:py-5 py-4 flex flex-col gap-3">
                <p className="flex items-center justify-between w-full">
                  Subtotal:{" "}
                  <span>
                    ${(order?.total_price + order?.tax_amount)?.toFixed(2)}
                  </span>
                </p>
                <p className="flex items-center justify-between w-full text-black">
                  Total:{" "}
                  <span>
                    ${(order?.total_price + order?.tax_amount)?.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Billing + Payment */}
          <div className="2xl:w-[40%] lg:w-[35%] w-full flex flex-col xl:gap-[30px] gap-6">
            {/* Billing Address */}
            <div className="rounded-[5px] overflow-hidden">
              <div className="flex items-center justify-between w-full 1xl:py-[11px] py-2 sm:px-[22px] px-4 bg-blue-300 rounded-t-[5px]">
                <p className="text-black">Billing Address</p>
              </div>
              <div className="2xl:py-[30px] 2xl:px-[35px] sm:py-[25px] xl:px-[30px] sm:px-6 p-4 rounded-b-[5px] overflow-hidden border border-[#00193E1A]">
                <h4 className="font-bold mb-[10px] !mt-0">
                  {order?.user?.username}
                </h4>
                <p>{order?.billing_address?.address},</p>
                <p>{order?.billing_address?.city},</p>
                <p>{order?.billing_address?.state}</p>
                <p>
                  {order?.billing_address?.pincode},{" "}
                  {order?.billing_address?.country}
                </p>
                <div className="sm:mt-[15px] mt-2 sm:space-y-[9px] space-y-[6px]">
                  <p>
                    <span className="text-black sm:mr-[18px] mr-3">Email:</span>
                    {order?.user?.email}
                  </p>
                  <p>
                    <span className="text-black sm:mr-[18px] mr-3">Phone:</span>{" "}
                    {order?.user?.phone_no}
                  </p>
                  {/* <p>
                    <span className="text-black sm:mr-[18px] mr-3">GSTIN:</span>{" "}
                    22AAAA00051Z25
                  </p> */}
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="overflow-hidden rounded-[5px]">
              <div className="flex items-center justify-between w-full 1xl:py-[11px] py-2 sm:px-[22px] px-4 bg-blue-300 rounded-t-[5px]">
                <p className="text-black">Payment Detail</p>
              </div>
              <div className="flex flex-col gap-3 2xl:py-[26px] 2xl:px-[35px] sm:py-[20px] xl:px-[30px] sm:px-6 p-4 border border-[#00193E1A] rounded-b-[5px] overflow-hidden">
                <p className="flex items-center">
                  <span className="text-black sm:mr-[18px] mr-3">
                    Payment by:
                  </span>{" "}
                  <div className="flex items-center gap-2">
                    {order?.payment_type ? order?.payment_type : "Paypal"}{" "}
                    {order?.payment_type === "razorpay" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="102"
                        height="28"
                        viewBox="0 0 102 28"
                        fill="none"
                      >
                        <rect
                          x="0.328125"
                          y="0.25"
                          width="100.5"
                          height="27.5"
                          rx="2.75"
                          fill="#3395FF"
                          fillOpacity="0.15"
                        />
                        <rect
                          x="0.328125"
                          y="0.25"
                          width="100.5"
                          height="27.5"
                          rx="2.75"
                          stroke="#3395FF"
                          strokeWidth="0.5"
                        />
                        <g clipPath="url(#clip0_7812_4861)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M28.339 11.7998C28.2049 12.3006 27.9451 12.6681 27.5595 12.9028C27.1735 13.1374 26.6321 13.255 25.9337 13.255H23.7149L24.4938 10.3449H26.7126C27.4104 10.3449 27.8895 10.4622 28.1498 10.6969C28.4096 10.9318 28.473 11.2993 28.339 11.7998ZM30.6367 11.7371C30.9189 10.6841 30.8019 9.87563 30.286 9.31243C29.77 8.74922 28.8659 8.46777 27.5746 8.46777H22.6216L19.6406 19.6062H22.0469L23.2488 15.1163H24.8269C25.1807 15.1163 25.4593 15.1738 25.663 15.2885C25.8671 15.4035 25.9867 15.6069 26.0236 15.8985L26.4528 19.6062H29.0311L28.6128 16.1491C28.5276 15.3772 28.1748 14.9235 27.5549 14.788C28.3452 14.5588 29.0072 14.1777 29.5403 13.6458C30.0729 13.1141 30.4387 12.478 30.6367 11.7371Z"
                            fill="#072654"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M36.482 15.6175C36.2809 16.3682 35.9711 16.9421 35.5529 17.3382C35.1341 17.7347 34.6332 17.9327 34.0502 17.9327C33.4557 17.9327 33.0525 17.7373 32.84 17.3461C32.6264 16.9551 32.6191 16.3895 32.8176 15.6487C33.0156 14.9083 33.3315 14.3296 33.7664 13.912C34.2008 13.4953 34.7096 13.2864 35.293 13.2864C35.8761 13.2864 36.271 13.4875 36.4757 13.8889C36.6805 14.2903 36.683 14.8665 36.482 15.6175ZM37.5367 11.6751L37.2354 12.8015C37.1049 12.3947 36.8529 12.0716 36.4798 11.8317C36.1063 11.5919 35.6433 11.4717 35.0914 11.4717C34.4144 11.4717 33.7633 11.6465 33.1388 11.9959C32.5142 12.3455 31.968 12.8382 31.5009 13.4742C31.0338 14.1105 30.6914 14.8353 30.4736 15.6487C30.2559 16.4624 30.2123 17.1793 30.3432 17.7997C30.4742 18.4204 30.7579 18.8975 31.1948 19.2313C31.6314 19.5653 32.1936 19.7317 32.881 19.7317C33.4328 19.7317 33.9587 19.6171 34.4576 19.3876C34.9563 19.1584 35.3798 18.8401 35.7285 18.4334L35.4142 19.6066H37.742L39.8646 11.6751H37.5367Z"
                            fill="#072654"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M48.2361 11.6748H41.4707L40.9978 13.4427H44.9349L39.7294 17.948L39.2852 19.6063H46.2693L46.7427 17.8387H42.5245L47.809 13.2705L48.2361 11.6748Z"
                            fill="#072654"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M54.1936 15.6018C53.9842 16.3838 53.674 16.9683 53.2635 17.3541C52.853 17.7399 52.3562 17.9326 51.7733 17.9326C50.5542 17.9326 50.1531 17.1561 50.5688 15.6018C50.7756 14.83 51.0873 14.2486 51.5041 13.8576C51.9213 13.4664 52.4264 13.2708 53.0203 13.2708C53.6033 13.2708 53.9967 13.4664 54.1993 13.8576C54.4019 14.2486 54.4004 14.83 54.1936 15.6018ZM55.5555 11.9722C55.0198 11.6387 54.3354 11.4717 53.502 11.4717C52.6581 11.4717 51.8766 11.6387 51.157 11.9722C50.4373 12.3062 49.8247 12.7859 49.3191 13.4115C48.813 14.0374 48.4482 14.7673 48.2248 15.6018C48.0013 16.4364 47.9754 17.1661 48.1469 17.7919C48.3178 18.4178 48.6732 18.8975 49.2146 19.2313C49.7556 19.5653 50.4477 19.7317 51.2916 19.7317C52.125 19.7317 52.8987 19.5653 53.6132 19.2313C54.3266 18.8975 54.9372 18.4178 55.4433 17.7919C55.9488 17.1661 56.3136 16.4364 56.5371 15.6018C56.7605 14.7673 56.7865 14.0374 56.6155 13.4115C56.444 12.7859 56.0907 12.3062 55.5555 11.9722Z"
                            fill="#072654"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M79.9036 15.6175C79.7025 16.3682 79.3928 16.9421 78.9745 17.3382C78.5562 17.7347 78.0543 17.9327 77.4713 17.9327C76.8779 17.9327 76.4742 17.7373 76.2616 17.3461C76.048 16.9551 76.0408 16.3895 76.2393 15.6487C76.4373 14.9083 76.7532 14.3296 77.1881 13.912C77.6225 13.4953 78.1312 13.2864 78.7147 13.2864C79.2977 13.2864 79.6926 13.4875 79.8973 13.8889C80.1021 14.2903 80.1047 14.8665 79.9036 15.6175ZM80.9584 11.6751L80.6571 12.8015C80.5266 12.3947 80.2746 12.0716 79.9015 11.8317C79.5279 11.5919 79.065 11.4717 78.5131 11.4717C77.836 11.4717 77.185 11.6465 76.5604 11.9959C75.9358 12.3455 75.3897 12.8382 74.9226 13.4742C74.4555 14.1105 74.113 14.8353 73.8953 15.6487C73.6776 16.4624 73.6344 17.1793 73.7649 17.7997C73.8958 18.4204 74.179 18.8975 74.6165 19.2313C75.053 19.5653 75.6152 19.7317 76.3027 19.7317C76.8545 19.7317 77.3804 19.6171 77.8792 19.3876C78.378 19.1584 78.8015 18.8401 79.1501 18.4334L78.8358 19.6066H81.1636L83.2863 11.6751H80.9584Z"
                            fill="#072654"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M63.8542 13.8028L64.4476 11.6439C64.2459 11.5396 63.9788 11.4873 63.6458 11.4873C63.1142 11.4873 62.6024 11.6202 62.1093 11.8863C61.6858 12.1146 61.3252 12.4351 61.0207 12.8366L61.3294 11.674L60.6554 11.6751H59.0022L56.8633 19.6066H59.2233L60.3327 15.4611C60.4943 14.8563 60.7843 14.3844 61.2036 14.0455C61.6219 13.7065 62.1441 13.5369 62.7692 13.5369C63.1547 13.5369 63.5159 13.6256 63.8542 13.8028Z"
                            fill="#072654"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M70.4246 15.6484C70.2261 16.3893 69.9185 16.9548 69.5017 17.3458C69.084 17.737 68.5841 17.9324 68.0011 17.9324C67.4176 17.9324 67.0201 17.7344 66.8086 17.338C66.5966 16.9418 66.5914 16.3682 66.7925 15.6172C66.9936 14.8662 67.3064 14.29 67.7315 13.8886C68.1565 13.4872 68.661 13.2861 69.2446 13.2861C69.8171 13.2861 70.2064 13.495 70.4126 13.912C70.6184 14.3292 70.6226 14.9083 70.4246 15.6484ZM72.0739 11.9956C71.6359 11.6462 71.0783 11.4717 70.4017 11.4717C69.8078 11.4717 69.2425 11.6072 68.7072 11.8783C68.1705 12.1498 67.7356 12.5195 67.402 12.989L67.4095 12.937L67.806 11.6737H67.3498V11.6748H65.5023L64.9157 13.8681C64.9089 13.8936 64.9032 13.9174 64.8964 13.9432L62.4766 22.9855H64.8362L66.0546 18.4334C66.1741 18.8397 66.4225 19.1581 66.7987 19.3873C67.1749 19.6167 67.6389 19.7315 68.1913 19.7315C68.8788 19.7315 69.5324 19.565 70.1533 19.231C70.7738 18.8975 71.3131 18.4201 71.7704 17.7995C72.2282 17.1793 72.566 16.4621 72.7837 15.6484C73.0014 14.8349 73.0466 14.1102 72.9203 13.4739C72.7941 12.8379 72.5114 12.3452 72.0739 11.9956Z"
                            fill="#072654"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M93.0563 11.677L93.0578 11.6748H91.6286C91.5829 11.6748 91.5426 11.6761 91.5008 11.677H90.759L90.3797 12.2061C90.3493 12.246 90.3189 12.2861 90.2862 12.3327L90.2449 12.394L87.2303 16.5976L86.6052 11.6748H84.136L85.3865 19.1553L82.625 22.9855H82.7037H84.1137H85.0851L85.7544 22.0363C85.7741 22.008 85.791 21.9849 85.8121 21.955L86.593 20.8464L86.6154 20.8146L90.1098 15.8548L93.0539 11.6803L93.0578 11.677H93.0563Z"
                            fill="#072654"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.5735 9.74404L12.8672 12.3468L16.909 9.7294L14.2658 19.604L16.95 19.6065L20.8547 5.02148L13.5735 9.74404Z"
                            fill="#3395FF"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.22451 15.4555L8.11328 19.6067H13.6152C13.6152 19.6067 15.8657 11.164 15.8663 11.1616C15.8642 11.163 9.22451 15.4555 9.22451 15.4555Z"
                            fill="#072654"
                          />
                        </g>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="60"
                        height="28"
                        viewBox="0 0 60 28"
                        fill="none"
                      >
                        <rect
                          x="0.328125"
                          y="0.25"
                          width="58.7012"
                          height="27.4998"
                          rx="2.75"
                          fill="#635BFF"
                          fillOpacity="0.15"
                        />
                        <rect
                          x="0.328125"
                          y="0.25"
                          width="58.7012"
                          height="27.4998"
                          rx="2.75"
                          stroke="#635BFF"
                          strokeWidth="0.5"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M51.2793 14.3002C51.2793 11.2241 49.7913 8.79688 46.9473 8.79688C44.0913 8.79688 42.3633 11.2241 42.3633 14.2762C42.3633 17.893 44.4033 19.7194 47.3313 19.7194C48.7593 19.7194 49.8393 19.395 50.6553 18.9384V16.5352C49.8393 16.9437 48.9033 17.1961 47.7153 17.1961C46.5513 17.1961 45.5193 16.7875 45.3873 15.3696H51.2553C51.2553 15.2134 51.2793 14.5886 51.2793 14.3002ZM45.3513 13.1587C45.3513 11.8009 46.1793 11.2361 46.9353 11.2361C47.6673 11.2361 48.4473 11.8009 48.4473 13.1587H45.3513Z"
                          fill="#635BFF"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M37.73 8.79688C36.554 8.79688 35.798 9.34961 35.378 9.73413L35.222 8.98913H32.582V22.9998L35.582 22.363L35.594 18.9624C36.026 19.2749 36.662 19.7194 37.718 19.7194C39.866 19.7194 41.822 17.9891 41.822 14.1801C41.81 10.6954 39.83 8.79688 37.73 8.79688ZM37.01 17.0759C36.302 17.0759 35.882 16.8236 35.594 16.5112L35.582 12.0532C35.894 11.7048 36.326 11.4644 37.01 11.4644C38.102 11.4644 38.858 12.6901 38.858 14.2642C38.858 15.8743 38.114 17.0759 37.01 17.0759Z"
                          fill="#635BFF"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M28.4531 8.08812L31.4651 7.43925V5L28.4531 5.63685V8.08812Z"
                          fill="#635BFF"
                        />
                        <path
                          d="M31.4651 9.00146H28.4531V19.5155H31.4651V9.00146Z"
                          fill="#635BFF"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M25.2254 9.89034L25.0334 9.00116H22.4414V19.5152H25.4414V12.3897C26.1494 11.4644 27.3494 11.6327 27.7214 11.7648V9.00116C27.3374 8.85697 25.9334 8.59261 25.2254 9.89034Z"
                          fill="#635BFF"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M19.2252 6.39404L16.2972 7.01888L16.2852 16.6437C16.2852 18.4221 17.6172 19.7318 19.3932 19.7318C20.3772 19.7318 21.0972 19.5516 21.4932 19.3353V16.8961C21.1092 17.0523 19.2132 17.605 19.2132 15.8266V11.5609H21.4932V9.00152H19.2132L19.2252 6.39404Z"
                          fill="#635BFF"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.1141 12.0532C11.1141 11.5846 11.4981 11.4044 12.1341 11.4044C13.0461 11.4044 14.1981 11.6807 15.1101 12.1734V9.34961C14.1141 8.95308 13.1301 8.79688 12.1341 8.79688C9.69813 8.79687 8.07812 10.0706 8.07812 12.1974C8.07812 15.5138 12.6381 14.9851 12.6381 16.415C12.6381 16.9678 12.1581 17.148 11.4861 17.148C10.4901 17.148 9.21813 16.7395 8.21012 16.1867V19.0465C9.32613 19.5272 10.4541 19.7315 11.4861 19.7315C13.9821 19.7315 15.6981 18.4938 15.6981 16.3429C15.6861 12.7622 11.1141 13.399 11.1141 12.0532Z"
                          fill="#635BFF"
                        />
                      </svg>
                    )}
                  </div>
                </p>
                <p>
                  {" "}
                  <span className="text-black sm:mr-[18px] mr-3">
                    Payment Gateway:
                  </span>
                  {order?.payment_type ? order?.payment_type : "Paypal"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="sm:pt-8 pt-6">
          <Link href="/" className="btn btn-primary w-fit">
            Keep Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
