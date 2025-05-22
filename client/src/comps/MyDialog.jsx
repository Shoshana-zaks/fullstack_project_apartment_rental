
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// import { useEffect } from 'react';



export const MyDialog = ({apartment}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);


  const handleClickOpen =  (apartment) => {
  console.log("apertment to add apartment", apartment);

     navigate('/addApartment', { state:  {apartment} });
    
  }
  
  const moveAddApertment = async (apartment) => {
 
      navigate('/addApartment', { state: { apartment } });
     }

    console.log("apertment", apartment)
      console.log(apartment);
      
  const handleDelete = async (apartment ) => {
   
    if (!apartment || !apartment._id) {
      console.log("apertment!!!!!!!!!!!!", apartment);
      console.error("Apartment ID is missing.",apartment._id);
      return;
    }
  
    try {
      const token = localStorage.getItem('Authorization');
      const id= apartment._id;
      const response = await fetch(`http://localhost:3001/apartment/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        setOpenSnackbar(true);
      } else {
        setOpenErrorSnackbar(true);
      }
    } catch (error) {
      console.error("Error deleting apartment:", error);
      setOpenErrorSnackbar(true);
    }
  };
  
const handleCloseSnackbar = (event, reason) => {

  if (reason === 'clickaway') {
    return;
  }
  setOpenSnackbar(false);
  setOpenErrorSnackbar(false);
};

  const handleClose = () => {
    setOpen(false);
  };

  

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        עריכה
      </Button> */}
      <IconButton color="error" onClick={()=>{handleDelete(apartment)}}>
  <DeleteIcon />
</IconButton>
<Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
  <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
    המחיקה בוצעה בהצלחה!
  </MuiAlert>
</Snackbar>
<Snackbar open={openErrorSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
  <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
    המחיקה נכשלה. נסה שוב.
  </MuiAlert>
</Snackbar>
        <IconButton color="primary" onClick={()=>{handleClickOpen(apartment)}}>
        <EditIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"שים לב"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            רק בעלי הדירה יכולים לערוך  הדירה
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>חזרה</Button>
          {/* <Button onClick={moveLogin} autoFocus> */}
          <Button onClick={()=>{moveAddApertment(apartment)}} autoFocus >
            עריכה
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default MyDialog;
