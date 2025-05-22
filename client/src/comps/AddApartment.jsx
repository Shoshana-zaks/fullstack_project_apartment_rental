import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    Card, CardContent, TextField, Button,
    CircularProgress, Typography, Box,
    Snackbar, Alert
} from '@mui/material';
import SelectCity from "./SelectCity";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/";

const AddApartment = () => {
    const location = useLocation();
    const topRef = useRef(null);
    const navigate = useNavigate();
    const apartment = location.state?.apartment;

    const [formData, setFormData] = useState({
        _id: apartment?._id || "",
        name: apartment?.name || "",
        description: apartment?.description || "",
        categoryId: apartment ? apartment.categoryId : "",
        cityId: apartment ? apartment.cityId : "",
        address: apartment?.address || "",
        numBed: apartment?.numBed || 0,
        additives: apartment?.additives || "",
        price: apartment?.price || 0,
        image: apartment?.image || "",
    });

    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [fileUrl, setFileUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState("בחר תמונה");

    // מצב עבור הסנקבר (הודעה קופצת)
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const categoryUrl = baseURL + "category";
    const cityUrl = baseURL + "city";

    useEffect(() => {
        console.log("useEffect בעמוד AddApartment רץ");
        const user = localStorage.getItem('user');
        console.log("ערך של user מ-localStorage:", user);
        if (!user) {
            alert('עליך להתחבר כדי לפרסם דירה.');
            navigate('/login');
        }

        const fetchCategoriesAndCities = async () => {
            try {
                const categoriesResponse = await axios.get(categoryUrl);
                setCategories(categoriesResponse.data);
                const citiesResponse = await axios.get(cityUrl);
                setCities(citiesResponse.data);

                if (apartment) {
                    const foundCategory = categoriesResponse.data.find(cat => cat._id === apartment.categoryId);
                    const foundCity = citiesResponse.data.find(city => city._id === apartment.cityId);
                    setFormData(prev => ({
                        ...prev,
                        categoryId: foundCategory?._id || "",
                        cityId: foundCity?._id || "",
                    }));
                }
            } catch (error) {
                console.error("שגיאה בטעינת קטגוריות או ערים:", error);
            }
        };

        fetchCategoriesAndCities();

    }, [navigate, apartment, categoryUrl, cityUrl]);


    const checkAndAddCategory = async (name) => {
        console.log("בודק קטגוריה:", name);
        try {
            const response = await axios.get(`${categoryUrl}/getCategoryIdByName/${name}`);
            console.log("תגובה מקבלת קטגוריה:", response);
            return response.data._id;
        } catch (error) {
            console.log("שגיאה בקבלת קטגוריה, מנסה להוסיף:", name);
            console.error("שגיאה בקבלת קטגוריה:", error);
            const createResponse = await axios.post(`${categoryUrl}/addCategory`, { name });
            console.log("תגובה מהוספת קטגוריה:", createResponse);
            return createResponse.data._id;
        }
    };

    const checkAndAddCity = async (name) => {
        console.log("בודק עיר:", name);
        try {
            const response = await axios.get(`${cityUrl}/getCityIdByName/${name}`);
            console.log("תגובה מקבלת עיר:", response);
            return response.data._id;
        } catch (error) {
            console.log("שגיאה בקבלת עיר, מנסה להוסיף:", name);
            console.error("שגיאה בקבלת עיר:", error);
            const createResponse = await axios.post(`${cityUrl}/addCity`, { name });
            console.log("תגובה מהוספת עיר:", createResponse);
            return createResponse.data._id;
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "numBed" || name === "price" ? Number(value) : value
        }));
    }, []);

    const handleChangeCity = (cityId) => {
        console.log("handleChangeCity קיבל ID:", cityId);
        setFormData(prev => ({ ...prev, cityId: cityId }));
    };

    const handleChangeCategory = (categoryId) => {
        console.log("handleChangeCategory קיבל ID:", categoryId);
        setFormData(prev => ({ ...prev, categoryId: categoryId }));
    };

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setFileUrl(URL.createObjectURL(file));
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result.split(',')[1],
                }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleSuccessSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessSnackbarOpen(false);
    };

    const handleErrorSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorSnackbarOpen(false);
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.log("formData לפני בדיקת שדות:", formData);

        const {
            name, description, categoryId, cityId,
            address, numBed, price, image
        } = formData;

        if (!name || !description || !categoryId || !cityId || !address || !numBed || !price || !image) {
            alert("אנא מלא את כל השדות");
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('Authorization');
            const user = JSON.parse(localStorage.getItem('user'));
            const advertiserId = user?._id;

            if (!token || !advertiserId) {
                alert('עליך להתחבר כדי לפרסם');
                setIsSubmitting(false);
                return;
            }

            let categoryIdToUse = categoryId;
            let cityIdToUse = cityId;

            const isId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

            if (!isId(categoryId)) {
                categoryIdToUse = await checkAndAddCategory(categoryId);
            }

            if (!isId(cityId)) {
                cityIdToUse = await checkAndAddCity(cityId);
            }

            console.log("categoryIdToUse לאחר בדיקה/שימוש:", categoryIdToUse);
            console.log("cityIdToUse לאחר בדיקה/שימוש:", cityIdToUse);

            console.log("formData הסופי לפני שליחה:", {
                ...formData,
                categoryId: categoryIdToUse,
                cityId: cityIdToUse,
                advertiserId: advertiserId
            });

            const method = apartment ? "PUT" : "POST";
            const url = apartment
                ? `${baseURL}apartment/editApartment/${apartment._id}`
                : `${baseURL}apartment/addApartment`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    categoryId: categoryIdToUse,
                    cityId: cityIdToUse,
                    advertiserId: advertiserId
                })
            });

            if (!response.ok) {
                const text = await response.text();
                setErrorMessage(`שגיאה בשליחה: ${text}`);
                setErrorSnackbarOpen(true);
                throw new Error(text);
            }

            const data = await response.json();
            setSuccessSnackbarOpen(true);
            navigate('/');

        } catch (err) {
            setErrorMessage(`שגיאה בשליחה: ${err.message}`);
            setErrorSnackbarOpen(true);
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, apartment, navigate]);

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }} ref={topRef}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {apartment ? "עריכת דירה" : "הוספת דירה חדשה"}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField label="שם" name="name" fullWidth margin="normal" value={formData.name} onChange={handleChange} required />
                        <TextField label="תיאור" name="description" fullWidth margin="normal" value={formData.description} onChange={handleChange} required />
                        <SelectCity
                            label="קטגוריה"
                            url={categoryUrl}
                            value={formData.categoryId}
                            onChange={handleChangeCategory}
                            options={categories}
                        />
                        <SelectCity
                            label="עיר"
                            url={cityUrl}
                            value={formData.cityId}
                            onChange={handleChangeCity}
                            options={cities}
                        />
                        <TextField label="כתובת" name="address" fullWidth margin="normal" value={formData.address} onChange={handleChange} required />
                        <TextField label="מספר מיטות" name="numBed" type="number" fullWidth margin="normal" value={formData.numBed} onChange={handleChange} required />
                        <TextField label="תוספים" name="additives" fullWidth margin="normal" value={formData.additives} onChange={handleChange} />
                        <TextField label="מחיר" name="price" type="number" fullWidth margin="normal" value={formData.price} onChange={handleChange} required />

                        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                            {fileName}
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>

                        {fileUrl && (
                            <Box mt={2}>
                                <img src={fileUrl} alt="תמונה לדירה" style={{ width: "100%", borderRadius: 8 }} />
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : apartment ? "עדכן דירה" : "הוסף דירה"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleSuccessSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSuccessSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    הדירה התווספה בהצלחה!
                </Alert>
            </Snackbar>

            <Snackbar
                open={errorSnackbarOpen}
                autoHideDuration={5000}
                onClose={handleErrorSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleErrorSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddApartment;