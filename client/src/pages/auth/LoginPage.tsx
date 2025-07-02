import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AppDispatch, RootState } from "@/store";
import { login } from "@/store/slices/authSlice";
import AIButton from "@/components/buttons/AIButton";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  // Form validation schema
  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t("validation.invalidEmail"))
      .required(t("validation.required")),
    password: yup.string().required(t("validation.required")),
  });

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(login(data)).unwrap();

      if (result && result.token) {
        setTimeout(() => {
          navigate(redirect);
        }, 100);
      }
    } catch (err) {
      return null;
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" className="py-12 pt-24">
      <Paper elevation={3} className="p-8 rounded-none shadow-sm">
        <Typography
          variant="h4"
          component="h1"
          className="text-center mb-6 font-semibold font-josefin capitalize"
        >
          {/* {t('auth.login')} */}
          login account
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            label={t("auth.email")}
            type="email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading}
          />

          <TextField
            label={t("auth.password")}
            type={showPassword ? "text" : "password"}
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    aria-label={
                      showPassword ? "hide password" : "show password"
                    }
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box className="flex justify-end">
            <Link
              component={RouterLink}
              to="/auth-forgot-password"
              variant="body2"
              underline="hover"
            >
              {t("auth.forgotPassword")}
            </Link>
          </Box>

          <AIButton
            fullWidth
            type="submit"
            radius="none"
            variant="solid"
            isDisabled={loading}
            startContent={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading ? t("common.loading") : t("auth.login")}
          </AIButton>
        </form>

 
      </Paper>
    </Container>
  );
};

export default LoginPage;
