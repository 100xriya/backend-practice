// Practice set

/* Create a new project.
1. Install nodemon and express.
2. Add two dummy middleware that logs request path and request method respectively.
3. Add a third middleware that returns a response.
4. Now add handling using two more middleware that handle path /, a request to /contact-us page.
5. Contact us should return a form with name and email
as input fields that submits to /contact-us page also.
6. Also handle POST incoming request to /contact-us path using a separate middleware. 
7.Parse the body of the contact-us request and log it to console.
*/

// External modules
const express = require('express');
//adding body-parser module to parse the requests
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded());

console.log("hi");

app.use((req, res, next) => {
    console.log(req.url, req.method, "1st middleware");
    next();
})
app.use((req, res, next) => {
    console.log(req.url, req.method, "2nd middleware");
    next();
})
/* app.use((req, res, next) => {
    res.send('<p>This middleware contains response</p>');
    next();
}) */
app.get("/", (req, res, next) => {
    res.send('<p>home page</p>');
    // next();
})
app.get("/contact-us", (req, res, next) => {
    res.send(`
        <form action="/contact-us" method="post">
            <h1>Please Enter your details</h1>
            <label for="name">Name:</label>
            <input type="text" id="name" name="username"><br>
  
            <label for="email">Email:</label>
            <input type="email" id="email" name="useremail">
  
            <input type="submit" value="Submit">
        </form>
`);
    // next();
})
app.post("/contact-us", (req, res, next) => {
    res.send(`<h1>form submitted</h1>`)
    console.log(req.body);

})



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}`);

})