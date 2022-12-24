//express for create server
const express = require('express');
const app = express();
//MongoDB ODM
const mongoose = require('mongoose');
//ejs for boilerplate
const ejsMate = require('ejs-mate');
//session and flash for messages
const session = require('express-session');
const flash = require('connect-flash');
//for put and delete http verb
const methodOverride = require('method-override');
//import custom error
const storeError = require('./utils/storeError');
//import passport and the relevant strategy for login 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//import custom routers for products and categories
const products = require('./routes/products');
const categories = require('./routes/categories');
const users = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/storev2', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//replace engine to ejs mate
app.engine('ejs', ejsMate)
// View engine setup
app.set('view engine', 'ejs');

//parse the req body
app.use(express.urlencoded({ extended: true }));
//allow us the use put and delete on a form
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.isAuthenticated();
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', users);
app.use('/products', products);
app.use('/categories', categories);

app.all('*', (req, res) => {
    throw new storeError('Page Not Found', 404);
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
})