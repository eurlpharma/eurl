import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProductDetails,
} from "@/store/slices/productSlice";
import { getCategories } from "@/store/slices/categorySlice";
import { toast } from "react-toastify";
import { RootState } from "@/store";
import { v4 as uuidv4 } from 'uuid';
import { Grid, Paper, Typography } from "@mui/material";
import FormField from "@/components/form/FormField";
import RichTextEditor from "@/components/form/RichTextEditor";
import ImageUpload from "@/components/form/ImageUpload";
import AIButton from "@/components/buttons/AIButton";
import { IconAI, IconAIBold, IconTrashBold } from "@/components/Iconify";
import { GeminiAI } from "@/utils/gemini";

interface ProductFormData {
  name: string;
  description: string;
  richDescription?: string;
  price: number;
  newPrice?: number | null;
  oldPrice?: number | null;
  category: string;
  brand?: string;
  isFeatured: boolean;
  specifications: Array<{
    name: string;
    value: string;
  }>;
  stock: number;
  isActive: boolean;
  images?: string[];
}

const productSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Product description is required"),
  richDescription: yup.string(),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be positive"),
  newPrice: yup.number().nullable().min(0, "Price must be positive"),
  oldPrice: yup.number().nullable().min(0, "Price must be positive"),
  category: yup.string().required("Category is required"),
  brand: yup.string(),
  isFeatured: yup.boolean().default(false),
  specifications: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Specification name is required"),
        value: yup.string().required("Specification value is required"),
      })
    )
    .default([]),
  stock: yup
    .number()
    .required("Stock is required")
    .min(0, "Stock must be positive"),
  isActive: yup.boolean().default(true),
});

const ProductFormPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagesFolder, setImagesFolder] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [isLoadRichAI, setIsLoadRichAI] = useState<boolean>(false);
  const [isLoadAIForm, setIsLoadAIForm] = useState<
    null | "active" | "pending" | "fulfilled" | "rejected"
  >(null);
  const [productId, setProductId] = useState<string>("");

  const { product, loading } = useAppSelector(
    (state: RootState) => state.products
  );
  const { categories } = useAppSelector((state: RootState) => state.categories);

  const form = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      specifications: [],
      stock: 0,
      isActive: true,
      isFeatured: false,
    },
  });

  const { setValue, watch } = form;

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, isEditMode, id]);

  useEffect(() => {
    if (isEditMode && product) {
      let newPriceValue = undefined;
      let oldPriceValue = undefined;
      if (
        product.oldPrice &&
        product.oldPrice > 0 &&
        product.price < product.oldPrice
      ) {
        newPriceValue = product.price;
        oldPriceValue = product.oldPrice;
      } else {
        newPriceValue = undefined;
        oldPriceValue = product.price;
      }
      form.reset({
        name: product.name || "",
        description: product.description || "",
        richDescription: product.richDescription || "",
        price: product.price || 0,
        newPrice: newPriceValue,
        oldPrice: oldPriceValue,
        category:
          typeof product.category === "object"
            ? product.category.id
            : product.category,
        specifications: product.specifications || [],
        stock: product.countInStock || 0,
        isActive: product.isVisible ?? true,
        isFeatured: product.isFeatured || false,
        brand: product.brand || "",
      });

      if (product.images && product.images.length > 0) {
        const fullImageUrls = product.images.map((image: string) => {
          if (image.startsWith("http")) {
            return image;
          }
          return `${process.env.REACT_APP_API_URL}/uploads/${image}`;
        });
        setImageUrls(fullImageUrls);
      }
      if (product.imagesFolder) {
        setImagesFolder(product.imagesFolder);
      }
    }
  }, [isEditMode, product, form]);

  useEffect(() => {

    if (!isEditMode && !productId) {
      setProductId(uuidv4());
    } else if (isEditMode && product?.id) {
      setProductId(product.id);
    }
  }, [isEditMode, product]);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      let response;
      let submitData = { ...data };

      if (data.newPrice && Number(data.newPrice) !== Number(product?.price)) {
        submitData.oldPrice = product?.price;
        submitData.price = Number(data.newPrice);
      } else if (Number(data.price) !== Number(product?.price)) {
        submitData.oldPrice = product?.price;
      }
      delete submitData.newPrice;
      let uploadedImageUrls: string[] = [...imageUrls];
      if (images.length > 0 && productId) {
        const token = localStorage.getItem('token');
        const productIdShort = productId.slice(0, 8);
        for (const file of images) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('productId', productIdShort);
          const res = await fetch('https://eurl-server.onrender.com/api/upload/product-image', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData,
          });
          const data = await res.json();
          if (data.url) {
            uploadedImageUrls.push(data.url);
          }
        }
      }
      submitData.images = uploadedImageUrls;

      if (isEditMode && id) {

        const formData = new FormData();
        Object.entries(submitData).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === "specifications" && value) {
              formData.append(key, JSON.stringify(value));
            } else if (key === "isActive") {
              formData.append("isVisible", String(value));
            } else if (key === "stock") {
              formData.append("countInStock", String(value));
            } else if (key === "images") {
              formData.append("images", JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        if (imagesFolder) {
          formData.append("imagesFolder", imagesFolder);
        }

        response = await dispatch(
          updateProduct({ id, productData: formData })
        ).unwrap();

        if (response.success) {
          toast.success(t("notifications.productUpdated"));
          await dispatch(getProductDetails(id));
          await dispatch(getProducts({ page: 1, limit: 10 }));
          navigate("/admin/products", { replace: true });
        } else {
          throw new Error(response.message || "Failed to update product");
        }
      } else {
        const formData = new FormData();
        Object.entries(submitData).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === "specifications" && value) {
              formData.append(key, JSON.stringify(value));
            } else if (key === "isActive") {
              formData.append("isVisible", String(value));
            } else if (key === "stock") {
              formData.append("countInStock", String(value));
            } else if (key === "images") {
              formData.append("images", JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        if (imagesFolder) {
          formData.append("imagesFolder", imagesFolder);
        }

        response = await dispatch(createProduct(formData)).unwrap();

        if (response.success) {
          toast.success(t("notifications.productCreated"));
          await dispatch(getProducts({ page: 1, limit: 10 }));
          navigate("/admin/products", { replace: true });
        } else {
          throw new Error(response.message || "Failed to create product");
        }
      }
    } catch (error: any) {
      toast.error(error.message || t("notifications.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCreateDescription = async () => {
    setIsLoadingAI(true);

    const productName: string = watch("name");
    const descLang = "اللهجة الجزائرية";
    const prompt = `
    Write a persuasive and SEO-optimized product description for the following product:
    
    Product Name: ${productName}
    
    Requirements:
    - Language: ${descLang}
    - Length: between 6 and 10 lines maximum
    - Do not use any emojis
    - Use a clean and professional tone
    - Make the description engaging and compelling
    - Naturally integrate relevant keywords to help with search engine ranking
    - Assume typical features and benefits based on the product name if not specified
    - ⚠️ Do not include any introductions, explanations, titles, or messages before or after the description. Only return the pure product description in the selected language.
    `;

    const res = await GeminiAI(prompt);
    const { success, data } = await res;
    if (success) {
      const textCode = data.candidates[0].content.parts[0].text;
      setValue("description", textCode);
      setIsLoadingAI(false);
    }
  };

  const handleCreateRichDescription = async () => {
    setIsLoadRichAI(true);
    const productName: string = watch("name");
    const descLang = "اللهجة الجزائرية";
    const prompt = `
      I want you to write a high-quality, SEO-optimized product description for the following product:
      Product Name: ${productName}
      Requirements:
      - Language: ${descLang}
      - Length: 16 to 28 lines
      - Output must be in multiline format using real line breaks (not \\n, not \\\\n). Each line should appear on its own line, as if typed in a draft or textarea input.
      - Use a clear and structured format (bullet points, short paragraphs, or spaced lines)
      - Include relevant SEO keywords naturally
      - Add fitting emojis to make the description visually attractive
      - If specific details are not provided, intelligently assume the most likely features and benefits based on the product name
      - Make it sound persuasive and professional
      - End with a strong call-to-action
      - ⚠️ Only return the description content itself, without any titles, comments, or additional text before or after
    `;

    const res = await GeminiAI(prompt);
    const { success, data } = await res;
    if (success) {
      const textCode = data.candidates[0].content.parts[0].text;
      setValue("richDescription", textCode);
      setIsLoadRichAI(false);
    }
  };

  const handleCleareDescripionAI = () => {
    if (watch("description").trim().length > 0) {
      setValue("description", "");
    }
  };

  const handleCleareRichDescripionAI = () => {
    if (
      watch("richDescription") &&
      (watch("richDescription")?.trim() || "").length > 0
    ) {
      setValue("richDescription", "");
    }
  };

  const handleAIForm = async () => {
    if (watch("name")) {
      setIsLoadAIForm("pending")
      const prompt = `
        You are an expert in e-commerce product copywriting and market analysis.

        I will give you only the **product name**, and you will return the following JSON structure based on it:

        {
          "brand": "The most likely brand or manufacturer name for this product",
          "price": "Only the numeric value of the estimated average or official price in Algerian Dinar (DA), without currency symbols or text. Example: 850",
          "shortDescription": "A concise, professional product description (6 to 10 lines), written using real newlines (\\n or actual line breaks), without emojis or styling",
          "richDescription": "A persuasive, SEO-optimized, emoji-rich, and well-formatted product description (16 to 28 lines), written using actual newlines (line breaks) for each bullet point or paragraph. No Markdown formatting or HTML. It must appear line by line, ready to be pasted into a plain text draft input."
        }

        Product Name: ${watch("name")}

        Rules:
        - 'price' must be a number only (e.g., 850), no text or symbols.
        - Descriptions must use real line breaks between lines. Avoid inline paragraphs or joined lines.
        - Do not use Markdown formatting (no **bold**, no \`\`\`, no *, no #).
        - Only return the JSON object. No explanations or extra text.
        `;

      const res = await GeminiAI(prompt);
      const { success, data } = res;
      if (success) {

        console.log(data)

        const raw = data.candidates[0].content.parts[0].text;
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleaned);
        const { brand, price, shortDescription, richDescription } = result;

        typeof brand === "string" && setValue("brand", brand);
        typeof Number(price)==="number" && setValue("price", price);
        typeof shortDescription === "string" &&
          setValue("description", shortDescription);
        typeof shortDescription === "string" &&
          setValue("richDescription", richDescription);
        setIsLoadAIForm("fulfilled")
      } else {
        setIsLoadAIForm("rejected")
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <Typography variant="h4" component="div" className="font-josefin">
          {isEditMode ? t("admin.editProduct") : t("admin.createProduct")}
        </Typography>
        <AIButton
          startContent={<IconAI />}
          radius="full"
          className="font-josefin"
          onClick={handleAIForm}
          isLoading={isLoadAIForm==="pending"}
          isDisabled={watch("name").length > 0 ? false : true}
        >
          Generate
        </AIButton>
      </div>

      <Paper elevation={0} className="p-6 mb-6">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" className="mb-4">
                {t("admin.basicInformation")}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                control={form.control}
                name="name"
                label={t("admin.productName")}
                type="text"
                error={form.formState.errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                control={form.control}
                name="brand"
                label={t("admin.brand")}
                type="text"
                error={form.formState.errors.brand}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                control={form.control}
                name="price"
                label={t("admin.price")}
                type="number"
                error={form.formState.errors.price}
                required
                textFieldProps={{
                  inputProps: { min: 0, step: 0.01 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                control={form.control}
                name="stock"
                label={t("admin.countInStock")}
                type="number"
                error={form.formState.errors.stock}
                required
                textFieldProps={{
                  inputProps: { min: 0, step: 1 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                control={form.control}
                name="category"
                label={t("admin.category")}
                type="select"
                error={form.formState.errors.category}
                required
                options={
                  categories?.map((category: any) => ({
                    value: category.id,
                    label: category.name,
                  })) || []
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                control={form.control}
                name="isFeatured"
                label={t("admin.featured")}
                type="checkbox"
                error={form.formState.errors.isFeatured}
              />
            </Grid>

            <Grid item xs={12} className="font-poppins">
              <div className="relative">
                <AIButton
                  type="button"
                  isIconOnly
                  radius="none"
                  isLoading={isLoadingAI}
                  variant={"liner"}
                  startContent={
                    watch("description").trim().length > 0 ? (
                      <IconTrashBold />
                    ) : (
                      <IconAIBold />
                    )
                  }
                  isDisabled={
                    !watch("name") || watch("name").trim().length < 1
                      ? true
                      : false
                  }
                  onClick={() =>
                    watch("description").trim().length > 0
                      ? handleCleareDescripionAI()
                      : handleCreateDescription()
                  }
                  className="absolute z-10 right-0 bottom-0"
                ></AIButton>

                <FormField
                  className="font-poppins"
                  control={form.control}
                  name="description"
                  label={t("admin.shortDescription")}
                  type="textarea"
                  error={form.formState.errors.description}
                  required
                  rows={3}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="relative">
                <AIButton
                  type="button"
                  isIconOnly
                  radius="none"
                  isLoading={isLoadRichAI}
                  variant={"liner"}
                  startContent={
                    (watch("richDescription")?.trim() || "").length > 0 ? (
                      <IconTrashBold />
                    ) : (
                      <IconAIBold />
                    )
                  }
                  isDisabled={
                    !watch("name") || watch("name").trim().length < 1
                      ? true
                      : false
                  }
                  onClick={() =>
                    (watch("richDescription")?.trim() || "").length > 0
                      ? handleCleareRichDescripionAI()
                      : handleCreateRichDescription()
                  }
                  className="absolute z-10 right-0 bottom-4"
                ></AIButton>
                <RichTextEditor
                  value={form.watch("richDescription") || ""}
                  onChange={(content: string) =>
                    form.setValue("richDescription", content)
                  }
                  error={form.formState.errors.richDescription?.message}
                  height={600}
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormField
                name="newPrice"
                label={t("admin.newPrice") || "السعر الجديد (اختياري)"}
                type="number"
                control={form.control}
                textFieldProps={{
                  placeholder:
                    t("admin.newPricePlaceholder") ||
                    "اتركه فارغًا إذا لم يوجد عرض",
                  inputProps: { min: 0 },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className="mb-4">
                {t("admin.images")}
              </Typography>
              <ImageUpload
                images={images}
                imageUrls={imageUrls}
                onImagesChange={setImages}
                onImageUrlsChange={setImageUrls}
                maxFiles={5}
              />
            </Grid>

            <Grid item xs={12}>
              <AIButton
                type="submit"
                variant="solid"
                radius="full"
                isDisabled={isSubmitting}
                className="mt-4"
                fullWidth
              >
                {isSubmitting
                  ? t("common.saving")
                  : isEditMode
                  ? t("common.update")
                  : "Create New Product"}
              </AIButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default ProductFormPage;
