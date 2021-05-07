const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Role = require('./Role');

class Employee extends Model {}

Employee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    roleId: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
      references: {
          model: Role,
          key: 'id',
      },
    },
    manager: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    managerId: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
      references: {
        model: Employee,
        key: 'id',
      },
    }
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'employees'
  }
);

module.exports = Employee;
