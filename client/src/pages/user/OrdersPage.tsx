import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { EyeIcon } from '@heroicons/react/24/outline';
import { AppDispatch, RootState } from '@/store';
import { getUserOrders } from '@/store/slices/orderSlice';

const OrdersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { orders, loading, error, totalOrders } = useSelector(
    (state: RootState) => state.orders
  );
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  useEffect(() => {
    dispatch(getUserOrders({ page, limit }));
  }, [dispatch, page, limit]);
  
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(totalOrders / limit);
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        {t('orders.myOrders')}
      </Typography>
      
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Paper className="p-4">
        {loading && orders.length === 0 ? (
          <Box className="flex justify-center py-8">
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Box className="text-center py-8">
            <Typography variant="h6" className="mb-4">
              {t('orders.noOrders')}
            </Typography>
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              color="primary"
            >
              {t('orders.startShopping')}
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('orders.orderId')}</TableCell>
                    <TableCell>{t('orders.date')}</TableCell>
                    <TableCell>{t('orders.total')}</TableCell>
                    <TableCell>{t('orders.status')}</TableCell>
                    <TableCell align="right">{t('orders.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <Typography variant="body2" className="font-medium">
                          #{order._id.substring(order._id.length - 8)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        ${order.totalPrice.toFixed(2)} DA
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`orders.status.${order.status.toLowerCase()}`)}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={RouterLink}
                          to={`/orders/${order._id}`}
                          startIcon={<EyeIcon className="w-4 h-4" />}
                          size="small"
                        >
                          {t('orders.view')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {totalPages > 1 && (
              <Box className="flex justify-center mt-4">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default OrdersPage;
