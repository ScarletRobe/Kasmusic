import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }

  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color'];
    };
  }
}

export const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    action: {
      disabled: '#787878',
    },
    primary: {
      main: '#673ab7',
      darker: '#3f1e78',
    },
    secondary: {
      main: '#fff',
      darker: '#F4F4F4',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});
