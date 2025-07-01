import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/store';
import { resetPasswordRequest, verifyResetTokenRequest } from '@/store/slices/authSlice';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);
  
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  // Verify token on component mount
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenChecked(true);
        return;
      }
      
      try {
        await dispatch(verifyResetTokenRequest(token)).unwrap();
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
      } finally {
        setTokenChecked(true);
      }
    };
    
    checkToken();
  }, [dispatch, token]);
  
  // Form validation schema
  const schema = yup.object().shape({
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
  });
  
  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    
    try {
      await dispatch(resetPasswordRequest({ token, password: data.password })).unwrap();
      setResetSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
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
  
  // Show loading state while checking token
  if (!tokenChecked) {
    return (
      <Container maxWidth="sm" className="py-12">
        <Paper elevation={3} className="p-8 text-center">
          <CircularProgress size={40} className="mb-4" />
          <Typography>{t('common.loading')}</Typography>
        </Paper>
      </Container>
    );
  }
  
  // Show error if token is invalid
  if (!tokenValid) {
    return (
      <Container maxWidth="sm" className="py-12">
        <Paper elevation={3} className="p-8">
          <Typography variant="h4" component="h1" className="text-center mb-6 font-bold">
            {t('auth.invalidToken')}
          </Typography>
          <Alert severity="error" className="mb-4">
            {t('auth.resetLinkInvalid')}
          </Alert>
          <Typography variant="body1" className="mb-4">
            {t('auth.resetLinkExpired')}
          </Typography>
          <Button
            component={RouterLink}
            to="/auth/forgot-password"
            variant="contained"
            color="primary"
            fullWidth
          >
            {t('auth.requestNewLink')}
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="sm" className="py-12">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" className="text-center mb-6 font-bold">
          {t('auth.resetPassword')}
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        {resetSuccess ? (
          <Box>
            <Alert severity="success" className="mb-4">
              {t('auth.passwordResetSuccess')}
            </Alert>
            <Typography variant="body1" className="mb-4">
              {t('auth.redirectingToLogin')}
            </Typography>
            <CircularProgress size={24} className="mx-auto block" />
          </Box>
        ) : (
          <>
            <Typography variant="body1" className="mb-6">
              {t('auth.resetPasswordInstructions')}
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextField
                label={t('auth.newPassword')}
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
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? t('common.loading') : t('auth.resetPassword')}
              </Button>
              
              <Box className="text-center mt-4">
                <Typography variant="body2">
                  {t('auth.rememberPassword')}{' '}
                  <Link component={RouterLink} to="/auth/login" underline="hover">
                    {t('auth.login')}
                  </Link>
                </Typography>
              </Box>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
