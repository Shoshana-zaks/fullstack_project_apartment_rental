import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, TextField, MenuItem, Typography, Slider, Button } from '@mui/material';

const Filters = React.memo(({ onFilterChange }) => {
  const [priceLimits, setPriceLimits] = useState({ min: 0, max: 10000 });
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    cityId: '',
    categoryId: '',
    numBed: '',
    minPrice: 0,
    maxPrice: 10000
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [citiesRes, categoriesRes, apartmentsRes] = await Promise.all([
          axios.get('http://localhost:3001/city'),
          axios.get('http://localhost:3001/category'),
          axios.get('http://localhost:3001/apartment')
        ]);

        setCities(citiesRes.data);
        setCategories(categoriesRes.data);

        // שליפת המחירים מהדירות וחישוב טווח
        const prices = apartmentsRes.data.map(a => a.price).filter(p => typeof p === 'number');
        const min = prices.length ? Math.min(...prices) : 0;
        const max = prices.length ? Math.max(...prices) : 10000;

        setPriceLimits({ min, max });
        setFilters(f => ({ ...f, minPrice: min, maxPrice: max }));

        console.log('Price Limits:', { min, max });
      } catch (err) {
        console.error("שגיאה בשליפת הנתונים:", err);
      }
    };

    fetchFilters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handlePriceChange = (_, newValue) => {
    const [minPrice, maxPrice] = newValue.map(v => Math.round(v / 100) * 100);
    setFilters({ ...filters, minPrice, maxPrice });
  };

  const handleSearch = () => {
    // שליחת הפילטרים בפורמט שהשרת מצפה לו
    const filterParams = {
      cityId: filters.cityId || undefined,
      categoryId: filters.categoryId || undefined,
      numBed: filters.numBed || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    };
    
    // מניעת שליחת פרמטרים ריקים
    Object.keys(filterParams).forEach(key => {
      if (filterParams[key] === '' || filterParams[key] === undefined) {
        delete filterParams[key];
      }
    });
    
    console.log("Sending filters to parent:", filterParams);
    onFilterChange(filterParams);
  };

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
      {/* בחירת עיר */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          label="עיר"
          name="cityId"
          value={filters.cityId}
          onChange={handleChange}
        >
          <MenuItem value="">הכל</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city._id} value={city._id}>
              {city.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* בחירת קטגוריה */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          label="קטגוריה"
          name="categoryId"
          value={filters.categoryId}
          onChange={handleChange}
        >
          <MenuItem value="">הכל</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* מספר מיטות */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          type="number"
          fullWidth
          label="מספר מיטות"
          name="numBed"
          value={filters.numBed}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />
      </Grid>

      {/* טווח מחירים */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography gutterBottom>טווח מחירים (₪)</Typography>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={priceLimits.min}
          max={priceLimits.max}
          step={100}
          valueLabelFormat={(value) => `${value}`}
        />
      </Grid>

      {/* כפתור חיפוש */}
      <Grid item xs={12} display="flex" justifyContent="center">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSearch}
        >
          חפש
        </Button>
      </Grid>
    </Grid>
  );
});

export default Filters;
