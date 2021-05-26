const { Department, Role, Employee } = require('../models');
const { pickDept, pickRole, pickEmp } = require('./modify');

const remDept = (dept) => {
  return Department
    .destroy({ where: dept })
    .then(doc => {
      console.log(`\nDepartment ${ dept.name } with ID ${ dept.id } deleted`);
      return doc;
    })
    .catch(err => console.error(err));
};
const remRole = (role) => {
  return Role
    .destroy({
      where: {
        id: role.id,
        title: role.title,
        salary: role.salary,
        departmentId: role.departmentId
      } 
    })
    .then(doc => {
      console.log(`\nRole ${ role.title } with ID ${ role.id } deleted`);
      return doc;
    })
    .catch(err => console.error(err));
};
const remEmp = (emp) => {
  return Employee
    .destroy({ where: emp })
    .then(doc => {
      console.log(`\nEmployee ${ emp.name } with ID ${ emp.id } deleted`);
      return doc;
    })
    .catch(err => console.error(err));
};
const remFunctions = {
  department: () => {
    return pickDept().then(dept => remDept(dept));
  },
  role: () => {
    return pickRole().then(role => remRole(role));
  },
  employee: () => {
    return pickEmp().then(emp => remEmp(emp));
  }
};

module.exports = {
  remove: (selection) => {
    remFunctions[selection]().then(require('./ask'));
  },
  ...remFunctions
};