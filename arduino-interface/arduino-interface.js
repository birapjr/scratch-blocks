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
 * @fileoverview Arduino interface, compiler, uploader and comunication
 * @author ubirajara.cortes@trendsmix.com <Ubirajara Cortes>
 */
'use strict';
const path    = require('path');
const fs      = require('fs-extra');
const locreq  = require('locreq')(__dirname);
const exec    = require('child_process').exec;
const db      = locreq('database/database');

async function execArduino(command, inoFile) {
  return await new Promise((resolve, reject) => {
    try {
      let commandString = `arduino ${command} ${inoFile}`;
      exec(commandString, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr);
          reject(false);
        }
        else {
          console.log(stdout);
          resolve(true);
        }
      });
    }
    catch (error) {
      console.error(error);
      reject(false);
    }
  });
}

async function verifyAndUpload(cCode) {
  let validCode;
  let successfulUpload;
  let tempFileName;
  let inoFolder;
  try {
    //save code to a temp file
    const inoName = `tmx_${await db.counter.getNext('compilations')}`;
    inoFolder = path.join('/tmp', inoName);
    tempFileName = path.join(inoFolder, `${inoName}.ino`);

    console.log('File: ', tempFileName); 
    
    fs.mkdirSync(inoFolder);
    fs.writeFileSync(tempFileName, cCode, 'utf8');

    //verify code
    validCode = await execArduino('--verify', tempFileName);
    if (validCode) {
      //upload to the board here
      successfulUpload = await execArduino('--upload', tempFileName);
    }
    else {
      successfulUpload = validCode;
    }

    //delete temp file
    fs.unlinkSync(tempFileName);
    fs.rmdirSync(inoFolder);
  }
  catch (error) {
    successfulUpload = error;

    //delete temp file
    fs.unlinkSync(tempFileName);
    fs.rmdirSync(inoFolder);
  }
  return successfulUpload;
}

async function uploadProject(cCode) {
  return await verifyAndUpload(cCode);
}

module.exports = {
  uploadProject
};