import { ProductData } from "@/types/product";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import unDrawEmpty from "../../assets/undraw/empty.svg";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

interface ProductTableProps extends HTMLAttributes<HTMLElement> {
  products: ProductData[] | null;
}

const cellsTableProducts = [
  {
    key: "productImage",
    label: "productImage",
    algin: "start",
  },

  {
    key: "productName",
    label: "productName",
    align: "start",
  },

  {
    key: "category",
    label: "category",
    align: "start",
  },

  {
    key: "price",
    label: "price",
    align: "right",
  },

  {
    key: "stock",
    label: "stock",
    align: "right",
  },

  {
    key: "status",
    label: "status",
    align: "center",
  },
];

const ProductTable: FC<ProductTableProps> = ({ products, ...props }) => {

  const { t } = useTranslation()

  return (
    <div {...props}>
      <Card className="shadow-lighter rounded-xl font-public-sans">
        <CardHeader
          className="font-public-sans"
          title={t("admin.recentProducts")}
          action={
            <Button component={Link} to="/admin/products" color="primary">
              {t("common.viewAll")}
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {products && products.length > 0 ? (
            <TableContainer>
              <Table
                className="border-separate"
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px dashed #0000001f",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    {cellsTableProducts.map((cell) => (
                      <TableCell key={cell.key} align="center">
                        {t(`admin.${cell.label}`)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product: ProductData) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-girl-secondary/10 transition-background duration-700"
                    >
                      <TableCell>
                        <Box className="w-12 h-12 relative">
                          {product.images && product.images.length > 0 ? (
                            <img
                              alt={product.name}
                              src={product.images[0]}
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            <Box className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <PhotoIcon className="w-10 h-10 text-gray-400" />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-primary-600 hover:underline whitespace-nowrap"
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {typeof product.category === "string"
                          ? product.category
                          : product.category.nameEn}
                      </TableCell>
                      <TableCell align="right" className="whitespace-nowrap">
                        {product.price} {t("ammount.da")}
                      </TableCell>
                      <TableCell align="right">
                        {product.countInStock}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            product.countInStock === 0
                              ? t("products.outOfStock")
                              : product.countInStock < 10
                              ? t("products.lowStock")
                              : t("products.inStock")
                          }
                          color={
                            product.countInStock === 0
                              ? "error"
                              : product.countInStock < 10
                              ? "warning"
                              : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6">
              <img src={unDrawEmpty} className="w-[50%]" />

              <Typography className="font-paris text-girl-secondary text-2xl lg:text-3xl font-semibold capitalize">
                {t("products.noProductsFound")}
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTable;
