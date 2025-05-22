import express from 'express'

import {
    getAll,
    addCategory,
    // getId,
    getCategoryIdByName,
    deleteCategoryByName
} from '../controllers/category.js'

const router = express.Router()

router.get('', getAll)
router.get('/getCategoryIdByName/:name', getCategoryIdByName)
router.post('/addCategory', addCategory)
router.delete('/deleteCategoryByName/:name', deleteCategoryByName);


export default router