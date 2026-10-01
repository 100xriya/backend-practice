// Core Modules
const path = require('path');

const express = require('express')

const hostRouter = express.Router();    //routing separate pages using express.Router

hostRouter.get("/add-home", (req, res, next) => {
    console.log(req.url, req.method);
    res.sendFile(path.join(__dirname, '../', 'views', 'add-home.html'))
})

hostRouter.post("/add-home", (req, res, next) => {
    console.log(req.body);

    res.sendFile(path.join(__dirname, '../', 'views', 'homeAdded.html'))
})

module.exports = hostRouter;