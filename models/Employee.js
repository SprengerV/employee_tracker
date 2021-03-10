const { Model, DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'config', 'connection.js'));
const Role = require(path.join(__dirname, 'Role.js'));

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
            type: DataTypes.INTEGER,
            references: {
                model: Role,
                id: 'id',
            },
        },
        manager_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Employee,
                id: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'employees'
    }
);
// Employee.hasOne(Role);


module.exports = Employee;