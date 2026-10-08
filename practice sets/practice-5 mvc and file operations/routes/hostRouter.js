const express = require('express')
const addHomeController = require('../controller/homes')

const hostRouter = express.Router();    //routing separate pages using express.Router

hostRouter.get("/add-home", addHomeController.getAddHome)


hostRouter.post("/add-home", addHomeController.postAddHome)

// module.exports = hostRouter;
exports.hostRouter = hostRouter;