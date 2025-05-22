import * as React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // אייקון עריכה
import DeleteIcon from '@mui/icons-material/Delete'; // אייקון מחיקה
import ShareIcon from '@mui/icons-material/Share'; // אייקון שיתוף
import { useNavigate } from 'react-router-dom'; // ניווט
import AdvertiserDetails from './AdvertiserDetails';

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/";

const ApartmentCard = ({ apartment, isOwner }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpenDialog(true); 
  };

  const handleClose = () => {
    setOpenDialog(false); 
  };

  // פונקציה לעריכה של הדירה
  const handleEdit = () => {
    navigate('/addApartment', { state: { apartment } }); // מעביר לדף הוספת דירה עם נתוני הדירה לעדכון
  };

  // פונקציה למחיקת דירה
  const handleDelete = async (apartmentId) => {
    const token = localStorage.getItem('Authorization');
    try {
      const response = await fetch(`${baseURL}apartment/remove/${apartmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert('הדירה נמחקה בהצלחה!');
        // עדכון הדירות לאחר מחיקה
      } else {
        alert('מחיקה נכשלה!');
      }
    } catch (error) {
      alert('שגיאה במחיקת הדירה');
    }
  };

  return (
    <Card sx={{ maxWidth: 345, textAlign: 'center' }}>
      <CardHeader
        sx={{ display: 'flex', flexDirection: 'row-reverse' }}
        title={
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
            {apartment.name}
          </Typography>
        }
      />
      <CardMedia
        component="img"
        height="194"
        image={apartment.image ? `data:image/png;base64,${apartment.image}` : '/static/images/default.jpg'}
        alt={apartment.name}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {apartment.description || "No Description"}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1, color: 'text.secondary' }}>
          מספר מיטות: {apartment.numBed}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1, color: 'text.secondary' }}>
          כתובת: {apartment.address}
        </Typography>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          ₪ מחיר: {apartment.price}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {!isOwner ? (
          // אם זה לא בעל הדירה (מבקר)
          <>
            <IconButton aria-label="view advertiser details" onClick={handleClickOpen}>
              <ShareIcon />
            </IconButton>
            <AdvertiserDetails 
              advertiserId={apartment.advertiserId} 
              open={openDialog} 
              onClose={handleClose} 
            />
          </>
        ) : (
          // אם זה בעל הדירה
          <>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(apartment._id)}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default ApartmentCard;
