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
    Home.findById(homeId, home => {
        if (!home) {
            console.log('Home not found');
            res.redirect("/")

        } else {
            console.log(('home details found', home));
            res.render('user/home-detail', {
                home: home,
            }
            );

        }


    })
}

exports.getBookings = (req, res, next) => {
    res.render('user/bookings')
}