const path = require('path');
const Home = require('../models/home');
const Favourite = require('../models/favourite');
// const { error } = require('console');

// Home list features
exports.getHome = (req, res, next) => {
    Home.fetchAll((registeredHomes) => {
        res.render('user/home-list', {
            registeredHomes: registeredHomes
        });
    }); 9
};

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

// Favourites feature
exports.getFavList = (req, res, next) => {
    Favourite.getFavourites((favourites) => {

        // method 1 - using filter
        Home.fetchAll((registeredHomes) => {

            const favouriteHomes = registeredHomes.filter(home => favourites.includes(String(home.id)));
            res.render('user/favourites', {
                favouriteHomes: favouriteHomes
            });
        })
        // method 2 -using map
        /*  Home.fetchAll((registeredHomes) => {
             const favouriteHomes = favourites.map(homeId => registeredHomes.find(home => home.id === homeId));
             res.render('user/favourites')
         }) */
    })
}
exports.postFavList = (req, res, next) => {
    Favourite.addToFavourite(req.body.id, error => {
        if (error) {
            console.log("Error while marking fav:", error);
        }
        res.redirect('/user/favourites')
    });
}

// Bookings features
exports.getBookings = (req, res, next) => {
    res.render('user/bookings')
}