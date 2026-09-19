const http = require('http');
const fs = require('fs');
const { requestHandler } = require('./requestHandler');

const server = http.createServer(requestHandler);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`server running on address- http://localhost:${PORT}`);

})