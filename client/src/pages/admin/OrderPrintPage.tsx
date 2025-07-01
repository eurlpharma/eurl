import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Container,
  Alert,
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getOrderForPrint } from '@/api/orders';
import { Order, OrderItem } from '@/types/order';
import type { UserData } from '@/types/user';
import { formatDate, formatPrice } from '@/utils/formatters';
import AIButton from '@/components/buttons/AIButton';
import willayatData from '@/data/willayat.json';
import i18n from '@/i18n';

const isUserData = (user: any): user is UserData => {
  return user && typeof user === 'object' && 'name' in user;
};

const INVOICE_PRIMARY = '#6C63FF'; 
const INVOICE_BG = '#F8F9FB';
const INVOICE_BORDER = '#E0E3EA';
const INVOICE_SUCCESS = '#388E3C';
const INVOICE_ERROR = '#D32F2F'; 
const INVOICE_TOTAL_BG = '#D81B60'; 

const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      background: ${INVOICE_BG} !important;
    }
    .no-print {
      display: none !important;
    }
    .print-only {
      display: block !important;
    }
    .invoice-paper {
      box-shadow: none !important;
      border: none !important;
      background: white !important;
    }
    .invoice-status-success {
      color: ${INVOICE_SUCCESS} !important;
    }
    .invoice-status-error {
      color: ${INVOICE_ERROR} !important;
    }
  }
`;

const OrderPrintPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const fetchOrder = useCallback(async () => {
    if (!id || !isMountedRef.current) return;

    // إلغاء أي طلب سابق
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // إنشاء controller جديد
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const data = await getOrderForPrint(id, abortControllerRef.current.signal);
      if (isMountedRef.current) {
        setOrder(data);
        retryCountRef.current = 0; // إعادة تعيين عداد المحاولات عند النجاح
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          return;
        }
        
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          setTimeout(fetchOrder, 1000 * retryCountRef.current);
          return;
        }

        if (isMountedRef.current) {
          setError(err.message || 'Error fetching order data');
        }
      } else {
        if (isMountedRef.current) {
          setError('An unexpected error occurred while fetching order data');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchOrder();

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOrder]);

  const handleBack = () => {
    navigate('/admin/orders');
  };

  const handlePrint = () => {
    window.print();
  };

  // في جزء عرض معلومات العميل
  const renderCustomerInfo = () => {
    if (!order) return null;

    if (isUserData(order.user)) {
      return (
        <>
          <Typography>
            Name: {order.user.name}
          </Typography>
          <Typography>
            Phone: {order.user.phone || 'Not available'}
          </Typography>
        </>
      );
    }
    // ضيف
    return (
      <>
        <Typography>
          Name: {order.guestInfo?.name || 'Not available'}
        </Typography>
        <Typography>
          Phone: {order.guestInfo?.phone || 'Not available'}
        </Typography>
      </>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <AIButton
          variant="solid"
          startContent={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Orders
        </AIButton>
      </Container>
    );
  }

  if (!order || (!order._id && !order.id)) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Order not found
        </Alert>
        <AIButton
          variant="solid"
          startContent={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Orders
        </AIButton>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <style>{printStyles}</style>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, '@media print': { display: 'none' } }}>
        <AIButton
          variant="solid"
          startContent={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </AIButton>
        <AIButton
          variant="solid"
          startContent={<PrintIcon />}
          onClick={handlePrint}
        >
          Print
        </AIButton>
      </Box>

      {/* محتوى الفاتورة */}
      <Paper 
        elevation={2}
        className="invoice-paper"
        sx={{ 
          p: { xs: 2, md: 5 },
          borderRadius: 4,
          background: INVOICE_BG,
          border: `1.5px solid ${INVOICE_BORDER}`,
          boxShadow: '0 4px 24px 0 rgba(108,99,255,0.04)',
        }}
      >
        {/* رأس الفاتورة */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h3" className="font-josefin" letterSpacing={1} gutterBottom sx={{ color: INVOICE_PRIMARY }}>
            Healthy Store
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Order Invoice
          </Typography>
        </Box>

        {/* بيانات الفاتورة */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
            <Typography className="uppercase">{order._id || order.id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Order Date</Typography>
            <Typography>{formatDate(order.createdAt)}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />

        {/* معلومات العميل والشحن */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-josefin" gutterBottom sx={{ color: INVOICE_PRIMARY }}>
              Customer Information
            </Typography>
            {renderCustomerInfo()}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-josefin" gutterBottom sx={{ color: INVOICE_PRIMARY }}>
              Shipping Address
            </Typography>
            {(() => {
              const wilayaObj = willayatData.find((w: any) => w.wilaya_id === order.shippingAddress.city || w.wilaya_id === order.shippingAddress.wilaya);
              const dairaObj = willayatData.find((d: any) => d.post_code === order.shippingAddress.postalCode);
              const wilayaName = wilayaObj ? (i18n.language.startsWith('ar') ? wilayaObj.ar_name : wilayaObj.name) : order.shippingAddress.city;
              const dairaName = dairaObj ? (i18n.language.startsWith('ar') ? dairaObj.ar_name : dairaObj.name) : order.shippingAddress.postalCode;
              return <Typography>{wilayaName}, {dairaName}</Typography>;
            })()}
            <Typography>{order.shippingAddress.address}</Typography>
            <Typography>
              Delivery : {order.shippingAddress.deliveryType === 'home' ? 'Home Delivery' : 'Office Delivery'}
            </Typography>
          </Grid>
        </Grid>

        {/* جدول تفاصيل الطلب */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" className="font-josefin" gutterBottom sx={{ color: INVOICE_PRIMARY }}>
            Order Details
          </Typography>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mt: 2 }}>
            <Box component="thead" sx={{ background: INVOICE_BG }}>
              <Box component="tr">
                <Box component="td" sx={{ color: INVOICE_PRIMARY, py: 1, px: 2, textAlign: 'left', borderBottom: `2px solid ${INVOICE_BORDER}` }}>Product</Box>
                <Box component="td" sx={{ color: INVOICE_PRIMARY, py: 1, px: 2, textAlign: 'center', borderBottom: `2px solid ${INVOICE_BORDER}` }}>Quantity</Box>
                <Box component="td" sx={{ color: INVOICE_PRIMARY, py: 1, px: 2, textAlign: 'right', borderBottom: `2px solid ${INVOICE_BORDER}` }}>Total</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {order.orderItems.map((item: OrderItem, idx: number) => (
                <Box
                  component="tr"
                  key={item._id || idx}
                  sx={{ background: '#fff' }}
                >
                  <Box component="td" sx={{ py: 1, px: 2 }}>{item.name}</Box>
                  <Box component="td" sx={{ py: 1, px: 2, textAlign: 'center' }}>{item.quantity ?? item.qty}</Box>
                  <Box component="td" sx={{ py: 1, px: 2, textAlign: 'right' }}>{formatPrice(item.price * (item.quantity ?? item.qty))}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ملخص الطلب بشكل جدول مع تمييز صف Total فقط */}
        <Box sx={{ mt: 4, maxWidth: 400, ml: 'auto', borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 8px 0 rgba(108,99,255,0.03)' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={{ py: 1, px: 2 }}>Subtotal</Box>
                <Box component="td" sx={{ py: 1, px: 2, textAlign: 'right' }}>{formatPrice(order.itemsPrice)}</Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ py: 1, px: 2 }}>Shipping</Box>
                <Box component="td" sx={{ py: 1, px: 2, textAlign: 'right' }}>{formatPrice(order.shippingPrice)}</Box>
              </Box>
              {order.discount > 0 && (
                <Box component="tr">
                  <Box component="td" sx={{ py: 1, px: 2 }}>Discount</Box>
                  <Box component="td" sx={{ py: 1, px: 2, textAlign: 'right', color: 'error.main' }}>-{formatPrice(order.discount)}</Box>
                </Box>
              )}
            </Box>
            <Box component="tfoot">
              <Box component="tr" sx={{ background: INVOICE_TOTAL_BG }}>
                <Box component="td" sx={{ py: 1.5, px: 2, color: '#fff', fontSize: 18 }} className="font-josefin">Total</Box>
                <Box component="td" sx={{ py: 1.5, px: 2, textAlign: 'right', color: '#fff', fontSize: 18 }}>{formatPrice(order.totalPrice)}</Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* حالة الطلب */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {order.isPaid && (
            <Typography
              className="invoice-status-success"
              sx={{
                color: INVOICE_SUCCESS,
                fontWeight: 'bold',
                fontSize: 20,
              }}
            >
              Paid
            </Typography>
          )}
          {order.isPaid && order.paidAt && (
            <Typography variant="body2" color="text.secondary">
              Payment Date: {formatDate(order.paidAt)}
            </Typography>
          )}
        </Box>

        {/* ملاحظات */}
        {order.notes && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: INVOICE_PRIMARY, fontWeight: 700 }}>
              Notes
            </Typography>
            <Typography>{order.notes}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default OrderPrintPage; 