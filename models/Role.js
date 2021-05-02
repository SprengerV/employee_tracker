const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');
const Department = require('./Department');

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Department,
        key: 'id',
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'roles'
  }
);

module.exports = Role;
