const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/connection.js')

class Department extends Model {}

Department.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      // autoIncrement: true,
      primaryKey: true
      // references: {
      //     model: Role,
      //     key: 'department_id',
      // },
    },
    name: {
      type: DataTypes.STRING(25),
      unique: true,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'departments'
  }
)

module.exports = Department
