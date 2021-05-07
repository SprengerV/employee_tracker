const Department = require('../models').Department
const Role = require('../models').Role
const Employee = require('../models').Employee
const inquirer = require('inquirer')

const addDept = () => {
    return inquirer
      .prompt([
        {
          name: 'name',
          type: 'Input',
          message: 'Department name:'
        }
      ])
      .then(ans => {
        const res = { name: ans.name.toUpperCase() };
        return Department
          .create(res)
          .then(doc => {
            console.log(`\n${res.name} added to database`);
            res.id = doc.id;
            return res;
          });
      })
      .catch(err => console.error(err));
}
const addRole = () => {
  let role = {};
  return Department
    .findAll({ raw: true })
    .then(depts => {
      const choices = depts.map(index => {
        index.value = index.id;
        return index;
      });
      return inquirer
        .prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Title:'
          },
          {
            name: 'dept',
            type: 'list',
            message: 'Which department does this role belong to?',
            choices: ['Add new department', ...choices]
          }
        ])
        .then(async (ans) => {
          if (ans.dept === 'Add new department') {
            console.log('\nCreating new department instead')
            let dept;
            try {  
              dept = await addDept();
            } catch (err) {
              console.error(err);
            }
            role.departmentId = dept.id;
          } else role.departmentId = ans.dept;
          role.title = ans.title.toUpperCase();
          return inquirer
            .prompt([
              {
                name: 'salary',
                type: 'number',
                message: 'Salary:'
              }
            ])
            .then(ans2 => {
              role = { ...role, ...ans2 };
              return Role
                .create(role)
                .then(doc => {
                  console.log(`${doc.title} added to database.`);
                  return doc; 
                })
                .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    });
}
const addEmp = () => {
  let emp = {};
  return inquirer
    .prompt([
      {
        name: 'first',
        type: 'input',
        message: 'Employee first name:'
      },
      {
        name: 'last',
        type: 'input',
        message: 'Employee last name:'
      } 
    ])
    .then(ans => {
      emp.firstName = ans.first.toUpperCase();
      emp.lastName = ans.last.toUpperCase();
      return Role
        .findAll({ raw: true })
        .then(docs => {
          const roles = docs.map(index => {
            index.name = index.title;
            index.value = index.id;
            return index;
          })
          return inquirer
            .prompt([
              {
                name: 'role',
                type: 'list',
                message: 'Emplyee role:',
                choices: [`Add a role for ${emp.firstName} ${emp.lastName}`, ...roles]
              }
            ])
            .then(async (ans2) => {
              let role;
              if (ans2.role === `Add a role for ${emp.firstName} ${emp.lastName}`) {
                try {
                  role = await addRole();
                  emp.roleId = role.id;
                } catch (err) {
                  console.error(err);
                }
              } else emp.roleId = ans2.role;
              return inquirer
                .prompt([
                  {
                    name: 'mgr',
                    type: 'confirm',
                    message: 'Is this employee a manager?'
                  },
                  {
                    name: 'conf',
                    type: 'confirm',
                    message: 'Does this employee report to a manager?'
                  }
                ])
                .then(async ans3 => {
                  ans3.mgr ?
                    emp.manager = true 
                    :
                    emp.manager = false
                  ;
                  if (ans3.conf) {
                    try {
                      emp.managerId = await addMgr();
                    } catch (err) {
                      console.error(err);
                    }
                  }
                  return Employee
                    .create(emp)
                    .then(doc => {
                      return doc;
                    });
                })
                .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};
const addMgr = () => {
  return Employee
    .findAll({
      raw: true,
      where: {
        manager: 1
      },
      attributes: ['firstName', 'lastName', 'id']
    })
    .then(emps => {
      const employees = [];
      for (const index of emps) {
        employees.push({
          ...index,
          name: `${index.firstName} ${index.lastName}`,
          value: index.id
        });
      }
      return inquirer
        .prompt([
          {
            name: 'mgr',
            type: 'list',
            message: 'Select manager:',
            choices: ['Cancel', ...employees]
          }
        ])
        .then(ans => {
          if (ans.mgr === 'Cancel') {
            return;
          }
          return ans.mgr;
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}
const addFunctions = {
  department: addDept,
  role: addRole,
  employee: addEmp
};

module.exports = {
  add: (entry) => {
    addFunctions[entry]().then(require('./ask'));
  },
  ...addFunctions
};
