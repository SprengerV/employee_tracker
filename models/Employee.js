const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/connection.js')
class Employee extends Model {}

Employee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    role_id: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true
      // references: {
      //     model: Role,
      //     key: 'id',
      // },
    },
    manager_id: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true
      // references: {
      //     model: Employee,
      //     key: 'id',
      // },
    }
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'employees'
  }
)

module.exports = Employee
