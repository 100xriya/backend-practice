// Core Modules
const path = require('path');

// External Module
const express = require('express')

// Local Module
const userRouter = require('./routes/userRouter');
const { hostRouter } = require('./routes/hostRouter');

const app = express();

//to render a view, use EJS to generate the HTML
app.set('view engine', 'ejs');
// Look for my EJS files inside the views folder.
app.set('views', 'views');

// body parser
app.use(express.urlencoded())

app.use(userRouter)
app.use(hostRouter)

// to handle errors -> add 404
app.use((req, res, next) => {
    res.status(404)
    res.sendFile(path.join(__dirname, 'views', '404.html'))
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}`);
})