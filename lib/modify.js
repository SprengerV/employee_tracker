const inquirer = require('inquirer');
const Department = require('../models').Department;
const Role = require('../models').Role;
const Employee = require('../models').Employee;
const { pickEmp, pickMgr, pickRole, pickDept } = require('./pick');

const modEmp = (emp) => {
  return inquirer
    .prompt([
      {
        name: 'field',
        type: 'list',
        message: 'Which field would you like to modify?',
        choices: ['First name', 'Last name', 'Role', 'Manager Status', 'Employee manager', 'Cancel']
      },
      {
        when: (ans) => {
          return ans.field === 'First name';
        },
        name: 'firstName',
        type: 'input',
        message: 'Enter new first name:'
      },
      {
        when: (ans) => {
          return ans.field === 'Last name';
        },
        name: 'lastName',
        type: 'input',
        message: 'Enter new last name:'
      },
      {
        when: (ans) => {
          return ans.field === 'Manager Status';
        },
        name: 'manager',
        type: 'confirm',
        message: 'Is this employee now a manager?'
      }
    ])
    .then(async (ans) => {
      if (ans.field === 'Cancel') return null;
      else {
        const ansMod = {};
        for (const key in ans) {
          ansMod[key] = ans[key].toUpperCase();
        }
        const modded = {
          ...emp,
          ...ansMod
        };
        if (ans.field === 'Employee manager') {
          const mgr = await pickMgr();
          modded.managerId = mgr.id;
        } else if (ans.field === 'Role') {
          const role = await pickRole();
          modded.roleId = role.id;
        }
        return Employee
          .update(modded, {
            where: {
              id: emp.id
            }
          })
          .then(doc => {
            console.log(`Employee ${ans.field} updated`);
            return doc;
          })
          .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
};
const modRole = (role) => {
  return inquirer
    .prompt([
      {
        name: 'field',
        type: 'list',
        message: 'Select field to edit:',
        choices: ['Title', 'Department', 'Cancel']
      },
      {
        when: (ans) => {
          return ans.field === 'Title';
        },
        name: 'title',
        type: 'input',
        message: 'Enter role title:'
      }
    ])
    .then(async ans => {
      let dept;
      switch (ans.field) {
      case 'Cancel':
        return null;
      case 'Department':
        dept = await pickDept();
        return Role
          .update({ departmentId: dept.id }, {
            where: {
              id: role.id
            }
          })
          .then(res => {
            return res;
          })
          .catch(err => console.error(err));
      case 'Title':
        return Role
          .update({ title: ans.title.toUpperCase() }, {
            where: {
              id: role.id
            }
          })
          .then(res => {
            return res;
          });
      default:
        return null;
      }     
    })
    .catch(err => console.error(err)); 
};
const modDept = async (dept) => {
  return inquirer
    .prompt([
      {
        name: 'field',
        type: 'confirm',
        message: 'Change department name?'
      },
      {
        when: (ans) => {
          return ans.field;
        },
        name: 'name',
        type: 'input',
        message: 'Enter department name:'
      }
    ])
    .then(ans => {
      if (!ans.field) return null;
      return Department
        .update({ name: ans.name.toUpperCase() }, {
          where: {
            id: dept.id
          }
        })
        .then(res => {
          console.log(`${ dept.name } changed to ${ ans.name.toUpperCase() }`);
          return res;
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

const modifyFunctions = {
  employee: () => pickEmp().then(emp => {
    if (emp) return modEmp(emp);
  }),
  role: () => pickRole().then(role => {
    if (role) return modRole(role);
  }),
  department: () => pickDept().then(dept => {
    if (dept) return modDept(dept);
  })
};

module.exports = {
  modify: (entry) => {
    modifyFunctions[entry]().then(require('./ask'));
  },
  ...modifyFunctions,
};
