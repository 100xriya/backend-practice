// External Modules
const express = require('express')
const userRouter = express.Router();    //routing separate pages using express.Router
const getUserController = require('../controller/userController')

userRouter.get("/", getUserController.getHome)
userRouter.get("/homes/:homeId", getUserController.getHomeDetails)
userRouter.get("/user/favourites", getUserController.getFavList)
userRouter.post("/user/favourites", getUserController.postFavList)
userRouter.post('/user/favourites/delete-favs/:homeId', getUserController.postRemoveFavourite)

userRouter.get("/user/bookings", getUserController.getBookingList)
userRouter.post("/user/bookings", getUserController.postBookingList)
userRouter.post('/user/bookings/delete-bookings/:homeId', getUserController.postRemoveBookings)


exports.userRouter = userRouter;
