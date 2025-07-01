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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AppDispatch, RootState } from "@/store";
import { getProducts } from "@/store/slices/productSlice";
import { getCategories } from "@/store/slices/categorySlice";
import { setProductFilters } from "@/store/slices/uiSlice";
import ProductCard from "@/components/products/ProductCard";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { ProductData } from "@/types/product";
import ProductCardList from "@/components/products/ProductCardList";
import Breadcrumb from "@/components/global/Breadcrumb";
import AIButton from "@/components/buttons/AIButton";

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

  // Handle filter changes
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Update search state with current form values
    setSearchState({
      keyword: keywordInput,
      selectedCategories,
      priceRange,
      sortBy,
      page: 1, // Reset to first page on new search
    });
  };

  const handleCategoryChange = (cat: string) => {
    let newSelectedCategories: string[] = [];
    if (selectedCategories[0] === cat) {
      // إذا ضغطت على نفس التصنيف، ألغِ التحديد
      newSelectedCategories = [];
    } else {
      // إذا ضغطت على تصنيف جديد، حدده فقط
      newSelectedCategories = [cat];
    }

    setSelectedCategories(newSelectedCategories);

    // تطبيق البحث تلقائياً عند تغيير التصنيف
    setSearchState((prev) => ({
      ...prev,
      selectedCategories: newSelectedCategories,
      page: 1, // إعادة تعيين الصفحة إلى 1
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handlePriceChangeCommitted = () => {
    // تحديث حالة البحث عند الانتهاء من تغيير السعر
    setSearchState((prev) => ({
      ...prev,
      priceRange: [priceRange[0], priceRange[1]],
      page: 1,
    }));
  };

  const handleSortChange = (e: any) => {
    setSortBy(e.target.value);

    // Update search state immediately for sort changes
    setSearchState((prev) => ({
      ...prev,
      sortBy: e.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);

    // Update search state immediately for pagination
    setSearchState((prev) => ({
      ...prev,
      page: newPage,
    }));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    // Reset form values
    setKeywordInput("");
    setSelectedCategories([]);
    setPriceRange([0, 0]);
    setSortBy("createdAt");
    setPage(1);

    // Update search state immediately
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

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / limit);

  // Filter drawer/sidebar content
  const filtersContent = (
    <Box className="">
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
            categories.map((cat: any) => {
              return (
                <Box
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`
                    font-josefin text-lg capitalize py-2  rounded-lg cursor-pointer transition-all duration-200
                    ${
                      selectedCategories.includes(cat._id)
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
          onClick={handleSearch}
          className="flex-1"
          startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
        >
          {t("products.search")}
        </AIButton>
      </Box>
    </Box>
  );

  // Active filters display based on search state
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
      <Breadcrumb pageName="Products" />

      <Container maxWidth="xl" className="py-16">
        <Grid container spacing={4}>
          {/* Filters - Desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3} lg={2}>
              <Box className="sticky top-24 ">{filtersContent}</Box>
            </Grid>
          )}

          {/* Products */}
          <Grid item xs={12} md={9} lg={10}>
            {/* Toolbar */}
            <Box className="flex flex-wrap justify-between items-center mb-6">
              <div className="products-filter">
                <Box className="flex items-center mb-4 md:mb-0">
                  {isMobile && (
                    <AIButton
                      radius="full"
                      variant="solid"
                      startContent={<FunnelIcon className="w-5 h-5" />}
                      onClick={toggleFilters}
                    >
                      {t("products.filters")}
                    </AIButton>
                  )}
                </Box>
              </div>

              <FormControl
                variant="outlined"
                size="small"
                className="min-w-[200px] rounded-full"
                color="error"
              >
                <InputLabel>{t("products.sortBy")}</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label={t("products.sortBy")}
                >
                  <MenuItem value="createdAt">
                    {t("products.sortNewest")}
                  </MenuItem>
                  <MenuItem value="price">
                    {t("products.sortPriceLow")}
                  </MenuItem>
                  <MenuItem value="-price">
                    {t("products.sortPriceHigh")}
                  </MenuItem>
                  <MenuItem value="-rating">
                    {t("products.sortRating")}
                  </MenuItem>
                  <MenuItem value="name">{t("products.sortNameAZ")}</MenuItem>
                  <MenuItem value="-name">{t("products.sortNameZA")}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Active filters */}
            {activeFilters.length > 0 && (
              <Box className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((filter) => (
                  <Chip
                    key={filter.key}
                    label={filter.label}
                    onDelete={() => {
                      if (filter.key === "keyword") {
                        setKeywordInput("");
                        setSearchState((prev) => ({ ...prev, keyword: "" }));
                      }
                      if (filter.key.startsWith("category-")) {
                        const catId = filter.key.replace("category-", "");
                        const newCategories =
                          searchState.selectedCategories.filter(
                            (id) => id !== catId
                          );
                        setSelectedCategories(newCategories);
                        setSearchState((prev) => ({
                          ...prev,
                          selectedCategories: newCategories,
                        }));
                      }
                      if (filter.key === "price") {
                        setPriceRange([0, 0]);
                        setSearchState((prev) => ({
                          ...prev,
                          priceRange: [0, 0],
                        }));
                      }
                    }}
                    size="small"
                  />
                ))}
                {activeFilters.length > 1 && (
                  <Chip
                    label={t("products.clearAll")}
                    onClick={handleClearFilters}
                    size="small"
                    color="primary"
                  />
                )}
              </Box>
            )}

            {/* Products grid */}
            <Grid container spacing={2}>
              {loading ? (
                // Loading placeholders
                Array.from(new Array(limit)).map((_, index) => (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
                    <ProductCard product={{} as any} loading />
                  </Grid>
                ))
              ) : products && products.length > 0 ? (
                products.map((product: any) => (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCardList product={product} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box className="text-center py-16">
                    <Typography variant="h6" className="mb-2">
                      {t("products.noProductsFound")}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-4">
                      {t("products.tryDifferentFilters")}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClearFilters}
                    >
                      {t("products.clearFilters")}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
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

        {/* Mobile filters drawer */}
        {isMobile && (
          <Drawer
            container={document.getElementById("root")}
            anchor="left"
            open={filtersOpen}
            onClose={toggleFilters}
            PaperProps={{
              className: "backdrop-blur-lg bg-girl-white/60",
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
