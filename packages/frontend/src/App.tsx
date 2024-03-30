import './App.css';
import { ThemeProvider } from '@emotion/react';
import { green, indigo } from '@mui/material/colors';
import { createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { router } from './router';
import { AuthProvider } from './context/auth';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: indigo['A700'],
    },
    secondary: {
      main: green[500],
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* <MainDialog /> */}
        <RouterProvider router={router} />
        {/* <MainEditor></MainEditor> */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
