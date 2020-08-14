// from https://github.com/sequelize/express-example/blob/master/models/index.js

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const db = {};

  // looks at every file in dirname and executes a sequelize.import() on the contents of the files found
  // stores each sequelize model created in the 'db' dictionary
  fs
    .readdirSync(__dirname)
    .filter(file =>
      (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

  // looks in each entry in the 'db' dict andf checks for an associate entry and runs sequelize.associate() for any foreign keys listed
  Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  // Is asynchronous but we won't wait here
  sequelize.sync()
  .catch(function(err) {
    // print the error details
    console.log(err);
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};
