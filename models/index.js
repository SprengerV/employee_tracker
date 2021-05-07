const Department = require('./Department');
const Role = require('./Role');
const Employee = require('./Employee');

Employee.hasMany(Employee, {
  foreignKey: 'managerId'
});
Employee.belongsTo(Employee, {
  foreignKey: 'managerId'
});

Role.hasMany(Employee);
Employee.belongsTo(Role);

Department.hasMany(Role);
Role.belongsTo(Department);

module.exports = { Department, Role, Employee };
