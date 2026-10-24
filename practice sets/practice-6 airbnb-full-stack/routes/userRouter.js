// External Modules
const express = require('express')
const userRouter = express.Router();    //routing separate pages using express.Router
const getUserController = require('../controller/userController')

userRouter.get("/", getUserController.getHome)
userRouter.get("/user/bookings", getUserController.getBookings)
userRouter.get("/user/favourite-list", getUserController.getFavList)
userRouter.get("/homes/:homeId", getUserController.getHomeDetails)


exports.userRouter = userRouter;
