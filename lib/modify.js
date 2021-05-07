const inquirer = require('inquirer');
const Department = require('../models').Department;
const Role = require('../models').Role;
const Employee = require('../models').Employee;

const pickEmp = async () => {
  let empOld;
  return Employee
    .findAll({ raw: true })
    .then(emps => {
      const employees = emps.map(index => {
        const employee = {
          name: `${index.firstName} ${index.firstName}`,
          value: { ...index }
        }
        return employee;
      });
      return inquirer
        .prompt([
          {
            name: 'pick',
            type: 'list',
            message: 'Select an employee below:',
            choices: ['Find employee by name', 'Cancel', ...employees]
          },
          {
            when: (ans) => {
              return ans.pick === 'Find employee by name'
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
        .then(ans => {
          if (ans.pick === 'Cancel') require('./ask');
          if (ans.pick !== 'Find employee by name') empOld = ans.pick
          else {
            empOld = await Employee
              .findOne({
                where: {
                  firstName: ans.first,
                  lastName: ans.last
                }
              });
          }
          if (!empOld) this.modify('employee');
          return empOld;
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}
const modEmp = async (emp) => {

}
const pickRole = async () => {
  let roleOld;
  return Role
    .findAll({ raw: true })
    .then(res => {
      const roles = res.map(index => {
        const role = {
          name: index.title,
          value: { ...index }
        };
        return role;
      });
      return inquirer
        .prompt([
          {
            name: 'role',
            type: 'list',
            message: 'Choose a role below',
            choices: ['Find a role by title', 'Cancel', ...roles]
          },
          {
            when: (ans) => {
              return ans.role === 'Find a role by title'
            },
            name: 'title',
            type: 'input',
            message: 'Enter role title:'
          }
        ])
        .then(ans => {
          if (ans.role === 'Cancel') require('./ask');
          if (ans.role !== 'Find a role by title') roleOld = ans.role
          else {
            roleOld = await Role
              .findOne({
                where: {
                  title: ans.title
                }
              }); 
          }
          if (!roleOld) modify('role');
          return roleOld;
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
} 
const modRole = async (role) => {

}
const pickDept = async () => {
  let deptOld;
  return Department
    .findAll({ raw: true })
    .then(res => {
      const departments = res.map(index => {
        const department = {
          name: index.name,
          value: { ...index }
        };
        return department;
      });
      return inquirer
        .prompt([
          {
            name: 'dept',
            type: 'list',
            message: 'Select a department:',
            choices: ['Find a department by name', 'Cancel', ...departments]
          },
          {
            when: (ans) => {
              return ans.dept === 'Find a department by name'
            },
            name: 'name',
            type: 'input',
            message: 'Enter department name:'
          }
        ])
        .then(ans => {
          if (ans.dept === 'Cancel') require('./ask');
          if (ans.dept !== 'Find a department by name') deptOld = ans.dept
          else {
            deptOld = await Department
              .findOne({
                where: {
                  name: ans.name
                }
              });
          }
          if (!deptOld) modify('department');
          return deptOld; 
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}
const modDept = async (dept) => {

}

const modifyFunctions = {
  employee: () => pickEmp.then(emp => modEmp(emp)),
  role: () => pickRole.then(role => modRole(role)),
  department: () => pickDept.then(dept => modDept(dept))
};

module.exports = {
  modify: (entry) => {
    modifyFunctions[entry].then(require('./ask'));
  },
  ...modifyFunctions
};
