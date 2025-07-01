import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/store';
import { forgotPasswordRequest } from '@/store/slices/authSlice';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const [emailSent, setEmailSent] = useState(false);
  
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  // Form validation schema
  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t('validation.invalidEmail'))
      .required(t('validation.required')),
  });
  
  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await dispatch(forgotPasswordRequest(data.email)).unwrap();
      setEmailSent(true);
    } catch (err) {
      // Error is handled by the auth slice and displayed below
    }
  };
  
  return (
    <Container maxWidth="sm" className="py-12">
      <Paper elevation={3} className="p-8">
        <Typography variant="h4" component="h1" className="text-center mb-6 font-bold">
          {t('auth.forgotPassword')}
        </Typography>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        {emailSent ? (
          <Box>
            <Alert severity="success" className="mb-4">
              {t('auth.resetLinkSent')}
            </Alert>
            <Typography variant="body1" className="mb-4">
              {t('auth.checkEmailInstructions')}
            </Typography>
            <Button
              component={RouterLink}
              to="/auth/login"
              variant="contained"
              color="primary"
              fullWidth
            >
              {t('auth.backToLogin')}
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="body1" className="mb-6">
              {t('auth.forgotPasswordInstructions')}
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextField
                label={t('auth.email')}
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading}
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
                {loading ? t('common.loading') : t('auth.sendResetLink')}
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

export default ForgotPasswordPage;
