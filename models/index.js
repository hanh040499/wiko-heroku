'use strict';

const fs = require('fs');
const path = require('path');
const knex = require('../db/database');

const getModelFiles = (dir) => {
  return fs
    .readdirSync(dir)
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .map((file) => path.join(dir, file));
};

const initAllModels = () => {
  const files = getModelFiles(`${__dirname}/db-entities`);
  
  return files.reduce((modelsObject, filename) => {
    const initModel = require(filename);
    const model = initModel(knex);

    if (model) {
      modelsObject[model.name] = model;
    }

    return modelsObject;
  }, {});
};

const models = initAllModels();

module.exports = models;
