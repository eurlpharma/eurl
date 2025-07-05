import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { PhotoProvider, PhotoView } from "react-photo-view";

import {
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Container,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Skeleton,
  Button,
} from "@mui/material";
import {
  ShoppingCartIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { AppDispatch, RootState } from "@/store";
import {
  getProductDetails,
  getFeaturedProducts,
} from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { useNotification } from "@/hooks/useNotification";
const  { Swiper, SwiperSlide } = await import("swiper/react");
const  { Thumbs, Zoom, FreeMode } = await import("swiper/modules");
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "swiper/css/free-mode";
import "@/styles/swiper-custom.css";
import "react-photo-view/dist/react-photo-view.css";
import ProductCardList from "@/components/products/ProductCardList";
import AIButton from "@/components/buttons/AIButton";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="pt-4">{children}</Box>}
    </div>
  );
};

const API_URL =
  import.meta.env.VITE_API_URL || `https://pharma-api-e5sd.onrender.com`;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error } = useNotification();

  const {
    product,
    featuredProducts,
    loading,
    error: apiError,
  } = useSelector((state: RootState) => state.products);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
      dispatch(getFeaturedProducts(4));
    }

    return () => {
      setQuantity(1);
      setActiveTab(0);
      setActiveImage(0);
    };
  }, [dispatch, id]);

  useEffect(() => {
    setActiveImage(0);
  }, [product]);

  if (!id || (!product && !loading)) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h5" className="text-center py-16">
          {t("products.productNotFound")}
        </Typography>
      </Container>
    );
  }

  if (apiError) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography color="error" align="center" className="mb-4">
          {t("common.errorOccurred")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(getProductDetails(id!))}
        >
          {t("common.retry")}
        </Button>
      </Container>
    );
  }

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const result = await dispatch(
        addToCart({ productId: product.id, quantity })
      );
      if (addToCart.fulfilled.match(result)) {
        success(t("products.addedToCart"));
      } else {
        error(t("products.failedToAddToCart"));
      }
    } catch (err) {
      console.log(err);
      error(t("common.errorOccurred"));
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      success(t("products.addedToFavorites"));
    } else {
      success(t("products.removedFromFavorites"));
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatImageUrl = (imagePath: string) => {
    if (!imagePath) {
      return "/images/product-placeholder.svg";
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    let cleanPath = imagePath.replace("undefined/", "");

    while (cleanPath.startsWith("/uploads/uploads/")) {
      cleanPath = cleanPath.replace("/uploads/uploads/", "/uploads/");
    }

    if (cleanPath.startsWith("/uploads")) {
      const finalUrl = `${API_URL}${cleanPath}`;
      return finalUrl;
    }

    const finalUrl = `${API_URL}/uploads/${cleanPath}`;
    return finalUrl;
  };

  const productImages = product
    ? product.images?.length
      ? product.images.map((img: string) => {
          return formatImageUrl(img);
        })
      : product.image
      ? [formatImageUrl(product.image)]
      : []
    : [];

  if (loading && !product) {
    return (
      <Container maxWidth="lg" className="py-8 pt-28 lg:pt-48">
        <Box className="mb-4">
          <Skeleton variant="text" width={300} height={30} />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
            <Box className="flex mt-2 gap-2">
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={80}
                  height={80}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={24} width="40%" className="mt-2" />
            <Skeleton variant="text" height={24} width="60%" className="mt-2" />
            <Skeleton variant="rectangular" height={100} className="mt-4" />
            <Skeleton variant="rectangular" height={50} className="mt-4" />
            <Skeleton variant="rectangular" height={50} className="mt-2" />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <div>
      {/* {<Breadcrumb pageName="Product Details" />} */}
      <Container maxWidth="lg" className="py-8">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className="relative product-swiper-container">
              {product.isFeatured && (
                <Chip
                  label={t("products.featured")}
                  color="secondary"
                  size="small"
                  className="absolute top-4 left-4 z-10"
                />
              )}

              {productImages.length > 0 ? (
                <PhotoProvider>
                  <Swiper
                    modules={[Thumbs, Zoom]}
                    spaceBetween={10}
                    navigation={false}
                    pagination={false}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    zoom={true}
                    className="product-swiper"
                    onSlideChange={(swiper) =>
                      setActiveImage(swiper.activeIndex)
                    }
                    initialSlide={activeImage}
                  >
                    {productImages.map((image: string, index: number) => (
                      <SwiperSlide key={index}>
                        <div className="swiper-zoom-container">
                          <PhotoView src={image}>
                            <img
                              className="object-cover"
                              src={image}
                              alt={`${product.name} - ${index + 1}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/product-placeholder.svg";
                              }}
                            />
                          </PhotoView>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* الصور المصغرة */}
                  {productImages.length > 1 && (
                    <Swiper
                      modules={[Thumbs, FreeMode]}
                      watchSlidesProgress
                      spaceBetween={10}
                      slidesPerView="auto"
                      freeMode={true}
                      className="product-thumbs"
                      onSwiper={setThumbsSwiper}
                    >
                      {productImages.map((image: string, index: number) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image}
                            alt={`${product.name} - thumbnail ${index + 1}`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/product-placeholder.svg";
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </PhotoProvider>
              ) : (
                <Box
                  component="img"
                  src="/images/product-placeholder.svg"
                  alt={product.name}
                  className="w-full h-auto rounded-lg object-cover"
                  sx={{ maxHeight: 500 }}
                />
              )}
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              component="h1"
              className=" mb-2 font-josefin"
            >
              {product.name}
            </Typography>

            {product.brand && (
              <Typography variant="subtitle1" className="text-gray-600 mb-2">
                {product.brand}
              </Typography>
            )}

            <Typography
              variant="h5"
              className="font-caveat text-primary-600 mb-4"
            >
              DA{" "}
              {product?.price !== undefined ? product.price.toFixed(2) : "0.00"}
            </Typography>

            <Typography
              variant="body1"
              className="mb-6 font-cairo"
              dir="auto"
            >
              {product?.description || t("products.noDescription")}
            </Typography>

            <Divider className="mb-6" />

            {/* Stock Status */}
            {product.countInStock > 0 ? (
              <Typography className="mb-4 text-green-600">
                {t("products.inStock")} {t("products.available")}
              </Typography>
            ) : (
              <Typography className="mb-4 text-red-600">
                {t("products.outOfStock")}
              </Typography>
            )}

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <Box className="mb-6">
                <Typography variant="subtitle1" className="mb-2">
                  {t("products.quantity")}
                </Typography>
                <Box className="flex items-center">
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    size="small"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </IconButton>
                  <Typography className="mx-4">{quantity}</Typography>
                  <IconButton
                    onClick={() =>
                      setQuantity(Math.min(product.countInStock, quantity + 1))
                    }
                    disabled={quantity >= product.countInStock}
                    size="small"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </IconButton>
                  <Typography
                    variant="body2"
                    className="ml-4 text-gray-600 select-none"
                  >
                    {t("products.maxAvailable", {
                      count: product.countInStock,
                    })}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Box className="flex gap-3">
              <AIButton
                variant="solid"
                startContent={<ShoppingCartIcon className="w-5 h-5" />}
                onClick={handleAddToCart}
                isDisabled={product.countInStock === 0}
                fullWidth
              >
                {t("products.addToCart")}
              </AIButton>
              <AIButton
                variant="outlined"
                startContent={
                  isFavorite ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )
                }
                onClick={toggleFavorite}
              >
                {t("products.favorite")}
              </AIButton>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Paper elevation={0} className="mt-8 p-4">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={t("products.description")} />
            <Tab label={t("products.specifications")} />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <div
              dir="auto"
              className="prose max-w-none dark:prose-invert whitespace-pre-wrap font-cairo"
              dangerouslySetInnerHTML={{
                __html: product?.richDescription || product?.description || "",
              }}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" className="font-bold mb-2">
                  {t("products.productDetails")}
                </Typography>
                <Box component="dl" className="space-y-2">
                  {product?.brand && (
                    <Box className="flex">
                      <Box
                        component="dt"
                        className="w-1/3 font-medium text-gray-600"
                      >
                        {t("products.brand")}:
                      </Box>
                      <Box component="dd" className="w-2/3">
                        {product.brand}
                      </Box>
                    </Box>
                  )}
                  <Box className="flex">
                    <Box
                      component="dt"
                      className="w-1/3 font-medium text-gray-600"
                    >
                      {t("products.category")}:
                    </Box>
                    <Box component="dd" className="w-2/3">
                      {/* Here you would display category name */}
                      {t("products.medical")}
                    </Box>
                  </Box>
                  <Box className="flex">
                    <Box
                      component="dt"
                      className="w-1/3 font-medium text-gray-600"
                    >
                      {t("products.stockStatus")}:
                    </Box>
                    <Box component="dd" className="w-2/3">
                      {product?.countInStock > 0
                        ? `${t("products.inStock")} (${product.countInStock})`
                        : t("products.outOfStock")}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>

        {/* Related Products */}
        {(featuredProducts?.length ?? 0) > 0 && (
          <Box className="mt-12">
            <Typography variant="h5" className="font-bold mb-6">
              {t("products.relatedProducts")}
            </Typography>
            <Grid container spacing={3}>
              {featuredProducts
                .filter((p: any) => p.id !== product.id)
                .slice(0, 4)
                .map((product: any) => (
                  <Grid item xs={6} sm={6} md={3} key={product.id}>
                    <ProductCardList product={product} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default ProductDetailPage;
