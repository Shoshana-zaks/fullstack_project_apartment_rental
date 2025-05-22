import express from 'express'

import {
    getAll,
    addCity,

    getCityIdByName
} from '../controllers/city.js'

const router = express.Router()

router.get('', getAll)
router.post('/addCity', addCity)

router.get('/getCityIdByName/:name', getCityIdByName)

export default router