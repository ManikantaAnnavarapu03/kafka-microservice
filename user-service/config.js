const mysql = require('mysql2/promise')

const sql = mysql.createPool({
    host:"localhost",
    user:'root',
    password:'Manikanta@03',
    database:'mani'
})

module.exports = sql