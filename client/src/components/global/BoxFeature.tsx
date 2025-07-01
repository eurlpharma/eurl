


import { Box } from '@mui/material'
import { FC, HTMLAttributes } from 'react'

interface BoxFeatureProps extends HTMLAttributes<HTMLElement> {
  src: any,
  title: string,
  category: string,
  onPress: () => void
}

const BoxFeature: FC<BoxFeatureProps> = ({src, title, category, onPress,...props}) => {
  return (
    <Box className="feature-box" onClick={onPress} {...props}>
      <img src={src} />
      <div className="overlay"></div>
      <div className="info">
        <div className="title">{title}</div>
        <div className="category">{category}</div>
      </div>
    </Box>
  )
}

export default BoxFeature
