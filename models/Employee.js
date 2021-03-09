const { Model, DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'config', 'connection.js'));

class Employee extends Model {}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING(30)
        },
        last_name: {
            type: DataTypes.STRING(30)
        },
        role_id: {
            type: DataTypes.INTEGER
        },
        manager_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
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