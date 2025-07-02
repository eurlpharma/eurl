import { useTranslation } from 'react-i18next';
import { ShippingAddress } from '@/store/slices/cartSlice';
import willayatData from '@/data/willayat.json';
import i18n from '@/i18n';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Paper,
} from '@mui/material';

interface ReviewOrderProps {
  shippingData: ShippingAddress;
  paymentMethod: string; 
  cartItems: any[];
}

const ReviewOrder = ({ shippingData, cartItems }: ReviewOrderProps) => {
  const { t } = useTranslation();
  
  const itemsPrice = cartItems && cartItems.length > 0
    ? cartItems.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      )
    : 0;
  const shippingPrice = 500;
  const totalPrice = Number(
    (itemsPrice + shippingPrice).toFixed(2)
  );
  
  const getWilayaName = (wilayaId: string | number) => {
    const wilaya = willayatData.find((item: any) => item.wilaya_id == wilayaId);
    if (!wilaya) return wilayaId;
    return i18n.language && i18n.language.startsWith('ar') ? wilaya.ar_name : wilaya.name;
  };
  

  const getDairaNameFromJson = (dairaId: string | number) => {
    const daira = willayatData.find((item: any) => item.id == dairaId);
    if (!daira) return dairaId;
    return i18n.language && i18n.language.startsWith('ar') ? daira.ar_name : daira.name;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom className="font-josefin">
        {t('checkout.orderSummary')}
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper className="p-4 shadow-sm rounded-none">
            <Typography variant="h6" gutterBottom className="font-josefin">
              {t('checkout.shippingAddress')}
            </Typography>
            <Typography gutterBottom>{shippingData.fullName}</Typography>
            <Typography gutterBottom>{shippingData.phone}</Typography>
            <Typography gutterBottom>
              {getWilayaName(shippingData.wilaya)}, {getDairaNameFromJson(shippingData.daira)}
            </Typography>
            <Typography gutterBottom>
              {t('checkout.deliveryType')}: {shippingData.deliveryType === 'home' ? t('checkout.deliveryHome') : t('checkout.deliveryOffice')}
            </Typography>
            {shippingData.address && (
              <Typography gutterBottom>{shippingData.address}</Typography>
            )}
          </Paper>
          
          <Paper className="p-4 mt-4 shadow-sm rounded-none">
            <Typography variant="h6" gutterBottom className="font-josefin">
              {t('checkout.paymentDetails')}
            </Typography>
            <Typography>{t('checkout.cashOnDelivery')}</Typography>
            <Typography variant="body2" color="textSecondary" className="mt-2">
              {t('checkout.paymentNote')}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper className="p-4 shadow-sm rounded-none">
            <Typography variant="h6" gutterBottom className="font-josefin">
              {t('checkout.orderItems')} ({cartItems ? cartItems.length : 0})
            </Typography>
            <List disablePadding>
              {cartItems && cartItems.length > 0 && cartItems.map((item) => (
                <ListItem key={item.product} className="py-2">
                  <Box className="w-16 h-16 mr-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </Box>
                  <ListItemText
                    primary={item.name}
                    secondary={`${t('products.quantity')}: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    DA {(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              
              <Divider className="my-2" />
              
              <ListItem className="py-2">
                <ListItemText primary={t('checkout.subtotal')} />
                <Typography variant="body1">DA {itemsPrice.toFixed(2)} DA</Typography>
              </ListItem>
              
              <ListItem className="py-2">
                <ListItemText primary={t('checkout.shipping')} />
                <Typography variant="body1">DA {shippingPrice.toFixed(2)} DA</Typography>
              </ListItem>
              
              <Divider className="my-2" />
              
              <ListItem className="py-2">
                <ListItemText primary={t('checkout.total')} />
                <Typography variant="h6" className="font-semibold">
                  {totalPrice.toFixed(2)} DA
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewOrder;
