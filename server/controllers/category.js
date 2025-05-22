import Category from "../models/category.js";
import axios from 'axios';

export const getAll = (req, res) => {
    Category.find()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({ err: err.message });
        });
};

export const getCategoryIdByName = async (req, res) => {
    const { name } = req.params;

    try {
        const category = await Category.findOne({ name });
        if (!category) {
            return res.status(404).send({ error: 'Category not found' });
        }
        res.status(200).send({ id: category._id });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

export const addCategory = (req, res) => {
    const { name } = req.body;
    const n = new Category({ name });
    n.save()
        .then(c => {
            res.status(201).send(c);
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
};


export const addToCategoryApertment = async (req) => {
    const { id, categoryId } = req;

    try {
        const apartCategory = await Category.findById(categoryId);
        if (!apartCategory) {
            throw new Error('Category not found'); 
        }
        apartCategory.apartments.push(id);
        await apartCategory.save();
        return apartCategory; 
    } catch (err) {
        console.error('Error adding apartment to category:', err.message);
        throw err; 
    }
};

export const deleteCategoryByName = async (req, res) => {
    const { name } = req.params;

    try {
        const deletedCategory = await Category.findOneAndDelete({ name: name });

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};