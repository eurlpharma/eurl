// src/theme/muiTheme.js
import { createTheme, Direction } from '@mui/material/styles';

export const getMuiTheme = (dir: Direction = 'ltr') => {
  return createTheme({
    direction: dir,
    typography: {
      fontFamily: [
        'Poppins',
        'Cairo',
        'Tajawal',
        'Open Sans',
        'Montserrat',
        'sans-serif',
      ].join(','),
    },
  });
};
