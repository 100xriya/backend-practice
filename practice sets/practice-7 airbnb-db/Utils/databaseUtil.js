const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "100xRiya",
    password: "Riya@9599#",
    database: "airbnb",
})

module.exports = pool.promise();