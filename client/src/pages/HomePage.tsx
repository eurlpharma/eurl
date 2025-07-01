import {
  Box,
} from '@mui/material';
import HeroHome from '@/components/hero/HeroHome';

import TopTheCharts from '@/components/global/TopTheCharts';
import StretchSection from '@/components/global/StretchSection';
import CatsBlog from '@/components/global/CatsBlog';
import OfferSection from '@/components/global/OfferSection';
import LastProducts from '@/components/global/LastProducts';
import BlogSection from '@/components/global/BlogSection';

const HomePage = () => {
  
  return (

    <Box>

    <HeroHome />

    <TopTheCharts />

    <StretchSection />

    <CatsBlog />

    <OfferSection />

    <LastProducts />
    
    <BlogSection />

    {/* <ServicesSection /> */}

    {/* <FeaturedSection /> */}

    {/* <QuickAboutSection /> */}

    </Box>
  );
};

export default HomePage;
