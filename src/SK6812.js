/******************************************************************************
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 Alan Thiessen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 ******************************************************************************/

'use strict';

const ws281x = require('rpi-ws281x');
const Mode = require('./Mode.js');
const Modes = require('./Modes.js');
const {
    Property,
    Thing,
    Value,
} = require('webthing');


/***
 * A Webthing which controls a strip of SK6812 LEDs
 */
class SK6812 extends Thing {
    constructor(config) {
        super('urn:dev:ops:sk6812', 'SK6812', ["OnOffSwitch"], 'SK6812 LED Light Strip');

        this.config = {
            on: false,
            mode: 'White',
            color: '#ff0000',
            level: 80,
            speed: 50,
            numLeds: config.numLeds
        };

        this.mode = null;

        this.wsConfig = {
            leds: config.numLeds,
            dma: config.dma,
            brightness: 255,
            gpio: config.gpio,
            strip: 'grbw'
        };

        this.addProperty(
            new Property(this,
                'Mode',
                new Value(this.config.mode, this.SetMode.bind(this)),
                {
                    'type': 'string',
                    'title': 'Mode',
                    'enum': Object.keys(Modes)
                }));

        this.addProperty(
            new Property(this,
                'On',
                new Value(true, this.SetOn.bind(this)),
                {
                    '@type': 'OnOffProperty',
                    'type': 'boolean',
                    'title': 'On',
                    'description': "Turn On/Off"
                }));

        this.addProperty(
            new Property(this,
                'Color',
                new Value(this.config.color1, this.SetColor.bind(this)),
                {
                    '@type': 'ColorProperty',
                    'type': 'string',
                    'title': 'Color'
                }));

        this.addProperty(
            new Property(this,
                'Level',
                new Value(this.config.speed, this.SetLevel.bind(this)),
                {
                    '@type': 'LevelProperty',
                    'type': 'integer',
                    'title': 'Brightness',
                    'minimum': 0,
                    'maximum': 100
                }));

        this.addProperty(
            new Property(this,
                'Speed',
                new Value(this.config.speed, this.SetSpeed.bind(this)),
                {
                    '@type': 'LevelProperty',
                    'type': 'integer',
                    'title': 'Speed',
                    'minimum': 0,
                    'maximum': 100
                }));

        ws281x.configure(this.wsConfig);

        this.SetOn(this.config.on);
    }


    SetOn(on) {
        this.config.on = on;

        if(this.config.on) {
            this.SetMode(this.config.mode);
        }
        else {
            if(this.mode instanceof Mode) {
                this.mode.Stop();
            }

            this.mode = new Modes.White({
                numLeds: this.config.numLeds,
                color: '#000000',
                level: 0
            });
        }
    }


    SetMode(mode) {
        if(Modes.hasOwnProperty(mode)) {
            if(this.mode instanceof Mode) {
                this.mode.Stop();
            }

            this.config.mode = mode;
            this.mode = new Modes[this.config.mode](this.config);
        }
    }


    SetColor(color) {
        this.config.color = color;
        this.mode.UpdateConfig(this.config);
    }


    SetLevel(level) {
        this.config.level = level;
        this.mode.UpdateConfig(this.config);
    }


    SetSpeed(speed) {
        this.config.speed = speed;
        this.mode.UpdateConfig(this.config);
    }
}


module.exports = SK6812;
