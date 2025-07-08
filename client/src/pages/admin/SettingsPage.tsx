import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getSettings, updateSettings } from "@/store/slices/settingsSlice";
import { RootState } from "@/store/storeConfig";
import { AppDispatch } from "@/store";

const API_URL =
  import.meta.env.VITE_API_URL || `https://pharma-api-e5sd.onrender.com`;
import Preloader from "@/components/global/Preloader";
import FormLayout from "@/components/layout/FormLayout";
import UIButton from "@/components/design/UIButton";

const SettingsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading } = useSelector(
    (state: RootState) => state.settings
  );

  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
    shippingPolicy: "",
    returnPolicy: "",
    privacyPolicy: "",
    termsAndConditions: "",
    maintenanceMode: false,
    currency: "USD",
    taxRate: 0,
    minimumOrderAmount: 0,
    freeShippingThreshold: 50,
    googleMapUrl: "",
    siteLogo: "",
  });

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...prev,
        ...settings,
        googleMapUrl: settings.googleMapUrl ?? "",
      }));
    }
  }, [settings]);

  const handleChange = (e: any) => {
    const { name, value, checked } = e.target;
    if (name === "maintenanceMode") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name.startsWith("socialMedia.")) {
      const platform = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
    formDataUpload.append("image", file);
    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formDataUpload,
    });
    const data = await res.json();
    setFormData((prev) => ({ ...prev, siteLogo: data.url }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Preloader />
      </Box>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between gap-3 px-4 mb-4 w-full lg:w-[720px] xl:w-[880px] mx-auto">
        <Typography
          component="div"
          className="font-public-sans text-lg md:text-xl"
        >
          {t("admin.settings")}
        </Typography>
      </div>

      <Paper
        elevation={0}
        className="lg:p-4 mb-6 w-full lg:w-[720px] xl:w-[880px] mx-auto font-public-sans"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* General Settings info */}
            <FormLayout
              title={t("admin.generalSettings")}
              subTitle="Name, description, rich..."
            >
              <TextField
                fullWidth
                label={t("admin.siteName")}
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label={t("admin.siteDescription")}
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleChange}
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                label={t("admin.contactEmail")}
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                type="email"
              />
              <TextField
                fullWidth
                label={t("admin.contactPhone")}
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label={t("admin.address")}
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                label={t("admin.googleMapUrl") || "Google Map URL"}
                name="googleMapUrl"
                value={formData.googleMapUrl}
                onChange={handleChange}
                placeholder="https://www.google.com/maps/embed?..."
              />
              <Box display="flex" alignItems="center" gap={2}>
                {formData.siteLogo && (
                  <img
                    src={formData.siteLogo}
                    alt="Site Logo"
                    style={{ maxHeight: 60, borderRadius: 8 }}
                  />
                )}
                <Button variant="outlined" component="label">
                  {t("admin.siteLogo") || "Site Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleLogoChange}
                  />
                </Button>
              </Box>
            </FormLayout>

            {/* Social Media */}
            <FormLayout
              title={t("admin.socialMedia")}
              subTitle="Additional functions and attributes..."
            >
              <TextField
                fullWidth
                label="Facebook"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Twitter"
                name="socialMedia.twitter"
                value={formData.socialMedia.twitter}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Instagram"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram}
                onChange={handleChange}
              />
            </FormLayout>

            {/* Policies */}
            <FormLayout
              title={t("admin.policies")}
              subTitle="Price related inputs"
            >
              <TextField
                fullWidth
                label={t("admin.shippingPolicy")}
                name="shippingPolicy"
                value={formData.shippingPolicy}
                onChange={handleChange}
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label={t("admin.returnPolicy")}
                name="returnPolicy"
                value={formData.returnPolicy}
                onChange={handleChange}
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label={t("admin.privacyPolicy")}
                name="privacyPolicy"
                value={formData.privacyPolicy}
                onChange={handleChange}
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label={t("admin.termsAndConditions")}
                name="termsAndConditions"
                value={formData.termsAndConditions}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </FormLayout>

            {/* More Settings */}
            <FormLayout
              title={t("admin.storeSettings")}
              subTitle="Price related inputs"
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.maintenanceMode}
                    onChange={handleChange}
                    name="maintenanceMode"
                  />
                }
                label={t("admin.maintenanceMode")}
              />
              <TextField
                fullWidth
                label={t("admin.currency")}
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label={t("admin.taxRate")}
                name="taxRate"
                type="number"
                value={formData.taxRate}
                onChange={handleChange}
                InputProps={{
                  endAdornment: "%",
                }}
              />
              <TextField
                fullWidth
                label={t("admin.minimumOrderAmount")}
                name="minimumOrderAmount"
                type="number"
                value={formData.minimumOrderAmount}
                onChange={handleChange}
                InputProps={{
                  startAdornment: "DA",
                }}
              />
              <TextField
                fullWidth
                label={t("admin.freeShippingThreshold")}
                name="freeShippingThreshold"
                type="number"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
                InputProps={{
                  startAdornment: "DA",
                }}
              />
            </FormLayout>

            {/* Submit button */}
            <Box display="flex" justifyContent="flex-end">
              <UIButton type="submit" isLoading={loading}>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  t("admin.saveSettings")
                )}
              </UIButton>
            </Box>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default SettingsPage;
