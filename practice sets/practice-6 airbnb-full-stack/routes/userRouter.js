// External Modules
const express = require('express')
const userRouter = express.Router();    //routing separate pages using express.Router
const getUserController = require('../controller/userController')

userRouter.get("/", getUserController.getHome)
userRouter.get("/user/bookings", getUserController.getBookings)
userRouter.get("/user/favourites", getUserController.getFavList)
userRouter.post("/user/favourites", getUserController.postFavList)
userRouter.get("/homes/:homeId", getUserController.getHomeDetails)
userRouter.post('/user/favourites/delete-favs/:homeId', getUserController.postRemoveFavourite)

exports.userRouter = userRouter;
