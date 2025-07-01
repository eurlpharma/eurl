import { forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { hideNotification } from '@/store/slices/uiSlice';
import { Snackbar, Alert, AlertProps } from '@mui/material';

const AlertComponent = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert elevation={6} ref={ref} variant="filled" {...props} />
));

AlertComponent.displayName = 'AlertComponent';

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.ui?.notification);
  
  // التحقق من وجود البيانات قبل استخراجها
  const open = notification?.open || false;
  const message = notification?.message || '';
  const type = notification?.type || 'info';

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <AlertComponent
        onClose={handleClose}
        severity={type}
        sx={{ width: '100%' }}
      >
        {message}
      </AlertComponent>
    </Snackbar>
  );
};

export default Notification;
