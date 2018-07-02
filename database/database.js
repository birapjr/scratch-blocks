/**
 * @license
 * TrendsMix Building Blocks for Arduino 
 *
 * Copyright 2018 TrendsMix Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Database module
 * @author ubirajara.cortes@trendsmix.com <Ubirajara Cortes>
 */
'use strict';
const locreq    = require('locreq')(__dirname);
const path      = require('path');
const Promise   = require('bluebird');
const _         = require('lodash');
const fs        = Promise.promisifyAll(require('fs-extra'));
const Sequelize = require('sequelize');

//connection uri
//TODO: Change to enviroment varible

//Database server connection string
const db_conn = process.env.DB_CONNECTION;

//TODO: find a good place for it
const log_level = 'Error';
//const log_level = 'Debug';

var db;
module.exports = db = {};

var sequelize = new Sequelize(db_conn,{
  define:{
    timestamps:true,
    underscored:true
  },
  logging: (log_level == 'Debug' ? console.log : false),
  operatorsAliases: Sequelize.Op
});

fs
  .readdirSync(path.join(__dirname, 'models'))
  .filter(function(file) {
    return (file.indexOf(".") !== 0);
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, 'models', file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  let model =  db[modelName];
  // classMethods
  if(model.options.classMethods) {
    Object.keys(model.options.classMethods).forEach(methodName => {
      model[methodName] = model.options.classMethods[methodName];
      delete model.options.classMethods[methodName];
    });
  }  
  // instanceMethods
  if(model.options.instanceMethods) {
    Object.keys(model.options.instanceMethods).forEach(methodName => {
      model.prototype[methodName] = model.options.instanceMethods[methodName];
      delete model.options.instanceMethods[methodName];
    });
  }
  // create relations
  if ('associate' in model) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;