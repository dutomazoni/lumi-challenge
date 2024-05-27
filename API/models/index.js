const fs = require('fs')
const path = require('path')
const Sequelize= require('sequelize')
const basename = path.basename(__filename);
const config = require('../config/database')
const db = {}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// db.Invoice = require('./Invoice')

// Object.keys(db).forEach((m) => {
//   db[m].init({ sequelize })
// })

fs.readdirSync(__dirname)
.filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
})
.forEach((file) => {
  const model = require(path.join(__dirname, file))(
    sequelize,
    Sequelize.DataTypes
  );
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// Object.assign(module.exports, db)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
