const inquirer = require("inquirer");
const mysql = require("mysql2");

mysql.createConnection({

        host: 'localhost',
        user: 'root',
        password: require("./db_password/password"),
        database: 'employee_tracker'
    },
    console.log("CONNECTED TO DATABASE SUCCESSFULLY")
)
