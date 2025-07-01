"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import DynamicTable from "@/components/common/table";
import { useAuth } from "@/contexts/AuthContext";
import { debounce } from "lodash";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import toast from "react-hot-toast";
import { strapiGet, strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";

const ticketSupportPage = ({ title }) => {
  const formRef = useRef(null);
  const { authUser } = useAuth();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const fileInputAuthorRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState("");
  const [filterData, setFilterData] = useState({});
  const [filterAuthorData, setFilterAuthorData] = useState({});
  const [filteredSupport, setFilteredSupport] = useState([]);
  const [filteredSupportAuthor, setFilteredSupportAuthor] = useState([]);
  const [TabsSelected, setTabsSelected] = useState("checkTicketStatus");
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [openTicket, setOpenTicket] = useState(null);
  const [openTicketData, setOpenTicketData] = useState({});

  const [submitFormData, setSubmitFormData] = useState({});

  const handleClick = () => {
    fileInputRef.current.click();
  };

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

  const handleStatusChange = (value) => {
    if (value !== undefined) {
      setFilterData((prev) => ({ ...prev, status: value }));
    }
  };

  const handleProductChange = (value) => {
    if (value !== undefined) {
      setFilterData((prev) => ({ ...prev, product_name: value }));
    }
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

  const handleSubmitFormData = (e, name) => {
    setSubmitFormData((prev) => ({
      ...prev,
      ...e,
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

  const handleSubmit = async (e) => {
    setFormSubmitLoading(true);
    e.preventDefault();

    const newErrors = {};

    if (!submitFormData.productDocumentId || !submitFormData.title) {
      newErrors.product = "Product is required.";
    }

    if (!submitFormData.message || submitFormData.message.trim() === "") {
      newErrors.message = "Message is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormSubmitLoading(false);
      return;
    } else {
      // console.log({ ...submitFormData, attachment });
      try {
        let attachments = null;
        if (file) {
          try {
            const formData = new FormData();
            formData.append("files", file);
            const fileData = await strapiPost(
              `upload`,
              formData,
              themeConfig.TOKEN
            );
            if (fileData) {
              attachments = fileData[0].id;
            }
          } catch (error) {
            if (error.status === 413) {
              setFormSubmitLoading(false);
              toast.error(error.response.data.error.message);
            }
          }
        }

        const formData = { ...submitFormData, attachments };
        const submitData = await strapiPost(
          `supports`,
          {
            message: formData?.message,
            product: formData?.productDocumentId,
            customer: formData?.custommerDocumentId,
            author: formData?.authorDocumentId,
            order: formData?.orderDocumentId,
            attachments,
            support_status: "Pending",
          },
          themeConfig.TOKEN
        );
        if (submitData) {
          setFormSubmitLoading(false);
          toast.success("Your Ticket submit successfully...!");
          setTimeout(() => {
            setTabsSelected("checkTicketStatus");
            setOpenTicket(null);
            setOpenTicketData(null);
            fetchSupportData(authUser?.documentId, authUser?.position);
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        setFormSubmitLoading(false);
        toast.error(error.response.data.error.message);
      } finally {
        setFormSubmitLoading(false);
      }
    }
  };

  const statuses = [
    {
      label: "Authorized",
      value: "Authorized",
      color: "text-primary",
    },
    {
      label: "Pending",
      value: "Pending",
      color: "text-[#ED9A12]",
    },
    {
      label: "Rejected",
      value: "Rejected",
      color: "text-[#C32D0B]",
    },
  ];

  // table
  const columns = [
    {
      title: "Ticket Number",
      field: "documentId",
      hozAlign: "center",
      width: 50,
      formatter: function (cell) {
        return `<div class="flex items-center gap-1 text-primary">${cell.getValue()}</div>`;
      },
      cellClick: async (e, cell) => {
        const orderData = cell.getRow().getData();
        console.log(orderData);
        if (orderData.id) {
          await setOpenTicket(orderData?.id);
        } else {
          toast.error("No invoice data found.");
        }
      },
    },
    {
      title: "Product Name",
      field: "product_name",
      hozAlign: "center",
      widthGrow: 1.5,
    },
    {
      title: "Description",
      field: "description",
      hozAlign: "center",
      widthGrow: 1.5,
      formatter: function (cell) {
        return `<div class="text-primary pr-2 truncate">${cell.getValue()}</div>`;
      },
    },
    {
      title: "Status",
      field: "status",
      hozAlign: "center",
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
            style = "";
        }

        return `<span class="px-3 py-1 text-xs font-semibold rounded-full ${style}">${value}</span>`;
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
  ];

  const page_size = 10;

  const fetchSupportData = async (id, position) => {
    // console.log(id, position, 'SupportData')
    // setLoading(true);
    if (id && position === false) {
      try {
        const payload = {
          page_size,
          ...filterData,
        };

        const supportData = await strapiPost(
          `supports/buyer/${id}`,
          payload,
          themeConfig.TOKEN
        );

        if (supportData?.data) {
          const formattedData = supportData.data.map((item) => {
            const lastComment = item?.comments.length
              ? item?.comments[item?.comments.length - 1]
              : {};
            const firstComment = item?.comments.length ? item?.comments[0] : {};

            return {
              ...item,
              documentId: item.documentId,
              product_name: item.product ? item.product.title : "Untitled",
              status: item?.support_status,
              description: firstComment?.message,
              date: item?.createdAt,
            };
          });
          setFilteredSupport(formattedData);
        }
      } catch (err) {
        toast.error("Failed to load product data.");
        setFilteredSupport([]);
      } finally {
        // setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchSupportData(authUser?.documentId, authUser?.author);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filterData, authUser?.documentId]);

  useEffect(() => {
    const fetchSupportAuthorData = async (id, position) => {
      // setLoading(true);
      // console.log(id, position, 'SupportAuthorData')
      if (id && position === true) {
        try {
          const payload = {
            page_size,
            ...filterData,
          };

          const supportData = await strapiPost(
            `supports/author/${id}`,
            payload,
            themeConfig.TOKEN
          );

          if (supportData?.data) {
            const formattedData = supportData.data.map((item) => {
              const lastComment = item?.comments.length
                ? item?.comments[item?.comments.length - 1]
                : {};
              const firstComment = item?.comments.length
                ? item?.comments[0]
                : {};

              return {
                ...item,
                documentId: item.documentId,
                product_name: item.product ? item.product.title : "Untitled",
                status: item?.support_status,
                description: firstComment?.message,
                date: item?.createdAt,
              };
            });
            setFilteredSupportAuthor(formattedData);
          }
        } catch (err) {
          toast.error("Failed to load product data.");
          setFilteredSupportAuthor([]);
        } finally {
          // setLoading(false);
        }
      }
    };
    if (authUser) {
      fetchSupportAuthorData(authUser?.documentId, authUser?.author);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filterData, authUser?.documentId]);

  useEffect(() => {
    fetchOrderData(authUser?.documentId);
  }, [authUser?.documentId]);

  const fetchOrderData = async (id) => {
    if (id) {
      try {
        const payload = {
          page_size,
          ...filterData,
        };

        const orderData = await strapiGet(
          `order/all-product/${id}`,
          payload,
          themeConfig.TOKEN
        );

        if (orderData?.data) {
          setOrderData(orderData?.data);
        }
      } catch (err) {
        toast.error("Failed to load product data.");
        setOrderData([]);
      }
    }
  };

  useEffect(() => {
    if (openTicket) fetchSingleTicketData(openTicket);
  }, [openTicket]);

  const fetchSingleTicketData = async (id) => {
    if (id) {
      try {
        const ticketData = await strapiGet(`supports/${id}`, themeConfig.TOKEN);

        if (ticketData?.data) {
          // console.log(ticketData?.data);
          setOpenTicketData(ticketData?.data);
        }
      } catch (err) {
        toast.error("Failed to load product data.");
        setOrderData([]);
      }
    }
  };

  function extractLabelParts(label) {
    const parts = label.split(" / ");
    if (parts.length !== 3) {
      throw new Error("Label format is incorrect");
    }

    const [title, orderDocumentId, productDocumentId] = parts;

    const matchedItem = orderData.find(
      (item) =>
        item.productDocumentId === productDocumentId &&
        item.orderDocumentId === orderDocumentId &&
        item.authorDocumentId
    );

    const authorDocumentId = matchedItem?.authorDocumentId || null;
    const custommerDocumentId = authUser?.documentId || null;

    return {
      orderDocumentId,
      productDocumentId,
      authorDocumentId,
      custommerDocumentId,
      title,
    };
  }

  // Format date
  const dateOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  // Format time
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const input = new Date();
  const optionsDate = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = input
    .toLocaleDateString("en-GB", optionsDate)
    .replace(/ /g, " ");

  // Format time like "03:20 PM"
  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedTime = input.toLocaleTimeString("en-US", optionsTime);

  const ReplayForm = ({ data, status = "Pending" }) => {
    const fileInputAuthorRef = useRef(null);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [formSubmitLoading, setFormSubmitLoading] = useState(false);
    const [errors, setErrors] = useState("");

    const handleClick = () => {
      fileInputAuthorRef.current.click();
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

    const checkStatus = (value) => {
      let style = "";
      let border = "";
      switch (value) {
        case "Authorized":
          border = "bg-primary/20 border border-primary";
          style = "text-primary";
          break;
        case "Pending":
          border = "bg-[#257C6533] border border-[#257C65]";
          style = "text-[#257C65]";
          break;
        case "Rejected":
          border = "bg-red-100 border border-red-500";
          style = "text-red-600";
          break;
        default:
          border = "";
          style = "";
      }

      return (
        <p
          className={`${border} rounded-full text-center px-5 flex items-center justify-center`}
        >
          <span className={`${style} !leading-[23px] !text-[13px]`}>
            {value}
          </span>
        </p>
      );
    };

    const handleAuthorSubmit = async (e) => {
      e.preventDefault();
      setFormSubmitLoading(true);

      // Use local validationError for reliable checking
      let validationError = "";
      if (!message.trim()) {
        validationError = "Message is required.";
      } else if (message.length > 500) {
        validationError = "Message cannot exceed 500 characters.";
      }

      if (validationError) {
        setErrors(validationError);
        setFormSubmitLoading(false);
        return;
      } else {
        try {
          let attachments = null;

          if (file) {
            const formData = new FormData();
            formData.append("files", file);

            try {
              const fileData = await strapiPost(
                `upload`,
                formData,
                themeConfig.TOKEN
              );
              if (fileData && fileData.length > 0) {
                attachments = fileData[0].id;
              }
            } catch (error) {
              if (error?.status === 413) {
                toast.error(
                  error?.response?.data?.error?.message || "File too large."
                );
              } else {
                toast.error("File upload failed.");
              }
              setFormSubmitLoading(false);
              return;
            }
          }

          const submitData = await strapiPost(
            `supports/${data.id}/add-comment`,
            {
              message,
              attachments,
              user: authUser.documentId,
              support_status: status,
            },
            themeConfig.TOKEN
          );

          if (submitData) {
            toast.success("Your ticket was submitted successfully!");
            setOpenTicketData(submitData.data);
            setMessage("");
            setFile(null);
            setFileName("");
          }
        } catch (error) {
          console.error(error);
          toast.error(
            error?.response?.data?.error?.message || "Submission failed."
          );
        } finally {
          setFormSubmitLoading(false);
        }
      }
    };

    return (
      <Card className="shadow-none px-0">
        <CardBody className="p-12">
          <div className="bg-white">
            <h3 className="sm:mb-6 mb-4">
              Subject - Ticket #{data.documentId} - #{data?.order?.documentId}
            </h3>
            <form
              onSubmit={handleAuthorSubmit}
              className="flex lg:flex-row flex-col w-full lg:gap-10 gap-8"
            >
              <div className="bg-white xl:w-[80%] lg:w-[74%] w-full">
                <div className="space-y-[7px]">
                  {data?.comments?.map((item, index) => {
                    // Create a Date object from the ISO string
                    const dateObj = new Date(item?.create_at);

                    const formattedDate = dateObj.toLocaleDateString(
                      "en-GB",
                      dateOptions
                    );

                    const formattedTime = dateObj.toLocaleTimeString(
                      "en-US",
                      timeOptions
                    );

                    return (
                      <div
                        className="flex items-start sm:gap-[30px] gap-[10px]"
                        key={index}
                      >
                        <div className="overflow-hidden grid justify-items-center gap-[7px] flex-shrink-0">
                          <div className="w-6 h-6 border-2 border-primary bg-primary rounded-full flex items-center justify-center">
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
                          <div className="lg:h-[192px] md:h-[180px] sm:h-[162px] h-[245px] border border-blue-300 w-[2px]"></div>
                        </div>
                        <div className="w-full lg:pb-[26px] pb-5">
                          <div className="flex sm:items-center items-start justify-between sm:flex-row flex-col w-full mb-[6px] sm:gap-0 gap-1">
                            <span className="p2">
                              User:{" "}
                              <span className="!text-primary p2">
                                {item.user?.full_name || item.user?.username}
                              </span>
                            </span>
                            <div className="flex sm:items-center items-start sm:flex-row flex-col sm:gap-6 gap-1">
                              <span className="p2">
                                Date:{" "}
                                <span className="!text-primary p2">
                                  {formattedDate || ""}
                                </span>
                              </span>
                              <span className="p2">
                                Time:{" "}
                                <span className="!text-primary p2">
                                  {" "}
                                  {formattedTime || ""}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="border border-primary/10 divide-y divide-primary/10 rounded-[5px]">
                            <Textarea
                              classNames={{
                                inputWrapper:
                                  "w-full border-0 !shadow-none xl:py-3 py-2 xl:px-5 md:px-4 px-3 lg:!h-[120px] md:!h-[110px] !h-[100px] focus:outline-none !bg-white",
                                base: "!bg-white",
                                input:
                                  "xl:!text-base md:!text-[15px] !text-sm placeholder:!text-gray-300 !font-normal",
                                label:
                                  "2xl:!text-base md:!text-[15px] !text-black !text-md",
                              }}
                              readOnly
                              defaultValue={item.message}
                              variant="bordered"
                            />
                            <div className="sm:py-[10px] sm:px-5 py-1 px-2">
                              <span className="p2">
                                Attachment link :{" "}
                                {item.attachments?.[0]?.url ? <Link href={item.attachments?.[0]?.url} target="_blank" className="!text-primary p2">
                                  {item.attachments?.[0]?.url || "No Attachment Link"}
                                </Link> :
                                  <span className="!text-primary p2">
                                    {item.attachments?.[0]?.url || "No Attachment Link"}
                                  </span>}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-start sm:gap-[30px] gap-[10px]">
                    <div className="overflow-hidden grid justify-items-center gap-[7px] flex-shrink-0">
                      <div className="w-6 h-6 border-2 border-primary bg-primary rounded-full flex items-center justify-center">
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
                      <div className="lg:h-[192px] md:h-[180px] sm:h-[162px] h-[262px] border border-blue-300 w-[2px]"></div>
                    </div>
                    <div className="w-full">
                      <div className="flex sm:items-center items-start justify-between sm:flex-row flex-col w-full mb-[6px] sm:gap-0 gap-1">
                        <span className="p2">
                          User:{" "}
                          <span className="!text-primary p2">
                            {authUser?.full_name || authUser?.username}
                          </span>
                        </span>

                        <div className="flex sm:items-center items-start sm:flex-row flex-col sm:gap-6 gap-1">
                          <span className="p2">
                            Date:{" "}
                            <span className="!text-primary p2">
                              {formattedDate}
                            </span>
                          </span>
                          <span className="p2">
                            Time:{" "}
                            <span className="!text-primary p2">
                              {" "}
                              {formattedTime}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div
                        className={`border ${errors?.length > 0 ? "border-red" : "border-primary/10"} divide-y divide-primary/10 rounded-[5px]`}
                      >
                        <Textarea
                          classNames={{
                            inputWrapper:
                              "w-full border-0 !shadow-none xl:py-3 py-2 xl:px-5 md:px-4 px-3 lg:!h-[120px] md:!h-[110px] !h-[100px] focus:outline-none !bg-white !overflow-auto",
                            base: "!bg-white",
                            input:
                              "xl:!text-base md:!text-[15px] !text-sm placeholder:!text-gray-300 !font-normal !overflow-hidden",
                            label:
                              "2xl:!text-base md:!text-[15px] !text-black !text-md",
                          }}
                          rows={8}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            setErrors("");
                          }}
                          value={message}
                          isInvalid={errors?.length > 0 ? true : false}
                          placeholder="Write about description..."
                          variant="bordered"
                        />
                        <div className="flex flex-col justify-between items-start w-full h-auto">
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-col items-start gap-[6px] w-full">
                              {/* Hidden File Input */}
                              <Input
                                ref={fileInputAuthorRef}
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <div className="flex sm:items-center items-start sm:flex-row flex-col justify-start w-full rounded sm:px-3 sm:py-[9px] p-2 !font-normal sm:gap-[18px] gap-2 outline-none">
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
                        </div>
                      </div>
                      {errors ? (
                        <ul>
                          <li className="2xl:text-sm text-red md:text-[13px] text-xs p-1">
                            {errors}
                          </li>
                        </ul>
                      ) : (
                        <div className="flex items-center gap-[5px] p-1">
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
                            Maximum 500 characters; no links or special symbols
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white lg:w-[10%] w-full flex lg:flex-col sm:flex-row flex-col sm:gap-0 gap-4 justify-between items-start">
                <div>
                  <h3 className="lg:mb-[47px] sm:mb-3 mb-2">Status</h3>
                  {checkStatus(data?.support_status)}
                </div>
                <div className="flex flex-col items-start lg:gap-4 sm:gap-2 gap-1 lg:mb-[55px]">
                  <Button
                    type="submit"
                    disabled={formSubmitLoading}
                    isLoading={formSubmitLoading}
                    className="!py-3 !px-[36px] btn btn-primary "
                  >
                    Send and Resolve
                  </Button>
                  <Button className="!py-3 !px-[36px] w-full btn btn-outline-primary opacity-100">
                    Close
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="py-[27px] min-h-[717px]">
      <h1
        className={`h2 ${authUser?.position === "author" ? "sm:absolute" : ""} mb-4`}
      >
        {title}
      </h1>
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
            <Tab
              key="author"
              title={
                <div className="flex items-center space-x-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_4913_1227)">
                      <path
                        d="M9.49913 10.3889C11.9537 10.3889 13.9436 8.39904 13.9436 5.94444C13.9436 3.48985 11.9537 1.5 9.49913 1.5C7.04453 1.5 5.05469 3.48985 5.05469 5.94444C5.05469 8.39904 7.04453 10.3889 9.49913 10.3889Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.6109 17.5C16.6109 15.614 15.8617 13.8053 14.5281 12.4717C13.1945 11.1381 11.3858 10.3889 9.49978 10.3889C7.6138 10.3889 5.80506 11.1381 4.47147 12.4717C3.13788 13.8053 2.38867 15.614 2.38867 17.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4913_1227">
                        <rect
                          width="18"
                          height="18"
                          fill="white"
                          transform="translate(0.5 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <span>Author</span>
                </div>
              }
              onClick={() => {
                setOpenTicket(null);
                setOpenTicketData(null);
              }}
              className="p-0"
            >
              <Card className="shadow-none px-0 overflow-hidden border border-gray-100">
                <CardBody className="p-0 ">
                  <div className="flex w-full flex-col">
                    <Tabs
                      aria-label="Options"
                      selectedKey={TabsSelected}
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
                        title={
                          <div className="flex items-center space-x-2">
                            {openTicket && openTicketData && (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.5 16.5L3 10L9.5 3.5M3.90278 10H17.0833"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}

                            <span>Check Ticket Status</span>
                          </div>
                        }
                        className="p-0"
                        onClick={() => {
                          setTabsSelected("checkTicketStatus");
                          setOpenTicket(null);
                          setOpenTicketData(null);
                        }}
                      >
                        {openTicket && openTicketData ? (
                          <ReplayForm data={openTicketData} status="Pending" />
                        ) : (
                          <div>
                            <form
                              ref={formRef}
                              className="grid items-end xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]"
                            >
                              <div>
                                <Input
                                  isRequired={false}
                                  name="id"
                                  classNames={{
                                    input:
                                      "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                    inputWrapper:
                                      "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                    label:
                                      "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                  }}
                                  defaultValue={filterData?.id || ""}
                                  onChange={handleInputChange}
                                  label="Ticket Number"
                                  labelPlacement="outside"
                                  placeholder="Enter ticket number"
                                  type="text"
                                  variant="bordered"
                                />
                              </div>
                              <div>
                                <Autocomplete
                                  name="product_name"
                                  className="!bg-white custom-auto-complete"
                                  classNames={{
                                    mainWrapper: "!bg-white",
                                    innerWrapper:
                                      "border !border-gray-100 !bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center",
                                    input:
                                      "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                                    inputWrapper: "!bg-transparent",
                                  }}
                                  label="Product Name"
                                  items={orderData}
                                  labelPlacement="outside"
                                  placeholder="Select product name"
                                  // selectedKey={filterData?.status || ""}
                                  onSelectionChange={handleProductChange}
                                >
                                  {(item) => (
                                    <AutocompleteItem
                                      key={item.title}
                                      value={item.title}
                                    >
                                      {item.title}
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                              </div>
                              <div>
                                <Autocomplete
                                  name="status"
                                  className="!bg-white custom-auto-complete"
                                  classNames={{
                                    mainWrapper: "!bg-white",
                                    innerWrapper:
                                      "border !border-gray-100 !bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center",
                                    input:
                                      "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                                    inputWrapper: "!bg-transparent",
                                  }}
                                  label="States"
                                  items={statuses}
                                  labelPlacement="outside"
                                  placeholder="Select State"
                                  // selectedKey={filterData?.status || ""}
                                  onSelectionChange={handleStatusChange}
                                >
                                  {(item) => (
                                    <AutocompleteItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                              </div>
                              <div className="relative">
                                <DatePicker
                                  name="ticket_date"
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
                                    filterData?.ticket_date
                                      ? parseDate(
                                        filterData.ticket_date
                                          .split("-")
                                          .reverse()
                                          .join("-")
                                      )
                                      : null
                                  }
                                  label="Date Purchased"
                                  labelPlacement="outside"
                                  onChange={(e) => {
                                    if (!e) return; // 💥 prevent crash if e is null

                                    const date = e.toDate(getLocalTimeZone());
                                    const day = String(date.getDate()).padStart(
                                      2,
                                      "0"
                                    );
                                    const month = String(
                                      date.getMonth() + 1
                                    ).padStart(2, "0");
                                    const year = date.getFullYear();

                                    const formattedDate = `${day}-${month}-${year}`;

                                    const data = {
                                      target: {
                                        name: "ticket_date",
                                        value: formattedDate,
                                      },
                                    };
                                    handleInputChange(data);
                                  }}
                                />
                              </div>
                            </form>

                            {filterData &&
                              Object.values(filterData).some(
                                (value) =>
                                  value !== null &&
                                  value !== "" &&
                                  value !== undefined
                              ) && (
                                <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap pt-[18px]">
                                  <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black">
                                    Applied Filters:
                                  </p>

                                  {Object.entries(filterData).map(
                                    ([key, value]) => {
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
                                            {key}:{" "}
                                            <span className="!text-black">
                                              {value}
                                            </span>
                                          </p>
                                          <button
                                            onClick={() => removeFilter(key)}
                                          >
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
                                    }
                                  )}

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

                            <Card className="shadow-none !max-w-full">
                              <CardBody className="sm:px-5 px-4 py-5">
                                {/* {loading && (
<div className="p-4">
<div className="overflow-x-auto rounded-lg border border-gray-100">
<table className="min-w-full divide-y divide-gray-100 bg-white text-sm">
<tbody className="divide-y divide-gray-100">
{[...Array(10)].map((_, idx) => (
<tr
key={idx}
className="hover:bg-gray-50"
>
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
)} */}
                                {filteredSupport ? (
                                  <DynamicTable
                                    // id={loading}
                                    data={filteredSupport}
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
                        )}
                      </Tab>
                      <Tab
                        key="RaiseANewTicket"
                        title="Raise a New ticket"
                        className="p-0"
                        onClick={() => {
                          setTabsSelected("RaiseANewTicket");

                          setOpenTicket(null);
                          setOpenTicketData(null);
                        }}
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
                                        <Autocomplete
                                          className={`!bg-white custom-auto-complete ${errors?.product?.length > 0 ? "custom-auto-complete-error" : ""}`}
                                          classNames={{
                                            mainWrapper: "!bg-white",
                                            innerWrapper: `!bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center ${errors?.product?.length > 0 ? "border !border-danger" : "border !border-gray-100"}`,
                                            input:
                                              "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                                            label:
                                              "2xl:!text-base md:!text-[15px] !text-black !text-md",
                                            inputWrapper:
                                              "!bg-white focus:!bg-white hover:!bg-white" +
                                                errors?.product?.length >
                                                0
                                                ? " !border-danger"
                                                : "",
                                          }}
                                          items={orderData}
                                          label="Product Name / Order Id / Product Id *"
                                          labelPlacement="outside"
                                          placeholder="Enter product name / order id / product id"
                                          onSelectionChange={(e) => {
                                            const result = extractLabelParts(e);
                                            handleSubmitFormData(
                                              result,
                                              "product"
                                            );
                                          }}
                                          isInvalid={
                                            errors?.product?.length > 0
                                              ? true
                                              : false
                                          }
                                          errorMessage={
                                            errors?.product && (
                                              <ul>
                                                <li className="2xl:text-sm md:text-[13px] text-xs">
                                                  {errors?.product}
                                                </li>
                                              </ul>
                                            )
                                          }
                                        >
                                          {(item) => (
                                            <AutocompleteItem
                                              key={item.label}
                                              value={item.label}
                                            >
                                              {item.label}
                                            </AutocompleteItem>
                                          )}
                                        </Autocomplete>
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
                                              "2xl:!text-base md:!text-[15px] !text-black !text-md",
                                            errorMessage: "!text-red",
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
                                          onChange={(e) => {
                                            const data = {
                                              message: e.target.value,
                                            };
                                            handleSubmitFormData(
                                              data,
                                              "message"
                                            );
                                          }}
                                          isInvalid={
                                            errors?.message?.length > 0
                                              ? true
                                              : false
                                          }
                                          errorMessage={
                                            errors?.message && (
                                              <ul>
                                                <li className="2xl:text-sm md:text-[13px] text-xs">
                                                  {errors?.message}
                                                </li>
                                              </ul>
                                            )
                                          }
                                          name="message"
                                          label="Message *"
                                          labelPlacement="outside"
                                          placeholder="Write message..."
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
                                              accept=".jpg,.jpeg,.png"
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
                                          disabled={formSubmitLoading}
                                          isLoading={formSubmitLoading}
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
                                        A. Use the support message box provided
                                        on your purchase detail page.
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
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key="client"
              title={
                <div className="flex items-center space-x-2">
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.03496 6.98018V4.14439C6.03496 2.57822 7.3623 1.30859 8.99965 1.30859C10.637 1.30859 11.9643 2.57822 11.9643 4.14439V6.98018M3.07026 5.08965H14.929L15.9173 17.3781H2.08203L3.07026 5.08965Z"
                      stroke="currentColor"
                      strokeWidth="1.54556"
                      strokeLinecap="round"
                    />
                  </svg>

                  <span>Client</span>
                </div>
              }
              onClick={() => {
                setOpenTicket(null);
                setOpenTicketData(null);
              }}
              className="p-0"
            >
              <Card className="shadow-none px-0 overflow-hidden border border-gray-100">
                <CardBody className="p-0 ">
                  <Tabs
                    aria-label="Options"
                    selectedKey={TabsSelected}
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
                      title={
                        <div className="flex items-center space-x-2">
                          {openTicket && openTicketData && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.5 16.5L3 10L9.5 3.5M3.90278 10H17.0833"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}

                          <span>Check Ticket Status</span>
                        </div>
                      }
                      className="p-0"
                      onClick={() => {
                        setTabsSelected("checkTicketStatus");
                        setOpenTicket(null);
                        setOpenTicketData(null);
                      }}
                    >
                      {openTicket && openTicketData ? (
                        <ReplayForm data={openTicketData} status="Authorized" />
                      ) : (
                        <div>
                          <form
                            ref={formRef}
                            className="grid items-end xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]"
                          >
                            <div>
                              <Input
                                isRequired={false}
                                name="id"
                                classNames={{
                                  input:
                                    "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                  inputWrapper:
                                    "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                  label:
                                    "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                                }}
                                defaultValue={filterData?.id || ""}
                                onChange={handleInputChange}
                                label="Ticket Number"
                                labelPlacement="outside"
                                placeholder="Enter ticket number"
                                type="text"
                                variant="bordered"
                              />
                            </div>
                            <div>
                              <Autocomplete
                                name="product_name"
                                className="!bg-white custom-auto-complete"
                                classNames={{
                                  mainWrapper: "!bg-white",
                                  innerWrapper:
                                    "border !border-gray-100 !bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center",
                                  input:
                                    "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                                  inputWrapper: "!bg-transparent",
                                }}
                                label="Product Name"
                                items={orderData}
                                labelPlacement="outside"
                                placeholder="Select product name"
                                // selectedKey={filterData?.status || ""}
                                onSelectionChange={handleProductChange}
                              >
                                {(item) => (
                                  <AutocompleteItem
                                    key={item.title}
                                    value={item.title}
                                  >
                                    {item.title}
                                  </AutocompleteItem>
                                )}
                              </Autocomplete>
                            </div>
                            <div>
                              <Autocomplete
                                name="status"
                                className="!bg-white custom-auto-complete"
                                classNames={{
                                  mainWrapper: "!bg-white",
                                  innerWrapper:
                                    "border !border-gray-100 !bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center",
                                  input:
                                    "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                                  inputWrapper: "!bg-transparent",
                                }}
                                label="States"
                                items={statuses}
                                labelPlacement="outside"
                                placeholder="Select State"
                                // selectedKey={filterData?.status || ""}
                                onSelectionChange={handleStatusChange}
                              >
                                {(item) => (
                                  <AutocompleteItem
                                    key={item.value}
                                    value={item.value}
                                  >
                                    {item.label}
                                  </AutocompleteItem>
                                )}
                              </Autocomplete>
                            </div>
                            <div className="relative">
                              <DatePicker
                                name="ticket_date"
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
                                  filterData?.ticket_date
                                    ? parseDate(
                                      filterData.ticket_date
                                        .split("-")
                                        .reverse()
                                        .join("-")
                                    )
                                    : null
                                }
                                label="Date Purchased"
                                labelPlacement="outside"
                                onChange={(e) => {
                                  if (!e) return; // 💥 prevent crash if e is null

                                  const date = e.toDate(getLocalTimeZone());
                                  const day = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  const month = String(
                                    date.getMonth() + 1
                                  ).padStart(2, "0");
                                  const year = date.getFullYear();

                                  const formattedDate = `${day}-${month}-${year}`;

                                  const data = {
                                    target: {
                                      name: "ticket_date",
                                      value: formattedDate,
                                    },
                                  };
                                  handleInputChange(data);
                                }}
                              />
                            </div>
                          </form>

                          {filterData &&
                            Object.values(filterData).some(
                              (value) =>
                                value !== null &&
                                value !== "" &&
                                value !== undefined
                            ) && (
                              <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap pt-[18px]">
                                <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black">
                                  Applied Filters:
                                </p>

                                {Object.entries(filterData).map(
                                  ([key, value]) => {
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
                                          {key}:{" "}
                                          <span className="!text-black">
                                            {value}
                                          </span>
                                        </p>
                                        <button
                                          onClick={() => removeFilter(key)}
                                        >
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
                                  }
                                )}

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

                          <Card className="shadow-none !max-w-full">
                            <CardBody className="sm:px-5 px-4 py-5">
                              {filteredSupportAuthor ? (
                                <DynamicTable
                                  // id={loading}
                                  data={filteredSupportAuthor}
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
                      )}
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        ) : (
          <Card className="shadow-none px-0 overflow-hidden border border-gray-100">
            <CardBody className="p-0 ">
              <div className="flex w-full flex-col">
                <Tabs
                  aria-label="Options"
                  selectedKey={TabsSelected}
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
                    title={
                      <div className="flex items-center space-x-2">
                        {openTicket && openTicketData && (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.5 16.5L3 10L9.5 3.5M3.90278 10H17.0833"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}

                        <span>Check Ticket Status</span>
                      </div>
                    }
                    className="p-0"
                    onClick={() => {
                      setTabsSelected("checkTicketStatus");
                      setOpenTicket(null);
                      setOpenTicketData(null);
                    }}
                  >
                    {openTicket && openTicketData ? (
                      <ReplayForm data={openTicketData} status="Pending" />
                    ) : (
                      <div>
                        <form
                          ref={formRef}
                          className="grid items-end xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]"
                        >
                          <div>
                            <Input
                              isRequired={false}
                              name="id"
                              classNames={{
                                input:
                                  "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                                inputWrapper:
                                  "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                                label:
                                  "2xl:text-base md:text-[15px] sm:text-sm !text-black block !pb-1 !font-normal",
                              }}
                              defaultValue={filterData?.id || ""}
                              onChange={handleInputChange}
                              label="Ticket Number"
                              labelPlacement="outside"
                              placeholder="Enter ticket number"
                              type="text"
                              variant="bordered"
                            />
                          </div>
                          <div>
                            <Autocomplete
                              name="product_name"
                              className="!bg-white custom-auto-complete"
                              classNames={{
                                mainWrapper: "!bg-white",
                                innerWrapper:
                                  "border !border-gray-100 !bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center",
                                input:
                                  "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                                inputWrapper: "!bg-transparent",
                              }}
                              label="Product Name"
                              items={orderData}
                              labelPlacement="outside"
                              placeholder="Select product name"
                              // selectedKey={filterData?.status || ""}
                              onSelectionChange={handleProductChange}
                            >
                              {(item) => (
                                <AutocompleteItem
                                  key={item.title}
                                  value={item.title}
                                >
                                  {item.title}
                                </AutocompleteItem>
                              )}
                            </Autocomplete>
                          </div>
                          <div>
                            <Autocomplete
                              name="status"
                              className="!bg-white custom-auto-complete"
                              classNames={{
                                mainWrapper: "!bg-white",
                                innerWrapper:
                                  "border !border-gray-100 !bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center",
                                input:
                                  "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                                inputWrapper: "!bg-transparent",
                              }}
                              label="States"
                              items={statuses}
                              labelPlacement="outside"
                              placeholder="Select State"
                              // selectedKey={filterData?.status || ""}
                              onSelectionChange={handleStatusChange}
                            >
                              {(item) => (
                                <AutocompleteItem
                                  key={item.value}
                                  value={item.value}
                                >
                                  {item.label}
                                </AutocompleteItem>
                              )}
                            </Autocomplete>
                          </div>
                          <div className="relative">
                            <DatePicker
                              name="ticket_date"
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
                                filterData?.ticket_date
                                  ? parseDate(
                                    filterData.ticket_date
                                      .split("-")
                                      .reverse()
                                      .join("-")
                                  )
                                  : null
                              }
                              label="Date Purchased"
                              labelPlacement="outside"
                              onChange={(e) => {
                                if (!e) return; // 💥 prevent crash if e is null

                                const date = e.toDate(getLocalTimeZone());
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                const month = String(
                                  date.getMonth() + 1
                                ).padStart(2, "0");
                                const year = date.getFullYear();

                                const formattedDate = `${day}-${month}-${year}`;

                                const data = {
                                  target: {
                                    name: "ticket_date",
                                    value: formattedDate,
                                  },
                                };
                                handleInputChange(data);
                              }}
                            />
                          </div>
                        </form>

                        {filterData &&
                          Object.values(filterData).some(
                            (value) =>
                              value !== null &&
                              value !== "" &&
                              value !== undefined
                          ) && (
                            <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap pt-[18px]">
                              <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black">
                                Applied Filters:
                              </p>

                              {Object.entries(filterData).map(
                                ([key, value]) => {
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
                                        {key}:{" "}
                                        <span className="!text-black">
                                          {value}
                                        </span>
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
                                }
                              )}

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

                        <Card className="shadow-none !max-w-full">
                          <CardBody className="sm:px-5 px-4 py-5">
                            {filteredSupport ? (
                              <DynamicTable
                                // id={loading}
                                data={filteredSupport}
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
                    )}
                  </Tab>
                  <Tab
                    key="RaiseANewTicket"
                    title="Raise a New ticket"
                    className="p-0"
                    onClick={() => {
                      setTabsSelected("RaiseANewTicket");

                      setOpenTicket(null);
                      setOpenTicketData(null);
                    }}
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
                                    <Autocomplete
                                      className={`!bg-white custom-auto-complete ${errors?.product?.length > 0 ? "custom-auto-complete-error" : ""}`}
                                      classNames={{
                                        mainWrapper: "!bg-white",
                                        innerWrapper: `!bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center ${errors?.product?.length > 0 ? "border !border-danger" : "border !border-gray-100"}`,
                                        input:
                                          "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                                        label:
                                          "2xl:!text-base md:!text-[15px] !text-black !text-md",
                                        inputWrapper:
                                          "!bg-white focus:!bg-white hover:!bg-white" +
                                            errors?.product?.length >
                                            0
                                            ? " !border-danger"
                                            : "",
                                      }}
                                      items={orderData}
                                      label="Product Name / Order Id / Product Id *"
                                      labelPlacement="outside"
                                      placeholder="Enter product name / order id / product id"
                                      onSelectionChange={(e) => {
                                        const result = extractLabelParts(e);
                                        handleSubmitFormData(result, "product");
                                      }}
                                      isInvalid={
                                        errors?.product?.length > 0
                                          ? true
                                          : false
                                      }
                                      errorMessage={
                                        errors?.product && (
                                          <ul>
                                            <li className="2xl:text-sm md:text-[13px] text-xs">
                                              {errors?.product}
                                            </li>
                                          </ul>
                                        )
                                      }
                                    >
                                      {(item) => (
                                        <AutocompleteItem
                                          key={item.label}
                                          value={item.label}
                                        >
                                          {item.label}
                                        </AutocompleteItem>
                                      )}
                                    </Autocomplete>
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
                                          "2xl:!text-base md:!text-[15px] !text-black !text-md",
                                        errorMessage: "!text-red",
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
                                            Maximum 500 characters; no links or
                                            special symbols
                                          </p>
                                        </div>
                                      }
                                      onChange={(e) => {
                                        const data = {
                                          message: e.target.value,
                                        };
                                        handleSubmitFormData(data, "message");
                                      }}
                                      isInvalid={
                                        errors?.message?.length > 0
                                          ? true
                                          : false
                                      }
                                      errorMessage={
                                        errors?.message && (
                                          <ul>
                                            <li className="2xl:text-sm md:text-[13px] text-xs">
                                              {errors?.message}
                                            </li>
                                          </ul>
                                        )
                                      }
                                      name="message"
                                      label="Message *"
                                      labelPlacement="outside"
                                      placeholder="Write message..."
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
                                          accept=".jpg,.jpeg,.png"
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
                                      disabled={formSubmitLoading}
                                      isLoading={formSubmitLoading}
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
                                Before reaching out, check our FAQ section — it
                                might save you time!
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
                                    templates require a separate description for
                                    each project.
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
                                    support center within the eligible timeframe
                                    stated in our refund policy.
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
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ticketSupportPage;