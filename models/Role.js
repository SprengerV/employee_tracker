const { Model, DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'config', 'connection.js'));
const Department = require(path.join(__dirname, 'Department.js'));

class Role extends Model {}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(30)
        },
        salary: {
            type: DataTypes.DECIMAL(10,2)
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Department,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'roles',
    }
);
// Role.hasOne(Department);

module.exports = Role;