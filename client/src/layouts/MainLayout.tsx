import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Notification from '@/components/ui/Notification';

const MainLayout = () => {
  return (
    <Box className="flex flex-col min-h-screen">
      <Header />
      <Box component="main" className="flex-grow bg-girl-white">
        <Outlet />
      </Box>
      <Footer />
      <Notification />
    </Box>
  );
};

export default MainLayout;
