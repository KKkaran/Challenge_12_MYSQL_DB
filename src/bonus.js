//this is the bonus exercises.
const inquirer = require("inquirer")
const {getManager} = require('./index')
const choices = ["View employees by Manager","total utilized budget of department"]

const bonus = ()=>{

    return new Promise((res,rej)=>{

        inquirer.prompt([
            {
                type:"rawlist",
                name:"bonus",
                message:"Pick a bonus: Required",
                choices:choices
            }
        ]).then(answer=>{
           res(answer)
        })
    })

}


module.exports = {
 
    bonus:bonus,
    choices2:choices
};