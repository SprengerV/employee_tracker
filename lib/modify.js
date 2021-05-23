const inquirer = require('inquirer');
const Department = require('../models').Department;
const Role = require('../models').Role;
const Employee = require('../models').Employee;
const add = require('./add.js');

const pickEmp = () => {
  return Employee
    .findAll({ raw: true })
    .then(emps => {
      const employees = emps.map(index => {
        const employee = {
          name: `${index.firstName} ${index.lastName}`,
          value: index
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
              return ans.pick === 'Find employee by name';
            },
            name: 'last',
            type: 'input',
            message: 'Last name:'
          },
          {
            when: (ans) => {
              return ans.pick === 'Find employee by name';
            },
            name: 'first',
            type: 'input',
            message: 'First name:'
          }
        ])
        .then(async (ans) => {
          console.log(ans.pick)
          let empOld = null;
          if (ans.pick === 'Cancel') return null;
          else if (ans.pick === 'Find employee by name') {
            empOld = await Employee
              .findOne({
                where: {
                  firstName: ans.first.toUpperCase(),
                  lastName: ans.last.toUpperCase()
                }
              });
            if (!empOld) {
              console.log('Employee not found');
              return pickEmp();
            }
          } else empOld = ans.pick
          return empOld;
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};
const pickMgr = () => {
  return Employee
    .findAll({
      where: {
        manager: 1
      }
    })
    .then(res => {
      if (!res) {
        return inquirer
          .prompt([
            {
              name: 'add',
              type: 'confirm',
              message: 'No managers found, add one now?'
            }
          ]).then(async (ans) => {
            if (ans.add) {
              await add.employee();
              pickMgr();
            } else {
              return
            }
          })
          .catch(err => console.error(err));
      } else {
        const managers = res.map(index => {
          const manager = {
            name: `${index.firstName} ${index.lastName}`,
            value: index
          };
          return manager;
        });
        return inquirer
          .prompt([
            {
              name: 'manager',
              type: 'list',
              message: 'Select manager below:',
              choices: ['Add a new manager', 'Cancel', ...managers]
            }
          ])
          .then(ans => {
            if (ans.manager === 'Cancel') {
              console.log('Adding manager cancelled');
              return null;
            } else if (ans.manager === 'Add a new manager') return add.employee();
            else {
              console.log(`${ans.manager.firstName} ${ans.manager.lastName} selected as manager`)
              return ans.manager;
            }
          })
          .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
};
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
      if (ans.field === 'Cancel') return null
      else {
        const modded = {
          ...emp,
          ...ans
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
const pickRole = () => {
  let roleOld;
  return Role
    .findAll({ 
      raw: true,
      include: {
        model: Department,
        attributes: ['name']
      }
    })
    .then(res => {
      console.log(res)
      const roles = res.map(index => {
        const role = {
          name: `${index.title} - ${index['department.name']}`,
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
              return ans.role === 'Find a role by title';
            },
            name: 'title',
            type: 'input',
            message: 'Enter role title:'
          }
        ])
        .then(async (ans) => {
          switch (ans.role) {
            case 'Cancel':
              return null;
            case 'Find a role by title':
              return Role
                .findAll({ 
                  raw: true,
                  where: {
                    title: ans.title.toUpperCase()
                  },
                  include: {
                    model: Department,
                    attributes: ['name']
                  }
                })
                .then(res => {
                  if (!res) {
                    console.log(`${ ans.title.toUpperCase() } not found`);
                    return pickRole();
                  } else {
                    const queriedRoles = res.map(index => {
                      const role = {
                        name: `${ index.title } - ${ index['department.name'] }`,
                        value: index
                      }
                      return role;
                    });
                    return inquirer
                      .prompt([
                        {
                          name: 'role',
                          type: 'list',
                          message: 'Select role below:',
                          choices: [...queriedRoles, { name: 'Cancel', value: null }]
                        }
                      ])
                      .then(res2 => {
                        return res2.role;
                      })
                      .catch(err => console.error(err));
                  }
                })
                .catch(err => console.error(err));
            default:
              return ans.role;
          };
        })
        .catch(err => console.error(err));
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
      switch (ans.field) {
        case 'Cancel':
          return null
        case 'Department':
          const dept = await pickDept();
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
            })
        default:
          return null;
      }     
    })
    .catch(err => console.error(err)); 
};
const pickDept = () => {
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
        .then(async (ans) => {
          if (ans.dept === 'Cancel') return null;
          if (ans.dept !== 'Find a department by name') deptOld = ans.dept
          else {
            deptOld = await Department
              .findOne({
                where: {
                  name: ans.name
                }
              });
          }
          if (!deptOld) {
            console.log(`Department ${ans.name} not found`)
            return pickDept();
          }
          console.log(`Selected department ${deptOld.name}`)
          return deptOld; 
        })
        .catch(err => console.error(err));
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

const selectFunctions = {
  pickEmp,
  pickRole,
  pickDept
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
  ...selectFunctions
};
