import express from 'express'

import {
    login,
    signin,
    getAll, 
    getById
} from '../controllers/advertiser.js'
// import { checkToken } from './middlewares.js'

const router = express.Router()


// router.get("",checkToken,getAll)
router.post('/login', login)
router.post('/signin', signin)
router.get("", getAll)
router.get('/:id', getById)

export default router
