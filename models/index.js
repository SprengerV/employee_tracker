const Department = require('./Department.js')
const Role = require('./Role.js')
const Employee = require('./Employee.js')

Employee.hasOne(Employee, {
  foreignKey: 'manager_id',
  as: 'manager'
})

Role.hasMany(Employee, {
  as: 'role_employees'
})
Employee.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role'
})

// Role.belongsTo(Employee, {
//     as: 'employees',
// });

// Role.hasOne(Department, {
//     foreignKey: 'department_id',
//     as: 'department',
// });
Department.hasMany(Role, {
  as: 'department_roles'
})
Role.belongsTo(Department, {
  foreignKey: 'department_id'
  // as: 'department',
})

module.exports = { Department, Role, Employee }
