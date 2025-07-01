import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings, updateSettings } from '@/store/slices/settingsSlice';
import { RootState } from '@/store/storeConfig';
import { AppDispatch } from '@/store';
const API_URL = import.meta.env.VITE_API_URL || `http://192.168.1.2:5000`;
import AIButton from '@/components/buttons/AIButton';

const SettingsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, error, success } = useSelector((state: RootState) => state.settings);

  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    shippingPolicy: '',
    returnPolicy: '',
    privacyPolicy: '',
    termsAndConditions: '',
    maintenanceMode: false,
    currency: 'USD',
    taxRate: 0,
    minimumOrderAmount: 0,
    freeShippingThreshold: 50,
    googleMapUrl: '',
    siteLogo: '',
  });

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);


  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        ...settings,
        googleMapUrl: settings.googleMapUrl ?? '',
      }));
    }
  }, [settings]);

  const handleChange = (e: any) => {
    const { name, value, checked } = e.target;
    if (name === 'maintenanceMode') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.startsWith('socialMedia.')) {
      const platform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(updateSettings(formData));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    // ارفع الصورة إلى السيرفر (يفترض وجود endpoint /api/upload)
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formDataUpload,
    });
    const data = await res.json();
    setFormData(prev => ({ ...prev, siteLogo: data.url }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Typography variant="h4" component="h1" className="mb-6 font-josefin">
        {t('admin.settings')}
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4">
          {t('admin.settingsUpdated')}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('admin.generalSettings')} />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.siteName')}
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.siteDescription')}
                      name="siteDescription"
                      value={formData.siteDescription}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.contactEmail')}
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.contactPhone')}
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('admin.address')}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('admin.googleMapUrl') || 'Google Map URL'}
                      name="googleMapUrl"
                      value={formData.googleMapUrl}
                      onChange={handleChange}
                      placeholder="https://www.google.com/maps/embed?..."
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={2}>
                      {formData.siteLogo && (
                        <img src={formData.siteLogo} alt="Site Logo" style={{ maxHeight: 60, borderRadius: 8 }} />
                      )}
                      <Button variant="outlined" component="label">
                        {t('admin.siteLogo') || 'Site Logo'}
                        <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('admin.socialMedia')} />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Facebook"
                      name="socialMedia.facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Twitter"
                      name="socialMedia.twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Instagram"
                      name="socialMedia.instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Policies */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('admin.policies')} />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.shippingPolicy')}
                      name="shippingPolicy"
                      value={formData.shippingPolicy}
                      onChange={handleChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.returnPolicy')}
                      name="returnPolicy"
                      value={formData.returnPolicy}
                      onChange={handleChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.privacyPolicy')}
                      name="privacyPolicy"
                      value={formData.privacyPolicy}
                      onChange={handleChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.termsAndConditions')}
                      name="termsAndConditions"
                      value={formData.termsAndConditions}
                      onChange={handleChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Store Settings */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('admin.storeSettings')} />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.maintenanceMode}
                          onChange={handleChange}
                          name="maintenanceMode"
                        />
                      }
                      label={t('admin.maintenanceMode')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.currency')}
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.taxRate')}
                      name="taxRate"
                      type="number"
                      value={formData.taxRate}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: '%'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.minimumOrderAmount')}
                      name="minimumOrderAmount"
                      type="number"
                      value={formData.minimumOrderAmount}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: 'DA'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('admin.freeShippingThreshold')}
                      name="freeShippingThreshold"
                      type="number"
                      value={formData.freeShippingThreshold}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: 'DA'
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <AIButton
                type="submit"
                variant="solid"
                isLoading={loading}
              >
                {loading ? <CircularProgress size={24} /> : t('admin.saveSettings')}
              </AIButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SettingsPage;
