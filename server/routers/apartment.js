import express from 'express'
import { checkToken } from '../middlewares/checkToken.js';
import {
    getAll,
    getById,
    getByCategoryId,
    getByCityId,
    getByNumBeds,
    getByPrice,
    getByAdvertiserId,
    addApartment,
    remove,
    editApartment
} from '../controllers/apartment.js'

const router = express.Router()

// שליפת כל הדירות (כולל פילטרים!)
router.get('/', getAll);

// שליפת דירה לפי מזהה
router.get('/id/:id', getById);

// שליפת דירות לפי קוד קטגוריה
router.get('/getByCategoryId/:categoryId', getByCategoryId);

// שליפת דירות לפי קוד עיר
router.get('/getByCityId/:cityId', getByCityId);

// שליפת דירות לפי מספר מיטות - שים לב שזה נתיב עם שאילתה ולא פרמטר
router.get('/getByNumBeds', getByNumBeds);

// שליפת דירות לפי מחיר
router.get('/getByPrice/:price', getByPrice);

// שליפת דירות לפי קוד מפרסם
router.get('/getByAdvertiserId/:advertiserId', getByAdvertiserId);

// הוספת דירה
router.post('/addApartment', checkToken, addApartment);

// עידכון
router.put('/editApartment/:_id', checkToken, editApartment);

// מחיקה
router.delete('/remove/:id', checkToken, remove);

export default router;