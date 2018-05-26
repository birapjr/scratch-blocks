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
 * Get the node of the next block to process
 * @param {Object} jsonCodeObject The blocks code
 * @param {String} lastBlockId The last processed block id
 */
function getNextSourceBlock(jsonCodeObject, lastBlockId) {
  let nextBlock;
  if (lastBlockId != null) {
    //search the next block
    if (jsonCodeObject.xml) {
      if (jsonCodeObject.xml.block[0].$.id == lastBlockId) {
        //call recursive
        nextBlock = getNextSourceBlock(jsonCodeObject.xml.block[0], lastBlockId);
      }
      else {
        //call recursive again
        if (jsonCodeObject.xml) {
          nextBlock = getNextSourceBlock(jsonCodeObject.xml.block[0], lastBlockId);
        }
      }
    }
    else if (jsonCodeObject.$.id == lastBlockId) {
      if (jsonCodeObject.next && jsonCodeObject.next[0] && jsonCodeObject.next[0].block && jsonCodeObject.next[0].block[0]) {
        nextBlock = jsonCodeObject.next[0].block[0];
      }
      else if (jsonCodeObject.statement && jsonCodeObject.statement[0]) {
        nextBlock = jsonCodeObject.statement[0].block[0];
      }
    }
    else if ((jsonCodeObject.next)) {
      //get next
      nextBlock = getNextSourceBlock(jsonCodeObject.next[0].block[0], lastBlockId);
    }
  }
  else {
    //Get the first block
    if (jsonCodeObject.xml.block[0].$) {
      nextBlock = jsonCodeObject.xml.block[0];
    }
  }
  return nextBlock;
}

/**
 * Get properties of a block and its code
 * @param {Object} jsonCodeObject The blocks code
 * @param {String} lastBlockId The last processed block id
 */
function getNextBlock(jsonCodeObject, lastBlockId) {
  let nextBlock = {
    code: null,
    id: null,
    type: null,
    value: null
  }

  let nextSourceBlock = getNextSourceBlock(jsonCodeObject, lastBlockId);
  switch (nextSourceBlock.$.type) {
    //green start flag
    case 'event_whenflagclicked':
      nextBlock.type = 'event_whenflagclicked';
      nextBlock.id = nextSourceBlock.$.id;
      break;

    case 'control_forever':
      nextBlock.type = 'control_forever';
      nextBlock.id = nextSourceBlock.$.id;
      nextBlock.code = 'while (1) {';
      break;

    case 'arduino_setcolor':
      nextBlock.type = 'arduino_setcolor';
      nextBlock.id = nextSourceBlock.$.id;
      nextBlock.value = nextSourceBlock.value[0].shadow[0].field[0]._;
      break;
  
    default:
      break;
  }

  return nextBlock;
}

/**
 * Transpile to Google Block code into Arduino C
 * @param {Object} jsonCodeObject 
 * 
 * @returns {String} the transpiled C code
 */
function transpile(jsonCodeObject) {
  //c transpiled code parts
  let cGlobalCode;
  let cSetupCode;
  let cLoopCode;

  //current block
  let lastBlockId;
  let currentBlock;

  //end/start of code found
  let endOfCode = false;
  let startOfCode = false;

  let codeBlockMap = new Map();
  let sequence = 1;

  while (!endOfCode) {
    currentBlock = getNextBlock(jsonCodeObject, lastBlockId);

    codeBlockMap.set(sequence, currentBlock);
    sequence++;

    if (currentBlock && currentBlock.id) {
      lastBlockId = currentBlock.id;
    }

    switch (currentBlock.type) {
      case 'control_forever':
        cLoopCode += currentBlock.code;
        break;
      case 'arduino_setcolor':
        //get the status of the block
        break;
      case 'event_whenflagclicked':
        startOfCode = true;
        break;
    }

    if (!startOfCode) {
      endOfCode = true;
      console.log("Start block not found");
    }
  }

  return `${cGlobalCode}${cSetupCode}${cLoopCode}`;
}

module.exports = {
  transpile
};