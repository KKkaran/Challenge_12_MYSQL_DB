const db = require("./db/connection");
const table = require("string-table");
const {bonus,choices2} = require("./src/bonus")
const {displayOptions,updateEmp,addRole,addDepartment,addEmployee,choices} = require("./src")

const j = ()=>{
    displayOptions().then(answers=>{
    const option = answers.optionPicked;
    const sql = "SELECT * FROM department";
    if(option === choices[0]){//show all departments
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(table.create(result));
            console.log("\n\n")
            j();
        });
    }else if(option === choices[1]){//show all roles
        const sql = "SELECT r.*, d.depart_name FROM role AS r LEFT JOIN department AS d ON r.department_id = d.id ORDER BY d.id;";
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(table.create(result));
            console.log("\n\n")
            j();
        });
    }else if(option === choices[2]){//show all employees
        const sql = 'SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.depart_name, CONCAT(f.first_name," ",f.last_name) AS Manager FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS f ON e.manager_id = f.id;';
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(table.create(result));
            console.log("\n\n")
            j();
        });
    }else if(option === choices[3]){//add a department
        addDepartment().then(ans=>{
            const sql = "INSERT INTO department (depart_name) VALUES (?);"
            db.query(sql,ans.departName,(err,result)=>{
                if(err){
                    console.log(err)
                }else if(!result.affectedRows){
                    console.log("nothing added")
                }else{
                    console.log("Your Department hasbeen added to the Table.")
                }
                console.log("\n\n")
                j();
            })   
        })
    }else if(option === choices[4]){//add a role
        addRole(j)
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
                console.log("\n\n")
                j();
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
                console.log("\n\n")
                j();
            })   
        });

    
    
    
    
    }else if(option === choices[7]){//go for bonus
        bonus().then(a=>{
            if(a.bonus === choices2[0]){
                const sql = "SELECT e.id, e.first_name,e.last_name, r.title, r.salary, d.depart_name, concat(f.first_name,' ',f.last_name) as Manager from employee as e left join role as r on e.role_id = r.id left join department as d on r.department_id = d.id left join employee as f on e.manager_id = f.id;;"
                db.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    console.log(table.create(result));
                    console.log("\n\n")
                    j();
                });
            }else if(a.bonus === choices2[1]){
                const sql = "select SUM(r.salary) as BUDGET, d.depart_name from employee as e inner join role as r on e.role_id = r.id inner join department as d on r.department_id = d.id group by d.depart_name;";
                db.query(sql,function(err,result,fields){
                    if(err) throw err;
                    console.log(table.create(result));
                    console.log("\n\n")
                    j();
                })
            }
        });
    }else if(option === choices[8]){
        console.log("***************************************Program has now ended.***************************************")  
    }
   })
}
j();

