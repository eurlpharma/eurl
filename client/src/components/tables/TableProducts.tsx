import { ProductData } from "@/types/product";
import { getLocalizedCategoryName } from "@/utils/formatters";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Link, useNavigate } from "react-router-dom";
import {
  IconCheckCircle,
  IconExcel,
  IconPenBold,
  IconTimeBold,
  IconTrashBold,
} from "../Iconify";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import unDrawEmpty from "../../assets/undraw/empty.svg";
import unDrawError from "../../assets/undraw/bug_fix.svg";
import AIButton from "../buttons/AIButton";
import { PlusIcon } from "lucide-react";
import UIChip from "../design/UIChip";
import UIProgress from "../design/UIProgress";
import { calcProgress } from "@/library/Calculation";
import { useNotification } from "@/hooks/useNotification";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { deleteProduct, getProducts } from "@/store/slices/productSlice";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import UIButton from "../design/UIButton";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface TableProductsProps extends HTMLAttributes<HTMLElement> {
  isPagination?: boolean;
  isViewAll?: "new" | "all" | null;
  header?: string;
  subHeader?: string;
  isHeader?: boolean;
  isFilter?: boolean;
  isRecent?: number | null;
}

const cells = [
  {
    key: "products.image",
    label: "image",
    align: "left" as const,
  },

  {
    key: "products.name",
    label: "name",
    align: "left" as const,
  },

  {
    key: "products.price",
    label: "price",
    align: "left" as const,
  },

  {
    key: "products.stock",
    label: "stock",
    align: "left" as const,
  },

  {
    key: "Published",
    label: "Published",
    align: "left" as const,
  },

  {
    key: "products.featured",
    label: "featured",
    align: "left" as const,
  },

  {
    key: "common.actions",
    label: "actions",
    align: "right" as const,
  },
];

const columnsMap: Record<string, string> = {
  name: "Name",
  price: "Price",
  oldPrice: "Old Price",
  countInStock: "Stock",
  isFeatured: "Featured",
  isVisible: "Visible",
  createdAt: "Created At",
};

const TableProducts: FC<TableProductsProps> = ({
  isPagination,
  isViewAll,
  header,
  subHeader,
  isHeader = true,
  isFilter,
  isRecent,
  ...props
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = `https://pharma-api-e5sd.onrender.com`;
  const { success } = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const [maxQuant, setMaxQuant] = useState<number>(0);
  const {
    products,
    loading,
    error,
    totalProducts,
  }: {
    products: ProductData[];
    loading: boolean;
    error: any;
    totalProducts: number;
  } = useSelector((state: any) => state.products);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isProductId, setIsProductId] = useState<string | null>(null);

  /* Search Products */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result: any = dispatch(
          getProducts({
            page: page + 1,
            keyword: searchTerm,
            limit: isRecent ? isRecent : rowsPerPage,
          })
        );
        if (getProducts.rejected.match(result)) {
          throw new Error(result.payload as string);
        }
      } catch (error) {
        return false;
      }
    };
    fetchProducts();
  }, [dispatch, isRecent, page, rowsPerPage, searchTerm]);

  /* Fetch Products */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result: any = dispatch(
          getProducts({ page: 1, limit: isRecent ? isRecent : 10 })
        );
        if (getProducts.rejected.match(result)) {
          throw new Error(result.payload as string);
        }
      } catch (error) {
        return false;
      }
    };
    fetchProducts();
  }, [dispatch, isRecent]);

  /* get max stock */
  useEffect(() => {
    if (products && products.length > 0) {
      const maxStock = Math.max(
        ...products.map((product: ProductData) => product.countInStock)
      );
      setMaxQuant(maxStock);
    }
  }, [products]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <img src={unDrawError} className="w-full lg:w-[50%] mx-auto" />
        <Typography className="font-paris text-2xl font-semibold capitalize text-girl-secondary">
          {t("common.errorOccurred")}
        </Typography>
        <AIButton radius="full" className="font-public-sans px-3">
          {t("common.refreshPage")}
        </AIButton>
      </div>
    );
  }

  if (products && products.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <img src={unDrawEmpty} className="w-full lg:w-[50%] mx-auto" />
        <Typography className="font-paris text-2xl font-semibold capitalize text-girl-secondary">
          {t("common.EmptyProducts")}
        </Typography>
        <AIButton
          variant="liner"
          radius="full"
          className="font-public-sans px-3 text-default"
          startContent={<PlusIcon />}
          onClick={() => navigate("/admin/products/add")}
        >
          {t("admin.NewProduct")}
        </AIButton>
      </div>
    );
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
  };

  const handleOpenDeleteDialog = (productId: string | undefined) => {
    if (productId) {
      setIsProductId(productId);
      setDeleteDialogOpen(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setIsProductId(null);
  };

  const handleDeleteProduct = async () => {
    if (isProductId) {
      try {
        await dispatch(deleteProduct(isProductId) as any).unwrap();
        success(t("admin.productDeleted"));
        dispatch(
          getProducts({
            page: page + 1,
            limit: rowsPerPage,
            keyword: searchTerm,
          }) as any
        );
      } catch (err) {
        return;
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  const limited = isRecent ?? Infinity;

  const handleExportExcel = () => {
    const filteredProducts = products.map((product) => {
      const filtered: Record<string, any> = {};
      Object.keys(columnsMap).forEach((key) => {
        let value = product[key as keyof typeof product];

        if (key === "createdAt" && typeof value === "string") {
          const date = new Date(value);
          value = date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        }

        filtered[columnsMap[key]] = value;
      });
      return filtered;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const today = new Date();
    const dateStr = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}`;

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, `products-${dateStr}.xlsx`);
  };

  return (
    <div {...props}>
      <Card classes={{ root: "shadow-lighter p-0 rounded-xl" }}>
        {isHeader && (
          <CardHeader
            className="font-public-sans"
            title={header && t(`admin.${header}`)}
            subheader={subHeader && t(`admin.${subHeader}`)}
            classes={{
              title: "font-public-sans text-medium lg:text-lg xl:text-xl",
            }}
            action={
              <div className="flex items-center gap-3">
                {isViewAll && (
                  <UIButton
                    color="grey"
                    variant="link"
                    component={Link}
                    size="sm"
                    className="text-tiny lg:text-sm"
                    startIcon={
                      isViewAll === "new" && (
                        <PlusIcon className="w-4 md:w-5 lg:w-6" />
                      )
                    }
                    to={
                      isViewAll === "all"
                        ? "/admin/products"
                        : "/admin/products/add"
                    }
                  >
                    {t(
                      isViewAll === "all"
                        ? "common.viewAll"
                        : "admin.NewProduct"
                    )}
                  </UIButton>
                )}

                <UIButton
                  startIcon={<IconExcel className="w-4 h-4" />}
                  onClick={handleExportExcel}
                  size="sm"
                  variant="light"
                  className="text-tiny lg:text-sm"
                >
                  Export
                </UIButton>
              </div>
            }
          />
        )}
        {isFilter && (
          <CardContent>
            <Box className="mb-4">
              <TextField
                fullWidth
                variant="outlined"
                placeholder={t("common.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </CardContent>
        )}
        <CardContent className="p-0">
          <TableContainer component={Paper} className="shadow-none">
            <SimpleBar style={{maxHeight: "66vh"}}>
              <Table
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px dashed #0000001f",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    {cells.map(({ align, key }) => (
                      <TableCell
                        key={key}
                        align={align}
                        className="capitalize font-public-sans"
                      >
                        {t(key)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    Array.from(Array(6)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-10 w-10" variant="rounded" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" component="h2" />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Box className="flex justify-end items-center gap-2">
                            <Skeleton variant="circular" className="w-6 h-6" />
                            <Skeleton variant="circular" className="w-6 h-6" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
                      {products?.map((product: ProductData, index: number) => {
                        if (index <= limited) {
                          const percent: number = calcProgress(
                            product.countInStock,
                            maxQuant
                          );

                          return (
                            <TableRow
                              key={product.id}
                              className="font-public-sans hover:bg-[#cdcdcd0d] transition duration-700"
                            >
                              <TableCell>
                                {product.images && product.images.length > 0 ? (
                                  <Box
                                    component="img"
                                    src={
                                      product.images[0].startsWith("http")
                                        ? product.images[0]
                                        : `${API_URL}${product.images[0]}`
                                    }
                                    alt={product.name}
                                    sx={{
                                      width: 50,
                                      height: 50,
                                      objectFit: "cover",
                                      borderRadius: 1,
                                    }}
                                  />
                                ) : (
                                  <Box
                                    component="img"
                                    src="/placeholder.png"
                                    alt="No image"
                                    sx={{
                                      width: 50,
                                      height: 50,
                                      objectFit: "cover",
                                      borderRadius: 1,
                                    }}
                                  />
                                )}
                              </TableCell>

                              <TableCell className="font-public-sans capitalize">
                                <div className="min-w-[10rem] max-w-[14rem] line-clamp-1">{product.name}</div>
                                <div className="text-gray-500">
                                  {product.category
                                    ? getLocalizedCategoryName(
                                        product.category,
                                        i18n.language
                                      )
                                    : "-"}
                                </div>
                              </TableCell>

                              <TableCell className="font-barlow lg:text-lg whitespace-nowrap">
                                {product.price} {t("ammount.da")}
                              </TableCell>

                              <TableCell className="font-barlow lg:text-lg">
                                <Box>
                                  <UIProgress
                                    className="max-w-20"
                                    variant="soft"
                                    size="sm"
                                    progress={percent}
                                    color={
                                      percent <= 0
                                        ? "error"
                                        : percent > 0 && percent <= 10
                                        ? "warning"
                                        : percent > 10 && percent <= 40
                                        ? "secondary"
                                        : percent > 40 && percent <= 80
                                        ? "grey"
                                        : percent > 80
                                        ? "primary"
                                        : "info"
                                    }
                                  />
                                  <div className="flex items-start gap-1 text-[#637381] text-tiny md:text-sm whitespace-nowrap">
                                    <span className="font-barlow">
                                      {product.countInStock
                                        .toString()
                                        .padStart(2, "0")}
                                    </span>
                                    <span className="font-public-sans">
                                      {product.countInStock > 0
                                        ? "in stock"
                                        : "out stock"}
                                    </span>
                                  </div>
                                </Box>
                              </TableCell>

                              <TableCell className="font-barlow">
                                <UIChip
                                  variant="soft"
                                  radius="full"
                                  className=""
                                  color={
                                    product.isVisible ? "primary" : "error"
                                  }
                                  size="sm"
                                >
                                  {t(
                                    `common.${
                                      product.isVisible
                                        ? "published"
                                        : "unpublished"
                                    }`
                                  )}
                                </UIChip>
                              </TableCell>

                              <TableCell className="font-barlow">
                                <UIChip
                                  variant="soft"
                                  radius="full"
                                  className="ps-0"
                                  color={
                                    product.isFeatured ? "secondary" : "primary"
                                  }
                                  size="sm"
                                  startContent={
                                    product.isFeatured ? (
                                      <IconTimeBold />
                                    ) : (
                                      <IconCheckCircle />
                                    )
                                  }
                                >
                                  {t(
                                    `common.${
                                      product.isFeatured
                                        ? "featured"
                                        : "available"
                                    }`
                                  )}
                                </UIChip>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center justify-end">
                                  <IconButton
                                    component={Link}
                                    to={`/admin/products/edit/${product.id}`}
                                    color="primary"
                                  >
                                    <IconPenBold />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleOpenDeleteDialog(product.id)
                                    }
                                  >
                                    <IconTrashBold />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      })}
                    </>
                  )}
                </TableBody>
              </Table>
            </SimpleBar>

            {isPagination && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalProducts || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={t("common.rowsPerPage")}
              />
            )}
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        className="backdrop-blur-sm bg-white/10 transition-transform-background duration-500"
        classes={{
          paper: "shadow-lighter rounded-xl",
        }}
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        container={document.getElementById("root")}
      >
        <DialogTitle className="font-public-sans">
          {t("admin.deleteProductTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="font-public-sans">
            {t("admin.deleteProductConfirmation")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <UIButton
            onClick={handleCloseDeleteDialog}
            variant="light"
            color="grey"
            size="sm"
          >
            {t("common.cancel")}
          </UIButton>
          <UIButton
            onClick={handleDeleteProduct}
            color="error"
            size="sm"
            variant="filled"
          >
            {t("common.delete")}
          </UIButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TableProducts;
