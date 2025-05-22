import request from "request";
import kelvinToCelsius from 'kelvin-to-celsius';
import City from "../models/city.js";
import axios from 'axios';


export const getAll = (req, res) => {
    City.find()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({ err: err.message })
        })

}

export const addCity = (req, res) => {
    const { name } = req.body
    const c = new City({ name })
    c.save()
        .then(i => {
            res.status(201).send(i)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

// export const getWeather = (req) => {
//     const { city } = req.body
//     return new Promise((resolve, reject) => {
//         request(`https://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${process.env.WEATHER_API_KEY}`, (err, data) => {
//             if (err) {
//                 reject(err)
//             }
//             if (data) {
//                 const weather = JSON.params(data)
//                 let temp = kelvinToCelsius(whather.main.temp)
//                 resolve({ temp, city: whather.name })
//             }
//         })
//     })
// }

export const addToCityApertment = async (req) => {
    const { id, cityId } = req;

    try {
        const apartCity = await City.findById(cityId);
        if (!apartCity) {
            throw new Error('City not found'); // זורק שגיאה
        }
        apartCity.apartments.push(id); 
        await apartCity.save();
        return apartCity; // מחזיר את העיר המעודכנת
    } catch (err) {
        console.error('Error adding apartment to city:', err.message);
        throw err; // זורק שגיאה
    }
};

export const getCityIdByName = async (req, res) => {
    const { name } = req.params;

    try {
        const city = await City.findOne({ name: name });

        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }
        
        res.status(200).json({ _id: city._id });
    } catch (error) {
        console.error('Error fetching city by name:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
