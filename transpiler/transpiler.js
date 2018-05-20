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
 * @fileoverview TrendsMix Building Blocks for Arduino - Transpiler from Google Blocks to Arduino C code
 * @author ubirajara.cortes@trendsmix.com <Ubirajara Cortes>
 */
'use strict';

const basicScractArduino = `
/*
  TrendsMix basic scratch
*/

int redLedPin = 2;
int blueLedPin = 3;

void setup() {
  // initialize digital pin LEDS as an output.
  pinMode(redLedPin, OUTPUT);
  pinMode(blueLedPin, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
digitalWrite(redLedPin, HIGH);   // turn the LED on (HIGH is the voltage level)
delay(1000);                       // wait for a second
digitalWrite(blueLenPin, LOW);    // turn the LED off by making the voltage LOW
delay(1000);                       // wait for a second
}`

/**
 * Get a C code of a block
 * @param {Object} block The current block to parse
 */
function getBlockCode(block) {
  let code;
  let lastCode;
  switch (block.$.type) {
    case 'control_forever':
      lastCode = block.$.type;
      code = 'while(1){';
      break;
    case 'arduino_setcolor':
      //get the status of the block
      let status = block.value[0].shadow[0].field[0]._;
      break;
  }

  if (lastCode == 'control_forever') {
    if (block.statement && block.statement.length) {
      code += getBlockCode(block.statement[0].block[0]);
    }
  }

  return code;
}

/**
 * Transpile to Google Block code into Arduino C
 * @param {Object} jsonCodeObejct 
 * 
 * @returns {String} the transpiled C code
 */
function transpile(jsonCodeObejct) {
  let cCode;

  if (jsonCodeObejct.xml) {
    if (jsonCodeObejct.xml.block && jsonCodeObejct.xml.block.length) {
      //green start flag
      if (jsonCodeObejct.xml.block[0].$.type == 'event_whenflagclicked') {
        let next = jsonCodeObejct.xml.block[0].next;
        if (next && next.length) {
          cCode += getBlockCode(next[0].block[0]);
        }
      }
    }
  }

  cCode = basicScractArduino;

  return cCode;
}

module.exports = {
  transpile
};