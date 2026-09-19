const { sumRequest } = require('./sum');

const requestHandler = (req, res) => {
    console.log(req.url, req.method);

    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body><h1>Welcome to calculator</h1><a href="/calculator">Click to use the Calculator</a></body></html>');
        res.end();
    }
    else if (req.url.toLowerCase() === '/calculator') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body><form action="/calculate-result" method="post"><label for="no1">Enter 1st no.</label><input type="number" id="no1" name="no1"><label for="no2">Enter 2nd no.</label><input type="number" id="no2" name="no2"><input type="submit" value="sum"></form></body></html>')
        res.end();
    }
    else if (req.url.toLowerCase() === '/calculate-result') {
        sumRequest(req, res);
    }
    else {

        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body><h1>404 Page does not exist</h1><a href="/">Go to Home page</a></body></html>');
        res.end();
    }

}

exports.requestHandler = requestHandler;


