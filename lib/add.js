const Department = require('../models').Department
const Role = require('../models').Role
const Employee = require('../models').Employee
const inquirer = require('inquirer')
const { Op } = require('sequelize')
const ask = require('../index.js')

const add = async (type) => {
  try {
    switch (type) {
      case 'Department':
        await addDept()
        break
      case 'Role':
        await addRole()
        break
      case 'Employee':
        await addEmp()
        break
      default:
        console.log(`Illegel action: Add '${type}' not found.`)
    }
    ask()
  } catch (err) {
    console.error(err)
  }
}
const addDept = async () => {
  try {
    const ans = await inquirer
      .prompt([
        {
          name: 'name',
          type: 'Input',
          message: 'Department name:'
        }
      ])
    const name = ans.name.toUpperCase()
    await Department.create({ name: name })
    console.log(`${name} added to database\n`)
    return name
  } catch (err) {
    console.error(err)
  }
}
const addRole = async () => {
  try {
    const depts = await Department.findAll({ raw: true })
    const choices = depts.map((index) => {
      return index.name
    })
    let title = await inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Title:'
        }
      ])
    title = title.title.toUpperCase()
    const ans = await inquirer
      .prompt([
        {
          name: 'salary',
          type: 'number',
          message: `${title} salary:`
        },
        {
          name: 'dept',
          type: 'list',
          message: 'Which department does this role belong to?',
          choices: [...choices, `Add new department for ${title}`]
        }
      ])
    let deptAns = ans.dept.toUpperCase()
    if (ans.dept === `Add new department for ${title}`) {
      deptAns = await addDept()
    }
    const deptId = await Department.findOne(
      {
        raw: true,
        attributes: ['id'],
        where: { name: deptAns }
      }
    )
    console.log(`matching dept: ${deptId}`)
    await Role.create(
      {
        title: title,
        salary: parseInt(ans.salary),
        departmentId: deptId.id
      }
    )
    console.log(`Role ${title} in department ${deptAns} added to database.\n`)
    return title
  } catch (err) {
    console.error(err)
  }
}
const addEmp = async () => {
  try {
    const roleQuery = await Role.findAll({ raw: true })
    const roles = []
    for (const key of roleQuery) {
      roles.push(key.title)
    };
    console.log(roles)
    const ans1 = await inquirer
      .prompt([
        {
          name: 'first',
          type: 'input',
          message: 'First name:'
        },
        {
          name: 'last',
          type: 'input',
          message: 'Last name:'
        }
      ])
    const first = ans1.first.toUpperCase()
    const last = ans1.last.toUpperCase()
    const ans2 = await inquirer
      .prompt([
        {
          name: 'role',
          type: 'list',
          message: 'Role:',
          choices: [...roles, `Add a role for ${first} ${last}`]
        }
      ])
    let role = ans2.role
    if (role === `Add a role for ${first} ${last}`) {
      role = await addRole()
    }
    let roleId = await Role.findOne(
      {
        raw: true,
        attributes: ['id'],
        where: { title: role }
      }
    )
    roleId = roleId.id
    const ans3 = await inquirer
      .prompt([
        {
          name: 'conf',
          type: 'confirm',
          message: 'Does this employee report to a manager?'
        },
        {
          when: (ans) => {
            return ans.conf
          },
          name: 'mgrFirst',
          type: 'input',
          message: 'Manager first name:'
        },
        {
          when: (ans) => {
            return ans.conf
          },
          name: 'mgrLast',
          type: 'input',
          message: 'Manager last name:'
        }
      ])
    let mgrId
    if (ans3.conf) {
      const mgrFirst = ans3.mgrFirst.toUpperCase()
      const mgrLast = ans3.mgrLast.toUpperCase()
      mgrId = await Employee.findOne(
        {
          raw: true,
          attributes: ['id'],
          where: {
            first_name: mgrFirst,
            last_name: mgrLast
          }
        })
      mgrId = mgrId.id
      if (mgrId.length === 0) console.log('\nManager not found in database')
    }
    await Employee.create({
      first_name: first,
      last_name: last,
      role_id: roleId,
      manager_id: mgrId
    })
    console.log(`\n${first} ${last} with role ${role} added to database`)
  } catch (err) {
    console.error(err)
  }
}

module.exports = add
