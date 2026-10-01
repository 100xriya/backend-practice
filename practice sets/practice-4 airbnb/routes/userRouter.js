// Core Modules
const path = require('path');

// External Modules
const express = require('express')
const userRouter = express.Router();    //routing separate pages using express.Router

userRouter.get("/", (req, res, next) => {
    console.log(req.url, req.method);
    res.sendFile(path.join(__dirname, '../', 'views', 'home.html'))
})

module.exports = userRouter;