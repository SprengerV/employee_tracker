const inquirer = require('inquirer');
const { Employee, Role, Department } = require('../models');
const { employee } = require('./add');

const pickEmp = () => {
  const include = [
    {
      model: Employee,
      as: 'answers_to',
      attributes: [
        'firstName',
        'lastName',
        'id'
      ]
    },
    {
      model: Role,
      include: [
        {
          model: Department
        }
      ]
    }
  ];
  return Employee
    .findAll({
      raw: true,
      include
    })
    .then(emps => {
      const employees = emps.map(index => {
        const employee = {
          name: `${index.firstName} ${index.lastName}`,
          value: index
        };
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
          console.log(ans.pick);
          let empOld = null;
          if (ans.pick === 'Cancel') return null;
          else if (ans.pick === 'Find employee by name') {
            empOld = await Employee
              .findOne({
                where: {
                  firstName: ans.first.toUpperCase(),
                  lastName: ans.last.toUpperCase()
                },
                include
              });
            if (!empOld) {
              console.log('Employee not found');
              return pickEmp();
            }
          } else empOld = ans.pick;
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
              await employee();
              pickMgr();
            } else {
              return;
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
            } else if (ans.manager === 'Add a new manager') return employee();
            else {
              console.log(`${ans.manager.firstName} ${ans.manager.lastName} selected as manager`);
              return ans.manager;
            }
          })
          .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
};
const pickRole = () => {
  return Role
    .findAll({ 
      raw: true,
      include: {
        model: Department,
        attributes: ['name']
      }
    })
    .then(res => {
      console.log(res);
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
                    };
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
          }
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};
const pickDept = () => {
  return Department
    .findAll({
      raw: true
    })
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
              return ans.dept === 'Find a department by name';
            },
            name: 'name',
            type: 'input',
            message: 'Enter department name:'
          }
        ])
        .then(async (ans) => {
          let dept;
          if (ans.dept === 'Cancel') return null;
          if (ans.dept !== 'Find a department by name') dept = ans.dept;
          else {
            const dept = await Department
              .findOne({
                where: {
                  name: ans.name
                }
              });
          }
          if (!dept) {
            console.log(`Department ${ans.name} not found`);
            return pickDept();
          }
          console.log(`Selected department ${dept.name}`);
          return dept; 
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

module.exports = {
  pickEmp,
  pickMgr,
  pickRole,
  pickDept
};