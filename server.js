const inquirer = require("inquirer");
const express = require("express")
const mysql = require("mysql2");
const db = require("./db/connection");
const table = require("string-table")
const choices = ["View all Departments","View all Roles","View all Employees","Add a Department","Add a Role","Add an Employee","Update an Employee Role"];

const displayOptions = ()=>{

    return inquirer.prompt([
        {
            type:"list",
            name: "optionPicked",
            message:"********************************Welcome to the Employee Tracker App**********************************",
            choices: choices
        }
    ])
}
displayOptions().then(answers=>{
   const option = answers.optionPicked;
   const sql = "SELECT * FROM department";
   if(option === choices[0]){
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(table.create(result));
    });
   }else if(option === choices[1]){
       const sql = "SELECT r.*, d.depart_name FROM role AS r LEFT JOIN department AS d ON r.department_id = d.id ORDER BY d.id;";
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(table.create(result));
});
   }
   
})


// //making a connection
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected to DB")
// });




