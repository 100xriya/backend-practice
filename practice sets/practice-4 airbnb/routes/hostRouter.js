// Core Modules
const path = require('path');

const express = require('express')

const hostRouter = express.Router();    //routing separate pages using express.Router

hostRouter.get("/add-home", (req, res, next) => {
    console.log(req.url, req.method);
    res.sendFile(path.join(__dirname, '../', 'views', 'add-home.html'))
})

const registeredHomes = [];

hostRouter.post("/add-home", (req, res, next) => {
    console.log(`Home registration successful for:`, req.body, req.body.houseName);
    registeredHomes.push({ houseName: req.body.houseName, location: req.body.location, price: req.body.price, image: req.body.image, rating: req.body.rating });
    // console.log(registeredHomes);

    res.sendFile(path.join(__dirname, '../', 'views', 'homeAdded.html'))
})

// module.exports = hostRouter;
exports.hostRouter = hostRouter;
exports.registeredHomes = registeredHomes;