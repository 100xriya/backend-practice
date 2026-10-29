// Core Modules
const path = require('path');

// External Module
const express = require('express')

// Local Module
const { userRouter } = require('./routes/userRouter');
const { hostRouter } = require('./routes/hostRouter');

const errorController = require('./controller/hostController')

const app = express();

//to render a view -> use EJS to generate the HTML
app.set('view engine', 'ejs');
// Look for my EJS files inside the views folder.
app.set('views', 'views');

// body parser
app.use(express.urlencoded())

// Mounts hostRouter and userRouter
app.use(userRouter)
app.use(hostRouter)

// adding the intro page
app.get('/roles', (req, res) => {
    res.render('roles');
});

// to handle errors -> add 404   => put it in last
app.use(errorController.error)

const PORT = 3000;

console.log('Before app.listen');

const server = app.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}/roles`);
    console.log('Is server listening?', server.listening);
})

console.log('After app.listen');

server.on('close', () => {
    console.log('SERVER CLOSED');
});