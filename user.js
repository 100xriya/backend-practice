const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    //    taking input from user
    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>')
        res.write('<form method="POST" action="/submit-user">')             //method->POST, action->/submit-user
        res.write('<input type="text" name="name" placeholder="User name"><br><input type="number" name="Phone No." placeholder="Phone no."><br><button type="submit">Add User</button></form>')
        res.write('</body></html>')
        res.end()
    }
    // handling the response and redirecting requests
    else if (req.url === '/submit-user' && req.method === "POST") {
        fs.writeFileSync('user.txt', "This is the redirected file");
        res.statusCode = 302;
        res.setHeader('location', '/');
        return res.end();
    }
})


// provide PORT for listening
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}`);

})
