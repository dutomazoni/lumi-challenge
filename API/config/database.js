// import dotenv from 'dotenv';
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('invoice_extractor', 'postgres', 'admin', {host: 'localhost', dialect: 'postgres'});
// // const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {host: process.env.DB_HOST, dialect: 'postgres'});
//
// module.exports = sequelize
require('dotenv').config({
  path: '.env',
})

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || 'postgres',
  port: process.env.DB_PORT || 5432,
  operatiorsAliases: false,
  logging: true,
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
  timezone: '-03:00', // for writing to database
  'dialectOptions': {
    'ssl': {
      'require': true,
    },
  },
  connection: {
    options: `project=${process.env.ENDPOINT_ID}`,
  },
}
