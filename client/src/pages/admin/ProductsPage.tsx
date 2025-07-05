import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/useNotification";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct } from "@/store/slices/productSlice";
import AIButton from "@/components/buttons/AIButton";
import { AppDispatch } from "@/store";
import TableProducts from "@/components/tables/TableProducts";

const ProductsPage = () => {
  const { t } = useTranslation();
  const { success } = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const { products, loading, error, totalProducts } = useSelector(
    (state: any) => state.products
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result: any = dispatch(
          getProducts({
            page: page + 1,
            limit: rowsPerPage,
            keyword: searchTerm,
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
  }, [dispatch, page, rowsPerPage, searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result: any = dispatch(getProducts({ page: 1, limit: 10 }));
        if (getProducts.rejected.match(result)) {
          throw new Error(result.payload as string);
        }
      } catch (error) {
        return false;
      }
    };
    fetchProducts();
  }, [dispatch]);

  // Manejadores de eventos para la paginación
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

  // Manejadores para el diálogo de eliminación
  const handleOpenDeleteDialog = (productId: string) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleDeleteProduct = async () => {
    if (selectedProductId) {
      try {
        await dispatch(deleteProduct(selectedProductId) as any).unwrap();
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

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-6">
        <Typography
          variant="h4"
          component="h1"
          className="font-semibold font-josefin"
        >
          {t("admin.products")}
        </Typography>

        <AIButton
          onClick={() => navigate("/admin/products/add")}
          variant="solid"
          radius="full"
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
        >
          {t("admin.addProduct")}
        </AIButton>
      </Box>

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

      {/* Tabla de productos */}
      <TableProducts
        page={page}
        error={error}
        loading={loading}
        products={products}
        rowsPerPage={rowsPerPage}
        totalProducts={totalProducts}
        handleChangePage={handleChangePage}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        container={document.getElementById("root")}
      >
        <DialogTitle>{t("admin.deleteProductTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("admin.deleteProductConfirmation")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t("common.cancel")}
          </Button>
          <Button onClick={handleDeleteProduct} color="error">
            {t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;
