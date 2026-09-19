const sumRequest = (req, res) => {

    const body = [];
    req.on('data', chunk => {
        body.push(chunk);
    })
    req.on('end', () => {
        // to collect chunks and concat inside body
        const bodyStr = Buffer.concat(body).toString();
        const params = new URLSearchParams(bodyStr);
        const bodyObj = Object.fromEntries(params);
        console.log(bodyObj);
        const result = Number(bodyObj.no1) + Number(bodyObj.no2);
        console.log(`The sum of ${bodyObj.no1} & ${bodyObj.no2} = ${result}`);

        res.setHeader('Content-Type', 'text/html');
        res.write(`
            <html > 
                <body>  
                    <h1>The sum is:${result}</h1>
                    <a href="/">Go to Home page</a>
                </body>
            </html >
        `);
        res.end();
    })

}

exports.sumRequest = sumRequest;