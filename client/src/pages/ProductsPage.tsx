import React, { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Container,
  Pagination,
  TextField,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ProductData } from "@/types/product";
import { CategoryData } from "@/types/category";
import { AppDispatch, RootState } from "@/store";
import AIButton from "@/components/buttons/AIButton";
import Breadcrumb from "@/components/global/Breadcrumb";
import { getProducts } from "@/store/slices/productSlice";
import { setProductFilters } from "@/store/slices/uiSlice";
import NotFoundProduct from "../assets/undraw/not_found.svg";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { getCategories } from "@/store/slices/categorySlice";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IconReset, IconSearch } from "@/components/Iconify";
import { getLocalizedCategoryName } from "@/utils/formatters";
import defaultCategoryIcon from "@/assets/icons/default/default-user.png";
const ProductCardList = React.lazy(
  () => import("@/components/products/ProductCardList")
);

const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);

  const { products, loading, totalProducts } = useSelector(
    (state: RootState) => state.products
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  // Local state for displayed filters (form values)
  const [keywordInput, setKeywordInput] = useState(
    searchParams.get("keyword") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? searchParams.get("category")!.split(",") : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [, setMaxPrice] = useState<number>(0);
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit] = useState(20);

  const [searchState, setSearchState] = useState({
    keyword: searchParams.get("keyword") || "",
    selectedCategories: searchParams.get("category")
      ? searchParams.get("category")!.split(",")
      : [],
    priceRange: [
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 50000000000,
    ] as [number, number],
    sortBy: searchParams.get("sortBy") || "createdAt",
    page: Number(searchParams.get("page")) || 1,
  });

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const { keyword, selectedCategories, priceRange, sortBy, page } =
      searchState;

    const filters = {
      keyword,
      category:
        selectedCategories.length > 0
          ? selectedCategories.join(",")
          : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice:
        priceRange[1] > 0 && priceRange[1] < absoluteMaxPrice
          ? priceRange[1]
          : undefined,
      sortBy,
      page,
      limit,
    };

    dispatch(getProducts(filters));
    dispatch(
      setProductFilters({
        category:
          selectedCategories.length > 0 ? selectedCategories.join(",") : "",
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
      })
    );

    // Update URL params
    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword;
    if (selectedCategories.length > 0)
      params.category = selectedCategories.join(",");
    if (priceRange[0] > 0) params.minPrice = priceRange[0].toString();
    if (priceRange[1] > 0 && priceRange[1] < absoluteMaxPrice)
      params.maxPrice = priceRange[1].toString();
    if (sortBy !== "createdAt") params.sortBy = sortBy;
    if (page > 1) params.page = page.toString();

    setSearchParams(params);
  }, [dispatch, searchState, limit, absoluteMaxPrice]);

  useEffect(() => {
    if (products && products.length > 0 && absoluteMaxPrice === 0) {
      const maxProductPrice = Math.max(
        ...products.map((p: ProductData) => p.price)
      );
      setAbsoluteMaxPrice(maxProductPrice);
      setMaxPrice(maxProductPrice);
    }
  }, [products, absoluteMaxPrice]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const keywordParam = searchParams.get("keyword") || "";
    const minPriceParam = Number(searchParams.get("minPrice")) || 0;
    const maxPriceParam =
      Number(searchParams.get("maxPrice")) || absoluteMaxPrice;
    const sortByParam = searchParams.get("sortBy") || "createdAt";
    const pageParam = Number(searchParams.get("page")) || 1;

    setSelectedCategories(categoryParam ? categoryParam.split(",") : []);
    setKeywordInput(keywordParam);
    setPriceRange([minPriceParam, maxPriceParam]);
    setSortBy(sortByParam);
    setPage(pageParam);

    setSearchState({
      keyword: keywordParam,
      selectedCategories: categoryParam ? categoryParam.split(",") : [],
      priceRange: [minPriceParam, maxPriceParam],
      sortBy: sortByParam,
      page: pageParam,
    });
  }, [searchParams, absoluteMaxPrice]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setSearchState({
      keyword: keywordInput,
      selectedCategories,
      priceRange,
      sortBy,
      page: 1,
    });
  };

  const handleCategoryChange = (cat: string) => {
    let newSelectedCategories: string[] = [];
    if (selectedCategories[0] === cat) {
      newSelectedCategories = [];
    } else {
      newSelectedCategories = [cat];
    }

    setSelectedCategories(newSelectedCategories);

    setSearchState((prev) => ({
      ...prev,
      selectedCategories: newSelectedCategories,
      page: 1,
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handlePriceChangeCommitted = () => {
    setSearchState((prev) => ({
      ...prev,
      priceRange: [priceRange[0], priceRange[1]],
      page: 1,
    }));
  };

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);

    setSearchState((prev) => ({
      ...prev,
      page: newPage,
    }));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setKeywordInput("");
    setSelectedCategories([]);
    setPriceRange([0, absoluteMaxPrice]);
    setMaxPrice(absoluteMaxPrice);
    setSortBy("createdAt");
    setPage(1);

    setSearchState({
      keyword: "",
      selectedCategories: [],
      priceRange: [0, absoluteMaxPrice],
      sortBy: "createdAt",
      page: 1,
    });

    setSearchParams({});
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const totalPages = Math.ceil(totalProducts / limit);

  const filtersContent = (
    <Box className="px-3 pt-8">
      <form onSubmit={handleSearch} className="mb-4">
        <TextField
          classes={{
            root: "hacker-input",
          }}
          fullWidth
          variant="standard"
          label={t("products.search")}
          value={keywordInput}
          className="rounded-full"
          onChange={(e) => setKeywordInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" edge="end">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </IconButton>
            ),
          }}
        />
      </form>

      <Box className="mb-4 font-josefin">
        <Typography variant="h6" className="mb-3 font-josefin">
          {t("products.category")}
        </Typography>

        <Box className="space-y-2">
          {categories &&
            categories.length > 0 &&
            categories
              .filter((cat: CategoryData) => !!(cat._id || cat.id))
              .map((cat: CategoryData) => {
                const catId = cat._id || cat.id;
                return (
                  <Box
                    key={catId}
                    onClick={() => catId && handleCategoryChange(catId)}
                    className={`
                      font-josefin text-lg capitalize py-2  rounded-lg cursor-pointer transition-all duration-200
                      ${
                        catId && selectedCategories.includes(catId)
                          ? " text-girl-secondary"
                          : " text-gray-700"
                      }
                    `}
                  >
                    <>
                      <img
                        src={cat.icon || cat.image || defaultCategoryIcon}
                        alt="icon"
                        style={{
                          width: 22,
                          height: 22,
                          display: "inline-block",
                          marginRight: 8,
                          verticalAlign: "middle",
                        }}
                      />
                      {getLocalizedCategoryName(cat, i18n.language)}
                    </>
                  </Box>
                );
              })}
        </Box>
      </Box>

      <Box className="mb-4">
        <Box>
          <PriceRangeFilter
            onPriceChange={handlePriceChange}
            onPriceChangeCommitted={handlePriceChangeCommitted}
            maxPrice={absoluteMaxPrice}
          />
        </Box>
      </Box>

      <Box className="flex items-center gap-2 mt-2">
        <AIButton
          variant="solid"
          radius="full"
          fullWidth
          onClick={handleSearch}
          className="flex-1"
          startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
        >
          {t("products.search")}
        </AIButton>
        <AIButton
          startContent={<IconReset />}
          variant="solid"
          radius="full"
          onClick={handleClearFilters}
          className=" w-fit"
          isIconOnly
        ></AIButton>
      </Box>
    </Box>
  );

  const activeFilters = [];
  if (searchState.keyword)
    activeFilters.push({ label: searchState.keyword, key: "keyword" });
  if (searchState.selectedCategories.length > 0) {
    searchState.selectedCategories.forEach((catId) => {
      const category = categories.find(
        (c: any) => c._id === catId || c.id === catId
      );
      const categoryName = category
        ? getLocalizedCategoryName(category, i18n.language)
        : catId;
      activeFilters.push({ label: categoryName, key: `category-${catId}` });
    });
  }
  if (searchState.priceRange[0] > 0 || searchState.priceRange[1] < 5000) {
    activeFilters.push({
      label: `${searchState.priceRange[0]} DA - ${searchState.priceRange[1]} DA`,
      key: "price",
    });
  }

  return (
    <div className="bg-girl-white">
      {!isMobile && <Breadcrumb pageName="Products" />}

      <Container
        maxWidth="xl"
        className="py-1 pb-6 md:py-2 lg:py-16 px-1 md:px-2 lg:px-3"
      >
        <Grid container spacing={4} key="main-container">
          {!isMobile && (
            <Grid item xs={12} md={3} lg={2} key="filters-desktop">
              <Box className="sticky top-24 ">{filtersContent}</Box>
            </Grid>
          )}

          <Grid item xs={12} md={9} lg={10} key="products-section">
            {isMobile && (
              <Box className="flex items-center justify-between w-full mb-4 md:mb-0">
                <div>
                  <h1 className="capitalize font-poppins text-xl text-gray-800">
                    Products
                  </h1>
                  <p className="text-tiny text-gray-600">
                    Find your best products
                  </p>
                </div>

                <AIButton
                  radius="full"
                  variant="liner"
                  className="py-1"
                  onClick={toggleFilters}
                  startContent={<IconSearch className="w-5 h-5" />}
                >
                  {t("products.search")}
                </AIButton>
              </Box>
            )}

            {
              <Grid
                container
                rowSpacing={2}
                columnSpacing={1}
                key="products-grid"
              >
                {loading ? (
                  Array.from(new Array(limit)).map((_, index) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
                      <Suspense fallback={<ProductCardList product={null} />}>
                        <ProductCardList product={null} isLoading={true} />
                      </Suspense>
                    </Grid>
                  ))
                ) : products && products.length > 0 ? (
                  products.map((product: any, index: number) => (
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={4}
                      lg={3}
                      key={product.id || product._id || `product-${index}`}
                    >
                      <Suspense fallback={<ProductCardList product={null} />}>
                        <ProductCardList product={product} />
                      </Suspense>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box className="flex flex-col items-center justify-center gap-3 lg:gap-4 py-3 md:py-6 lg:py-16">
                      <img
                        className="mx-auto"
                        src={NotFoundProduct}
                        alt="Not Found Product"
                      />
                      <Typography
                        variant="h6"
                        className="mb-2 font-paris text-3xl font-semibold text-girl-secondary capitalize"
                      >
                        {t("products.noProductsFound")}
                      </Typography>
                      <AIButton
                        radius="full"
                        variant="solid"
                        className="mx-auto"
                        onClick={handleClearFilters}
                      >
                        {t("products.clearFilters")}
                      </AIButton>
                    </Box>
                  </Grid>
                )}
              </Grid>
            }

            {totalPages > 1 && (
              <Box className="flex justify-center mt-8">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        {isMobile && (
          <Drawer
            container={document.getElementById("root")}
            anchor="left"
            open={filtersOpen}
            onClose={toggleFilters}
            PaperProps={{
              className: "backdrop-blur-lg bg-girl-white/90",
              sx: { width: 300 },
            }}
          >
            {filtersContent}
          </Drawer>
        )}
      </Container>
    </div>
  );
};

export default ProductsPage;
