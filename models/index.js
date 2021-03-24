const Department = require('./Department.js')
const Role = require('./Role.js')
const Employee = require('./Employee.js')

Employee.hasOne(Employee, {
  foreignKey: 'manager_id',
  as: 'manager'
})
// Employee.belongsTo(Employee)

Role.hasMany(Employee)
Employee.belongsTo(Role, {
  foreignKey: 'role_id'
})

Department.hasMany(Role)
Role.belongsTo(Department, {
  foreignKey: 'department_id'
})

module.exports = { Department, Role, Employee }
