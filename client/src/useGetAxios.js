import axios from "axios";
import { useEffect, useState } from "react";

export const useGetAxios = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {
        axios.get(url)
            .then(x => {
                setData(x.data);
            })
            .catch(err => {
                setError(err.message);
            });
    }, [url]);

    return { data, error };
};

const baseUrl = `http://localhost:3001/`;

export const registerUser = async (advertiser) => { // שינוי שם הפונקציה לשם יותר מתאים
    try {
        const response = await axios.post(`${baseUrl}advertiser/signin`, advertiser, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error; // חשוב להמשיך את השגיאה כדי שהקומפוננטה תוכל לטפל בה
    }
};

export const loginUser = async (credentials) => { // שינוי שם הפונקציה לשם יותר מתאים
    try {
        const response = await axios.post(`${baseUrl}advertiser/login`, credentials, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // חשוב להמשיך את השגיאה כדי שהקומפוננטה תוכל לטפל בה
    }
};

export const addApartment = async (apartment) => {
    try {
        const token = localStorage.getItem('Authorization'); // קבלת הטוקן רק כשצריך (לאחר התחברות)
        const response = await axios.post(`${baseUrl}apartment/addApartment`, apartment, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // שליחת הטוקן עם הבקשה
            }
        });
        return response;
    } catch (error) {
        console.error("Error adding apartment:", error);
        throw error;
    }
};

export const allCity = () => {
    return axios.get(`${baseUrl}city`);
};

export const allCategory = () => {
    return axios.get(`${baseUrl}category`);
};