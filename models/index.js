const Department = require('./Department.js')
const Role = require('./Role.js')
const Employee = require('./Employee.js')
const { DataTypes } = require('sequelize')

Employee.hasMany(Employee, {
  // foreignKey: 'manager_id',
  // as: 'manager'
})
Employee.belongsTo(Employee, {
  foreignKey: 'manager_id',
  as: 'manager'
})

Role.hasMany(Employee)
Employee.belongsTo(Role, {
  foreignKey: 'role_id'
})

Department.hasMany(Role)
Role.belongsTo(Department, {
  foreignKey: 'department_id'
})

module.exports = { Department, Role, Employee }
