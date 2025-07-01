

import { Box, Container } from '@mui/material'
import QuickAbout from '../global/QuickAbout'
import aboutImage from "@/assets/images/hero/image_01.jpg";

const QuickAboutSection = () => {
  return (
    <Box className="q-about">
        <Container>
          <div className="top">
            <div className="title">why choose us</div>
          </div>

          <div className="main">
            <section>
              <QuickAbout />
            </section>
            <section>
              <img src={aboutImage} className="w-full  min-h-[28rem] object-cover" />
            </section>
          </div>
        </Container>
      </Box>
  )
}

export default QuickAboutSection
