import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  TextField,
  Grid,
  Paper,
} from '@mui/material';
import {
  CreditCardIcon,
  CurrencyEuroIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface PaymentFormProps {
  onSubmit: (method: string) => void;
  selectedMethod: string;
}

const PaymentForm = ({ onSubmit, selectedMethod }: PaymentFormProps) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState(selectedMethod || 'Credit Card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(paymentMethod);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        {t('checkout.paymentMethod')}
      </Typography>

      <FormControl component="fieldset" className="w-full">
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <Paper className="mb-4 p-4 border border-gray-200 hover:border-primary-500 transition-colors">
            <FormControlLabel
              value="Credit Card"
              control={<Radio />}
              label={
                <Box className="flex items-center">
                  <CreditCardIcon className="w-6 h-6 mr-2" />
                  <Typography>{t('checkout.creditCard')}</Typography>
                </Box>
              }
            />
            {paymentMethod === 'Credit Card' && (
              <Box className="mt-4 pl-8">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('checkout.cardNumber')}
                      placeholder="**** **** **** ****"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('checkout.expiryDate')}
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('checkout.cvv')}
                      placeholder="***"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('checkout.cardholderName')}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>

          <Paper className="mb-4 p-4 border border-gray-200 hover:border-primary-500 transition-colors">
            <FormControlLabel
              value="PayPal"
              control={<Radio />}
              label={
                <Box className="flex items-center">
                  <CurrencyEuroIcon className="w-6 h-6 mr-2" />
                  <Typography>PayPal</Typography>
                </Box>
              }
            />
            {paymentMethod === 'PayPal' && (
              <Box className="mt-4 pl-8">
                <Typography variant="body2" color="textSecondary">
                  {t('checkout.paypalDescription')}
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper className="mb-4 p-4 border border-gray-200 hover:border-primary-500 transition-colors">
            <FormControlLabel
              value="Cash on Delivery"
              control={<Radio />}
              label={
                <Box className="flex items-center">
                  <BanknotesIcon className="w-6 h-6 mr-2" />
                  <Typography>{t('checkout.cashOnDelivery')}</Typography>
                </Box>
              }
            />
            {paymentMethod === 'Cash on Delivery' && (
              <Box className="mt-4 pl-8">
                <Typography variant="body2" color="textSecondary">
                  {t('checkout.cashOnDeliveryDescription')}
                </Typography>
              </Box>
            )}
          </Paper>
        </RadioGroup>
      </FormControl>

      <Box className="mt-6 flex justify-end">
        <Button type="submit" variant="contained" color="primary">
          {t('checkout.continue')}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentForm;
