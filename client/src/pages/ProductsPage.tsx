import React, { useState, useEffect } from "react";
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
import ProductCardList from "@/components/products/ProductCardList";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IconSearch } from "@/components/Iconify";

const ProductsPage = () => {
  const { t } = useTranslation();
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
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit] = useState(12);

  // Search state (values used for actual filtering)
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

  // Load categories on initial load
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Load products when search state changes
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
        priceRange[1] > 0 && priceRange[1] < 1000000
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
    if (priceRange[1] > 0 && priceRange[1] < 1000000)
      params.maxPrice = priceRange[1].toString();
    if (sortBy !== "createdAt") params.sortBy = sortBy;
    if (page > 1) params.page = page.toString();

    setSearchParams(params);
  }, [dispatch, searchState, limit]);

  useEffect(() => {
    if (products && products.length > 0) {
      const maxProductPrice = Math.max(
        ...products.map((p: ProductData) => p.price)
      );
      setMaxPrice(maxProductPrice);
    }
  }, [products]);

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
    setPriceRange([0, 0]);
    setSortBy("createdAt");
    setPage(1);

    setSearchState({
      keyword: "",
      selectedCategories: [],
      priceRange: [0, 0],
      sortBy: "createdAt",
      page: 1,
    });
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
            categories.map((cat: CategoryData) => {
              const catId = cat._id || "";
              return (
                <Box
                  key={catId}
                  onClick={() => handleCategoryChange(catId)}
                  className={`
                    font-josefin text-lg capitalize py-2  rounded-lg cursor-pointer transition-all duration-200
                    ${
                      selectedCategories.includes(catId)
                        ? " text-girl-secondary"
                        : " text-gray-700"
                    }
                  `}
                >
                  {cat.name}
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
            maxPrice={maxPrice}
          />
        </Box>
      </Box>

      <Box className="flex space-x-2 mt-2">
        <AIButton
          variant="solid"
          radius="full"
          onClick={handleSearch}
          className="flex-1"
          startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
        >
          {t("products.search")}
        </AIButton>
      </Box>
    </Box>
  );

  const activeFilters = [];
  if (searchState.keyword)
    activeFilters.push({ label: searchState.keyword, key: "keyword" });
  if (searchState.selectedCategories.length > 0) {
    searchState.selectedCategories.forEach((catId) => {
      const categoryName =
        categories.find((c: any) => c._id === catId)?.name || catId;
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
                  <p className="capitalize font-poppins text-xl text-gray-800">
                    Products
                  </p>
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
                      <ProductCardList product={null} isLoading={true} />
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
                      key={product._id || `product-${index}`}
                    >
                      <ProductCardList product={product} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box className="text-center py-3 md:py-6 lg:py-16 space-y-3">
                      <img src={NotFoundProduct} alt="Not Found Product" />
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
