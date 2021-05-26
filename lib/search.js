const inquirer = require('inquirer');
const { Employee, Department, Role } = require('../models');
const { pickEmp, pickRole, pickDept } = require('./pick');

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
      ]);
    switch (ans.which) {
    case 'Name':
      await name();
      break;
    case 'Role':
      await role();
      break;
    case 'Department':
      await dept();
      break;
    case 'Cancel':
      require('../index.js');
      break;
    default:
      console.log(`\nIllegal action: ${ans.which} \nReturning to main menu.`);
      require('../index.js');
    }
  } catch (err) {
    console.error(err);
  }
};
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
      ]);
    const term = ans1.which.toLowerCase().split(' ').join('_');
    const obj = {};
    obj[term] = ans1.name;
    const emps = await Employee.findAll(
      {
        raw: true,
        where: obj,
        include: [Role]
      });
    console.log(emps);
    for (const i in emps) {
      const findD = await Department.findOne({ where: { id: emps[i]['role.department_id'] } });
      const dpt = findD.name;
      const findM = await Employee.findOne({ where: { id: emps[i].manager_id } });
      let mgr;
      if (findM) mgr = `${findM.last_name}, ${findM.first_name}`;
      else mgr = '-';
      console.log(`
      ${emps[i].last_name}, ${emps[i].first_name}
      ID # ${emps[i].id}
      Title: ${emps[i]['role.title']}
      Salary: $${emps[i]['role.salary']}/year
      Department: ${dpt}
      Reports to: ${mgr}
      `);
    }
  } catch (err) {
    console.error(err);
  }
};
const dept = async () => {
  try {
    const depts = await Department.findAll(
      {
        raw: true,
        attributes: ['name']
      });
    const choices = depts.map((key) => {
      return key.name;
    });
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
            return ans.search === 'Enter a department';
          },
          name: 'name',
          type: 'input',
          message: 'Department name:'
        }
      ]);
    let dept = ans1.search;
    if (ans1.name) {
      dept = ans1.name;
    }
    const info = await Department.findAll(
      {
        raw: true,
        where: {
          name: dept
        },
        include: [Role]
      }
    );
    console.log(info);
    const roleObj = {};
    for (const i in info) {
      const key = info[i]['roles.title'];
      roleObj[key] = [];
      const roleId = info[i]['roles.id'];
      const roleEmps = await Employee.findAll(
        {
          raw: true,
          where: {
            role_id: roleId
          }
        }
      );
      for (const x in roleEmps) {
        const name = roleEmps[x].name;
        const id = roleEmps[x].id;
        const empObj = {
          name: name,
          id: id
        };
        roleObj[key].push(empObj);
      }
    }
    console.log(roleObj);
  } catch (err) {
    console.error(err);
  }
};
const role = async () => {
  try {
    const roles = await Role.findAll(
      {
        raw: true,
        attributes: ['title']
      }
    );
    const choices = roles.map((key) => {
      return key.title;
    });
    const ans1 = await inquirer
      .prompt([
        {
          name: 'role',
          type: 'list',
          message: 'Select a role below',
          choices: ['Enter a role', ...choices]
        }
      ]);
    const find = await Role.findAll(
      {
        where: {
          title: ans1.role
        },
        include: ['employees']
      }
    );
    console.log(find);
  } catch (err) {
    console.error(err);
  }
};

const searchEmp = (emp) => {
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
    ...optQs
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
        'Employee\'s salary': () => console.log(`\nSalary: $${emp['role.salary']}`),
        'Employee\'s title': () => console.log(`\nTitle: ${emp['role.title']}`),
        'Employee\'s department': () => console.log(`\nDepartment: ${emp['role.department.name']}`),
        'Employee\'s manager': () => console.log(`\nManager: ${emp['answers_to.name']}`),
        'Manager\'s employees': () => {
          return underlings(emp.id);
        }
      };
      ans
        ? func[ans]()
        : console.log('\nInvalid response');
    })
    .catch(err => console.error(err));
};
const underlings = (id) => {
  return Employee
    .findAll({
      where: {
        managerId: id
      }
    })
    .then(docs => {
      docs
        ? console.log(docs)
        : console.log('No employee\'s found with that manager');
    })
    .catch(err => console.error(err));
};
const searchRole = (role) => {

};
const searchDept = (dept) => {

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
