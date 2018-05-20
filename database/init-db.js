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
 * @fileoverview TrendsMix Building Blocks for Arduino - Database module
 * @author ubirajara.cortes@trendsmix.com <Ubirajara Cortes>
 */
'use strict';

const locreq  = require('locreq')(__dirname);
const db = locreq('database/database');

async function initDb() {
  try {
    //Create db
    await db.sequelize.sync({force: true});
    console.log('TBBA database initialized');
    process.exit(0);
  }
  catch (error) {
    console.error('Error on init TBBA database: ', error);
    process.exit(1);
  }
};

initDb();