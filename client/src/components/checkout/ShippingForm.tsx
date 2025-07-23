import clsx from "clsx";
import * as yup from "yup";
import { AppDispatch, RootState } from "@/store";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IconHouse, IconOffice } from "../Iconify";
import { yupResolver } from "@hookform/resolvers/yup";
import { ShippingAddress as BaseShippingAddress } from "@/store/slices/cartSlice";
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
import { getPricing, getWilayat } from "@/store/slices/deliverySlice";

interface WilayaType {
  id: number;
  name: string;
  zone: number;
  is_deliverable: number;
}

interface DayraType {
  commune_id: number;
  commune_name: string;
  economic_desk: number;
  economic_home: number;
  express_desk: number;
  express_home: number;
}

interface ShippingAddress extends BaseShippingAddress {
  dairaName?: string;
  deliveryType?: "home" | "office";
}

interface ShippingFormProps {
  onSubmit: (data: ShippingAddress) => void;
  initialData?: ShippingAddress;
}

const ShippingForm = ({ onSubmit, initialData }: ShippingFormProps) => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isDayrat, setIsDayrat] = useState<DayraType[] | null>([]);
  const [isDayra, setIsDayra] = useState<DayraType | null>(null);

  const { pricing, wilayat } = useSelector(
    (state: RootState) => state.delivery
  );

  useEffect(() => {
    dispatch(getWilayat());
  }, [dispatch]);

  const schema = yup.object().shape({
    fullName: yup.string().required(t("validation.required")),
    phone: yup.string().required(t("validation.required")),
    wilaya: yup.string().required(t("validation.required")),
    daira: yup.string().required(t("validation.required")),
    address: yup.string(),
    deliveryPrice: yup.number().min(0).max(100000),
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
      deliveryType: "office",
      deliveryPrice: 0,
    },
  });

  const selectedWilaya = watch("wilaya");
  const selectedDaira = watch("daira");
  const deliveryType = watch("deliveryType");

  useEffect(() => {
    if (selectedWilaya) {
      dispatch(getPricing({ from: 16, to: Number(selectedWilaya) }));
    }
  }, [selectedWilaya, dispatch]);

  useEffect(() => {
    if (selectedWilaya) {
      const dayrat = Object.values(pricing.per_commune || {}) as DayraType[];
      if (dayrat && dayrat.length > 0) {
        setValue("daira", "");
        setIsDayrat(dayrat);
      }
    }
  }, [dispatch, pricing, selectedWilaya]);

  useEffect(() => {
    if (selectedDaira) {
      const getDayra: DayraType | undefined = isDayrat?.find(
        (d) =>
          d.commune_name.toLocaleLowerCase() ===
          selectedDaira.toLocaleLowerCase()
      );

      if (getDayra) {
        setIsDayra(getDayra);
        setValue("dairaName", getDayra.commune_name);
      }
    }
  }, [selectedDaira, setValue, dispatch]);

  useEffect(() => {
    if (!deliveryType) {
      setValue("deliveryType", "office");
    }
  }, [deliveryType, setValue]);

  useEffect(() => {
    if (isDayra) {
      if (watch("deliveryType") === "home") {
        setValue("deliveryPrice", isDayra.economic_home);
      } else {
        setValue("deliveryPrice", isDayra.economic_desk);
      }
    }
  }, [watch("deliveryType"), isDayra]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {t("checkout.shippingAddress")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            autoComplete="off"
            label={t("checkout.fullName")}
            {...register("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            autoComplete="off"
            label={t("checkout.phone")}
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            placeholder="05 00 00 00 00"
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
              {wilayat &&
                !wilayat.loading &&
                wilayat.data &&
                wilayat.data.length > 0 &&
                wilayat.data.map((w: WilayaType) => (
                  <MenuItem key={w.id} value={w.id}>
                    {`${w.id} - ${w.name}`}
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
            disabled={!isDayrat || isDayrat.length < 1}
          >
            <InputLabel id="daira-label">{t("checkout.daira")}</InputLabel>
            <Select
              labelId="daira-label"
              label={t("checkout.daira")}
              {...register("daira")}
            >
              {isDayrat &&
                isDayrat.map((daira) => (
                  <MenuItem key={daira.commune_name} value={daira.commune_name}>
                    {daira.commune_name}
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
            {t("checkout.deliveryType") || "نوع التوصيل"}
          </Typography>
          <Box display="flex" gap={2} mt={1}>
            <button
              type="button"
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border transition shadow-sm ${
                deliveryType === "home"
                  ? "border-girl-secondary bg-girl-secondary/10"
                  : "border-gray-300 bg-white"
              }`}
              onClick={() => setValue("deliveryType", "home")}
            >
              <IconHouse className="w-8 h-8" />
              <span className="mt-2 font-medium text-base">
                {t("checkout.deliveryHome") || "توصيل للمنزل"}
              </span>
            </button>
            <button
              type="button"
              className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border transition shadow-sm ${
                deliveryType === "office"
                  ? "border-girl-secondary bg-girl-secondary/10"
                  : "border-gray-300 bg-white"
              }`}
              onClick={() => setValue("deliveryType", "office")}
            >
              <IconOffice className="w-8 h-8" />
              <span className="mt-2 font-medium text-base">
                {t("checkout.deliveryOffice") || "توصيل للمكتب"}
              </span>
            </button>
          </Box>
          <input type="hidden" {...register("deliveryType")} />
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
