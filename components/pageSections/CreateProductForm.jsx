"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import {
  FormInput,
  FormTextArea,
  FormSingleFile,
  FormDropzone,
  FormMultiSelect,
  FormSelect,
  FormRadio,
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
  const [paramsData, setParamsData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [defaultValueData, setDefaultValueData] = useState({});
  const [categoriesList, setCategoriesList] = useState([]);
  const [technologyList, setTechnologyList] = useState([]);
  const [fileFormat, setFileFormat] = useState([]);
  const [compatibleWith, setCompatibleWith] = useState([]);
  const [existingProduct, setExistingProduct] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [showFiels, setShowFiels] = useState([]);

  const globalValidator = (field) => {
    // Define validator functions
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
          if (!value) return true; // Allow empty (use 'required' to enforce presence)
          const urlRegex =
            /^(https?:\/\/)?([^\s@]+)\.([^\s@]{2,})(\/[^\s@]*)?$/i;
          return urlRegex.test(value);
        },
        message: field.validation.url,
      }),
    };

    // Create field validators object
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

  const getOptionsList = async () => {
    const categoriesData = await strapiGet(`categories`, {
      params: { populate: "*" },
      token: themeConfig.TOKEN,
    });

    const tagData = await strapiGet(`tags`, {
      params: { populate: "*" },
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

    // Dynamically create validation rules
    field.forEach((field_data) => {
      rules[field_data.name] = globalValidator(field_data);
    });

    // Add image field validation rules
    image_field.forEach((field_data) => {
      rules[field_data.name] = globalValidator(field_data);
    });

    // Iterate through field groups and validate each field
    field.forEach((field_data) => {
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

    // Validate image fields
    image_field.forEach((field_data) => {
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

    const { title, description, grid_image, existing_product, price } =
      formValues;
    const slug = generateSlug(title);

    let data = {
      ...formValues,
      title,
      slug,
      description,
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
    };

    try {
      let response = {};
      const { id } = (await params) || {};
      if (id) {
        if (
          defaultValueData?.grid_image !== null &&
          defaultValueData?.grid_image?.id !== grid_image
        ) {
          await strapiDelete(
            `upload/files/${defaultValueData?.grid_image?.id}`,
            themeConfig.TOKEN
          );
        }

        const removedImages = defaultValueData?.gallery_image.filter(
          (img) => !formValues.gallery_image.includes(img.id)
        );

        for (const imgId of removedImages) {
          await strapiDelete(`upload/files/${imgId.id}`, themeConfig.TOKEN);
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
        toast.success(response.message);
        if (!id) {
          router.push(
            `/user/${authUser?.username}/products/edit/${response?.data?.documentId}`
          );
        }
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Product creation failed:", error);
      toast.error(
        error?.response?.data?.error?.message ||
        "An error occurred while creating the product."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = async (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (name === "product_zip_select") {
      setShowFiels([value]);
    }
  };

  const field = [
    {
      position: 1,
      name: "title",
      label: "Product Title",
      placeholder: "Enter product title",
      type: "text",
      html: "input",
      description: "Maximum 50 characters; no special symbols",
      validation: { required: "Title is require" },
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
      validation: { required: "Short name is require" },
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
      validation: { required: "Description is require" },
      rules: ["required"],
      className: "mb-5",
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
        required: "Preview link is require",
        url: "URL is unvalid",
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
      description: "Choose one relevant categories",
      validation: { required: "Categories is require" },
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
      validation: { required: "Technology is require" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 4,
      name: "product_zip_select",
      label: "Select your file preview ",
      type: "radio",
      html: "radio",
      validation: {
        required: "Select Correct Option for product zip",
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
      rules: ["required"],
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
      validation: { required: "Product zip is require" },
      rules: showFiels.includes("product_zip") ? ["required"] : [],
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
        required: "Product zip url is require",
        url: "Product zip url is unvalid",
      },
      rules: showFiels.includes("product_zip_url") ? ["required", "url"] : [],
      className: "mb-5",
    },
    {
      position: 5,
      name: "file_format",
      label: "File Format",
      placeholder: "Select correct format",
      type: "multiselect",
      html: "multiselect",
      options: fileFormat,
      startContent: true,
      description: "Choose one format for the product",
      validation: { required: "File format is require" },
      rules: ["required"],
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
      validation: { required: "Existing Product is require" },
      rules: ["required"],
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
      validation: { required: "Tags is require" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 8,
      name: "compatible_with",
      label: "Compatible With",
      placeholder: "Enter compatible With",
      type: "multiselect",
      html: "multiselect",
      options: compatibleWith,
      description: "Brief compatible With for the product",
      validation: { required: "Compatible With is require" },
      rules: ["required"],
      className: "mb-5",
    },
    {
      position: 4,
      name: "sell_exclusivity",
      label: "Sell Exclusivity.",
      type: "radio",
      html: "radio",
      description: "Select one option only",
      validation: {
        required: "Select Correct Option for sell",
      },
      options: [
        {
          label: "I will sell this products exclusively on WebbyTemplate.",
          value: true,
        },
        {
          label:
            "I will sell my products on WebbyTemplate and other marketplaces.",
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
      validation: { required: "Price is require" },
      rules: ["required"],
      className: "mb-5",
    },
  ];

  const image_field = [
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
      validation: { required: "Grid image is require" },
      rules: ["required"],
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
      validation: { required: "Gallery image is require" },
      rules: ["required"],
    },
  ];

  const getFields = (data) => {
    if (
      ["product_zip", "product_zip_url"].includes(data.name) &&
      !showFiels.includes(data.name)
    ) {
      return null; // Skip rendering if the field is not selected
    }
    switch (data.html) {
      case "input":
        return (
          <FormInput
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
          />
        );

      case "textarea":
        return (
          <FormTextArea
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
          />
        );

      case "upload":
        return (
          <FormSingleFile
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
          />
        );

      case "radio":
        return (
          <FormRadio
            data={data}
            onChange={handleFieldChange}
            error={validationErrors[data.name]}
            defaultValueData={defaultValueData[data.name]}
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
            type={paramsData?.sub_slug}
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
    if (formValues.categories) {
      getFormatAndCompatibleList(formValues.categories);
    }
  }, [formValues.categories]);

  useEffect(() => {
    if (authUser?.documentId || formValues.short_title) {
      getProductList(authUser?.documentId, formValues.short_title);
    }
  }, [formValues.short_title]);

  useEffect(() => {
    getOptionsList();

    const init = async () => {
      setParamsData(await params);
      const { id } = (await params) || {};
      if (id) {
        await getProductData(id);
      }
    };
    init();
  }, [params, authUser]);

  const extractIds = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => item.documentId);
  };

  const getFormatAndCompatibleList = async (id) => {
    try {
      const productData = await strapiGet(`format/${id}`, {
        params: { populate: "*" },
        token: themeConfig.TOKEN,
      });

      const technologyData = await strapiGet(`technologies`, {
        params: { populate: "*" },
        token: themeConfig.TOKEN,
      });

      if (technologyData.data) {
        setTechnologyList(technologyData.data || []);
      }

      if (productData?.data) {
        setFileFormat(productData.data?.file_format || []);
        setCompatibleWith(productData.data?.compatible_with || []);
      }
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      toast.error("Failed to load product data.");
    }
  };

  const getProductList = async (id, short_title) => {
    try {
      const payload = {
        "search": short_title
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
        const select = productData.data?.product_zip
          ? "product_zip"
          : "product_zip_url";

        setShowFiels([select]);

        setDefaultValueData((prev) => ({
          ...prev,
          ...productData.data,
          product_zip_select: select,
          categories: extractIds(productData.data?.categories)?.[0],
          tags: extractIds(productData.data?.tags),
          file_format: extractIds(productData.data?.file_format),
          compatible_with: extractIds(productData.data?.compatible_with),
          technology: productData.data?.all_technology?.technology?.documentId,
          existing_product: extractIds(
            productData.data?.all_technology?.products
          ),
          price: productData.data?.price?.sales_price,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      toast.error("Failed to load product data.");
    }
  };

  return (
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
                  {field?.map((data, index) => {
                    return (
                      getFields(data) && (
                        <div key={index} className={data.className}>
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
              {/* sub heading */}
              <div className="border-b border-primary/10">
                <p className="text-black py-[6px] px-5">{sub_title}</p>
              </div>
              {image_field?.map((data, index) => {
                return <div key={index}>{getFields(data)}</div>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
