"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HIDE_EARNINGS_TEMPORARILY } from "@/config/theamConfig";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  Tooltip,
  useDisclosure,
} from "@heroui/react";

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

function StatusPill({ status }) {
  const styles = {
    Requested: "bg-blue-300 text-primary border-primary",
    Processing: "bg-[#ED9A1233] text-[#ED9A12] border-[#ED9A12]",
    Completed: "bg-[#257C6533] text-[#257C65] border-[#257C65]",
    Failed: "bg-[#C32D0B33] text-[#C32D0B] border-[#C32D0B]",
  };

  const cls =
    styles[status] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className={`flex items-center gap-1.5`}>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 1xl:py-1 py-0.5 rounded-full border text-[13px] leading-5 ${cls}`}
      >
        {status}
      </span>
      <Tooltip
        content="Your payout is currently being processed."
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
      {/* <Tooltip
        content="Your total earnings from all sales (all-time)."
        placement="top"
        showArrow
        classNames={{
          base: "max-w-fit",
          content:
            "text-[14px] leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
        }}
      >
        <InfoIcon />
      </Tooltip> */}
    </div>
  );
}

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const shortDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

function LightBulbIcon({ className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clip-path="url(#clip0_9342_7467)">
        <path d="M4.53067 12.7777C4.17004 11.9626 3.98396 11.0811 3.98438 10.1898C3.98438 6.76107 6.67882 3.98145 10.0029 3.98145C13.327 3.98145 16.0214 6.762 16.0214 10.1907C16.0217 11.0817 15.8356 11.9629 15.4751 12.7777" stroke="#0043A2" stroke-width="1.4" stroke-linecap="round" />
        <path d="M10.0014 0.740723V1.66665M19.2607 9.99998H18.3348M1.66811 9.99998H0.742188M16.5477 3.45183L15.8931 4.10646M4.10978 4.10739L3.45515 3.45276M12.332 16.7648C13.2672 16.462 13.6431 15.6055 13.7487 14.7444C13.7802 14.487 13.5681 14.2731 13.3089 14.2731H6.73941C6.6761 14.2721 6.61329 14.2846 6.55515 14.3096C6.49701 14.3347 6.44486 14.3719 6.40214 14.4186C6.35943 14.4653 6.32712 14.5206 6.30737 14.5808C6.28762 14.6409 6.28086 14.7046 6.28756 14.7676C6.39126 15.6268 6.65237 16.2555 7.64311 16.7648M12.332 16.7648H7.64311M12.332 16.7648C12.22 18.5657 11.6996 19.2787 10.0079 19.2583C8.19867 19.2916 7.782 18.4102 7.64311 16.7648" stroke="#0043A2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  );
}

export default function EarningPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState(null);

  // TEMPORARY: Redirect when Earnings is hidden
  useEffect(() => {
    if (HIDE_EARNINGS_TEMPORARILY) {
      const username = pathname?.split("/")?.[2] || "";
      router.replace(username ? `/user/${username}/setting` : "/");
    }
  }, [HIDE_EARNINGS_TEMPORARILY, pathname, router]);
  const [openPayoutPanel, setOpenPayoutPanel] = useState("paypal"); // "paypal" | "bank" | ""
  const [payoutMethod, setPayoutMethod] = useState("paypal"); // "paypal" | "bank"
  const [saveMessage, setSaveMessage] = useState("");
  const [payoutErrors, setPayoutErrors] = useState({});
  const [formData, setFormData] = useState({
    paypal_email: "",
    bank_name: "",
    bank_account_holder_name: "",
    bank_account_number: "",
    bank_ifsc_swift_code: "",
    bank_country: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onOpenChange: onWithdrawOpenChange } =
    useDisclosure();
  const [withdrawMethodKey, setWithdrawMethodKey] = useState("bank");
  const [withdrawAmountMode, setWithdrawAmountMode] = useState("full"); // "full" | "other"
  const [withdrawOtherAmount, setWithdrawOtherAmount] = useState("50.00");
  const [withdrawError, setWithdrawError] = useState("");

  const displayName = useMemo(() => {
    if (!authUser) return "Author";
    return (
      authUser?.full_name ||
      authUser?.fullName ||
      authUser?.username ||
      authUser?.email ||
      "Author"
    );
  }, [authUser]);

  const summary = useMemo(
    () => ({
      totalEarnings: 12256000,
      pendingBalance: 6056151.5,
      availableBalance: 32158377,
      lastReviewing: "Jan, 23",
      lastPayoutAmount: 5351000,
      lastPayoutDate: new Date("2025-08-12T00:00:00.000Z"),
      heldNote: "Earnings currently held for 25 days due to the refund policy.",
    }),
    []
  );

  // Demo available balance for the modal (matches your screenshot style)
  const availableBalanceForWithdraw = 782.33;

  const rows = useMemo(
    () => [
      {
        id: "w1",
        date: new Date("2025-08-12"),
        amount: 250,
        method: "PayPal",
        status: "Requested",
      },
      {
        id: "w2",
        date: new Date("2025-08-05"),
        amount: 180,
        method: "Bank Transfer",
        status: "Processing",
      },
      {
        id: "w3",
        date: new Date("2025-08-12"),
        amount: 250,
        method: "PayPal",
        status: "Completed",
      },
      {
        id: "w4",
        date: new Date("2025-08-05"),
        amount: 180,
        method: "Bank Transfer",
        status: "Failed",
      },
      {
        id: "w5",
        date: new Date("2025-08-12"),
        amount: 250,
        method: "PayPal",
        status: "Requested",
      },
      {
        id: "w6",
        date: new Date("2025-08-05"),
        amount: 180,
        method: "Bank Transfer",
        status: "Processing",
      },
      {
        id: "w7",
        date: new Date("2025-08-12"),
        amount: 250,
        method: "PayPal",
        status: "Completed",
      },
      {
        id: "w8",
        date: new Date("2025-08-05"),
        amount: 180,
        method: "Bank Transfer",
        status: "Requested",
      },
      {
        id: "w9",
        date: new Date("2025-07-28"),
        amount: 320,
        method: "PayPal",
        status: "Completed",
      },
      {
        id: "w10",
        date: new Date("2025-07-20"),
        amount: 100,
        method: "Bank Transfer",
        status: "Completed",
      },
      {
        id: "w11",
        date: new Date("2025-07-12"),
        amount: 140,
        method: "PayPal",
        status: "Failed",
      },
      {
        id: "w12",
        date: new Date("2025-07-05"),
        amount: 260,
        method: "Bank Transfer",
        status: "Processing",
      },
    ],
    []
  );
  // ===== DROPDOWN STATE (INSIDE FUNCTION) =====
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const dropdownRef = useRef(null);

  const withdrawalMethods = useMemo(() => {
    const bankLast4 =
      (formData?.bank_account_number || "").slice(-4) || "1405";
    const bankName = formData?.bank_name || "ICICI Bank";
    const paypalEmail =
      formData?.paypal_email || "paypal@example.com";

    return [
      {
        key: "bank",
        label: `Bank Transfer — ${bankName} •••• ${bankLast4}`,
        etaLabel: "up to 7 days",
        hint: "This method can take up to 7 business days to reach your account.",
        noteKey: `your ${bankName} account ending in ${bankLast4}`,
      },
      {
        key: "paypal",
        label: `PayPal — ${paypalEmail}`,
        etaLabel: "up to 5 days",
        hint: "This method is usually faster (1–2 business days).",
        noteKey: `your PayPal (${paypalEmail})`,
      },
    ];
  }, [formData]);

  useEffect(() => {
    if (withdrawalMethods.length && !selectedMethod) {
      setSelectedMethod(withdrawalMethods[0]);
    }
  }, [withdrawalMethods, selectedMethod]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ========== end dropdownn

  // const withdrawalMethods = useMemo(() => {
  //   const bankLast4 =
  //     (formData.bank_account_number || "").slice(-4) || "1405";
  //   const bankName = formData.bank_name || "ICICI Bank";
  //   const paypalEmail = formData.paypal_email || "paypal@example.com";

  //   return [
  //     {
  //       key: "bank",
  //       label: `Bank Transfer — ${bankName} •••• ${bankLast4}`,
  //       etaLabel: "up to 7 days",
  //       hint: "This method can take up to 7 business days to reach your account.",
  //       noteKey: `your ${bankName} account ending in ${bankLast4}`,
  //     },
  //     {
  //       key: "paypal",
  //       label: `PayPal — ${paypalEmail}`,
  //       etaLabel: "up to 5 days",
  //       hint: "This method is usually faster (1–2 business days).",
  //       noteKey: `your PayPal (${paypalEmail})`,
  //     },
  //   ];
  // }, [formData.bank_account_number, formData.bank_name, formData.paypal_email]);

  const selectedWithdrawMethod = useMemo(() => {
    const bankLast4 =
      (formData.bank_account_number || "").slice(-4) || "1405";
    const bankName = formData.bank_name || "ICICI Bank";
    const paypalEmail = formData.paypal_email || "paypal@example.com";
    return (
      withdrawalMethods.find((m) => m.key === withdrawMethodKey) ||
      withdrawalMethods[0]
    );
  }, [withdrawMethodKey, withdrawalMethods]);

  const withdrawAmount = useMemo(() => {
    if (withdrawAmountMode === "full") return availableBalanceForWithdraw;
    const parsed = Number.parseFloat(withdrawOtherAmount || "0");
    if (Number.isNaN(parsed)) return 0;
    return parsed;
  }, [withdrawAmountMode, withdrawOtherAmount]);

  const totalReceive = useMemo(() => {
    // Demo: apply a small fixed processing fee similar to the example screenshot
    const fee = withdrawAmount > 0 ? 0.99 : 0;
    return Math.max(0, withdrawAmount - fee);
  }, [withdrawAmount]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage]);

  const showingFrom = rows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingTo = Math.min(safePage * pageSize, rows.length);

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error as user types
    setPayoutErrors((prev) => {
      if (!prev?.[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const isValidEmail = (email) => {
    const v = String(email || "").trim();
    // simple + safe email validation for UI
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };

  const validatePayoutDetails = (method, opts = {}) => {
    const { forWithdraw = false } = opts;
    const errors = {};

    if (method === "paypal") {
      const email = String(formData.paypal_email || "").trim();
      if (!email) errors.paypal_email = "PayPal email is required.";
      else if (!isValidEmail(email))
        errors.paypal_email = "Please enter a valid email address.";
    } else if (method === "bank") {
      const bankName = String(formData.bank_name || "").trim();
      const holder = String(formData.bank_account_holder_name || "").trim();
      const number = String(formData.bank_account_number || "").trim();
      const swift = String(formData.bank_ifsc_swift_code || "").trim();
      const country = String(formData.bank_country || "").trim();

      if (!bankName) errors.bank_name = "Bank name is required.";
      if (!holder) errors.bank_account_holder_name = "Account holder name is required.";
      if (!number) errors.bank_account_number = "Account number is required.";
      else if (number.length < 4) errors.bank_account_number = "Account number looks too short.";
      if (!swift) errors.bank_ifsc_swift_code = "IFSC / SWIFT code is required.";
      if (!country) errors.bank_country = "Bank country is required.";
    }

    setPayoutErrors(errors);

    // For withdraw we want to show a single modal error message too.
    if (forWithdraw && Object.keys(errors).length) {
      const nice =
        method === "paypal"
          ? "PayPal payout details are incomplete. Please add your PayPal email first."
          : "Bank payout details are incomplete. Please fill bank details first.";
      setWithdrawError(nice);
    }

    return Object.keys(errors).length === 0;
  };

  const handleWithdraw = () => {
    setWithdrawError("");

    // Require payout details for the selected method
    const okPayout = validatePayoutDetails(withdrawMethodKey, { forWithdraw: true });
    if (!okPayout) return false;

    if (withdrawAmountMode === "other") {
      const raw = String(withdrawOtherAmount || "").trim();
      const parsed = Number.parseFloat(raw);
      if (!raw || Number.isNaN(parsed)) {
        setWithdrawError("Please enter the other amount.");
        return false;
      }
    }

    if (withdrawAmount <= 0) {
      setWithdrawError("Please enter a valid amount.");
      return false;
    }
    if (withdrawAmount > availableBalanceForWithdraw) {
      setWithdrawError("Amount cannot be more than your available balance.");
      return false;
    }

    setSaveMessage("Withdraw request submitted (demo). Connect this to your backend/API.");
    window.setTimeout(() => setSaveMessage(""), 2500);
    return true;
  };

  const handleSavePayout = () => {
    const ok = validatePayoutDetails(payoutMethod);
    if (!ok) return;

    setSaveMessage("Payout details saved (demo).");
    window.setTimeout(() => setSaveMessage(""), 2500);
  };

  const handleDownload = (row) => {
    setSaveMessage(`Downloading receipt for ${shortDate(row.date)} (demo).`);
    window.setTimeout(() => setSaveMessage(""), 2500);
  };

  useEffect(() => {
    let mounted = true;
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/app-auth/session");
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setAuthUser(data?.authUser || null);
      } catch (e) {
        // ignore
      }
    };

    fetchSession();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  return (
    <div className="md:space-y-6 space-y-5">
      <div className="md:pt-6 pt-4">
        <h2 className="text-black text-[22px] sm:text-[28px] font-medium leading-tight">
          Earnings
        </h2>
        <p className="text-gray-200 mt-2.5">
          Track your earnings, available balance, and withdrawals.{" "}
          <span className="text-[#9aa0a6]">({displayName})</span>
        </p>
      </div>

      {saveMessage ? (
        <div className="md:px-[30px] px-5">
          <div className="bg-blue-50 border border-blue-100 text-blue-800 text-sm px-4 py-3 rounded-md">
            {saveMessage}
          </div>
        </div>
      ) : null}

      <div className="">
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="flex-1 bg-white border border-primary/10 rounded-md overflow-hidden">
            <div className="flex flex-wrap items-center justify-between px-5 py-[6px] border-b border-primary/10">
              <p className="text-black">Earnings Summary</p>
              <p className="p2 text-[#777777]">
                Last reviewing {summary.lastReviewing}
              </p>
            </div>

            <div className="px-5 py-6">
              <div className="flex items-center h-full lt:flex-nowrap flex-wrap lg:divide-x lg:divide-y-0 divide-y divide-gray-100">
                <div className=" 2xl:pr-7 1xl:pr-5 lg:pr-2 pb-3 lg:w-[30%] w-full">
                  <div className="flex items-center gap-1 p2 text-[#777777]">
                    Total Earnings{" "}
                    <Tooltip
                      content="Your total earnings from all sales (all-time)."
                      placement="top"
                      showArrow
                      classNames={{
                        base: "max-w-fit",
                        content:
                          "text-[14px] leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
                      }}
                    >
                      <span className="inline-flex items-center">
                        <InfoIcon className="text-primary cursor-help" />
                      </span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-2.5">
                    <p className="text-black font-bold">
                      {money(summary.totalEarnings)}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M7.7474 7.75V4.5C7.7474 2.70507 9.20247 1.25 10.9974 1.25C12.7923 1.25 14.2474 2.70507 14.2474 4.5V7.75M4.4974 5.58333H17.4974L18.5807 19.6667H3.41406L4.4974 5.58333Z" stroke="#0043A2" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <p className="p2">960</p>
                    </div>
                  </div>
                </div>
                <div className=" 2xl:px-6 1xl:px-5 lg:px-2 py-3 lg:divide-y-0 lg:w-[30%] w-full">
                  <div className="w-full flex items-center gap-1 p2 text-[#777777]">
                    Pending Balance{" "}
                    <Tooltip
                      content={summary.heldNote}
                      placement="top"
                      showArrow
                      classNames={{
                        base: "max-w-fit",
                        content:
                          "text-[14px] leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
                      }}
                    >
                      <span className="inline-flex items-center">
                        <InfoIcon className="text-primary cursor-help" />
                      </span>
                    </Tooltip>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-0.5">
                    <p className="text-black font-bold">
                      {money(summary.pendingBalance)}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M7.7474 7.75V4.5C7.7474 2.70507 9.20247 1.25 10.9974 1.25C12.7923 1.25 14.2474 2.70507 14.2474 4.5V7.75M4.4974 5.58333H17.4974L18.5807 19.6667H3.41406L4.4974 5.58333Z" stroke="#0043A2" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <p className="p2">960</p>
                    </div>
                  </div>
                </div>
                <div className="2xl:pl-6 1xl:pl-5 lg:pl-2 pt-3 flex items-center justify-between flex-wrap gap-4 lg:w-[40%] w-full">
                  <div className="">
                    <div className="flex items-center gap-1 p2 text-[#777777]">
                      Available Balance{" "}
                      <Tooltip
                        content="The amount you can withdraw right now (after holds/refunds)."
                        placement="top"
                        showArrow
                        classNames={{
                          base: "max-w-fit",
                          content:
                            "text-[14px] leading-4 bg-white border-blue-300 py-[7px] px-3 text-primary rounded-[5px] border shadow-[0px_2px_25px_0px_#277AC626]",
                        }}
                      >
                        <span className="inline-flex items-center">
                          <InfoIcon className="text-primary cursor-help" />
                        </span>
                      </Tooltip>
                    </div>
                    <p className="text-black font-bold mt-2.5">
                      {money(summary.availableBalance)}
                    </p>
                  </div>
                  <div className="flex items-center justify-start lg:justify-end">
                    <button
                      type="button"
                      onClick={onWithdrawOpen}
                      className="btn btn-primary w-full lg:w-auto gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_9301_4868)">
                          <path d="M14.4074 2.22815C14.4407 2.18611 14.4819 2.15107 14.5287 2.12503C14.5756 2.09899 14.6271 2.08248 14.6803 2.07644C14.7336 2.0704 14.7875 2.07495 14.8389 2.08983C14.8904 2.10471 14.9384 2.12963 14.9802 2.16315L15.8577 2.86677L12.6492 6.9504H14.7162L17.1277 3.8824L19.1622 5.51227C19.2048 5.5464 19.2401 5.58878 19.266 5.63687C19.2919 5.68496 19.3078 5.73777 19.3128 5.79216C19.3178 5.84654 19.3118 5.90137 19.2951 5.95338C19.2785 6.00538 19.2515 6.05349 19.2158 6.09483L18.4781 6.9504H20.6019C20.8817 6.5277 20.9933 6.01569 20.9148 5.51492C20.8363 5.01415 20.5734 4.56082 20.1778 4.24396L15.9959 0.894834C15.787 0.727571 15.5471 0.603238 15.29 0.528981C15.0328 0.454723 14.7636 0.432004 14.4977 0.462129C14.2318 0.492255 13.9744 0.57463 13.7404 0.704522C13.5065 0.834415 13.3004 1.00926 13.1342 1.21902L8.59481 6.9504H10.6675L14.4074 2.22815ZM16.0625 14.2629C15.847 14.2629 15.6403 14.3485 15.488 14.5009C15.3356 14.6532 15.25 14.8599 15.25 15.0754C15.25 15.2909 15.3356 15.4975 15.488 15.6499C15.6403 15.8023 15.847 15.8879 16.0625 15.8879H18.5C18.7155 15.8879 18.9222 15.8023 19.0745 15.6499C19.2269 15.4975 19.3125 15.2909 19.3125 15.0754C19.3125 14.8599 19.2269 14.6532 19.0745 14.5009C18.9222 14.3485 18.7155 14.2629 18.5 14.2629H16.0625ZM3.875 4.5129C3.22853 4.5129 2.60855 4.7697 2.15143 5.22682C1.69431 5.68394 1.4375 6.30393 1.4375 6.9504V18.7316C1.4375 19.7013 1.82271 20.6313 2.50839 21.317C3.19407 22.0027 4.12405 22.3879 5.09375 22.3879H18.9062C19.8759 22.3879 20.8059 22.0027 21.4916 21.317C22.1773 20.6313 22.5625 19.7013 22.5625 18.7316V11.4191C22.5625 10.4494 22.1773 9.51947 21.4916 8.83379C20.8059 8.14811 19.8759 7.7629 18.9062 7.7629H3.875C3.65951 7.7629 3.45285 7.67729 3.30048 7.52492C3.1481 7.37255 3.0625 7.16589 3.0625 6.9504C3.0625 6.73491 3.1481 6.52825 3.30048 6.37587C3.45285 6.2235 3.65951 6.1379 3.875 6.1379H7.59625L8.893 4.5129H3.875ZM3.0625 18.7316V9.24977C3.31681 9.33915 3.59063 9.3879 3.875 9.3879H18.9062C19.445 9.3879 19.9616 9.6019 20.3426 9.98284C20.7235 10.3638 20.9375 10.8804 20.9375 11.4191V18.7316C20.9375 19.2704 20.7235 19.787 20.3426 20.168C19.9616 20.5489 19.445 20.7629 18.9062 20.7629H5.09375C4.55503 20.7629 4.03837 20.5489 3.65744 20.168C3.27651 19.787 3.0625 19.2704 3.0625 18.7316Z" fill="currentColor" />
                        </g>
                      </svg>
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="2xl:w-[320px] 1xl:w-[292px] xl:w-[270px] w-full bg-primary rounded-md overflow-hidden relative">
            <div className="p-5">
              <p className="p2 !text-white">Last Payout</p>
              <h3 className="font-bold 2xl:mt-[18px] xl:mt-[14px] mt-[10px] text-white">
                {money(summary.lastPayoutAmount)}
              </h3>
              <p className="text-white/60 2xl:mt-[18px] xl:mt-[14px] mt-[10px]">
                Paid on {shortDate(summary.lastPayoutDate)}
              </p>
            </div>
            <div className="absolute right-0 left-auto top-[19%] h-full w-auto opacity-20 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                <path d="M45.36 54.5757C45.1753 54.5353 44.9849 54.5288 44.7978 54.5564C42.9197 54.3379 41.5029 52.7488 41.4996 50.8586C41.4996 50.4236 41.3268 50.0064 41.0192 49.6987C40.7116 49.3911 40.2944 49.2183 39.8593 49.2183C39.4243 49.2183 39.0071 49.3911 38.6995 49.6987C38.3919 50.0064 38.219 50.4236 38.219 50.8586C38.224 54.0149 40.335 56.7798 43.3786 57.6152V59.2554C43.3786 59.6905 43.5514 60.1077 43.859 60.4153C44.1666 60.7229 44.5838 60.8957 45.0189 60.8957C45.4539 60.8957 45.8711 60.7229 46.1787 60.4153C46.4863 60.1077 46.6591 59.6905 46.6591 59.2554V57.7144C50.172 56.9791 52.5595 53.7074 52.1904 50.1377C51.8203 46.568 48.8128 43.8554 45.2239 43.8546C43.1672 43.8546 41.4996 42.187 41.4996 40.1303C41.4996 38.0736 43.1672 36.406 45.2239 36.406C47.2806 36.406 48.9482 38.0734 48.9482 40.1303C48.9482 40.5653 49.121 40.9825 49.4286 41.2902C49.7362 41.5978 50.1534 41.7706 50.5885 41.7706C51.0235 41.7706 51.4407 41.5978 51.7483 41.2902C52.0559 40.9825 52.2287 40.5653 52.2287 40.1303C52.224 36.8161 49.9022 33.9575 46.6591 33.2735V31.7806C46.6591 31.3456 46.4863 30.9284 46.1787 30.6207C45.8711 30.3131 45.4539 30.1403 45.0189 30.1403C44.5838 30.1403 44.1666 30.3131 43.859 30.6207C43.5514 30.9284 43.3786 31.3456 43.3786 31.7806V33.3737C39.9938 34.2978 37.8153 37.5842 38.2814 41.0618C38.7474 44.5394 41.7151 47.1349 45.2239 47.1343C47.2535 47.1343 48.909 48.7594 48.9457 50.7881C48.9834 52.8169 47.388 54.5019 45.36 54.5757Z" fill="white" />
                <path d="M21.4375 45.6205C21.4375 58.7572 32.0867 69.4064 45.2233 69.4064C58.36 69.4064 69.0092 58.7572 69.0092 45.6205C69.0092 32.4839 58.36 21.8347 45.2233 21.8347C32.093 21.8491 21.4529 32.4902 21.4375 45.6205ZM45.2233 25.1153C56.5483 25.1153 65.7286 34.2956 65.7286 45.6205C65.7286 56.9455 56.5483 66.1258 45.2233 66.1258C33.8984 66.1258 24.7181 56.9455 24.7181 45.6205C24.731 34.3011 33.9039 25.1282 45.2233 25.1153Z" fill="white" />
                <path d="M77.0961 73.4501L64.2468 79.5212C63.3752 77.8999 62.0914 76.5372 60.5249 75.5706C58.9584 74.604 57.1647 74.0676 55.3247 74.0156L43.463 73.6896C41.5843 73.6358 39.7418 73.1601 38.0719 72.2976L36.8651 71.6722C33.8201 70.0852 30.4365 69.2581 27.0028 69.2618C23.5691 69.2654 20.1872 70.0995 17.1455 71.6929L17.2208 68.9586C17.2268 68.7432 17.1903 68.5288 17.1134 68.3275C17.0365 68.1263 16.9207 67.9421 16.7726 67.7857C16.6245 67.6292 16.4471 67.5034 16.2504 67.4155C16.0537 67.3276 15.8416 67.2793 15.6262 67.2734L2.61914 66.9156C2.40382 66.9096 2.18943 66.9462 1.98822 67.0231C1.78702 67.1 1.60295 67.2159 1.44653 67.364C1.2901 67.5121 1.1644 67.6895 1.07659 67.8862C0.98878 68.0829 0.94059 68.295 0.934773 68.5103L0.149075 97.0532C0.143069 97.2686 0.17956 97.4831 0.256464 97.6844C0.333368 97.8856 0.449178 98.0698 0.597277 98.2263C0.745375 98.3828 0.922861 98.5086 1.11959 98.5965C1.31633 98.6844 1.52845 98.7327 1.74385 98.7386L14.7507 99.0966H14.7956C15.223 99.0968 15.6336 98.9301 15.94 98.6321C16.2463 98.3341 16.4243 97.9283 16.4359 97.501L16.4734 96.1355L19.8524 94.3262C21.1782 93.6125 22.7297 93.4427 24.1785 93.8528L44.3569 99.5161C44.3922 99.5266 44.4272 99.5346 44.4635 99.5428C45.922 99.8477 47.4081 100.001 48.898 100C52.0538 100.002 55.1726 99.3214 58.0406 98.005C58.1112 97.9728 58.1792 97.9352 58.244 97.8926L87.501 78.9686C87.8521 78.7414 88.1032 78.3887 88.2031 77.9827C88.3029 77.5765 88.2439 77.1477 88.0382 76.7836C85.8663 72.9295 81.0485 71.4614 77.0961 73.4501ZM3.47374 95.5044L4.16881 70.24L13.8961 70.5076L13.2011 95.7728L3.47374 95.5044ZM56.5629 95.075C52.9995 96.6831 49.02 97.1273 45.1898 96.3446L25.0659 90.6957C22.8015 90.0556 20.377 90.3207 18.3044 91.4348L16.5776 92.3599L17.0397 75.5622C19.7262 73.7753 22.8429 72.7421 26.0648 72.5703C29.2866 72.3984 32.4956 73.0943 35.3568 74.5852L36.5639 75.2105C38.6732 76.2996 41.0003 76.9007 43.3731 76.9695L55.2357 77.2955C58.5676 77.3915 61.3973 79.7638 62.0733 83.0283L44.4041 82.5406C43.4982 82.516 42.7445 83.2303 42.7189 84.1353C42.707 84.5703 42.8683 84.9921 43.1673 85.3081C43.4664 85.6241 43.8787 85.8084 44.3136 85.8205L63.8128 86.3571H63.8585C64.2856 86.3568 64.6958 86.19 65.0018 85.892C65.3078 85.594 65.4855 85.1885 65.4972 84.7615C65.5173 84.0487 65.4642 83.3356 65.3387 82.6336L78.5178 76.4063C78.5307 76.4008 78.5434 76.3944 78.5563 76.3878C79.4691 75.926 80.5013 75.7545 81.5144 75.8964C82.5274 76.0383 83.4728 76.4868 84.2235 77.1817L56.5629 95.075ZM46.8645 17.223V1.64029C46.8645 1.20526 46.6917 0.788043 46.3841 0.480429C46.0765 0.172816 45.6592 0 45.2242 0C44.7892 0 44.372 0.172816 44.0644 0.480429C43.7567 0.788043 43.5839 1.20526 43.5839 1.64029V17.223C43.5839 17.6581 43.7567 18.0753 44.0644 18.3829C44.372 18.6905 44.7892 18.8633 45.2242 18.8633C45.6592 18.8633 46.0765 18.6905 46.3841 18.3829C46.6917 18.0753 46.8645 17.6581 46.8645 17.223ZM59.1667 17.223V9.84173C59.1667 9.4067 58.9939 8.98949 58.6862 8.68187C58.3786 8.37426 57.9614 8.20144 57.5264 8.20144C57.0913 8.20144 56.6741 8.37426 56.3665 8.68187C56.0589 8.98949 55.8861 9.4067 55.8861 9.84173V17.223C55.8861 17.6581 56.0589 18.0753 56.3665 18.3829C56.6741 18.6905 57.0913 18.8633 57.5264 18.8633C57.9614 18.8633 58.3786 18.6905 58.6862 18.3829C58.9939 18.0753 59.1667 17.6581 59.1667 17.223ZM34.5623 17.223V9.84173C34.5623 9.4067 34.3895 8.98949 34.0819 8.68187C33.7743 8.37426 33.3571 8.20144 32.922 8.20144C32.487 8.20144 32.0698 8.37426 31.7622 8.68187C31.4546 8.98949 31.2818 9.4067 31.2818 9.84173V17.223C31.2818 17.6581 31.4546 18.0753 31.7622 18.3829C32.0698 18.6905 32.487 18.8633 32.922 18.8633C33.3571 18.8633 33.7743 18.6905 34.0819 18.3829C34.3895 18.0753 34.5623 17.6581 34.5623 17.223Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="bg-white border border-primary/10 rounded-md sm:p-4 p-2">
          <div className="sm:border-l-2 border-blue-300 sm:pl-[18px]">
            <div className="flex items-center gap-2">
              {/* <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 18h.01" />
                <path d="M12 14a4 4 0 1 0-4-4" />
                <path d="M12 2a10 10 0 1 0 10 10" />
              </svg>
            </span> */}
              <p className="text-black">
                How your earnings are calculated
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
                You earn 75% of the sale price after taxes and payment gateway fees.
              </li>
              <li className="flex items-start gap-2 p2 text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className="flex-shrink-0 sm:w-[17px] sm:h-[17px] w-4 h-4">
                  <g clipPath="url(#clip0_9320_5934)">
                    <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z" fill="#0043A2" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z" fill="#0043A2" />
                  </g>
                </svg>
                The remaining amount covers platform services and transaction costs.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="">
        <div className="bg-white border border-primary/10 rounded-md">
          <p className="text-black py-1 px-5">Payout Method</p>

          <div className="space-y-3 sm:p-5 p-[10px] border-t border-primary/10">
            <div>
              <div className="border border-gray-100 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    const next = openPayoutPanel === "paypal" ? "" : "paypal";
                    setOpenPayoutPanel(next);
                    if (next) setPayoutMethod(next);
                  }}
                  className="w-full flex items-center justify-between sm:px-5 sm:py-3 p-[10px] bg-white"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={payoutMethod === "paypal"}
                      onChange={() => {
                        setPayoutMethod("paypal");
                        setOpenPayoutPanel("paypal");
                      }}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-black font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="86" height="23" viewBox="0 0 86 23" fill="none">
                          <path d="M32.0521 4.70386H27.309C26.9844 4.70386 26.7083 4.94083 26.6577 5.26283L24.7394 17.4856C24.7012 17.7267 24.8871 17.9442 25.1305 17.9442H27.395C27.7195 17.9442 27.9956 17.7072 28.0462 17.3845L28.5636 14.0879C28.6135 13.7652 28.8902 13.5282 29.2141 13.5282H30.7157C33.8401 13.5282 35.6433 12.0088 36.1142 8.99789C36.3265 7.68061 36.1233 6.64561 35.5095 5.92077C34.8353 5.12483 33.6397 4.70386 32.0521 4.70386ZM32.5993 9.16795C32.34 10.8783 31.0395 10.8783 29.7821 10.8783H29.0664L29.5685 7.6841C29.5984 7.49104 29.7648 7.34886 29.959 7.34886H30.287C31.1436 7.34886 31.9516 7.34886 32.3691 7.83952C32.6181 8.13225 32.6944 8.56716 32.5993 9.16795Z" fill="#253B80" />
                          <path d="M46.2274 9.11286H43.956C43.7625 9.11286 43.5954 9.25504 43.5656 9.4481L43.465 10.0865L43.3062 9.85513C42.8145 9.13795 41.718 8.89819 40.6235 8.89819C38.1136 8.89819 35.9698 10.8086 35.5523 13.4884C35.3352 14.8252 35.6439 16.1035 36.3985 16.9949C37.0906 17.8145 38.081 18.156 39.2593 18.156C41.2817 18.156 42.4032 16.8492 42.4032 16.8492L42.3019 17.4835C42.2638 17.726 42.4497 17.9435 42.6917 17.9435H44.7377C45.0629 17.9435 45.3376 17.7065 45.3889 17.3838L46.6165 9.57147C46.6553 9.33101 46.4702 9.11286 46.2274 9.11286ZM43.0614 13.5553C42.8422 14.8594 41.8123 15.7348 40.4987 15.7348C39.8391 15.7348 39.312 15.5222 38.9736 15.1193C38.6379 14.7193 38.5103 14.1499 38.6171 13.5156C38.8217 12.2227 39.869 11.3188 41.1624 11.3188C41.8074 11.3188 42.3318 11.5341 42.6771 11.9405C43.0232 12.351 43.1605 12.9239 43.0614 13.5553Z" fill="#253B80" />
                          <path d="M58.3248 9.11285H56.0423C55.8245 9.11285 55.6199 9.22158 55.4965 9.40349L52.3485 14.0634L51.0141 9.5854C50.9302 9.30522 50.6729 9.11285 50.3816 9.11285H48.1386C47.8661 9.11285 47.6767 9.38049 47.7634 9.63837L50.2775 17.0527L47.9139 20.4059C47.7281 20.67 47.9153 21.0331 48.2364 21.0331H50.5161C50.7325 21.0331 50.935 20.9272 51.0578 20.7488L58.6494 9.73664C58.8311 9.47319 58.6445 9.11285 58.3248 9.11285Z" fill="#253B80" />
                          <path d="M65.8803 4.70386H61.1364C60.8125 4.70386 60.5365 4.94083 60.4858 5.26283L58.5675 17.4856C58.5293 17.7267 58.7152 17.9442 58.9573 17.9442H61.3916C61.6177 17.9442 61.8112 17.7783 61.8466 17.5525L62.391 14.0879C62.4409 13.7652 62.7177 13.5282 63.0416 13.5282H64.5424C67.6675 13.5282 69.4701 12.0088 69.9417 8.99789C70.1546 7.68061 69.95 6.64561 69.3362 5.92077C68.6628 5.12483 67.4678 4.70386 65.8803 4.70386ZM66.4275 9.16795C66.1688 10.8783 64.8684 10.8783 63.6103 10.8783H62.8952L63.398 7.6841C63.4279 7.49104 63.5929 7.34886 63.7878 7.34886H64.1159C64.9717 7.34886 65.7804 7.34886 66.1979 7.83952C66.4469 8.13225 66.5225 8.56716 66.4275 9.16795Z" fill="#179BD7" />
                          <path d="M80.0604 9.11286H77.7904C77.5955 9.11286 77.4298 9.25504 77.4006 9.4481L77.3001 10.0865L77.1406 9.85513C76.6488 9.13795 75.553 8.89819 74.4586 8.89819C71.9487 8.89819 69.8056 10.8086 69.3881 13.4884C69.1717 14.8252 69.4789 16.1035 70.2335 16.9949C70.9271 17.8145 71.9161 18.156 73.0944 18.156C75.1168 18.156 76.2382 16.8492 76.2382 16.8492L76.137 17.4835C76.0988 17.726 76.2847 17.9435 76.5282 17.9435H78.5734C78.8973 17.9435 79.1733 17.7065 79.224 17.3838L80.4522 9.57147C80.4897 9.33101 80.3038 9.11286 80.0604 9.11286ZM76.8943 13.5553C76.6766 14.8594 75.6453 15.7348 74.3317 15.7348C73.6735 15.7348 73.145 15.5222 72.8066 15.1193C72.4709 14.7193 72.3447 14.1499 72.4501 13.5156C72.6561 12.2227 73.7019 11.3188 74.9954 11.3188C75.6404 11.3188 76.1647 11.5341 76.5101 11.9405C76.8576 12.351 76.9949 12.9239 76.8943 13.5553Z" fill="#179BD7" />
                          <path d="M82.7369 5.03906L80.7901 17.4855C80.752 17.7267 80.9379 17.9442 81.1799 17.9442H83.1371C83.4624 17.9442 83.7384 17.7072 83.7883 17.3845L85.7081 5.16243C85.7462 4.92128 85.5604 4.70312 85.3183 4.70312H83.1267C82.9332 4.70382 82.7667 4.846 82.7369 5.03906Z" fill="#179BD7" />
                          <path d="M5.03784 20.3194L5.40057 18.0041L4.59258 17.9853H0.734375L3.41563 0.900472C3.42396 0.848896 3.451 0.800805 3.49054 0.766654C3.53007 0.732502 3.5807 0.713684 3.63341 0.713684H10.1389C12.2986 0.713684 13.789 1.16532 14.5672 2.05674C14.932 2.47493 15.1643 2.91193 15.2767 3.39284C15.3946 3.89744 15.3967 4.50032 15.2816 5.23562L15.2732 5.28929V5.76044L15.638 5.96814C15.9453 6.13193 16.1894 6.31941 16.3767 6.53408C16.6888 6.89162 16.8906 7.34605 16.9759 7.8848C17.064 8.4389 17.0348 9.09823 16.8906 9.84468C16.7241 10.7034 16.455 11.4512 16.0916 12.0631C15.7573 12.627 15.3315 13.0947 14.8259 13.4571C14.3432 13.8014 13.7696 14.0627 13.1211 14.23C12.4928 14.3945 11.7764 14.4774 10.9906 14.4774H10.4843C10.1222 14.4774 9.77062 14.6085 9.49458 14.8434C9.21786 15.0831 9.03476 15.4107 8.97858 15.7689L8.94044 15.9773L8.2996 20.0581L8.27047 20.2079C8.26284 20.2553 8.24966 20.279 8.23025 20.295C8.21291 20.3097 8.18794 20.3194 8.16366 20.3194H5.03784Z" fill="#253B80" />
                          <path d="M15.9821 5.34369C15.9626 5.46845 15.9404 5.59599 15.9155 5.72702C15.0576 10.1535 12.1225 11.6826 8.37383 11.6826H6.46519C6.00675 11.6826 5.62044 12.0172 5.54901 12.4716L4.5718 18.6997L4.29507 20.4651C4.24861 20.7634 4.47748 21.0325 4.77709 21.0325H8.1623C8.56317 21.0325 8.9037 20.7397 8.96681 20.3425L9.00011 20.1696L9.63748 16.1049L9.6784 15.8819C9.74081 15.4832 10.082 15.1905 10.4829 15.1905H10.9892C14.269 15.1905 16.8365 13.8523 17.5869 9.97993C17.9004 8.36226 17.7381 7.01154 16.9086 6.06157C16.6576 5.77511 16.3462 5.53745 15.9821 5.34369Z" fill="#179BD7" />
                          <path d="M15.0903 4.98402C14.9592 4.94568 14.824 4.91083 14.6853 4.87947C14.5458 4.8488 14.403 4.82162 14.2559 4.79792C13.7413 4.71429 13.1775 4.67456 12.5734 4.67456H7.47443C7.3489 4.67456 7.22961 4.70314 7.1228 4.75471C6.88769 4.86832 6.71291 5.09205 6.67061 5.36595L5.5859 12.2701L5.55469 12.4716C5.62612 12.0171 6.01243 11.6826 6.47086 11.6826H8.37951C12.1281 11.6826 15.0632 10.1527 15.9212 5.72698C15.9468 5.59595 15.9683 5.46841 15.9877 5.34365C15.7707 5.22795 15.5355 5.12898 15.2824 5.04465C15.22 5.02374 15.1555 5.00353 15.0903 4.98402Z" fill="#222D65" />
                          <path d="M6.66777 5.36597C6.71007 5.09206 6.88485 4.86833 7.11996 4.75542C7.22746 4.70385 7.34606 4.67527 7.47159 4.67527H12.5706C13.1746 4.67527 13.7385 4.715 14.2531 4.79864C14.4001 4.82233 14.543 4.84952 14.6824 4.88018C14.8211 4.91155 14.9564 4.94639 15.0874 4.98473C15.1526 5.00424 15.2171 5.02446 15.2802 5.04467C15.5334 5.129 15.7685 5.22867 15.9856 5.34367C16.2408 3.70788 15.9835 2.59412 15.1034 1.58561C14.1331 0.475333 12.3819 0 10.1411 0H3.63557C3.17783 0 2.78736 0.334545 2.71662 0.789667L0.00692773 18.0501C-0.0464755 18.3916 0.215686 18.6997 0.558299 18.6997H4.57464L5.58306 12.2702L6.66777 5.36597Z" fill="#253B80" />
                        </svg>
                      </p>

                    </div>
                  </div>
                  <span className="text-primary rounded-full w-4 h-4 flex items-center justify-center border border-primary text-center">
                    {openPayoutPanel === "paypal" ? "−" : "+"}
                  </span>
                </button>

                {openPayoutPanel === "paypal" && (
                  <div className="sm:p-4 p-[10px] bg-white border-t border-gray-100">
                    <label className="p2 block mb-1">
                      PayPal Email *
                    </label>
                    <input
                      type="email"
                      placeholder="Enter PayPal email"
                      value={formData.paypal_email}
                      onChange={(e) => handleFieldChange("paypal_email", e.target.value)}
                      className={`w-full border rounded-[5px] sm:py-[10px] sm:px-3 px-[10px] py-[6px] outline-none focus:ring-1 ring-primary ${payoutErrors?.paypal_email ? "border-red-500" : "border-gray-100"
                        }`}
                    />
                    {payoutErrors?.paypal_email ? (
                      <p className="text-red-500 text-xs mt-1">{payoutErrors.paypal_email}</p>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-[5px] text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10.6667 12.6667L14 9.33336L10.6667 6.00002" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 9.33338L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[14px] text-gray-200 mt-1">
                  Receive payouts directly to your PayPal account.
                </p>
              </div>
            </div>
            <div>
              <div className="border border-gray-100 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    const next = openPayoutPanel === "bank" ? "" : "bank";
                    setOpenPayoutPanel(next);
                    if (next) setPayoutMethod(next);
                  }}
                  className="w-full flex items-center justify-between sm:px-4 sm:py-3 p-[10px] bg-white"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={payoutMethod === "bank"}
                      onChange={() => {
                        setPayoutMethod("bank");
                        setOpenPayoutPanel("bank");
                      }}
                      className="2xl:mt-2 mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-[10px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <g clipPath="url(#clip0_9320_5984)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10 6.59508e-06C9.67489 0.000239478 9.35639 0.0926361 9.08075 0.266673L0.846792 5.78286L0.845283 5.78591C0.570514 5.96075 0.364722 6.22683 0.263336 6.53833C0.161949 6.84984 0.171312 7.18729 0.289811 7.49257C0.513207 8.0701 1.08075 8.46324 1.76604 8.46324H1.90189V14.4853H1.64075C0.710943 14.4853 0 15.2594 0 16.1615V18.3253C0 19.2274 0.710943 20 1.64075 20H18.3608C19.2891 20 20 19.2274 20 18.3253V16.1615C20 15.2594 19.2891 14.4853 18.3608 14.4853H18.0981V8.46324H18.234C18.9192 8.46324 19.4868 8.0701 19.7102 7.4941C19.8292 7.18879 19.839 6.85112 19.7379 6.5393C19.6368 6.22748 19.4311 5.96104 19.1562 5.78591L19.1532 5.78439L10.9208 0.268197L10.8906 0.24534C10.6211 0.0839146 10.3133 -0.000861142 10 6.59508e-06ZM15.4581 8.46324H13.5804V14.4853H15.4566L15.4581 8.46324ZM10.9389 8.46324H9.06113V14.4853H10.9389V8.46324ZM6.41962 8.46324H4.5434V14.4853H6.41962V8.46324ZM1.88679 16.3901V18.0952H18.1132V16.3901H1.88679Z" fill="black" />
                          </g>
                        </svg>
                        <p className="!text-black p2">Bank Transfer</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-primary rounded-full w-4 h-4 flex items-center justify-center border border-primary text-center">
                    {openPayoutPanel === "bank" ? "−" : "+"}
                  </span>
                </button>

                {openPayoutPanel === "bank" && (
                  <div className="sm:p-4 p-[10px] bg-white border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="p2 block mb-1">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter bank name"
                          value={formData.bank_name}
                          onChange={(e) => handleFieldChange("bank_name", e.target.value)}
                          className={`w-full border rounded-[5px] sm:py-[10px] sm:px-3 px-[10px] py-[6px] outline-none focus:ring-1 ring-primary ${payoutErrors?.bank_name ? "border-red-500" : "border-gray-100"
                            }`}
                        />
                        {payoutErrors?.bank_name ? (
                          <p className="text-red-500 text-xs mt-1">{payoutErrors.bank_name}</p>
                        ) : null}
                      </div>
                      <div>
                        <label className="p2 block mb-1">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter account holder name"
                          value={formData.bank_account_holder_name}
                          onChange={(e) =>
                            handleFieldChange("bank_account_holder_name", e.target.value)
                          }
                          className={`w-full border rounded-[5px] sm:py-[10px] sm:px-3 px-[10px] py-[6px] outline-none focus:ring-1 ring-primary ${payoutErrors?.bank_account_holder_name ? "border-red-500" : "border-gray-100"
                            }`}
                        />
                        {payoutErrors?.bank_account_holder_name ? (
                          <p className="text-red-500 text-xs mt-1">
                            {payoutErrors.bank_account_holder_name}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label className="p2 block mb-1">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter account number"
                          value={formData.bank_account_number}
                          onChange={(e) =>
                            handleFieldChange(
                              "bank_account_number",
                              e.target.value.replace(/[^\d]/g, "")
                            )
                          }
                          className={`w-full border rounded-[5px] sm:py-[10px] sm:px-3 px-[10px] py-[6px] outline-none focus:ring-1 ring-primary ${payoutErrors?.bank_account_number ? "border-red-500" : "border-gray-100"
                            }`}
                        />
                        {payoutErrors?.bank_account_number ? (
                          <p className="text-red-500 text-xs mt-1">
                            {payoutErrors.bank_account_number}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label className="p2 block mb-1">
                          IFSC / SWIFT Code *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter IFSC/SWIFT"
                          value={formData.bank_ifsc_swift_code}
                          onChange={(e) =>
                            handleFieldChange(
                              "bank_ifsc_swift_code",
                              e.target.value.toUpperCase()
                            )
                          }
                          className={`w-full border rounded-[5px] sm:py-[10px] sm:px-3 px-[10px] py-[6px] outline-none focus:ring-1 ring-primary ${payoutErrors?.bank_ifsc_swift_code ? "border-red-500" : "border-gray-100"
                            }`}
                        />
                        {payoutErrors?.bank_ifsc_swift_code ? (
                          <p className="text-red-500 text-xs mt-1">
                            {payoutErrors.bank_ifsc_swift_code}
                          </p>
                        ) : null}
                      </div>
                      <div className="md:col-span-2">
                        <label className="p2 block mb-1">
                          Bank Country *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter bank country"
                          value={formData.bank_country}
                          onChange={(e) => handleFieldChange("bank_country", e.target.value)}
                          className={`w-full border rounded-[5px] sm:py-[10px] sm:px-3 px-[10px] py-[6px] outline-none focus:ring-1 ring-primary ${payoutErrors?.bank_country ? "border-red-500" : "border-gray-100"
                            }`}
                        />
                        {payoutErrors?.bank_country ? (
                          <p className="text-red-500 text-xs mt-1">{payoutErrors.bank_country}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-[5px] text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10.6667 12.6667L14 9.33336L10.6667 6.00002" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 9.33338L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[14px] text-gray-200 mt-1">
                  Receive payouts via direct bank transfer.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center pt-0 p-5 justify-between flex-wrap gap-2">
            <p className="p2 text-gray-200">
              <span className="font-medium text-black">Note:</span> Payouts are
              processed only after you request a withdrawal.
            </p>

            <button type="button" className="btn btn-primary" onClick={handleSavePayout}>
              Save Payout Details
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="bg-white border border-primary/10 rounded-md">
          <div className="px-5 py-3 border-b border-primary/10">
            <p className="text-black">Withdrawal History</p>
          </div>

          <div className="p-4">
            <div className="overflow-x-auto rounded-[5px]">
              <table className="bg-white text-sm min-w-[950px] w-full">
                <thead className="bg-blue-300 rounded-[10px] overflow-hidden">
                  <tr className="rounded-[10px] overflow-hidden">
                    <th className="px-5 lg:py-3 py-[10px] text-left !text-black p2 font-normal 1xl:w-1/5 w-[18%] rounded-l-[10px] overflow-hidden">
                      Date
                    </th>
                    <th className="px-5 lg:py-3 py-[10px] text-left !text-black p2 font-normal 1xl:w-1/5 w-[18%]">
                      Amount
                    </th>
                    <th className="px-5 lg:py-3 py-[10px] text-left !text-black p2 font-normal 1xl:w-1/5 w-[18%]">
                      Payout Method
                    </th>
                    <th className="px-5 lg:py-3 py-[10px] text-left !text-black p2 font-normal 1xl:w-1/5 w-[23%]">
                      Status
                    </th>
                    <th className="px-5 lg:py-3 py-[10px] text-left !text-black p2 font-normal 1xl:w-1/5 w-[23%] rounded-r-[10px] overflow-hidden">
                      Reference / Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pagedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-5 lg:py-3 py-[10px] text-gray-200 p2">
                        {shortDate(row.date)}
                      </td>
                      <td className="px-5 lg:py-3 py-[10px] text-gray-200 p2">
                        {money(row.amount)}
                      </td>
                      <td className="px-5 lg:py-3 py-[10px] text-gray-200 p2">{row.method}</td>
                      <td className="px-5 lg:py-3 py-[10px]">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="px-5 lg:py-3 py-[10px]">
                        {row.status === "Completed" ? (
                          <button
                            type="button"
                            onClick={() => handleDownload(row)}
                            className="btn btn-primary 2xl:!px-6 !px-4 !py-1 !text-[14px]"
                          >
                            Download receipt (PDF)
                          </button>
                        ) : (
                          <span className="text-[#9aa0a6] text-[12px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
              <p className="p2 !text-black">
                Showing {showingFrom} to {showingTo} of {rows.length} entries
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="1xl:w-10 1xl:h-10 w-8 h-8 rounded border p2 border-gray-200 bg-white text-[#616161] hover:border-primary hover:text-primary"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const p = idx + 1;
                  const active = p === safePage;
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`1xl:w-10 1xl:h-10 w-8 h-8 rounded border p2 ${active
                        ? "bg-primary !text-white border-primary"
                        : "bg-white text-[#616161] border-gray-200 hover:border-primary hover:text-primary"
                        }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="1xl:w-10 1xl:h-10 w-8 h-8 rounded border p2 border-gray-200 bg-white text-[#616161] hover:border-primary hover:text-primary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal (HeroUI) */}
      <Modal
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        isOpen={isWithdrawOpen}
        onOpenChange={(open) => {
          onWithdrawOpenChange(open);
          if (!open) {
            setWithdrawError("");
            setPayoutErrors({});
            setWithdrawAmountMode("full");
            setWithdrawOtherAmount("50.00");
          }
        }}
        classNames={{
          backdrop: "bg-black/50",
          wrapper: "px-4"
        }}
      >
        <ModalContent className="!p-0 !bg-white rounded-xl shadow-xl px-4 max-w-[640px] w-full mx-auto">
          {(onClose) => (
            <>
              <ModalHeader className="sm:!px-6 sm:!py-4 p-[10px] flex items-center justify-between border-b border-gray-100">
                <h3 className="text-black font-medium">
                  Withdraw Earnings
                </h3>
                <button
                  onClick={onClose}
                  className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </ModalHeader>

              <ModalBody className="sm:!px-6 sm:!py-5 p-4">
                <div className="md:space-y-6 space-y-5">
                  <div>
                    <p className="p2 !text-black">Available Balance:</p>
                    <p className="text-[22px] font-semibold text-primary mt-1">
                      {money(availableBalanceForWithdraw)}
                    </p>
                  </div>

                  <div className="sm:space-y-4 space-y-3">
                    <p className="p2 !text-black">
                      Withdrawal Method:
                    </p>

                    <Autocomplete
                      className="!bg-white"
                      classNames={{
                        mainWrapper: "!bg-white",
                        innerWrapper:
                          "border !border-gray-200 !bg-white rounded-[5px] px-3 py-[10px] w-full cursor-pointer flex justify-between items-center",
                        input:
                          "!text-[14px] !text-black placeholder:!text-gray-300",
                        inputWrapper: "!bg-transparent",
                        listboxWrapper: "!bg-white",
                      }}
                      aria-label="Withdrawal method"
                      placeholder="Select withdrawal method"
                      defaultItems={withdrawalMethods}
                      selectedKey={withdrawMethodKey}
                      onSelectionChange={(key) => {
                        const next = String(key || "");
                        setWithdrawMethodKey(next);
                        setWithdrawError("");
                      }}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.key} textValue={item.label}>
                          <div className="flex items-center justify-between w-full gap-3">
                            <span className="text-[14px] text-[#3a3a3a] ">
                              {item.label}
                            </span>
                            <span className="text-[12px] text-primary bg-blue-50 border border-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
                              {item.etaLabel}
                            </span>
                          </div>
                        </AutocompleteItem>
                      )}
                    </Autocomplete>

                    <div ref={dropdownRef} className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between gap-2 border border-gray-100 text-gray-200 rounded-[5px] bg-white sm:px-3 sm:py-2 px-[6px] py-2"
                      >
                        <p className="p2 line-clamp-1 text-left">{selectedMethod?.label}</p>

                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="absolute z-30 mt-2 w-full rounded-[5px] bg-white border border-gray-100 shadow-sm overflow-hidden p-1.5 space-y-2">
                          {withdrawalMethods.map((method) => {
                            const isSelected = selectedMethod?.key === method.key;

                            return (
                              <div
                                key={method.key}
                                onClick={() => {
                                  setSelectedMethod(method);
                                  setIsOpen(false);
                                }}
                                className={`flex items-center justify-between px-3 py-2 p2 cursor-pointer rounded-[5px] overflow-hidden
                                            ${isSelected ? "bg-blue-300" : "hover:bg-blue-300"}`}
                              >
                                <p className="sm:text-[15px] text-[13px] flex-wrap break-words whitespace-normal">
                                  {method.label}
                                </p>

                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-primary border-primary border bg-blue-300 px-2 py-0.5 rounded-full flex-shrink-0">
                                    {method.etaLabel}
                                  </span>

                                  {isSelected && (
                                    <svg
                                      className="w-4 h-4 text-primary"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.704 5.29a1 1 0 00-1.408-1.418L8 11.17 4.704 7.874a1 1 0 00-1.408 1.418l4 4a1 1 0 001.408 0l8-8z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>



                    <div className="flex items-start gap-2 bg-blue-300 border border-[#E6EFFB] rounded-[5px] px-3 py-2 text-primary text-[14px]">
                      <LightBulbIcon className="flex-shrink-0" />
                      <span>{selectedWithdrawMethod?.hint}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="p2 !text-black">Amount:</p>

                    <RadioGroup
                      value={withdrawAmountMode}
                      onChange={(e) => setWithdrawAmountMode(e.target.value)}
                      classNames={{
                        wrapper: "gap-3",
                      }}
                    >
                      <Radio
                        value="full"
                        classNames={{
                          label: "p2",
                          wrapper: "w-5 h-5",
                        }}
                      >
                        {money(availableBalanceForWithdraw)}
                      </Radio>

                      <Radio
                        value="other"
                        classNames={{
                          label: "p2",
                          wrapper: "w-5 h-5",
                        }}
                      >
                        Other amount
                      </Radio>
                    </RadioGroup>

                    {withdrawAmountMode === "other" && (
                      <Input
                        value={withdrawOtherAmount}
                        onChange={(e) => {
                          setWithdrawOtherAmount(e.target.value);
                          if (withdrawError) setWithdrawError("");
                        }}
                        label=""
                        placeholder="0.00"
                        type="text"
                        variant="bordered"
                        classNames={{
                          inputWrapper:
                            `rounded-[8px] border ${withdrawError ? "border-red-500" : "border-gray-100"
                            } bg-white px-3 py-[10px]`,
                          input: "!text-[16px] !text-black placeholder:!text-gray-300 !outline-none",
                        }}
                        startContent={
                          <span className="text-[#9aa0a6] font-medium">$</span>
                        }
                        endContent={
                          <span className="text-primary text-[13px] font-medium">
                            USD
                          </span>
                        }
                      />
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="p2 !text-black">
                        Total amount you&apos;ll receive:
                      </p>
                      <p className="p2 !text-black">
                        {money(withdrawAmountMode === "full" ? availableBalanceForWithdraw : withdrawAmount)}
                      </p>
                    </div>

                    <div className="flex items-start gap-2 bg-blue-300 border border-[#E6EFFB] rounded-[5px] px-3 py-2 text-primary text-[14px]">
                      <LightBulbIcon className="mt-[1px] flex-shrink-0" />
                      <span>
                        You are about to send{" "}
                        <span className="font-medium">
                          {money(totalReceive)}
                        </span>{" "}
                        to {selectedWithdrawMethod?.noteKey}.
                      </span>
                    </div>

                    {withdrawError ? (
                      <div className="bg-red-50 border border-red-100 text-red-700 text-[14px] rounded-[5px] px-3 py-2">
                        {withdrawError}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <Button
                      onPress={() => {
                        const ok = handleWithdraw();
                        if (ok) onClose();
                      }}
                      className="btn btn-primary w-fit"
                    >
                      Withdraw Now
                    </Button>
                    <Button
                      variant="bordered"
                      onPress={onClose}
                      className="btn btn-new"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}


