const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize

process.env.JAWSDB_URL ?
  sequelize = new Sequelize(process.env.JAWSDB_URL)
  :
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT
    }
  );

module.exports = sequelize;
