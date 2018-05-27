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
    else if (jsonCodeObject.next) {
      //get next on next
      nextBlock = getNextSourceBlock(jsonCodeObject.next[0].block[0], lastBlockId);
    }
    else if (jsonCodeObject.statement) {
      //get next on statement
      nextBlock = getNextSourceBlock(jsonCodeObject.statement[0].block[0], lastBlockId);
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
  if (nextSourceBlock) {
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
        switch (nextBlock.value) {
          case 'red':
            nextBlock.code = 'digitalWrite(RED_LED, HIGH);';
            break;

          case 'red-off':
            nextBlock.code = 'digitalWrite(RED_LED, LOW);';
            break;
        
          default:
            break;
        }
        break;

      case 'control_wait':
        nextBlock.type = 'control_wait';
        nextBlock.id = nextSourceBlock.$.id;
        nextBlock.code = 'delay(${value});';
        nextBlock.value = nextSourceBlock.value[0].shadow[0].field[0]._;
        break;
    
      default:
        break;
    }
  }

  return nextBlock;
}

/**
 * Compile the Block Array into C code
 * @param {Array} codeBlockArr Array of blocks of code
 */
function compileCode(codeBlockArr) {
  //c transpiled code parts
  let cGlobalCode = '';
  let cSetupCode = '';
  let cLoopCode = '';

  let openBlocks = 0;

  codeBlockArr.forEach(block => {
    switch (block.type) {
      case 'arduino_setcolor':
        if (block.value == 'red') {
          //Global Code
          cGlobalCode += 'int RED_LED = 3;';
          //Setup code
          cSetupCode += 'pinMode(RED_LED, OUTPUT);';
          //Loop code
          cLoopCode += block.code;
        }
        else if (block.value == 'red-off') {
          cLoopCode += block.code;
        }
        break;

      case 'control_wait':
        //Loop code
        cLoopCode += block.code.replace('${value}', `${block.value}*1000`);
        break;

      case 'control_forever':
        //Loop code
        cLoopCode += block.code;
        openBlocks++;
        break;
    
      default:
        console.log(`Block ${block.type} not implemented`);
        break;
    }
  });

  //Close open blocks
  for (let i = 1; i <= openBlocks; i++) {
    //Loop code
    cLoopCode += '}';
  }

  let cCode = `
    ${cGlobalCode}

    void setup() {
      ${cSetupCode}
    }
    
    void loop() {
      ${cLoopCode}
    }
  `;

  return cCode;
}

/**
 * Transpile to Google Block code into Arduino C
 * @param {Object} jsonCodeObject 
 * 
 * @returns {String} the transpiled C code
 */
function transpile(jsonCodeObject) {
  //current block
  let lastBlockId;
  let currentBlock;

  //end/start of code found
  let endOfCode = false;
  let startOfCode = false;

  let codeBlockArr = [];

  while (!endOfCode) {
    currentBlock = getNextBlock(jsonCodeObject, lastBlockId);

    if (currentBlock.id) {
      codeBlockArr.push(currentBlock);

      if (currentBlock.id) {
        lastBlockId = currentBlock.id;
      }
  
      if (currentBlock.type == 'event_whenflagclicked') {
        startOfCode = true;
      }
  
      if (!startOfCode) {
        endOfCode = true;
        console.log("Start block not found");
      }  
    }
    else {
      endOfCode = true;
    }  
  }

  let cCode = compileCode(codeBlockArr);

  return cCode;
}

module.exports = {
  transpile
};