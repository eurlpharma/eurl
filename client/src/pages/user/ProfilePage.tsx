import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  Divider,
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
import { updateProfile, changePassword } from '@/store/slices/authSlice';
import { useNotification } from '@/hooks/useNotification';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="pt-4">{children}</Box>}
    </div>
  );
};

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { success, error: showError } = useNotification();
  
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile form validation schema
  const profileSchema = yup.object().shape({
    firstName: yup.string().required(t('validation.required')),
    lastName: yup.string().required(t('validation.required')),
    email: yup
      .string()
      .email(t('validation.invalidEmail'))
      .required(t('validation.required')),
    phone: yup.string(),
    address: yup.string(),
    city: yup.string(),
    postalCode: yup.string(),
    country: yup.string(),
  });
  
  // Password form validation schema
  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required(t('validation.required')),
    newPassword: yup
      .string()
      .required(t('validation.required'))
      .min(8, t('validation.passwordLength'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        t('validation.passwordRequirements')
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], t('validation.passwordsMatch'))
      .required(t('validation.required')),
  });
  
  // Initialize profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
    },
  });
  
  // Initialize password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });
  
  // Set default values when user data is loaded
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || ['', ''];
      resetProfile({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
      });
    }
  }, [user, resetProfile]);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const userData = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      };
      
      await dispatch(updateProfile(userData)).unwrap();
      success(t('profile.updateSuccess'));
    } catch (err) {
      showError(t('profile.updateError'));
    }
  };
  
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await dispatch(
        changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      ).unwrap();
      
      success(t('profile.passwordUpdateSuccess'));
      resetPassword();
    } catch (err) {
      showError(t('profile.passwordUpdateError'));
    }
  };
  
  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return nameParts[0][0].toUpperCase();
  };
  
  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        {t('profile.title')}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className="p-6 text-center">
            <Avatar
              className="mx-auto mb-4 bg-primary-600 text-white"
              sx={{ width: 80, height: 80, fontSize: 32 }}
            >
              {getUserInitials()}
            </Avatar>
            
            <Typography variant="h6" className="font-bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-4">
              {user?.email}
            </Typography>
            
            <Divider className="my-4" />
            
            <Box className="text-left">
              <Typography variant="subtitle2" className="mb-1">
                {t('profile.accountType')}:
              </Typography>
              <Typography variant="body2" className="mb-3">
                {user?.role === 'admin' ? t('profile.admin') : t('profile.customer')}
              </Typography>
              
              <Typography variant="subtitle2" className="mb-1">
                {t('profile.memberSince')}:
              </Typography>
              <Typography variant="body2">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : '-'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className="p-6">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              className="mb-4"
            >
              <Tab label={t('profile.personalInfo')} />
              <Tab label={t('profile.security')} />
            </Tabs>
            
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            
            {/* Personal Information Tab */}
            <TabPanel value={activeTab} index={0}>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('auth.firstName')}
                      fullWidth
                      {...registerProfile('firstName')}
                      error={!!profileErrors.firstName}
                      helperText={profileErrors.firstName?.message}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('auth.lastName')}
                      fullWidth
                      {...registerProfile('lastName')}
                      error={!!profileErrors.lastName}
                      helperText={profileErrors.lastName?.message}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('auth.email')}
                      type="email"
                      fullWidth
                      {...registerProfile('email')}
                      error={!!profileErrors.email}
                      helperText={profileErrors.email?.message}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('profile.phone')}
                      fullWidth
                      {...registerProfile('phone')}
                      error={!!profileErrors.phone}
                      helperText={profileErrors.phone?.message}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('profile.address')}
                      fullWidth
                      {...registerProfile('address')}
                      error={!!profileErrors.address}
                      helperText={profileErrors.address?.message}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('profile.city')}
                      fullWidth
                      {...registerProfile('city')}
                      error={!!profileErrors.city}
                      helperText={profileErrors.city?.message}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('profile.postalCode')}
                      fullWidth
                      {...registerProfile('postalCode')}
                      error={!!profileErrors.postalCode}
                      helperText={profileErrors.postalCode?.message}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('profile.country')}
                      fullWidth
                      {...registerProfile('country')}
                      error={!!profileErrors.country}
                      helperText={profileErrors.country?.message}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                      {loading ? t('common.saving') : t('profile.saveChanges')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel value={activeTab} index={1}>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label={t('profile.currentPassword')}
                      type={showCurrentPassword ? 'text' : 'password'}
                      fullWidth
                      {...registerPassword('currentPassword')}
                      error={!!passwordErrors.currentPassword}
                      helperText={passwordErrors.currentPassword?.message}
                      disabled={loading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={toggleShowCurrentPassword}
                              edge="end"
                              aria-label={
                                showCurrentPassword ? 'hide password' : 'show password'
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('profile.newPassword')}
                      type={showNewPassword ? 'text' : 'password'}
                      fullWidth
                      {...registerPassword('newPassword')}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword?.message}
                      disabled={loading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={toggleShowNewPassword}
                              edge="end"
                              aria-label={
                                showNewPassword ? 'hide password' : 'show password'
                              }
                            >
                              {showNewPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('profile.confirmNewPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      fullWidth
                      {...registerPassword('confirmPassword')}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword?.message}
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
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="caption" className="text-gray-600 mb-4 block">
                      {t('profile.passwordRequirements')}
                    </Typography>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                      {loading ? t('common.saving') : t('profile.updatePassword')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
