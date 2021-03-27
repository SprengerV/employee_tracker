const inquirer = require('inquirer')
const Department = require('../models').Department
const Role = require('../models').Role
const Employee = require('../models').Employee
const add = require('./add.js')

const modify = async (type) => {
  try {
    switch (type) {
      case 'Department':
        await modDept()
        break
      case 'Role':
        await modRole()
        break
      case 'Employee':
        await modEmp()
        break
      default:
        console.log(`Illegel action: Modify '${type}' not found.`)
    }
    require('../index.js')
  } catch (err) {
    console.error(err)
  }
}

const modEmp = async () => {
  const emps = await Employee.findAll({ raw: true })
  const empChoices = emps.map((index) => {
    return `${index.last_name}, ${index.first_name}`
  })
  const ans1 = await inquirer
    .prompt([
      {
        name: 'pick',
        type: 'list',
        message: 'Select an employee below:',
        choices: ['Enter an employee name', ...empChoices]
      },
      {
        when: (ans) => {
          return ans.pick === 'Enter an employee name'
        },
        name: 'last',
        type: 'input',
        message: 'Last name:'
      },
      {
        when: (ans) => {
          return ans.pick === 'Enter an employee name'
        },
        name: 'first',
        type: 'input',
        message: 'First name:'
      }
    ])
  const search = async (ansObj) => {
    try {
      let lname
      let fname
      if (ansObj.pick === 'Enter a new role' || ansObj.pick === 'Add a new role') {
        lname = ansObj.last
        fname = ansObj.first
      } else {
        const split = ansObj.pick.split(', ') 
        lname = split[0]
        fname = split[1]
      }
      console.log(`first: ${fname} last: ${lname}`)
      const record = await Employee.findOne(
        {
          raw: true,
          where: {
            first_name: fname,
            last_name: lname
          }
        }
      )
      return record
    } catch (err) {
      console.error(err)
    }
  }
  const search1 = await search(ans1)
  const empId = search1.id
  let first = search1.first_name
  let last = search1.last_name
  let roleId = search1.role_id
  let mgrId = search1.manager_id
  const ans2 = await inquirer
    .prompt([
      {
        name: 'field',
        type: 'checkbox',
        message: 'Which fields would you like to modify?',
        choices: ['First name', 'Last name', 'Role', 'Manager']
      },
      {
        when: (ans) => {
          return ans.field.includes('First name')
        },
        name: 'first',
        type: 'input',
        message: 'New first name:'
      },
      {
        when: (ans) => {
          return ans.field.includes('Last name')
        },
        name: 'last',
        type: 'input',
        message: 'New last name:'
      }
    ])
  if (ans2.field.includes('First name')) first = ans2.first.toUpperCase()
  if (ans2.field.includes('Last name')) last = ans2.last.toUpperCase()
  if (ans2.field.includes('Role')) {
    const roles = await Role.findAll(
      {
        raw: true
      })
    const roleChoices = roles.map((index) => {
      return index.title
    })
    const roleName = await inquirer
      .prompt([
        {
          name: 'pick',
          type: 'list',
          message: 'Select new role below:',
          choices: [...roleChoices]
        }
      ])
    let newRole = roleName.pick.toUpperCase()
    // if (newRole === 'Add a new role') {
    //   newRole = await add('Role')
    // }
    const find = Role.findOne(
      {
        raw: true,
        atrributes: ['id'],
        where: {
          title: newRole
        }
      }
    )
    roleId = find.id
  }
  if (ans2.field.includes('Manager')) {
    const mgrName = await inquirer
      .prompt([
        {
          name: 'pick',
          type: 'list',
          message: 'Select a new manager below:',
          choices: ['Enter a manager', 'Employee no longer reports to a manager', ...empChoices]
        },
        {
          when: (ans) => {
            return ans.list === 'Enter a manager'
          },
          name: 'last',
          type: 'input',
          message: 'Last name:'
        },
        {
          when: (ans) => {
            return ans.list === 'Enter a manager'
          },
          name: 'first',
          type: 'input',
          message: 'First name'
        }
      ])
    if (mgrName.pick === 'Employee no longer reports to a manager') mgrId = null
    else {
      const newMgr = search(mgrName)
      mgrId = newMgr.id
    }
  }
  await Employee.update(
    {
      first_name: first,
      last_name: last,
      role_id: roleId,
      manager_id: mgrId
    },
    {
      where: {
        id: empId
      }
    }
  )
}
const modRole = async () => {

}
const modDept = async () => {

}

module.exports = modify
