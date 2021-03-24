const inquirer = require('inquirer')
const Department = require('../models').Department
const Role = require('../models').Role
const Employee = require('../models').Employee
const ask = require('../index.js')

const search = async () => {
  try {
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
        ask()
        break
      default:
        console.log(`\nIllegal action: ${ans.which} \nReturning to main menu.`)
        ask()
    }
    ask()
  } catch (err) {
    console.error(err)
  }
}
const name = async () => {
  try {
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
    // TODO: possibly return manager info
    const emps = await Employee.findAll(
      {
        raw: true,
        where: obj,
        include: [Role]
      })
    console.log(emps)
  } catch (err) {
    console.error(err)
  }
}
const dept = async () => {
  try {
    const depts = await Department.findAll(
      {
        raw: true,
        attributes: ['name']
      })
    const choices = depts.map((key) => {
      return key.name
    })
    const ans1 = await inquirer
      .prompt([
        {
          name: 'search',
          type: 'list',
          message: 'Select a department below:',
          choices: ['Enter a department', ...choices]
        },
        {
          when: (ans) => {
            return ans.search === 'Enter a department'
          },
          name: 'name',
          type: 'input',
          message: 'Department name:'
        }
      ])
    let dept = ans1.search
    if (ans1.name) {
      dept = ans1.name
    }
    const info = await Department.findAll(
      {
        raw: true,
        where: {
          name: dept
        }
      }
    )
    console.log(info)
  } catch (err) {
    console.error(err)
  }
}
const role = async () => {
  try {
    console.log('searching by role')
  } catch (err) {
    console.error(err)
  }
}

module.exports = search
