const express = require('express');
const router = express.Router();
const { data } = require('../data/mydata.js');

router.get('/home/getCategories', function(req, res){
    // Preusmjereno na početnu stranicu jer su sve kategorije vidljive na njoj.
    res.redirect('/home');
});

router.get('/home/getProducts/:id', function(req, res){
    const cid = parseInt(req.params.id);
    if (cid < 0 || cid >= 10) {
        return res.status(404).send('Kategorija ne postoji. Molimo unesite broj iz intervala [0,9] za id kategorije.');
    }

    const category = data.categories.find(cat => cat.cid === cid);
    req.session.current_page = cid;
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
            category: category,
            current_page: cid,
            kategorije: {data}
        });
    }
    res.render('home', {
        session: req.session,
        name : category.name,
        products: category.products,
        cid: category.cid,
        kategorije: {data}
    });
    req.session.save();
});

router.get('/', function(req, res){
    res.redirect('/home');
});

router.get('/home', function(req, res){
    req.session.current_page = 0;
    const category = data.categories[0];
    return res.render('home', {
        session: req.session,
        name : category.name,
        products: category.products,
        cid: category.cid,
        kategorije: {data}
    });
});

router.get('/data', function (req, res) {
    // Dodatna ruta za dohvaćanje podataka
    res.json({
        categories: data.categories,
        session: {
            cart: req.session.cart,
            current_page: req.session.current_page
        }
    });
});

module.exports = router;