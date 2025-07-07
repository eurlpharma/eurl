import { ProductData } from "@/types/product";
import { getLocalizedCategoryName } from "@/utils/formatters";
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { ChangeEvent, FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { Link, useNavigate } from "react-router-dom";
import { IconCheckCircle, IconPenBold, IconTime, IconTrashBold } from "../Iconify";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import unDrawEmpty from "../../assets/undraw/empty.svg";
import unDrawError from "../../assets/undraw/bug_fix.svg";
import AIButton from "../buttons/AIButton";
import { PlusIcon } from "lucide-react";
import UIChip from "../chip/UIChip";

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
  const navigate = useNavigate();
  const API_URL = `https://pharma-api-e5sd.onrender.com`;

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

  return (
    <div {...props}>
      <TableContainer
        component={Paper}
        className="rounded-xl shadow-lighter mx-auto"
      >
        <SimpleBar style={{ maxHeight: "75vh" }}>
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
                  {products?.map((product: any) => (
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
                      <TableCell className="font-public-sans whitespace-nowrap capitalize">
                        <div>{product.name}</div>
                        <div className="text-gray-500">
                          {product.category
                            ? getLocalizedCategoryName(
                                product.category,
                                i18n.language
                              )
                            : "-"}
                        </div>
                      </TableCell>
                      <TableCell className="font-barlow text-lg whitespace-nowrap">
                        {product.price} {t("ammount.da")}
                      </TableCell>
                      <TableCell className="font-barlow text-lg">
                        {product.countInStock}
                      </TableCell>
                      <TableCell className="font-barlow">
                        <UIChip
                          variant="soft"
                          radius="full"
                          color={product.isFeatured ? "secondary" : "primary"}
                          size="sm"
                          startContent={product.isFeatured ? <IconTime /> : <IconCheckCircle /> }
                        >
                          {t(
                            `common.${
                              product.isFeatured ? "featured" : "available"
                            }`
                          )}
                        </UIChip>
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex items-center justify-end pe-3">
                          <IconButton
                            component={Link}
                            to={`/admin/products/edit/${product.id}`}
                            color="primary"
                          >
                            <IconPenBold />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(product.id)}
                          >
                            <IconTrashBold />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </SimpleBar>

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
