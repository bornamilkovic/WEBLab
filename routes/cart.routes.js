const express = require('express');
const router = express.Router();
const { data } = require('../data/mydata.js'); 

router.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = { products: [], cart_count: 0 };
    }
    next();
});

router.post('/cart/add/:id', function(req, res){
    let string = req.params.id;
    let id = parseInt(req.params.id);
    let pid = id % 10;
    let cid = Math.floor(id / 10);
    if(pid >= 5 || cid >= 10 || string.length !== 2){
        return res.status(404).send('Proizvod ne postoji. Molimo unesite broj iz intervala [0,9] za id kategorije i broj iz intervala [0,4] za id proizvoda.');
    }

    const exist = req.session.cart.products.find(p => p.cid === cid && p.pid === pid);
    if (exist) {
        exist.count += 1;
    } else {
        req.session.cart.products.push({ cid, pid, count: 1 });
    }
    req.session.cart.cart_count += 1;

    const updatedItem = req.session.cart.products.find(p => p.cid === cid && p.pid === pid);        
    return res.json({
        count: updatedItem.count,
        cart_count: req.session.cart.cart_count,
        product: data.categories[cid].products[pid].name
    });
});

router.get('/cart/add/:id', function(req, res){
    // Dodana get metoda kako bi se omogućilo dodavanje upisivanjem url-a. Ukoliko nije bilo potrebno ostvariti tu funkcionalnost može se i bez ovoga.
    let string = req.params.id;
    let id = parseInt(req.params.id);
    let pid = id % 10;
    let cid = Math.floor(id / 10);
    if(pid >= 5 || cid >= 10 || string.length !== 2){
        return res.status(404).send('Proizvod ne postoji. Molimo unesite broj iz intervala [0,9] za id kategorije i broj iz intervala [0,4] za id proizvoda.');
    }
        
    const exist = req.session.cart.products.find(p => p.cid === cid && p.pid === pid);
    if (exist) {
        exist.count += 1;
    } else {
        req.session.cart.products.push({ cid, pid, count: 1 });
    }
    req.session.cart.cart_count += 1;

    const updatedItem = req.session.cart.products.find(p => p.cid === cid && p.pid === pid);        
    return res.redirect('/cart');
});

router.delete('/cart/remove/:id', function(req, res){
    let string = req.params.id;
    let id = parseInt(req.params.id);
    let pid = id % 10;
    let cid = Math.floor(id / 10);
    if(pid >= 5 || cid >= 10 || string.length !== 2){
        return res.status(404).send('Proizvod ne postoji. Molimo unesite broj iz intervala [0,9] za id kategorije i broj iz intervala [0,4] za id proizvoda.');
    }

    const index = req.session.cart.products.findIndex(p => p.cid === cid && p.pid === pid);
    if (index === -1) {
        return res.status(404).send('Proizvod nije u kosarici. Molimo odaberite neki proizvod koji je u kosarici.');
    }

    req.session.cart.products[index].count -= 1;
    req.session.cart.cart_count -= 1;    
    let responseCount = req.session.cart.products[index].count;
    if (req.session.cart.products[index].count <= 0) {
        req.session.cart.products.splice(index, 1);
        responseCount = 0;
    }

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
            count: responseCount,
            cart_count: req.session.cart.cart_count,
        });
    }
});

router.get('/cart/remove/:id', function(req, res){ 
    // Dodana get metoda kako bi se omogućilo brisanje upisivanjem url-a. Ukoliko nije bilo potrebno ostvariti tu funkcionalnost može se i bez ovoga.
    let string = req.params.id;
    let id = parseInt(req.params.id);
    let pid = id % 10;
    let cid = Math.floor(id / 10);
    if(pid >= 5 || cid >= 10 || string.length !== 2){
        return res.status(404).send('Proizvod ne postoji. Molimo unesite broj iz intervala [0,9] za id kategorije i broj iz intervala [0,4] za id proizvoda.');
    }

    const index = req.session.cart.products.findIndex(p => p.cid === cid && p.pid === pid);
    if (index === -1) {
        return res.status(404).send('Proizvod nije u kosarici. Molimo odaberite neki proizvod koji je u kosarici.');
    }
    req.session.cart.products[index].count -= 1;
    req.session.cart.cart_count -= 1;    

    let responseCount = req.session.cart.products[index].count;
    if (req.session.cart.products[index].count <= 0) {
        req.session.cart.products.splice(index, 1);
        responseCount = 0;
    }
    return res.redirect('/cart');
});

router.get('/cart/getInfo', function(req, res){
    // Dodatna ruta za dohvaćanje podataka
    res.json(req.session.cart);
});

router.get('/cart/getAll', function(req, res){
    return res.redirect('/cart');
});

router.get('/cart', function(req, res){
    return res.render('cart', {
        session: req.session,
        name: "Košarica"
    });
});

module.exports = router;