const inquirer = require('inquirer');
const { Employee, Role } = require('../models');
const { pickEmp, pickRole, pickDept } = require('./pick');

const searchEmp = (emp) => {
  const name = `${emp.lastName}, ${emp.firstName}`;
  const optQs = ([
    emp.manager_id
      ? 'Employee\'s manager'
      : '',
    emp.manager
      ? 'Manager\'s employees'
      : ''
  ]).filter(i => {
    return i.length;
  });
  const qs = [
    'Employee\'s salary',
    'Employee\'s title',
    'Employee\'s department',
    ...optQs,
    'Cancel'
  ];
  return inquirer
    .prompt([
      {
        name: 'query',
        type: 'list',
        message: 'What would you like to search for?',
        choices: qs
      }
    ])
    .then(ans => {
      const func = {
        'Employee\'s salary': () => {
          const sal = emp['role.salary'];
          sal
            ? console.log(`\nSalary: $${sal}\n`)
            : console.log(`\nSalary data not found for ${name}\n`);
        },
        'Employee\'s title': () => {
          const title = emp['role.title'];
          title
            ? console.log(`\nTitle: ${title}\n`)
            : console.log(`\nRole data not found for ${name}\n`);
        },
        'Employee\'s department': () => {
          const dept = emp['role.department.name'];
          dept
            ? console.log(`\nDepartment: ${dept}\n`)
            : console.log(`\nDepartment data not found for ${name}\n`);
        },
        'Employee\'s manager': () => {
          const mgr = `\n${emp['answers_to.lastName']}, ${emp['answers_to.firstName']}, ID: ${emp['answers_to.id']}\n`;
          mgr
            ? console.log(`\nManager: ${mgr}\n`)
            : console.log(`\nManager data not found for ${name}\n`);
        },
        'Manager\'s employees': () => {
          return mgrEmps(emp.id);
        },
        'Cancel': () => {
          return null;
        }
      };
      ans
        ? func[ans.query]()
        : console.log('\nInvalid response\n');
    })
    .catch(err => console.error(err));
};
const mgrEmps = (id) => {
  return Employee
    .findAll({
      where: {
        managerId: id
      }
    })
    .then(docs => {
      docs
        ? console.log(docs)
        : console.log('\nNo employee\'s found with that manager\n');
    })
    .catch(err => console.error(err));
};
const searchRole = (role) => {
  return inquirer
    .prompt([
      {
        name: 'query',
        type: 'list',
        message: 'What would you like to search for?',
        choices: ['Role department', 'Employees with this role']
      }
    ])
    .then(ans => {
      const func = {
        'Role department': () => {
          const dept = `\n${ !role.departmentId || `Department: ${role['department.name']} ID: ${role['departmentId']}` }\n`;
          dept
            ? console.log(dept)
            : console.log(`\nNo department ID listed for role ${role.title}\n`);
        },
        'Employees with this role': () => {
          roleEmps(role) ;
        }
      };
      ans
        ? func[ans.query]()
        : console.log('\nInvalid answer\n');
    })
    .catch(err => console.error(err));
};
const roleEmps = (role) => {
  return Employee
    .findAll({
      where: {
        roleId: role.id
      }
    })
    .then(docs => {
      docs
        ? console.log(docs)
        : console.log(`\nNo employees found with role ${role.title}\n`);
    })
    .catch(err => console.error(err));
};
const searchDept = (dept) => {
  return inquirer
    .prompt([
      {
        name: 'query',
        type: 'list',
        message: 'What would you like to search for?',
        choices: ['Department roles', 'Department employees']
      }
    ])
    .then(ans => {
      const func = {
        'Department roles': () => {
          return deptRoles(dept);
        },
        'Department employees': () => {
          return deptEmps(dept);
        }
      };
      ans
        ? func[ans.query]()
        : console.log('Invalid answer');
    })
    .catch(err => console.err(err));
};
const deptRoles = (dept) => {
  return Role
    .findAll({
      raw: true,
      where: {
        departmentId: dept.id
      }
    })
    .then(docs => {
      docs
        ? console.log(docs)
        : console.log(`\nNo roles found in department ${dept.name}\n`);
      return docs;
    })
    .catch(err => console.error(err));
};
const deptEmps = (dept) => {
  return Role
    .findAll({
      raw: true,
      where: {
        departmentId: dept.id
      },
      include: [
        {
          model: Employee,
          as: 'employees'
        }
      ]
    })
    .then(docs => {
      docs
        ? console.log(docs)
        : console.log(`\nNo employees found for department ${dept.name}`);
      return docs;
    })
    .catch(err => console.error(err));
};

const searchFunctions = {
  role: () => pickRole().then(role => {
    if (role) return searchRole(role);
  }),
  department: () => pickDept().then(dept => {
    if (dept) return searchDept(dept);
  }),
  employee: () => pickEmp().then(emp => {
    if (emp) return searchEmp(emp);
  })
};

module.exports = {
  search: (type) => {
    searchFunctions[type]().then(require('./ask'));
  },
  ...searchFunctions
};
