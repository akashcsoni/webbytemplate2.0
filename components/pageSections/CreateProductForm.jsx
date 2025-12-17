"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import {
  FormInput,
  FormTextArea,
  FormSingleFile,
  FormDropzone,
  FormMultiSelect,
  FormSelect,
  FormRadio,
  GroupSelect,
} from "@/comman/fields";
import {
  strapiDelete,
  strapiGet,
  strapiPost,
  strapiPut,
} from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

export default function ProductsPage({
  button,
  images,
  form,
  title,
  sub_title,
  params = {},
}) {
  const { authUser } = useAuth();
  const router = useRouter();
  const [formValues, setFormValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [defaultValueData, setDefaultValueData] = useState({});
  const [originalImageData, setOriginalImageData] = useState({}); // Track original images
  const [categoriesList, setCategoriesList] = useState([]);
  const [technologyList, setTechnologyList] = useState([]);
  const [existingProduct, setExistingProduct] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [showFiels, setShowFiels] = useState([]);
  const [dynamicCategoryFields, setDynamicCategoryFields] = useState([]);
  const [allSelectedChildren, setAllSelectedChildren] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalContent, setModalContent] = useState("");

  // 🔑 One function handles multiple field types
  const handleInfoClick = (fieldLabel) => {
    switch (fieldLabel) {
      case "Product Overview":
        setModalContent(
          "The Product Overview should be a short summary (1–2 sentences) highlighting the product’s key features and purpose."
        );
        break;

      case "Product Description / Detailed Description":
        setModalContent(
          "The Product Description should be detailed. Include specifications, use cases, dimensions, and other relevant details to help customers understand the product better."
        );
        break;

      default:
        setModalContent("No details available for this field.");
    }
    onOpen();
  };

  //   dynamicCategoryFields.map((f) => f.name)
  // );

  // Helper function to safely get image ID with better error handling
  const getImageId = (image) => {
    if (!image) return null;
    if (typeof image === "number" && image > 0) return image;
    if (typeof image === "object" && image !== null) {
      if (typeof image.id === "number" && image.id > 0) return image.id;
      if (typeof image.id === "string" && !isNaN(Number.parseInt(image.id))) {
        const id = Number.parseInt(image.id);
        return id > 0 ? id : null;
      }
    }
    return null;
  };

  // Helper function to safely get array of image IDs with better filtering
  const getImageIds = (images) => {
    if (!Array.isArray(images)) return [];
    return images
      .map((img) => getImageId(img))
      .filter((id) => id !== null && id !== undefined && id > 0);
  };

  // ✅ NEW: Helper function to format image data consistently
  const formatImageData = (imageItem) => {
    if (!imageItem) return null;

    // If it's already a properly formatted object with URL
    if (typeof imageItem === "object" && imageItem.url && imageItem.id) {
      return {
        id: imageItem.id,
        url: imageItem.url,
        name:
          imageItem.name ||
          imageItem.alternativeText ||
          `image-${imageItem.id}`,
      };
    }

    // If it's a Strapi media object with different structure
    if (typeof imageItem === "object" && imageItem.id) {
      const possibleUrl =
        imageItem.url ||
        imageItem.formats?.small?.url ||
        imageItem.formats?.thumbnail?.url ||
        imageItem.formats?.medium?.url ||
        imageItem.formats?.large?.url ||
        "";

      return {
        id: imageItem.id,
        url: possibleUrl,
        name:
          imageItem.name ||
          imageItem.alternativeText ||
          `image-${imageItem.id}`,
      };
    }

    // If it's just an ID, return minimal structure
    if (typeof imageItem === "number" && imageItem > 0) {
      return {
        id: imageItem,
        url: "",
        name: `image-${imageItem}`,
      };
    }

    return null;
  };

  // ✅ NEW: Helper function to format array of images
  const formatImageArray = (images) => {
    if (!Array.isArray(images)) return [];
    return images.map(formatImageData).filter(Boolean);
  };

  // ✅ NEW: Helper function to get dynamic field names
  const getDynamicFieldNames = () => {
    return dynamicCategoryFields.map((field) => field.name);
  };

  // ✅ NEW: Helper function to preserve dynamic field data
  const preserveDynamicFieldData = (currentFormValues, currentDefaultData) => {
    const dynamicFieldNames = getDynamicFieldNames();
    const preservedData = {};

    dynamicFieldNames.forEach((fieldName) => {
      if (currentFormValues[fieldName] !== undefined) {
        preservedData[fieldName] = currentFormValues[fieldName];
      } else if (currentDefaultData[fieldName] !== undefined) {
        preservedData[fieldName] = currentDefaultData[fieldName];
      }
    });

    return preservedData;
  };

  const globalValidator = (field) => {
    const validators = {
      required: () => ({
        validate: (value) => {
          const isEmpty =
            value === undefined ||
            value === null ||
            value === "" ||
            (typeof value === "object" &&
              value !== null &&
              "length" in value &&
              value.length === 0);
          return !isEmpty;
        },
        message: field.validation.required,
      }),
      url: () => ({
        validate: (value) => {
          if (!value) return true;
          const urlRegex =
            /^(https?:\/\/)?([^\s@]+)\.([^\s@]{2,})(\/[^\s@]*)?$/i;
          return urlRegex.test(value);
        },
        message: field.validation.url,
      }),
      editModeRequired: () => ({
        validate: (value) => {
          const hasDefaultValue =
            defaultValueData[field.name] !== undefined &&
            defaultValueData[field.name] !== null &&
            (Array.isArray(defaultValueData[field.name])
              ? defaultValueData[field.name].length > 0
              : true);

          const isEmpty =
            value === undefined ||
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "object" &&
              value !== null &&
              "length" in value &&
              value.length === 0);

          if (hasDefaultValue && isEmpty) {
            return false;
          }

          if (!hasDefaultValue && isEmpty) {
            return false;
          }

          return true;
        },
        message: field.validation.required,
      }),
    };

    const fieldValidators = {};
    if (field.rules) {
      field.rules.forEach((rule) => {
        if (validators[rule]) {
          fieldValidators[rule] = validators[rule]();
        }
      });
    }
    return fieldValidators;
  };

  const validateSingleField = (fieldName, fieldValue) => {
    const allFields = [
      ...getFieldDefinitions(),
      ...getImageFields(),
      ...dynamicCategoryFields,
    ];

    const field = allFields.find((f) => f.name === fieldName);
    if (!field) return null;

    const validators = globalValidator(field);

    for (const validatorName in validators) {
      const { validate, message } = validators[validatorName];
      if (!validate(fieldValue)) {
        return [message];
      }
    }

    return null;
  };

  const getOptionsList = async () => {
    const categoriesData = await strapiGet(`categories`, {
      params: {
        populate: "*",
        "pagination[pageSize]": 1000,
      },
      token: themeConfig.TOKEN,
    });

    const tagData = await strapiGet(`tags`, {
      params: { populate: "*", "pagination[pageSize]": 1000 },
      token: themeConfig.TOKEN,
    });

    if (categoriesData?.data && tagData?.data) {
      setCategoriesList(categoriesData?.data);
      setTagList(tagData?.data);
    }
  };

  const validateFields = () => {
    let isValid = true;
    const errors = {};
    const rules = {};

    const allFields = [
      ...getFieldDefinitions(),
      ...getImageFields(),
      ...dynamicCategoryFields,
    ];

    allFields.forEach((field_data) => {
      rules[field_data.name] = globalValidator(field_data);
    });

    allFields.forEach((field_data) => {
      const fieldValue = formValues[field_data.name];
      if (field_data.name in rules) {
        const validators = rules[field_data.name];
        for (const validatorName in validators) {
          const { validate, message } = validators[validatorName];
          if (!validate(fieldValue)) {
            if (!errors[field_data.name]) {
              errors[field_data.name] = [];
            }
            errors[field_data.name].push(message);
            isValid = false;
          }
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const save_product_details = async (event) => {
    event.preventDefault();
    setLoading(true);
    setHasSubmitted(true);

    const isValid = validateFields();
    if (!isValid) {
      setLoading(false);
      return;
    }

    function generateSlug(title) {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const {
      title,
      description,
      grid_image,
      existing_product,
      price,
      overview,
    } = formValues;
    const slug = generateSlug(title);
    let optionIds = [];

    if (allSelectedChildren?.length) {
      try {
        const optionRes = await strapiGet("options", {
          params: {
            filters: {
              documentId: {
                $in: allSelectedChildren,
              },
            },
            fields: ["id"],
            pagination: { pageSize: 1000 },
          },
          token: themeConfig.TOKEN,
        });
        optionIds = optionRes?.data?.map((opt) => opt.id) || [];
      } catch (err) {
        console.error("Failed to fetch options:", err);
        toast.error("Failed to fetch selected options.");
        setLoading(false);
        return;
      }
    }

    const dynamicFieldValues = {};
    dynamicCategoryFields.forEach((field) => {
      if (formValues[field.name]) {
        dynamicFieldValues[field.name] = formValues[field.name];
      }
    });

    function removeHtmlAttributes(html) {
      // Replace all attributes inside HTML tags
      return html.replace(/<(\w+)(\s+[^>]+)>/g, "<$1>");
    }

    const data = {
      ...formValues,
      title,
      slug,
      description,
      // overview, // ✅ Added this line
      overview_description: removeHtmlAttributes(overview), // ✅ Map frontend field to backend field name
      grid_image,
      author: authUser?.documentId,
      all: existing_product,
      sub_title: title,
      seo_meta: {
        title,
        description,
        image: grid_image,
      },
      price: {
        regular_price: Number(price) + 10,
        sales_price: Number(price),
      },
      publishedAt: null,
      options: optionIds,
      ...dynamicFieldValues,
    };

    try {
      let response = {};
      const { id } = (await params) || {};

      if (id) {

        // Get current image IDs from formValues (most up-to-date)
        const currentGridImageId = getImageId(formValues.grid_image);
        const currentGalleryIds = getImageIds(formValues.gallery_image);

        // Get original image IDs from when the form was loaded
        const originalGridImageId = getImageId(originalImageData?.grid_image);
        const originalGalleryIds = getImageIds(
          originalImageData?.gallery_image
        );

        //   originalGrid: originalGridImageId,
        //   currentGallery: currentGalleryIds,
        //   originalGallery: originalGalleryIds,
        // });

        // Handle grid_image deletion - only delete if there was an original and it's different
        if (
          originalGridImageId &&
          originalGridImageId !== currentGridImageId &&
          originalGridImageId > 0
        ) {
          try {
            await strapiDelete(
              `upload/files/${originalGridImageId}`,
              themeConfig.TOKEN
            );
          } catch (deleteError) {
            console.error("Error deleting grid image:", deleteError);
          }
        }

        // Handle gallery_image deletion - only delete images that were removed
        const imagesToDelete = originalGalleryIds.filter(
          (originalId) =>
            originalId > 0 && !currentGalleryIds.includes(originalId)
        );


        // Delete removed images
        for (const imageIdToDelete of imagesToDelete) {
          if (imageIdToDelete > 0) {
            try {
              await strapiDelete(
                `upload/files/${imageIdToDelete}`,
                themeConfig.TOKEN
              );
            } catch (deleteError) {
              console.error("Error deleting gallery image:", deleteError);
            }
          }
        }

        response = await strapiPut(
          "products/" + defaultValueData.id,
          data,
          themeConfig.TOKEN
        );
      } else {
        response = await strapiPost("products", data, themeConfig.TOKEN);
      }

      if (response?.data?.documentId) {
        toast.success(response.message || "Product saved successfully!");

        // ✅ CRITICAL FIX: Preserve dynamic field data before updating
        const preservedDynamicData = preserveDynamicFieldData(
          formValues,
          defaultValueData
        );

        // ✅ CRITICAL FIX: Only update defaultValueData and preserve current formValues
        try {
          const updatedProductData = await strapiGet(
            `products/${response.data.documentId}`,
            {
              params: { populate: "*" },
              token: themeConfig.TOKEN,
            }
          );

          if (updatedProductData?.data) {
            //   updatedProductData.data
            // );

            // Format the fresh data properly for defaultValueData (reference only)
            const freshFormattedData = {
              ...updatedProductData.data,
              categories: extractIds(updatedProductData.data?.categories)?.[0],
              tags: extractIds(updatedProductData.data?.tags),
              topics: extractIds(updatedProductData.data?.topics),
              file_format: extractIds(updatedProductData.data?.file_format),
              compatible_with: extractIds(
                updatedProductData.data?.compatible_with
              ),
              technology:
                updatedProductData.data?.all_technology?.technology?.documentId,
              existing_product: extractIds(
                updatedProductData.data?.all_technology?.products
              ),
              overview: updatedProductData.data?.overview_description || "",
              price: updatedProductData.data?.price?.sales_price,
              // ✅ CRITICAL: Properly format image data with URLs
              grid_image: formatImageData(updatedProductData.data?.grid_image),
              gallery_image: formatImageArray(
                updatedProductData.data?.gallery_image
              ),
              // ✅ CRITICAL: Preserve dynamic field data
              ...preservedDynamicData,
            };

            //   freshFormattedData
            // );

            // ✅ CRITICAL FIX: Update defaultValueData with preserved dynamic data
            setDefaultValueData(freshFormattedData);

            // ✅ CRITICAL FIX: Only update formValues for image fields, preserve everything else
            setFormValues((prevFormValues) => ({
              ...prevFormValues, // Keep all existing form values including dynamic fields
              // Only update image fields with proper URLs from server
              grid_image: freshFormattedData.grid_image,
              gallery_image: freshFormattedData.gallery_image,
            }));

            // Update original image data for future comparisons
            setOriginalImageData({
              grid_image: updatedProductData.data?.grid_image,
              gallery_image: updatedProductData.data?.gallery_image,
            });
          }
        } catch (fetchError) {
          console.error("Failed to fetch updated product data:", fetchError);
          // Fallback: preserve dynamic data and update images
          const preservedData = preserveDynamicFieldData(
            formValues,
            defaultValueData
          );
          setDefaultValueData((prevDefault) => ({
            ...prevDefault,
            ...formValues,
            ...preservedData,
            grid_image: formatImageData(formValues.grid_image),
            gallery_image: formatImageArray(formValues.gallery_image),
          }));
        }

        if (!id) {
          const documentId = authUser?.documentId || authUser?.id;
          router.push(
            `/user/${documentId}/products/edit/${response?.data?.documentId}`
          );
        }
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Product save failed:", error);
      toast.error(
        error?.response?.data?.error?.message ||
          "An error occurred while saving the product."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = async (name, value) => {

    const updatedFormValues = {
      ...formValues,
      [name]: value,
    };
    setFormValues(updatedFormValues);

    // Clear validation errors immediately for the changed field
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }

    // Validate field if form has been submitted
    if (hasSubmitted) {
      const fieldError = validateSingleField(name, value);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
    }

    if (name === "product_zip_select") {
      setShowFiels([value]);
    }

    // Handle dynamic category fields
    const combinedSelectedChildren = Object.entries(updatedFormValues)
      .filter(([key]) =>
        dynamicCategoryFields.some((field) => field.name === key)
      )
      .flatMap(([, values]) => values || []);
    setAllSelectedChildren(combinedSelectedChildren);
  };

  const getFieldDefinitions = () => [
    {
      position: 1,
      name: "title",
      label: "Product Title",
      placeholder: "Enter product title",
      type: "text",
      html: "input",
      description: "Maximum 50 characters; no special symbols",
      validation: { required: "Title is required" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 2,
      name: "short_title",
      label: "Short Name",
      placeholder: "Enter product short name",
      type: "text",
      html: "input",
      description: "Maximum 50 characters; no special symbols",
      validation: { required: "Short name is required" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 3,
      name: "description",
      label: "Product Description / Detailed Description",
      placeholder: "Enter product description",
      type: "textarea",
      html: "textarea",
      description: "Provide a detailed description of the product",
      validation: { required: "Description is required" },
      rules: ["required"],
      className: "mb-5",
      infoVisible: true,
    },

    // this is for product overview

    {
      position: 3,
      name: "overview",
      label: "Product Overview",
      placeholder: "Enter product overview",
      type: "textarea",
      html: "textarea",
      description: "Provide a detailed overview of the product",
      validation: { required: "Overview is required" },
      rules: ["required"],
      className: "mb-5",
      infoVisible: true,
    },

    {
      position: 4,
      name: "preview_link",
      label: "Live Demo Link",
      placeholder: "Enter preview link",
      type: "url",
      html: "input",
      description: "Must be a valid URL (e.g., https://example.com)",
      validation: {
        required: "Preview link is required",
        url: "URL is invalid",
      },
      rules: ["required", "url"],
      className: "mb-5",
    },
    {
      position: 5,
      name: "categories",
      label: "Product Category",
      placeholder: "Select categories",
      type: "select",
      html: "select",
      options: categoriesList,
      startContent: true,
      description: "Choose one relevant category",
      validation: { required: "Category is required" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 5,
      name: "technology",
      label: "Product Technology",
      placeholder: "Select technology",
      type: "select",
      html: "select",
      options: technologyList,
      startContent: true,
      description: "Choose one relevant Technology",
      validation: { required: "Technology is required" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 4,
      name: "product_zip_select",
      label: "Select your file preview",
      type: "radio",
      html: "radio",
      validation: {
        required: "Select correct option for product zip",
      },
      options: [
        {
          label: "Product Zip File",
          value: "product_zip",
          description:
            "You can upload a zip file containing your product data, which will be processed and stored securely.",
        },
        {
          label: "Product Zip URL",
          value: "product_zip_url",
          description:
            "You can provide a URL to a zip file containing your product data, which will be fetched and processed.",
        },
      ],
      rules: isEditMode ? [] : ["required"],
      className: "mb-5",
    },
    {
      position: 6,
      name: "product_zip",
      label: "Upload Product Zip",
      placeholder: "Upload .zip file",
      type: "file",
      html: "upload",
      fileType: "zip",
      description: "Zip file containing the product assets",
      validation: { required: "Product zip is required" },
      rules:
        showFiels.includes("product_zip") && !isEditMode ? ["required"] : [],
      className: "mb-5",
    },
    {
      position: 7,
      name: "product_zip_url",
      label: "Upload Product Zip URL",
      placeholder: "Enter product zip URL",
      type: "url",
      html: "input",
      description: "Alternative URL to access product zip",
      validation: {
        required: "Product zip url is required",
        url: "Product zip url is invalid",
      },
      rules:
        showFiels.includes("product_zip_url") && !isEditMode
          ? ["required", "url"]
          : showFiels.includes("product_zip_url")
            ? ["url"]
            : [],
      className: "mb-5",
    },
    {
      position: 5,
      name: "existing_product",
      label: "Link to an Existing Product",
      placeholder: "Select correct existing product",
      type: "multiselect",
      html: "multiselect",
      options: existingProduct,
      startContent: true,
      description: "Choose one existing product",
      validation: { required: "" },
      rules: [],
      className: "mb-5",
    },
    {
      position: 9,
      name: "tags",
      label: "Tags",
      placeholder: "Enter tags",
      type: "multiselect",
      html: "multiselect",
      options: tagList,
      description: "Comma-separated tags to describe product",
      validation: { required: "Tags are required" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 20,
      name: "topics",
      label: "Topics",
      placeholder: "Enter topics",
      type: "groupselect",
      html: "groupselect",
      options: topicsData,
      description: "Comma-separated grouptable to describe product",
      validation: { required: "Topics are required" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 4,
      name: "sell_exclusivity",
      label: "Sell Exclusivity",
      type: "radio",
      html: "radio",
      description: "Select one option only",
      validation: {
        required: "Select correct option for sell exclusivity",
      },
      options: [
        {
          label: "I will sell this product exclusively on WebbyTemplate.",
          value: true,
        },
        {
          label:
            "I will sell my product on WebbyTemplate and other marketplaces.",
          value: false,
        },
      ],
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 10,
      name: "price",
      label: "Price",
      placeholder: "Enter price",
      type: "number",
      html: "input",
      description: "Numeric value for the product price",
      validation: { required: "Price is required" },
      rules: ["required"],
      className: "mb-5",
    },
  ];

  const getImageFields = () => [
    {
      position: 1,
      name: "grid_image",
      label: "Grid Image",
      placeholder: "Upload grid image",
      type: "file",
      html: "dropzone",
      multiple: false,
      description: "Minimum resolution: 271x345px; max file size: 2MB",
      support: "JPG or PNG",
      validation: { required: "Grid image is required" },
      rules: isEditMode ? ["editModeRequired"] : ["required"],
    },
    {
      position: 2,
      name: "gallery_image",
      label: "Gallery Images",
      placeholder: "Upload gallery images",
      type: "file",
      html: "dropzone",
      multiple: true,
      description:
        "Minimum resolution: 440x560px or 868x554px; max file size: 2MB/per image",
      support: "JPG, PNG, or GIF",
      validation: { required: "Gallery images are required" },
      rules: isEditMode ? ["editModeRequired"] : ["required"],
    },
  ];

  const getFields = (data) => {
    if (
      ["product_zip", "product_zip_url"].includes(data.name) &&
      !showFiels.includes(data.name)
    ) {
      return null;
    }

    switch (data.html) {
      case "input":
        return (
          <FormInput
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={
              data.name === "product_zip_url" && isEditMode
                ? undefined
                : defaultValueData[data.name]
            }
          />
        );
      case "textarea":
        return (
          <FormTextArea
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
            infoButton={
              data?.infoVisible === true && (
                <button
                  type="button"
                  onClick={() => handleInfoClick(data.label)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Info size={18} />
                </button>
              )
            }
          />
        );
      case "upload":
        return (
          <FormSingleFile
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={
              data.name === "product_zip" && isEditMode
                ? undefined
                : defaultValueData[data.name]
            }
          />
        );
      case "radio":
        return (
          <FormRadio
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={
              data.name === "product_zip_select" && isEditMode
                ? undefined
                : defaultValueData[data.name]
            }
          />
        );
      case "multiselect":
        return (
          <FormMultiSelect
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
          />
        );
      case "select":
        return (
          <FormSelect
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
          />
        );
      case "dropzone":
        return (
          <FormDropzone
            key={`${data.name}-${JSON.stringify(defaultValueData[data.name])}`} // Force re-render when data changes
            type={isEditMode ? "edit" : "add"}
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
          />
        );
      case "groupselect":
        return (
          <GroupSelect
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
          />
        );
      default:
        break;
    }
  };

  useEffect(() => {
    if (formValues.categories && !isEditMode) {
      getFormatAndCompatibleList(formValues.categories);
    }
  }, [formValues.categories, isEditMode]);

  useEffect(() => {
    if (authUser?.documentId || formValues.short_title) {
      getProductList(authUser?.documentId, formValues.short_title);
    }
  }, [formValues.short_title]);

  useEffect(() => {
    getOptionsList();
    const init = async () => {
      const { id } = (await params) || {};
      setIsEditMode(!!id);
      if (id) {
        await getProductData(id);
      }
    };
    init();
  }, [params, authUser]);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      setValidationErrors({});
      setFormValues({});
      setDefaultValueData({});
      setOriginalImageData({});
    };
  }, []);

  const extractIds = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => item.documentId);
  };

  const getFormatAndCompatibleList = async (id, existingProductData = null) => {
    try {
      const technologyData = await strapiGet(`technologies`, {
        params: { populate: "*", "pagination[pageSize]": 1000 },
        token: themeConfig.TOKEN,
      });

      if (technologyData.data) {
        setTechnologyList(technologyData.data || []);
      }

      const topicsData = await strapiGet(`category-topics/${id}`, {
        // params: { "pagination[pageSize]": 1000 },
        token: themeConfig.TOKEN,
      });
      if (topicsData?.topics) {
        setTopicsData(topicsData?.topics);
      }

      const categoryOptionsData = await strapiGet(`category-options/${id}`, {
        token: themeConfig.TOKEN,
      });

      if (categoryOptionsData?.options) {
        const dynamicFields = categoryOptionsData.options.map((option) => {
          const childOptions = (option.childs || []).map((child) => {
            return {
              ...child,
              label: child.title,
              value: child.documentId,
            };
          });

          return {
            position: 100,
            name: option.slug || `option_${option.documentId}`,
            label: option.title,
            placeholder: `Select ${option.title}`,
            type: "multiselect",
            html: "multiselect",
            options: childOptions,
            description: `Choose appropriate ${option.title}`,
            validation: { required: `${option.title} is required` },
            rules: ["required"],
            className: "mb-5",
          };
        });

        setDynamicCategoryFields(dynamicFields);

        if (isEditMode && existingProductData) {
          const dynamicFieldValues = {};
          const selectedOptionIds =
            existingProductData.options?.map((opt) => opt.documentId) || [];

          dynamicFields.forEach((field) => {
            const fieldSelectedOptions = [];
            field.options.forEach((option) => {
              if (selectedOptionIds.includes(option.documentId)) {
                fieldSelectedOptions.push(option.documentId);
              }
            });
            if (fieldSelectedOptions.length > 0) {
              dynamicFieldValues[field.name] = fieldSelectedOptions;
            }
          });

          setFormValues((prevValues) => ({
            ...prevValues,
            ...dynamicFieldValues,
          }));

          setDefaultValueData((prevData) => ({
            ...prevData,
            ...dynamicFieldValues,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      toast.error("Failed to load product data.");
    }
  };

  useEffect(() => {
    let categoryId = null;
    if (typeof defaultValueData?.categories === "string") {
      categoryId = defaultValueData.categories;
    } else if (Array.isArray(defaultValueData?.categories)) {
      categoryId = defaultValueData.categories?.[0]?.documentId;
    } else if (typeof defaultValueData?.categories === "object") {
      categoryId = defaultValueData.categories?.documentId;
    }

    if (categoryId) {
      getFormatAndCompatibleList(
        categoryId,
        isEditMode ? defaultValueData : null
      );
    }
  }, [defaultValueData.categories, isEditMode]);

  const getProductList = async (id, short_title) => {
    try {
      const payload = {
        search: short_title,
      };
      const productData = await strapiPost(`author-product/${id}`, {
        params: { populate: "*" },
        ...payload,
        token: themeConfig.TOKEN,
      });
      if (productData?.data) {
        setExistingProduct(productData.data);
      }
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      toast.error("Failed to load product data.");
    }
  };

  const getProductData = async (id) => {
    try {
      const productData = await strapiGet(`products/${id}`, {
        params: { populate: "*" },
        token: themeConfig.TOKEN,
      });
      if (productData?.data) {

        const firstVendorProduct = productData.data?.vendor_given_products?.[0];
        const processedVendorProducts =
          productData.data?.vendor_given_products?.map((item) => {
            if (item.zip) {
              return {
                ...item,
                type: "zip",
                value: item.zip,
              };
            } else if (item.url) {
              return {
                ...item,
                type: "url",
                value: item.url,
              };
            }
            return item;
          }) || [];

        function removeHtmlAttributes(html) {
          // Replace all attributes inside HTML tags
          return html.replace(/<(\w+)(\s+[^>]+)>/g, "<$1>");
        }

        // ✅ CRITICAL FIX: Properly format image data with URLs
        const finalDefaultValueData = {
          ...productData.data,
          categories: extractIds(productData.data?.categories)?.[0],
          tags: extractIds(productData.data?.tags),
          topics: extractIds(productData.data?.topics),
          file_format: extractIds(productData.data?.file_format),
          compatible_with: extractIds(productData.data?.compatible_with),
          technology: productData.data?.all_technology?.technology?.documentId,
          existing_product: extractIds(
            productData.data?.all_technology?.products
          ),
          price: productData.data?.price?.sales_price,
          vendor_given_products: processedVendorProducts,
          overview: productData.data?.overview_description || "",
          overview_description: removeHtmlAttributes(
            productData.data?.overview_description || ""
          ),
          // ✅ CRITICAL: Format images properly with URLs
          grid_image: formatImageData(productData.data?.grid_image),
          gallery_image: formatImageArray(productData.data?.gallery_image),
        };

        // Store original image data for comparison during updates
        setOriginalImageData({
          grid_image: productData.data?.grid_image,
          gallery_image: productData.data?.gallery_image,
        });

        //   finalDefaultValueData.gallery_image
        // );

        setDefaultValueData(finalDefaultValueData);
        setFormValues(finalDefaultValueData);
      }
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      toast.error("Failed to load product data.");
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between w-full">
          <h1 className="h2 py-[30px]">{title}</h1>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-4 md:flex-row flex-col items-start justify-between">
            {form && (
              <div className="xl:w-2/3 md:w-[60%] w-full bg-white border-primary/10 border rounded-md overflow-hidden">
                <div className="border-b border-primary/10 bg-white">
                  <p className="text-black py-[6px] px-5">{sub_title}</p>
                </div>
                <form
                  className="pt-4 pb-9 px-5"
                  id="product_details_form"
                  onSubmit={save_product_details}
                >
                  <div className="flex flex-col">
                    {getFieldDefinitions()?.map((data, index) => {
                      return (
                        getFields(data) && (
                          <div key={index} className={data.className}>
                            {getFields(data)}
                          </div>
                        )
                      );
                    })}

                    {isEditMode && defaultValueData?.product_zip_url && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (defaultValueData?.product_zip_url) {
                            window.open(
                              defaultValueData.product_zip_url,
                              "_blank"
                            );
                          }
                        }}
                        className="group btn btn-secondary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto mb-3"
                      >
                        Download Existing Zip
                      </Button>
                    )}
                    {dynamicCategoryFields?.map((data) => {
                      return (
                        getFields(data) && (
                          <div
                            key={`dynamic-${data.name}`}
                            className={data.className}
                          >
                            {getFields(data)}
                          </div>
                        )
                      );
                    })}
                  </div>
                  {button && (
                    <Button
                      disabled={loading}
                      type="submit"
                      startContent={
                        loading && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 50 50"
                            fill="none"
                          >
                            <circle cx="40" cy="25" r="3" fill="currentColor">
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="37.99038105676658"
                              cy="32.5"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.1s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="32.5"
                              cy="37.99038105676658"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.2s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle cx="25" cy="40" r="3" fill="currentColor">
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.30000000000000004s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="17.500000000000004"
                              cy="37.99038105676658"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.4s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="12.00961894323342"
                              cy="32.5"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.5s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="10"
                              cy="25.000000000000004"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.6000000000000001s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="12.009618943233418"
                              cy="17.500000000000004"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.7000000000000001s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="17.499999999999993"
                              cy="12.009618943233423"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.8s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="24.999999999999996"
                              cy="10"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="0.9s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="32.5"
                              cy="12.009618943233422"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="1s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx="37.99038105676658"
                              cy="17.499999999999993"
                              r="3"
                              fill="currentColor"
                            >
                              <animate
                                attributeName="opacity"
                                values="1;0.2;1"
                                dur="1.2s"
                                begin="1.1s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </svg>
                        )
                      }
                      className="group btn btn-primary flex items-center justify-center gap-[10px] w-[220px] xl:!py-[11px] py-[10px] h-auto sm:mt-7 mt-5"
                    >
                      {button?.label}
                    </Button>
                  )}
                </form>
              </div>
            )}
            {images && (
              <div className="border border-primary/10 rounded-md overflow-hidden bg-white xl:w-1/3 md:w-[40%] w-full">
                <div className="border-b border-primary/10">
                  <p className="text-black py-[6px] px-5">{sub_title}</p>
                </div>
                {getImageFields()?.map((data, index) => {
                  return <div key={index}>{getFields(data)}</div>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="font-semibold">Field Information</ModalHeader>
          <ModalBody>{modalContent}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
