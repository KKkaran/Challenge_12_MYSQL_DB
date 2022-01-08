const mysql = require("mysql2");

const db = mysql.createConnection({

        host: 'localhost',
        user: 'root',
        password: "Ontario25!!!",
        database: 'employee_tracker'
    },
    console.log("connection created to db")
);

module.exports = db;