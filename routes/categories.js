const express = require('express');
const router = express.Router();
const storeError = require('../utils/storeError');
//import category schema validator
const { categorySchema } = require('../schemas');

//import product and category from models directory
const Category = require('../models/category');

const validateCategory = (req, res, next) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new storeError(msg, 400);
    } else {
        next();
    }
}

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

router.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.render('categories/showAll', { categories });
    } catch (e) {
        next(e);
    }
})

router.get('/add', isLoggedIn, async (req, res) => {
    try {
        res.render('categories/add');
    } catch (e) {
        next(e);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            req.flash('error', 'Cannot find that category!');
            return res.redirect('/categories');
        }
        res.render('categories/show', { category });
    } catch (e) {
        next(e);
    }
})

router.get('/:id/edit', isLoggedIn, async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        const categories = await Category.find();
        if (!category) {
            req.flash('error', 'Cannot find that category!');
            return res.redirect('/categories');
        }
        res.render('categories/edit', { category, categories });
    } catch (e) {
        next(e);
    }
})

router.post('/add', isLoggedIn, validateCategory, async (req, res, next) => {
    try {
        const newCategory = new Category(req.body);

        const existCategory = await Category.findOne({ name: { $eq: req.body.name } });

        if (existCategory) {
            res.render('categories/exist', { existCategory });
        }
        else {
            await newCategory.save();
            req.flash('success', 'Successfully made a new category!');
            res.redirect(`/categories/${newCategory._id}`);
        }
    } catch (e) {
        next(e);
    }
})

router.put('/:id', isLoggedIn, validateCategory, async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
        req.flash('success', 'Successfully updated category!');
        res.redirect(`/categories`);
    } catch (e) {
        next(e);
    }
})

router.delete('/:id', isLoggedIn, async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (e) {
        next(e);
    }
})

module.exports = router;