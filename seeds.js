const mongoose = require('mongoose');
const Product = require('./models/product');
const Category = require('./models/category');


mongoose.connect('mongodb://localhost:27017/storev2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const seedCategories = [
    {
        name: 'ice cream',
        image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/87/85/da/ice-cream-factory-heladeria.jpg'
    },
    {
        name: 'chocolate',
        image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/04/12/fn_healthy-chocolate-getty_s4x3.jpg.rend.hgtvcom.476.357.suffix/1649787692492.jpeg'
    },
    {
        name: 'snack',
        image: 'https://merriam-webster.com/assets/ld/word_of_the_day/images/2767/large.jpg'
    },
    {
        name: 'drink',
        image: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/02/01/16/fizzy_drink_RF_getty.jpg?quality=75&width=1200&auto=webp'
    }
]

// const seedProducts = [
//     {
//         name: 'ben&jerry',
//         price: 4.00,
//         quantity: 50,
//         image: 'https://www.foodbusinessnews.net/ext/resources/2021/1/BenJerrysTopped_Lead.jpg?t=1611935596&width=1080',
//         description: 'it will freeze your brain',
//         category: {
//             name: 'ice cream',
//             image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/87/85/da/ice-cream-factory-heladeria.jpg'
//         }
//     },
//     {
//         name: 'm&m',
//         price: 4.99,
//         quantity: 90,
//         image: 'https://superpharmstorage.blob.core.windows.net/hybris/products/desktop/medium/040000513629.jpg',
//         description: 'it will explode your head',
//         category: {
//             name: 'chocolate',
//             image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/04/12/fn_healthy-chocolate-getty_s4x3.jpg.rend.hgtvcom.476.357.suffix/1649787692492.jpeg'
//         }
//     },
//     {
//         name: 'milka',
//         price: 3.99,
//         quantity: 100,
//         image: 'https://d3m9l0v76dty0.cloudfront.net/system/photos/8543541/original/ace0e321bc4f221952125ac922a0b53f.jpg',
//         description: 'it will get you closer to heaven',
//         category: {
//             name: 'chocolate',
//             image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2022/04/12/fn_healthy-chocolate-getty_s4x3.jpg.rend.hgtvcom.476.357.suffix/1649787692492.jpeg'
//         }
//     },
//     {
//         name: 'pringles',
//         price: 2.50,
//         quantity: 60,
//         image: 'https://www.pringles.com/content/global/pringles/en_CCE/pages/home/jcr:content/gridSystem/par/Copy%20of%20Copy%20of%20feature/slideData/jcr:content/par/inuitgrid/par/inuitgrid_975246484/par/responsiveimage.img.png/1639036153292.png',
//         description: 'best to eat near cold beer',
//         category: {
//             name: 'snack',
//             image: 'https://merriam-webster.com/assets/ld/word_of_the_day/images/2767/large.jpg'
//         }
//     },
//     {
//         name: 'coca cola',
//         price: 2.69,
//         quantity: 200,
//         image: 'https://dydza6t6xitx6.cloudfront.net/ci-coca-cola-3069f54e44791121.png',
//         description: 'sweet as hell',
//         category: {
//             name: 'drink',
//             image: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/02/01/16/fizzy_drink_RF_getty.jpg?quality=75&width=1200&auto=webp'
//         }
//     }
// ]

Category.deleteMany({})
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })

Product.deleteMany({})
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })

Category.insertMany(seedCategories)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })

// Product.insertMany(seedProducts)
//     .then(res => {
//         console.log(res)
//     })
//     .catch(e => {
//         console.log(e)
//     })

