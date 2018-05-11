/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
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
 * @fileoverview Arduino blocks for Scratch (Horizontal)
 * @author ubirajara.cortes@trendsmix.com <Ubirajara Cortes>
 */
'use strict';

goog.provide('Blockly.Blocks.arduino');

goog.require('Blockly.Blocks');

goog.require('Blockly.Colours');

Blockly.Blocks['dropdown_arduino_setcolor'] = {
  /**
   * Block for set led drop-down.
   * @this Blockly.Block
   */
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldIconMenu(
            [
              {src: Blockly.mainWorkspace.options.pathToMedia + 'icons/set-led_red.svg',
                value: 'red', width: 48, height: 48, alt: 'Red'},
              {src: Blockly.mainWorkspace.options.pathToMedia + 'icons/set-led_red-off.svg',
                value: 'red-off', width: 48, height: 48, alt: 'Red off'},
              {src: Blockly.mainWorkspace.options.pathToMedia + 'icons/set-led_blue.svg',
                value: 'blue', width: 48, height: 48, alt: 'Blue'},
              {src: Blockly.mainWorkspace.options.pathToMedia + 'icons/set-led_blue-off.svg',
                value: 'blue-off', width: 48, height: 48, alt: 'Blue off'}
            ]), 'CHOICE');
    this.setOutput(true);
    this.setColour(Blockly.Colours.looks.primary,
        Blockly.Colours.looks.secondary,
        Blockly.Colours.looks.tertiary
    );
  }
};

Blockly.Blocks['arduino_setcolor'] = {
  /**
   * Block to set LED on/off
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "id": "arduino_setcolor",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "icons/set-led_blue.svg",
          "width": 40,
          "height": 40,
          "alt": "Set LED Color"
        },
        {
          "type": "input_value",
          "name": "CHOICE"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.looks,
      "colour": Blockly.Colours.looks.primary,
      "colourSecondary": Blockly.Colours.looks.secondary,
      "colourTertiary": Blockly.Colours.looks.tertiary
    });
  }
};