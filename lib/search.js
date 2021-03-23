const inquirer = require('inquirer')
const Department = require('../models/Department.js')
const Role = require('../models/Role.js')
const Employee = require('../models/Employee.js')
const ask = require('../index.js')

const search = async () => {
  console.log('Searching...')
  const ans = await inquirer
    .prompt([
      {
        name: 'which',
        type: 'list',
        messages: 'What would you like to search by?',
        choices: ['Name', 'Role', 'Department', 'Cancel']
      }
    ])
  switch (ans.which) {
    case 'Name':
      await name()
      break
    case 'Role':
      await role()
      break
    case 'Department':
      await dept()
      break
    case 'Cancel':
      break
    default:
      console.log(`\nIllegal action: ${ans.which} \nReturning to main menu.`)
      ask()
  }
  ask()
}
const name = async () => {
  const ans1 = await inquirer
    .prompt([
      {
        name: 'which',
        type: 'list',
        message: 'First or last name?',
        choices: ['First name', 'Last name']
      },
      {
        name: 'name',
        type: 'input',
        message: 'Enter name:'
      }
    ])
  const term = ans1.which.toLowerCase().split(' ').join('_')
  const obj = {}
  obj[term] = ans1.name
  const emps = await Employee.findAll({ where: obj })
  console.log(emps)
}
const dept = async () => {

}
const role = async () => {

}

module.exports = search
