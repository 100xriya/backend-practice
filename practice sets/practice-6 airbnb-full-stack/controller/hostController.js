const path = require('path');
const Home = require('../models/home')

// display the homes in host-home-list
exports.getHomeList = (req, res, next) => {
    Home.fetchAll((registeredHomes) => {
        res.render('host/host-home-list', {
            registeredHomes: registeredHomes
        });
    });
}

// display the form
exports.getAddHome = (req, res, next) => {
    console.log(req.url, req.method);
    // res.sendFile(path.join(__dirname, '../', 'views', 'host', 'edit-home.ejs'))
    res.render('host/edit-home', {
        editing: false,

    })
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
    res.redirect('host/host-home-list');

}


exports.error = (req, res, next) => {
    res.status(404)
    res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
}

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === "true";

    Home.findById(homeId, home => {
        if (!home) {
            console.log("Home not found in list for editing");
            return res.redirect("/host/host-home-list");
        }
        console.log(homeId, editing, home);
        res.render('host/edit-home', {
            home: home,
            editing: editing,
            homeId: homeId,
        })
    })


}

exports.postEditHome = (req, res, next) => {
    console.log(`Home edited successful for:`, req.body, req.body.houseName);
    const { id, houseName, price, location, rating, image } = req.body;
    // Create a Home instance of class Home in ../models/home.js
    const home = new Home(houseName, price, location, rating, image);
    home.id = id
    home.save();

    res.redirect('/host/host-home-list');
}

