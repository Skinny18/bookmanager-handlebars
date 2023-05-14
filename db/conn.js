const mysql = require('mysql');

const pool =  mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'nodemysql'
})


module.exports = pool