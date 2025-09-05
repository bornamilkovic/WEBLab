const express = require('express');
const app = express();

const path = require('path');
const session = require('express-session');
var homeRouter = require('./routes/home.routes');
var cartRouter = require('./routes/cart.routes');

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        secret: 'lab2',
        resave: false,
        saveUninitialized: true,
    })
);
app.use((req, res, next) => {
    if(!req.session.cart){
        req.session.cart = {
            products: [],
            cart_count: 0
        };
        req.session.current_page = 0;
    }
    next();
})

app.use('/', homeRouter);
app.use('/', cartRouter);

app.listen(3000);