import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  Container,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/store';
import { register as registerUser } from '@/store/slices/authSlice';
import AIButton from '@/components/buttons/AIButton';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  
  // Get redirect path from URL query params
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);
  
  // Form validation schema
  const schema = yup.object().shape({
    firstName: yup.string().required(t('validation.required')),
    lastName: yup.string().required(t('validation.required')),
    email: yup
      .string()
      .email(t('validation.invalidEmail'))
      .required(t('validation.required')),
    password: yup
      .string()
      .required(t('validation.required'))
      .min(8, t('validation.passwordLength'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        t('validation.passwordRequirements')
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('validation.passwordsMatch'))
      .required(t('validation.required')),
    acceptTerms: yup
      .boolean()
      .oneOf([true], t('validation.acceptTerms'))
      .required(t('validation.required')),
  });
  
  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { firstName, lastName, email, password } = data;
      // Combine firstName and lastName into a single name field as required by RegisterData
      const userData = {
        name: `${firstName} ${lastName}`,
        email,
        password,
      };
      await dispatch(registerUser(userData)).unwrap();
      // Navigation will happen in the useEffect above
    } catch (err) {
      // Error is handled by the auth slice and displayed below
      return null;
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <Container maxWidth="md" className="py-12">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" className="text-center mb-6 font-bold">
          {t('auth.createAccount')}
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('auth.firstName')}
                fullWidth
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('auth.lastName')}
                fullWidth
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          <TextField
            label={t('auth.email')}
            type="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading}
          />
          
          <TextField
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    aria-label={showPassword ? 'hide password' : 'show password'}
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
          
          <TextField
            label={t('auth.confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowConfirmPassword}
                    edge="end"
                    aria-label={
                      showConfirmPassword ? 'hide password' : 'show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                {...register('acceptTerms')}
                color="primary"
                disabled={loading}
              />
            }
            label={
              <Typography variant="body2">
                {t('auth.agreeToTerms')}{' '}
                <Link component={RouterLink} to="/terms" underline="hover">
                  {t('auth.termsAndConditions')}
                </Link>{' '}
                {t('auth.and')}{' '}
                <Link component={RouterLink} to="/privacy" underline="hover">
                  {t('auth.privacyPolicy')}
                </Link>
              </Typography>
            }
          />
          {errors.acceptTerms && (
            <Typography variant="caption" color="error">
              {errors.acceptTerms.message}
            </Typography>
          )}
        

          <AIButton
            fullWidth
            type="submit"
            radius="none"
            isDisabled={loading}
            startContent={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? t('common.loading') : t('auth.login')}
          </AIButton>
        </form>
        
        <Divider className="my-6">
          <Typography variant="body2" color="textSecondary">
            {t('auth.or')}
          </Typography>
        </Divider>
        
        <Box className="text-center">
          <Typography variant="body2">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              component={RouterLink}
              to={`/auth/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
              underline="hover"
            >
              {t('auth.login')}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
