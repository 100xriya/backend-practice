const express = require('express')

const hostRouter = express.Router();    //routing separate pages using express.Router

hostRouter.get("/add-home", (req, res, next) => {
    console.log(req.url, req.method);
    res.send(`
        <h1>Register your home</h1>
        <form action="/add-home" method = "POST">
        <input type="text" name=houseName placeholder="Enter the name of your house"/>
        <input type = "submit" value="submit" />
        </form>
        `)
})

hostRouter.post("/add-home", (req, res, next) => {
    console.log(req.body);

    res.send(`
    <h1>Home registered</h1>
    <a href ="/"> Go back to Home</a>
    `)
})

module.exports = hostRouter;