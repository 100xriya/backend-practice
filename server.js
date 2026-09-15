//require() imports modules into node.js
const http = require('http');

// creating the first server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    /*     process.exit();                   // stops event loop-> kills the Node process, but you generally don't want to put that into your server code just to stop it. */

    // Response
    /*     res.setHeader('Content-Type', 'text/html');
        res.write('<html><body><h1>Hi User! I am server.</h1></body></html')
        res.end("Hello from server!"); */

    // Routing Responses 
    if (req.url === '/') {
        res.write('Welcome to my server!');
        res.end();
    } else if (req.url === '/about') {
        res.write("This is the about page.")
        res.end();
    } else if (req.url === '/products' && req.method === "GET") {
        res.write("Here are all the products.")
        res.end();
    } else if (req.url === '/products' && req.method === "POST") {
        res.write("New product received.")
        res.end();
    } else {
        res.write("Page not found")
        res.end();
    }
})


// provide PORT for listening
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}`);

})
