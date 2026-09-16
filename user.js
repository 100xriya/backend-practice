const http = require('http');
const fs = require('fs');
const { URLSearchParams } = require('url');

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

        // created an empty array so we can get all the chunks of data inside body[]
        const body = [];
        // Reading Chunk
        req.on('data', chunk => {
            console.log(chunk);                //this gives a buffer
            body.push(chunk);
        })
        req.on('end', () => {
            // how to collect chunks and concat inside body
            const fullBody = Buffer.concat(body).toString();
            console.log(fullBody);

            // to parse the chunks
            const params = new URLSearchParams(fullBody);                     //this will breakdown the o/p into key:val pair

            // methods of parsing request ->and make object

            // for-of loop -> std.method 
            /*          const bodyObject = {};
                        for (const [key, val] of params.entries()) {
                            bodyObject[key] = val;
                        }
                        console.log(bodyObject); */

            // easier alternative of above
            const bodyObject = Object.fromEntries(params);
            console.log(bodyObject);
            // to write the parsed req in file
            fs.writeFileSync('user.txt', JSON.stringify(bodyObject));

        });

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
