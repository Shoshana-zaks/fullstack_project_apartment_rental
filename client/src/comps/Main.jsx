import React, { useState, useEffect, useCallback } from 'react';
import Filters from './Filters';
import ApartmentCard from './ApartmentCard';
import NavBar from './navBar';
import { Grid, Container, Typography, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/";

const Main = () => {
  console.log("Main component rendered");
  console.log("REACT_APP_API_BASE_URL (Main.jsx):", process.env.REACT_APP_API_BASE_URL);
  console.log("Calculated baseURL (Main.jsx):", baseURL);
  const [displayedApartments, setDisplayedApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem('Authorization');
  const navigate = useNavigate();
  const [hasFetchedInitialUserApartments, setHasFetchedInitialUserApartments] = useState(false);
  const [navKey, setNavKey] = useState(1); // מפתח לרינדור של NavBar
  const [filtersKey, setFiltersKey] = useState(1); // מפתח לרינדור של Filters

  const fetchAllApartments = useCallback(async (filters = {}) => {
    console.log("fetchAllApartments called with filters:", filters);
    setIsLoading(true);
    console.log("fetchAllApartments - setIsLoading(true)");

    try {
      console.log("fetchAllApartments - Fetching all apartments for guest user with filters:", filters);

      // בניית מחרוזת שאילתה מהפילטרים
      const queryParams = new URLSearchParams();

      // הוספת הפרמטרים לשאילתה אם הם קיימים
      if (filters.cityId) queryParams.append('cityId', filters.cityId);
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
      if (filters.numBed) queryParams.append('numBed', filters.numBed);
      if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice);

      console.log(`fetchAllApartments - Request URL: ${baseURL}apartment?${queryParams.toString()}`);

      const response = await axios.get(`${baseURL}apartment?${queryParams.toString()}`);
      if (response.data) {
        console.log("fetchAllApartments - All apartments received:", response.data);
        setDisplayedApartments(response.data);
        console.log("fetchAllApartments - setDisplayedApartments called with:", response.data);
      }
    } catch (error) {
      console.error("fetchAllApartments - Error fetching all apartments:", error);
    } finally {
      setIsLoading(false);
      console.log("fetchAllApartments - setIsLoading(false) in finally");
      console.log("fetchAllApartments finished");
    }
  }, []);

  const fetchUserApartments = useCallback(async () => {
    console.log("fetchUserApartments called");
    setIsLoading(true);
    console.log("fetchUserApartments - setIsLoading(true)");
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const advertiserId = user?._id;

      if (advertiserId) {
        console.log("fetchUserApartments - Fetching user apartments for ID:", advertiserId);
        const response = await axios.get(`${baseURL}apartment/getByAdvertiserId/${advertiserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Authorization')}`
          }
        });
        if (response.data) {
          console.log("fetchUserApartments - User apartments received:", response.data);
          setDisplayedApartments(response.data);
          console.log("fetchUserApartments - setDisplayedApartments called with:", response.data);
        }
        if (response.data.length === 0 && !hasFetchedInitialUserApartments) {
          navigate('/addApartment');
          console.log("fetchUserApartments - navigate('/addApartment') called");
        }
      }
      console.log("fetchUserApartments - Setting hasFetchedInitialUserApartments to true");
      setHasFetchedInitialUserApartments(true);
    } catch (error) {
      console.error("fetchUserApartments - Error fetching user apartments:", error);
    } finally {
      setIsLoading(false);
      console.log("fetchUserApartments - setIsLoading(false) in finally");
      console.log("fetchUserApartments finished");
    }
  }, [navigate, hasFetchedInitialUserApartments]);

  useEffect(() => {
    console.log("Main - useEffect triggered");
    if (isLoggedIn) {
      console.log("Main - User is logged in, fetching only their apartments");
      fetchUserApartments();
    } else {
      console.log("Main - User is guest, fetching all apartments");
      fetchAllApartments({});
    }
    console.log("Main - useEffect finished");
  }, [isLoggedIn, fetchAllApartments, fetchUserApartments]);

  const handleFilterChange = useCallback((filters) => {
    console.log("handleFilterChange called with:", filters);
    if (!isLoggedIn) {
      console.log("handleFilterChange - User is guest, fetching all apartments with filters");
      fetchAllApartments(filters);
    }
  }, [isLoggedIn, fetchAllApartments]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          טוען דירות...
        </Typography>
      </Box>
    );
  }

  const isOwner = (apartment) => {
    if (!isLoggedIn) return false;
    const user = JSON.parse(localStorage.getItem('user'));
    return user?._id === apartment.advertiserId;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar key={navKey} />
      <Container maxWidth="xl" sx={{ mt: 2, padding: 2, flexGrow: 1 }}>
        {!isLoggedIn && <Filters key={filtersKey} onFilterChange={handleFilterChange} />}

        {/* האזור שכן יתרענן */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {displayedApartments.length > 0 ? (
            displayedApartments.map((apartment) => (
              <Grid item xs={12} sm={6} md={4} key={apartment._id}>
                <ApartmentCard
                  apartment={apartment}
                  isOwner={isOwner(apartment)}
                />
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              align="center"
              sx={{
                mt: 4,
                width: '100%',
                textAlign: 'center'
              }}
            >
              {isLoggedIn ? 'אין לך דירות כרגע.' : 'לא נמצאו דירות'}
            </Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Main;
