import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AdvertiserDetails = ({ advertiserId, open, onClose }) => {
  const [advertiserDetails, setAdvertiserDetails] = useState(null);

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/advertiser/${advertiserId}`);
        setAdvertiserDetails(response.data); 
      } catch (error) {
        console.error('Error fetching advertiser:', error);
      }
    };

    if (advertiserId && open) {
      fetchAdvertiser();
    }
  }, [advertiserId, open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h3" sx={{ textAlign: 'right' }}>פרטי המפרסם</DialogTitle>
      <DialogContent dir="rtl" sx={{ textAlign: 'right' }}>
        {advertiserDetails ? (
          <>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              שם: {advertiserDetails.name}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              אימייל: {advertiserDetails.email}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              טלפונים: {advertiserDetails.phone}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              טלפון נוסף: {advertiserDetails.phone_other}
            </Typography>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvertiserDetails;
