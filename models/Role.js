const { Model, DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '..', 'config', 'connection.js'));

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
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'roles',
    },
);

module.exports = Role;