const inquirer = require("inquirer");
const express = require("express")
const mysql = require("mysql2");
const db = require("./db/connection");
const table = require("string-table");
const res = require("express/lib/response");
const choices = ["View all Departments","View all Roles","View all Employees","Add a Department","Add a Role","Add an Employee","Update an Employee Role","QUIT"];


var g; //list of all departments

//gets all the departments from db
const getdepartment = async()=>{
    return new Promise((res,rej)=>{
        const sql = "SELECT * FROM department";
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            g = result.map(r=>r.depart_name)
            res(g)
        });
    })  
}
const getRoles = async(id)=>{//we will pass the department and get the roles for that department
    return new Promise((res,rej)=>{
        const sql = "SELECT r.id,r.title FROM role AS r LEFT JOIN department AS d ON r.department_id = d.id WHERE d.id = ?";
        db.query(sql,id, function (err, result, fields) {
            if (err) throw err;
            res(result)
        });
    })  
}
const getManager = async(id)=>{//we will get the designated manager for a department
    return new Promise((res,rej)=>{
        const sql = "select e.* from employee as e left join role as r on e.role_id = r.id left join department as d on r.department_id = d.id where r.title = 'Operations Mgr' and d.id = ?;";
        db.query(sql,id, function (err, result, fields) {
            if (err) throw err;
            res(result)
        });
    })  
}
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
//for adding department to the db
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
//for adding role to the db
const addRole = ()=>{
    getdepartment()
    return inquirer.prompt([
        {
            type:"input",
            name: "title",
            message:"Type the name of the role you wish to add: (Required)",
            validate: (data)=>{
                if(data) return true
                else {
                    console.log("Please Enter the Role title:")
                }
            }
        },
        {
            type:"input",
            name: "salary",
            message:"Type the salary for your title: (Required)",
            validate: (data)=>{
                if(data) return true
                else {
                    console.log("Please Enter the Role salary:")
                }
            }
        },
        {
            type:"list",
            name: "department",
            message:"What department you wish to add this role to: (Required)",
            choices: ()=> getdepartment().then(s=>s)
        }
        
    ]).then(ans=>{
        let {title,salary,department} = ans;
        let values = [title,salary,(g.indexOf(department)+1)]
        const sql = "INSERT INTO role (title,salary,department_id) VALUES (?,?,?);"
        db.query(sql,values,(err,result)=>{
            if(err){
                console.log(err)
            }else if(!result.affectedRows){
                console.log("nothing added")
            }else{
                console.log("Your Role has been added to the Table.")
            }
        })   
    }).catch(err=>{
        console.log(err)
    })
}
//for adding an employee
const addEmployee = ()=>{

    return new Promise((res,rej)=>{

     inquirer.prompt([
        {
            type:"input",
            name: "fname",
            message:"What is the first name of the employee: (Required)",
            validate: (data)=>{
                if(data) return true
                else {
                    console.log("Please Enter the first name of the employee:")
                }
            }
        },
        {
            type:"input",
            name: "lname",
            message:"What is the last name of the employee: (Required)",
            validate: (data)=>{
                if(data) return true
                else {
                    console.log("Please Enter the last name of the employee:")
                }
            }
        },
        {
            type:"rawlist",
            name: "depart",
            message:"Pick the department you wish to add the new employee to: (Required)",
            choices: ()=> getdepartment().then(s=>s)
        }
    ]).then(answer=>{
         getRoles(g.indexOf(answer.depart)+1).then(f=>{
            return inquirer.prompt([
                {
                    type:"rawlist",
                    name:"role",
                    message:"Below is a list of roles for the department you picked:Required",
                    choices: ()=> f.map(g=>g.title)
                    
                }
            ]).then(rolePicked=>{
                let roleid,managerid;
                const b = f.filter(p=>{//we are getting the role id
                    if(p.title === rolePicked.role){
                        return p
                    }
                })
                if(rolePicked.role === "Operations Mgr"){
                    console.log("Since you are adding a manager, this employee will be reporting to the CEO 'Dwayne Johnson'directly.")
                    roleid = b[0].id;
                    managerid = 1;
                    //console.log(answer.fname,answer.lname,b[0].id,1)
                    res( {
                        fn:answer.fname,
                        ln:answer.lname,
                        rid: roleid,
                        mid: managerid
                    })
                }else{
                    getManager(g.indexOf(answer.depart)+1).then(fg=>{
                        fg.forEach(f=>{
                            console.log("You are added to the Db and you will be reporting to " + f.first_name + " " + f.last_name);
                        })
                        roleid = b[0].id;
                        managerid = fg[0].id;
                        //console.log(answer.fname,answer.lname,b[0].id,fg[0].id)
                        res( {
                            fn:answer.fname,
                            ln:answer.lname,
                            rid: roleid,
                            mid: managerid
                        })
                    })
                }
            })
        })
    })
})
}
//updating the employee
const updateEmp = ()=>{
    return new Promise((res,rej)=>{

        inquirer.prompt([
            {
                type:"input",
                name:"id",
                message:"What is the employee id : Required",
                validate: (data)=>{
                    if(data) return true
                    else {
                        console.log("Please Enter the Employee id:")
                    }
                }
            },
            {
                type:"rawlist",
                name:"depart",
                message:"What new department do you wish to go to:Required",
                choices: ()=> getdepartment().then(s=>s)
            }
        ]).then(answer=>{
            getRoles(g.indexOf(answer.depart)+1).then(f=>{
                return inquirer.prompt([
                    {
                        type:"rawlist",
                        name:"role",
                        message:"Below is a list of roles for the department you picked:Required",
                        choices: ()=> f.map(g=>g.title)
                        
                    }
                ]).then(rolePicked=>{
                    let fn,ln,roleid,managerid;
                    const b = f.filter(p=>{//we are getting the role id
                        if(p.title === rolePicked.role){
                            return p
                        }
                    })
                    if(rolePicked.role === "Operations Mgr"){
                        //console.log("Since you are adding a manager, this employee will be reporting to the CEO 'Dwayne Johnson'directly.")
                        roleid = b[0].id;
                        managerid = 1;
                        //console.log(answer.fname,answer.lname,b[0].id,1)
                        res( {
                            id: answer.id,
                            rid: roleid,
                            mid: managerid
                        })
                    }else{
                        getManager(g.indexOf(answer.depart)+1).then(fg=>{
                            fg.forEach(f=>{
                                //console.log("You are added to the Db and you will be reporting to " + f.first_name + " " + f.last_name);
                            })
                            roleid = b[0].id;
                            managerid = fg[0].id;
                            //console.log(answer.fname,answer.lname,b[0].id,fg[0].id)
                            res( {
                                id:answer.id,
                                rid: roleid,
                                mid: managerid
                            })
                        })
                    }
                })
            })
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
        addRole()
   }else if(option === choices[5]){//add an employee
        addEmployee().then(f=>{
            const sql = "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?);"
            db.query(sql,[f.fn,f.ln,f.rid,f.mid],(err,result)=>{
                if(err){
                    console.log(err)
                }else if(!result.affectedRows){
                    console.log("nothing was added")
                }else{
                    console.log("Your Employee has been added to the Table.")
                }
            })   
        })
   }else if(option === choices[6]){//update an employee
        updateEmp().then(f=>{
            console.log(f.rid,f.mid,f.id)
            const sql = "UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?;";
            db.query(sql,[f.rid,f.mid,f.id],(err,result)=>{
                if(err){
                    console.log(err)
                }else if(!result.affectedRows){
                    console.log("Error performing the operation.")
                }else{
                    console.log("The employee's role has been updated in the Database.")
                }
            })   
        });

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