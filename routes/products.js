const express = require('express');
const router = express.Router();
const storeError = require('../utils/storeError');
//import product schema validator
const { productSchema } = require('../schemas');

//import product and category from models directory
const Product = require('../models/product');
const Category = require('../models/category');

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
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
        const products = await Product.find().populate('category');
        res.render('products/home', { products });
    } catch (e) {
        next(e);
    }
})

router.get('/pricing', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('products/pricing', { products });
    } catch (e) {
        next(e);
    }
})

router.get('/features', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('products/features', { products });
    } catch (e) {
        next(e);
    }
})

router.get('/add', isLoggedIn, async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.render('products/add', { categories });
    } catch (e) {
        next(e);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            req.flash('error', 'Cannot find that product!');
            return res.redirect('/products');
        }
        res.render('products/show', { product });
    } catch (e) {
        next(e);
    }
})

router.get('/:id/edit', isLoggedIn, async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');;
        const categories = await Category.find();
        if (!product) {
            req.flash('error', 'Cannot find that product!');
            return res.redirect('/products');
        }
        res.render('products/edit', { product, categories });
    } catch (e) {
        next(e);
    }
})

router.post('/add', isLoggedIn, validateProduct, async (req, res, next) => {
    try {
        const { name, price, quantity, image, description, category } = req.body;
        const selectedCategory = await Category.findById(category);
        const newProduct = new Product({ name, price, quantity, image, description });
        const existProduct = await Product.findOne({ name: { $eq: name } });

        if (existProduct) {
            res.render('products/exist', { existProduct });
        }
        else {
            selectedCategory.products.push(newProduct);
            newProduct.category = selectedCategory;
            await newProduct.save();
            await selectedCategory.save();
            req.flash('success', 'Successfully made a new product!');
            res.redirect(`/products/${newProduct._id}`);
        }
    } catch (e) {
        next(e);
    }
})

router.put('/:id', isLoggedIn, validateProduct, async (req, res, next) => {
    try {
        const { name, price, quantity, image, description, category } = req.body;
        const selectedCategory = await Category.findById(category);
        const product = await Product.findByIdAndUpdate(req.params.id, { name, price, quantity, image, description, category: selectedCategory }, { runValidators: true, new: true });
        req.flash('success', 'Successfully updated product!');
        res.redirect(`/products/${product._id}`);
    } catch (e) {
        next(e);
    }
})

router.delete('/:id', isLoggedIn, async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    } catch (e) {
        next(e);
    }
})

module.exports = router;