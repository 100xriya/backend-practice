const path = require('path');
const Home = require('../models/home');

exports.getHome = (req, res, next) => {
    Home.fetchAll((registeredHomes) => {
        console.log(registeredHomes);

        res.render('user/home-list', {
            registeredHomes: registeredHomes
        });
    });
};

exports.getFavList = (req, res, next) => {
    res.render('user/favourite-list')
}

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    console.log(`homeId of chosen house: ${homeId}`);
    res.render('user/home-detail');
}

exports.getBookings = (req, res, next) => {
    res.render('user/bookings')
}