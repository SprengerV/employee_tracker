const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(
    'employeedb',
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
    }
);

module.exports = sequelize;