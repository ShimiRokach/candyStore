const mongoose = require('mongoose');
const Product = require('./product');
const { Schema } = mongoose;

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    image: {
        type: String,
        required: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

// DELETE ALL ASSOCIATED PRODUCTS AFTER A CATEGORY IS DELETED
categorySchema.post('findOneAndDelete', async function (category) {
    if (category.products.length) {
        const res = await Product.deleteMany({ _id: { $in: category.products } })
        console.log(res);
    }
})

module.exports = mongoose.model('Category', categorySchema);