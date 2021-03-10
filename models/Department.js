const { Model, DataTypes } = require('sequelize');
const path = require('path')
const sequelize = require(path.join(__dirname, '..', 'config', 'connection.js'));

class Department extends Model {}

Department.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING
        },
    },
    {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'departments'
    }
);

module.exports = Department;