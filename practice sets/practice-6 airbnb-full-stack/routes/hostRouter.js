const express = require('express')
const addHostController = require('../controller/hostController')

const hostRouter = express.Router();    //creates a router

// connect an incoming request to the right controller function.

hostRouter.get("/host/host-home-list", addHostController.getHomeList)
hostRouter.get("/add-home", addHostController.getAddHome)
hostRouter.post("/add-home", addHostController.postAddHome)
hostRouter.get("/host/edit-home", addHostController.getEditHome)
hostRouter.post("host/edit-home", addHostController.postEditHome)


// module.exports = hostRouter;
exports.hostRouter = hostRouter;