// External Modules
const express = require('express')
const userRouter = express.Router();    //routing separate pages using express.Router
const getHomeController = require('../controller/homes')


userRouter.get("/", getHomeController.getHome)

module.exports = userRouter;