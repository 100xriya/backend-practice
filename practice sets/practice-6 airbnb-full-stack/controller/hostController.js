const path = require('path');
const Home = require('../models/home')

// display the homes in host-home-list
exports.getHomeList = (req, res, next) => {
    Home.fetchAll((registeredHomes) => {
        console.log(registeredHomes);

        res.render('host/host-home-list', {
            registeredHomes: registeredHomes
        });
    });
}

// display the form
exports.getAddHome = (req, res, next) => {
    console.log(req.url, req.method);
    res.sendFile(path.join(__dirname, '../', 'views', 'host', 'add-home.html'))
}

// return the submitted form response
exports.postAddHome = (req, res, next) => {
    console.log(`Home registration successful for:`, req.body, req.body.houseName);
    const { houseName, price, location, rating, image } = req.body;
    // Create a Home instance of class Home in ../models/home.js
    const home = new Home(houseName, price, location, rating, image)
    home.save();
    /*  registeredHomes.push({
         houseName: req.body.houseName,
         location: req.body.location,
         price: req.body.price,
         image: req.body.image,
         rating: req.body.rating
     }); */
    // console.log(registeredHomes);

    res.sendFile(path.join(__dirname, '../', 'views', 'host', 'homeAdded.html'))
}


exports.error = (req, res, next) => {
    res.status(404)
    res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
}

exports.getEditHome = (req, res, next) => {
    res.render('host/edit-home')
}

exports.postEditHome = (req, res, next) => {
    res.render('host/edit-home')
}

