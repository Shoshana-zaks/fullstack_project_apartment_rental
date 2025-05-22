import axios from "axios";
import { useEffect, useState } from "react";

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/';

export const useGetAxios = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {
        axios.get(baseUrl + url)
            .then(x => {
                setData(x.data);
            })
            .catch(err => {
                setError(err.message);
            });
    }, [url]);

    return { data, error };
};

export const registerUser = async (advertiser) => {
    try {
        const response = await axios.post(`${baseUrl}advertiser/signin`, advertiser, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${baseUrl}advertiser/login`, credentials, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

export const addApartment = async (apartment) => {
    try {
        const token = localStorage.getItem('Authorization');
        const response = await axios.post(`${baseUrl}apartment/addApartment`, apartment, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error("Error adding apartment:", error);
        throw error;
    }
};

export const allCity = () => axios.get(`${baseUrl}city`);
export const allCategory = () => axios.get(`${baseUrl}category`);
