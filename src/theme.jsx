import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    palette: {
      primary: {
        main: '#4102f3',
      },
      secondary: {
        main: '#0052cc',
      },
    },
    typography: {
      fontFamily: "Helvetica, Arial, sans-serif",
    },
    overrides: {
      MUIDataTable: {
        responsiveScroll: {
        maxHeight: '980px'
        }
    }}
  });
  
  export default theme;