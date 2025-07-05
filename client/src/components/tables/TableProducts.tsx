import { ProductData } from "@/types/product";
import { getLocalizedCategoryName } from "@/utils/formatters";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { PencilIcon, TrashIcon } from "lucide-react";
import { ChangeEvent, FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Link } from "react-router-dom";

interface TableProductsProps extends HTMLAttributes<HTMLElement> {
  page: number;
  loading: boolean;
  rowsPerPage: number;
  error: string | null;
  handleChangePage: (_: unknown, newPage: number) => void;
  products: ProductData[] | null;
  totalProducts: number | undefined;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  handleOpenDeleteDialog: (id: string) => void;
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
    key: "products.category",
    label: "category",
    align: "left" as const,
  },

  {
    key: "products.stock",
    label: "stock",
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

const TableProducts: FC<TableProductsProps> = ({
  page,
  error,
  loading,
  products,
  rowsPerPage,
  totalProducts,
  handleChangePage,
  handleOpenDeleteDialog,
  handleChangeRowsPerPage,
  ...props
}) => {
  const { t } = useTranslation();
  const API_URL = `https://pharma-api-e5sd.onrender.com`;

  return (
    <div {...props}>
      <TableContainer component={Paper} className="rounded-xl shadow-lighter">
        <Table>
          <TableHead>
            <TableRow>
              {cells.map(({align, key}) => (
                <TableCell
                  align={
                    align && typeof align === "string"
                      ? align
                      : "inherit"
                  }
                >
                  {t(key)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="error">
                    {t("common.errorFetchingData")}: {error}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : products && products.length > 0 ? (
              products.map((product: any) => (
                <TableRow key={product.id}>
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
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price} DA</TableCell>
                  <TableCell>
                    {product.category
                      ? getLocalizedCategoryName(
                          product.category,
                          i18n.language
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>
                    {product.isFeatured ? (
                      <Chip
                        label={t("common.yes")}
                        color="primary"
                        size="small"
                      />
                    ) : (
                      <Chip
                        label={t("common.no")}
                        color="default"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      to={`/admin/products/edit/${product.id}`}
                      color="primary"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(product.id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {t("products.noProductsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalProducts || 0} // Use totalProducts from Redux
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("common.rowsPerPage")}
        />
      </TableContainer>
    </div>
  );
};

export default TableProducts;
