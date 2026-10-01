// External Module
const express = require('express')

// Local Module
const userRouter = require('./routes/userRouter');
const hostRouter = require('./routes/hostRouter');

const app = express();

// body parser
app.use(express.urlencoded())

app.use(userRouter)
app.use(hostRouter)

// to handle errors -> add 404
app.use((req, res, next) => {
    res.status(404)
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}`);
})