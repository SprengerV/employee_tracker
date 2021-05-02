const Department = require('./Department');
const Role = require('./Role');
const Employee = require('./Employee');

Employee.hasMany(Employee, {
  foreignKey: 'managerId'
});
Employee.belongsTo(Employee, {
  as: 'manager'
});

Role.hasMany(Employee, {
  foreignKey: 'roleId'
});
Employee.belongsTo(Role);

Department.hasMany(Role, {
  foreignKey: 'departmentId'
});
Role.belongsTo(Department);

module.exports = { Department, Role, Employee };
