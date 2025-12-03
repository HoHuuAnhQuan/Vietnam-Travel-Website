const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'travel_db'
});

connection.connect((err) => {
    if(err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the MySQL database.' + connection.threadId);
});
module.exports = connection