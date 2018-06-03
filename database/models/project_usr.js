/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview TrendsMix Building Blocks for Arduino - User projects module
 * @author ubirajara.cortes@trendsmix.com <Ubirajara Cortes>
 */

module.exports = function(sequelize, DataTypes) {
  const project = sequelize.define('project', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    xml: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    json: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    cCode: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'project_usr'
  });
  return project;
};