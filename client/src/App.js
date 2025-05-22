import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './comps/Main'; 
import Login from './comps/login'; 
import AddApartment from './comps/AddApartment';  

const theme = createTheme({
  palette: {
    primary: {
      main: '#2b4eff',  // צבע ראשי
    },
    secondary: {
      main: '#41bdff',  // צבע משני
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Main />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/addApartment" element={<AddApartment />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

