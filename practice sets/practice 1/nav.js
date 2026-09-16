const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body><h1>Welcome to the Home page</h1><nav><div><a href="/">HOME</a></div><div><a href="/men">MEN</a></div><div><a href="/women">WOMEN</a></div><div><a href="/kids">KIDS</a></div><div><a href="/cart">CART</a></div></nav></body></html>')
        res.end();
    }
    else if (req.url.toLowerCase() === '/men') {
        res.write("Welcome to the Men's section!");
        res.end();
    }
    else if (req.url.toLowerCase() === '/women') {
        res.write("Welcome to the Women's section!");
        res.end();
    }
    else if (req.url.toLowerCase() === '/kids') {
        res.write("Welcome to the Kids's section!");
        res.end();
    }
    else if (req.url.toLowerCase() === '/cart') {
        res.write("Welcome to My Cart!");
        res.end();
    }


})

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}`);

})