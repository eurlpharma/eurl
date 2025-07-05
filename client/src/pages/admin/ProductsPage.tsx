import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '@/store/slices/productSlice';
import AIButton from '@/components/buttons/AIButton';
import { AppDispatch } from '@/store';
import { useLocalizedCategory } from '@/hooks/useLocalizedCategory';
import { getLocalizedCategoryName } from '@/utils/formatters';
import i18n from '@/i18n';


const API_URL = import.meta.env.VITE_API_URL || `http://192.168.1.11:5000`;

const ProductsPage = () => {
  const { t } = useTranslation();
  const { success } = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { 
    products, 
    loading, 
    error, 
    totalProducts 
  } = useSelector((state: any) => state.products);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result: any = dispatch(getProducts({ page: page + 1, limit: rowsPerPage, keyword: searchTerm }));
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
        return false
      }
    };
    fetchProducts();
  }, [dispatch]);
  
  // Manejadores de eventos para la paginación
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        success(t('admin.productDeleted'));
        dispatch(getProducts({ page: page + 1, limit: rowsPerPage, keyword: searchTerm }) as any);
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
        <Typography variant="h4" component="h1" className="font-semibold font-josefin">
          {t('admin.products')}
        </Typography>

        <AIButton
          onClick={() => navigate("/admin/products/add")}
          variant="solid"
          radius="full"
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
        >
          {t('admin.addProduct')}
        </AIButton>
      </Box>
      
      {/* Barra de búsqueda */}
      <Box className="mb-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('common.search')}
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('products.image')}</TableCell>
              <TableCell>{t('products.name')}</TableCell>
              <TableCell>{t('products.price')}</TableCell>
              <TableCell>{t('products.category')}</TableCell>
              <TableCell>{t('products.stock')}</TableCell>
              <TableCell>{t('products.featured')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">{t('common.loading')}</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="error">{t('common.errorFetchingData')}: {error}</Typography>
                </TableCell>
              </TableRow>
            ) : products && products.length > 0 ? (
              products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <Box
                        component="img"
                        src={product.images[0].startsWith('http') ? product.images[0] : `${API_URL}${product.images[0]}`}
                        alt={product.name}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          borderRadius: 1
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
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price} DA</TableCell>
                  <TableCell>
                    {product.category ? getLocalizedCategoryName(product.category, i18n.language) : '-'}
                  </TableCell>
                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>
                    {product.isFeatured ? (
                      <Chip label={t('common.yes')} color="primary" size="small" />
                    ) : (
                      <Chip label={t('common.no')} color="default" size="small" />
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
                <TableCell colSpan={7} align="center">{t('products.noProductsFound')}</TableCell>
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
          labelRowsPerPage={t('common.rowsPerPage')}
        />
      </TableContainer>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>{t('admin.deleteProductTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('admin.deleteProductConfirmation')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteProduct} color="error">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;
