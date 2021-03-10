const inquirer = require('inquirer');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'config', 'connection.js'));
const Department = require(path.join(__dirname, '..', 'models', 'Department.js'));
const Role = require(path.join(__dirname, '..', 'models', 'Role.js'));
const Employee = require(path.join(__dirname, '..', 'models', 'Employee.js'));

const ask = () => {
    inquirer 
        .prompt([
            {
                name: 'open',
                type: 'list',
                message: 'What would you like to do?',
                choices: ['Search employee database', 'Update employee database'],
            },
        ])
        .then((ans) => {
            switch (ans.open) {
                case 'Search employee database':
                    search();
                    break
                case 'Update employee database':
                    update();
                    break
                default:
                    console.log(`Invalid operation: '${ans.open}'`)
            }
        })
        .catch((err) => {
            if (err) throw new Error(err)
        });
}
const main = () => {
    // sequelize
    //     .import(Department)
    //     .import(Role)
    //     .import(Employee)
    // ;
    sequelize
        .sync()
        .then(() => {
            ask();
        })
} 

module.exports = main;