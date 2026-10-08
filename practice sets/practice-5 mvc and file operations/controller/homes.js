const path = require('path');
const registeredHomes = [];

exports.getAddHome = (req, res, next) => {
    console.log(req.url, req.method);
    res.sendFile(path.join(__dirname, '../', 'views', 'add-home.html'))
}

exports.postAddHome = (req, res, next) => {
    console.log(`Home registration successful for:`, req.body, req.body.houseName);
    registeredHomes.push({
        houseName: req.body.houseName,
        location: req.body.location,
        price: req.body.price,
        image: req.body.image,
        rating: req.body.rating
    });
    // console.log(registeredHomes);

    res.sendFile(path.join(__dirname, '../', 'views', 'homeAdded.html'))
}

exports.getHome = (req, res, next) => {
    console.log(`array:`, registeredHomes);

    console.log(req.url, req.method);
    res.render('home', { registeredHomes: registeredHomes })
}

exports.error = (req, res, next) => {
    res.status(404)
    res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
}