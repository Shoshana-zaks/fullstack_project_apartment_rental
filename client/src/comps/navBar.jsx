import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../לוגו השכרת דירות.png';

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    setIsLoggedIn(!!token); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('Authorization');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img src={Logo} alt="Logo" style={{ height: 40 }} />
          קטלוג דירות
        </Box>
        {isLoggedIn ? (
          <>
            <Button color="inherit" onClick={() => navigate('/addApartment')}>הוסף דירה</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(NavBar);
