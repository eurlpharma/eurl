import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { RootState } from "@/store";
import { ShippingAddress as BaseShippingAddress } from "@/store/slices/cartSlice";
import willayatData from "@/data/willayat.json";
import i18n from "@/i18n";
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormHelperText,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import clsx from "clsx";
import { IconHouse, IconOffice } from "../Iconify";

interface ShippingAddress extends BaseShippingAddress {
  postalCode?: string;
  dairaName?: string;
  deliveryType?: 'home' | 'office';
}

interface ShippingFormProps {
  onSubmit: (data: ShippingAddress) => void;
  initialData?: ShippingAddress;
}

const ShippingForm = ({ onSubmit, initialData }: ShippingFormProps) => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [availableDairas, setAvailableDairas] = useState<any[]>([]);

  const schema = yup.object().shape({
    fullName: yup.string().required(t("validation.required")),
    phone: yup.string().required(t("validation.required")),
    wilaya: yup.string().required(t("validation.required")),
    daira: yup.string().required(t("validation.required")),
    address: yup.string(),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingAddress>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      fullName: user?.name || "",
      phone: "",
      wilaya: "",
      daira: "",
      address: "",
      postalCode: "",
      deliveryType: "office",
    },
  });

  const selectedWilaya = watch("wilaya");
  const selectedDaira = watch("daira");
  const deliveryType = watch('deliveryType');

  useEffect(() => {
    if (selectedWilaya) {
      const dairas = willayatData.filter((item: any) => item.wilaya_id === selectedWilaya);
      setAvailableDairas(dairas);
      setValue("daira", "");
      setValue("postalCode", "");
    }
  }, [selectedWilaya, setValue]);

  useEffect(() => {
    if (selectedDaira) {
      const dairaObj = willayatData.find((item: any) => item.id === selectedDaira);
      if (dairaObj) {
        setValue("postalCode", dairaObj.post_code);
        setValue("dairaName", i18n.language.startsWith('ar') ? dairaObj.ar_name : dairaObj.name);
      }
    }
  }, [selectedDaira, setValue]);

  useEffect(() => {
    if (!deliveryType) {
      setValue('deliveryType', 'office');
    }
  }, [deliveryType, setValue]);

  const wilayas = Array.from(
    willayatData.reduce((acc: Map<string, any>, curr: any) => {
      if (!acc.has(curr.wilaya_id)) {
        acc.set(curr.wilaya_id, {
          wilaya_id: curr.wilaya_id,
          name: curr.name,
          ar_name: curr.ar_name,
        });
      }
      return acc;
    }, new Map()).values()
  );

  // Helper to get wilaya name by language
  const getWilayaName = (wilaya: any) => {
    if (i18n.language.startsWith('ar')) return wilaya.ar_name;
    return wilaya.name;
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {t("checkout.shippingAddress")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            autoComplete="off"
            label={t("checkout.fullName")}
            {...register("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            autoComplete="off"
            label={t("checkout.phone")}
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            placeholder="0XXXXXXXXX"
            dir="ltr"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.wilaya}>
            <InputLabel id="wilaya-label">{t("checkout.wilaya")}</InputLabel>
            <Select
              labelId="wilaya-label"
              label={t("checkout.wilaya")}
              {...register("wilaya")}
            >
              {wilayas.map((wilaya) => (
                <MenuItem key={wilaya.wilaya_id} value={wilaya.wilaya_id}>
                  {`${wilaya.wilaya_id} - ${getWilayaName(wilaya)}`}
                </MenuItem>
              ))}
            </Select>
            {errors.wilaya && (
              <FormHelperText>{errors.wilaya.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            error={!!errors.daira}
            disabled={!selectedWilaya}
          >
            <InputLabel id="daira-label">{t("checkout.daira")}</InputLabel>
            <Select
              labelId="daira-label"
              label={t("checkout.daira")}
              {...register("daira")}
            >
              {availableDairas.map((daira) => (
                <MenuItem key={daira.id} value={daira.id}>
                  {i18n.language.startsWith('ar') ? daira.ar_name : daira.name}
                </MenuItem>
              ))}
            </Select>
            {errors.daira && (
              <FormHelperText>{errors.daira.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            autoComplete="off"
            label={t("checkout.address")}
            {...register("address")}
            error={!!errors.address}
            helperText={errors.address?.message}
            placeholder={t("checkout.addressOptional")}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" className="mb-2 font-josefin">
            {t('checkout.deliveryType') || 'نوع التوصيل'}
          </Typography>
          <Box display="flex" gap={2} mt={1}>
            <button
              type="button"
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border transition shadow-sm ${deliveryType === 'home' ? 'border-girl-secondary bg-girl-secondary/10' : 'border-gray-300 bg-white'}`}
              onClick={() => setValue('deliveryType', 'home')}
            >
              <IconHouse className="w-8 h-8" />
              <span className="mt-2 font-medium text-base">{t('checkout.deliveryHome') || 'توصيل للمنزل'}</span>
            </button>
            <button
              type="button"
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border transition shadow-sm ${deliveryType === 'office' ? 'border-girl-secondary bg-girl-secondary/10' : 'border-gray-300 bg-white'}`}
              onClick={() => setValue('deliveryType', 'office')}
            >
              <IconOffice className="w-8 h-8" />
              <span className="mt-2 font-medium text-base">{t('checkout.deliveryOffice') || 'توصيل للمكتب'}</span>
            </button>
          </Box>
          <input type="hidden" {...register('deliveryType')} />
        </Grid>
      </Grid>

      <Box className="mt-6 flex justify-end">
        <button
          type="submit"
          color="primary"
          className={clsx(
            " px-5 py-2 flex items-center gap-1",
            " font-josefin text-girl-white",
            "bg-girl-secondary cursor-pointer"
          )}
        >
          {t("checkout.continue")}
        </button>
      </Box>
    </Box>
  );
};

export default ShippingForm;
