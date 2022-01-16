const inquirer = require("inquirer");
const db = require("../db/connection");
const mysql = require("mysql2");
const choices = ["View all Departments","View all Roles","View all Employees","Add a Department","Add a Role","Add an Employee","Update an Employee Role","****Bonus****","QUIT"];
console.log("*********************Welcome to the Tequilla Corp. Employee Tracking System****************************")
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
            type:"rawlist",
            name: "optionPicked",
            message:"Pick an option:",
            choices: choices
        }
    ])
}
//for adding department to the db
const addDepartment = ()=>{
    return new Promise((res,rej)=>{
        inquirer.prompt([
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
        ])
    
     .then(ans=>{res({departName:ans.departName})})})
}
//for adding role to the db
const addRole = (j)=>{
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
            console.log("\n\n")
            j();
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
                        if(fg.length === 0){
                            console.log("no manager for this department yet")
                        }else{
                            managerid = fg[0].id;
                        }
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
                            if(fg.length === 0){
                                console.log("no manager for this department yet")
                            }else{
                                managerid = fg[0].id;
                            }
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
module.exports = {
    displayOptions:displayOptions,
    addEmployee:addEmployee,
    updateEmp : updateEmp,
    addEmployee: addEmployee,
    addRole: addRole,
    addDepartment:addDepartment,
    getManager:getManager,
    choices: choices

}