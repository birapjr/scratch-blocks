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
 * @fileoverview TrendsMix Building Blocks for Arduino - Web Service backend
 * @author ubirajara.cortes@trendsmix.com <Ubirajara Cortes>
 */
'use strict';
const express    = require('express');
const router     = express.Router();
const bodyParser = require('body-parser');
const locreq     = require('locreq')(__dirname);
const db         = locreq('database/database');
const util       = locreq('util/util');
const transpiler = locreq('transpiler/transpiler');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/saveProject', async (req, res) => {
  try {
    console.log('Saving project data...');

    //get post parametrs
    let projectName = req.body.projectName;
    let codeXml = req.body.prettyXmlText;
    
    //Convert XML to JSON
    console.log(codeXml);
    let jsonCode = await util.parseXmlToJson(codeXml);

    //Compile to Arduino
    let cCode = transpiler.transpile(jsonCode);
    console.log(cCode);

    //Create project object

    //Save to DB
    
    //Reponde to the client
    res.send('data saved');
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;