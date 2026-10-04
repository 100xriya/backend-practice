// Core Modules
const path = require('path');

// External Modules
const express = require('express')
const userRouter = express.Router();    //routing separate pages using express.Router

const { registeredHomes } = require('./hostRouter')

userRouter.get("/", (req, res, next) => {
    console.log(`array:`, registeredHomes);

    console.log(req.url, req.method);
    // res.sendFile(path.join(__dirname, '../', 'views', 'home.html'))
    res.render('home', { registeredHomes: registeredHomes })
})

module.exports = userRouter;