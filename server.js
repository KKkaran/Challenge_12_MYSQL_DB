const inquirer = require("inquirer");
const express = require("express")
const mysql = require("mysql2");
const db = require("./db/connection");
const table = require("string-table");
const res = require("express/lib/response");
const choices = ["View all Departments","View all Roles","View all Employees","Add a Department","Add a Role","Add an Employee","Update an Employee Role","QUIT"];

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
const addDepartment = ()=>{
    return inquirer.prompt([
        {
            type:"input",
            name: "departName",
            message:"Type the Department name you wish to add: (Required)",
            validate: (data)=>{
                if(data) return true
                else {
                    console.log("Please Enter the Department' name:")
                }
            }
        }
    ]).then(ans=>{
        const sql = "INSERT INTO department (depart_name) VALUES (?);"
        db.query(sql,ans.departName,(err,result)=>{
            if(err){
                console.log(err)
            }else if(!result.affectedRows){
                console.log("nothing added")
            }else{
                console.log("Your Department has been added to the Table.")
            }
        })   
    })
}

displayOptions().then(answers=>{
   const option = answers.optionPicked;
   const sql = "SELECT * FROM department";
   if(option === choices[0]){//show all departments
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(table.create(result));
    });
   }else if(option === choices[1]){//show all roles
        const sql = "SELECT r.*, d.depart_name FROM role AS r LEFT JOIN department AS d ON r.department_id = d.id ORDER BY d.id;";
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(table.create(result));
    });
   }else if(option === choices[2]){//show all employees
        const sql = 'SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.depart_name, CONCAT(f.first_name," ",f.last_name) AS Manager FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS f ON e.manager_id = f.id;';
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(table.create(result));
        });
   }else if(option === choices[3]){//add a department
        addDepartment()
        
        

   }else if(option === choices[4]){//add a role

   }else if(option === choices[7]){
        console.log("Program is ended.")
   }
   
})


// //making a connection
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected to DB")
// });




//BONUS EXERCISES:
// view empl by manager-----> SELECT e.id, e.first_name,e.last_name, r.title, r.salary, d.depart_name, concat(f.first_name," ",f.last_name) as Manager from employee as e left join role as r on e.role_id = r.id left join department as d on r.department_id = d.id left join employee as f on e.manager_id = f.id where f.first_name = "Jessica";