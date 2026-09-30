// External Module
const express = require('express')

const app = express();

app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
})

app.use(express.urlencoded())

app.get("/", (req, res, next) => {
    console.log(req.url, req.method);
    res.send(`
        <h1>Welcome to airbnb</h1>
        <a href="/add-home">Add Home</a>
        `)
})

app.get("/add-home", (req, res, next) => {
    console.log(req.url, req.method);
    res.send(`
        <h1>Register your home</h1>
        <form action="/add-home" method = "POST">
        <input type="text" name=houseName placeholder="Enter the name of your house"/>
        <input type = "submit" value="submit" />
        </form>
        `)
})

app.post("/add-home", (req, res, next) => {
    console.log(req.body);

    res.send(`
    <h1>Home registered</h1>
    <a href ="/"> Go back to Home</a>
    `)
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}`);
})