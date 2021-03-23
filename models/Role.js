const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/connection.js')

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
      // references: {
      //     model: Employee,
      //     key: 'role_id',
      // }
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true
      // references: {
      //     model: Department,
      //     key: 'id',
      // },
    }
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'roles'
  }
)

module.exports = Role
