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
const Color = require('color');
const Mode = require('../Mode.js');

const MAX_SPEED = 30;

/***
 * Class RainbowMode lights the SK6812 strip up in a moving rainbow
 */
class RainbowMode extends Mode {
    constructor(config) {
        super(config);
        this.config.whiteLevel = 0;
        this.h2 = 0;
        this.hue = this.h2;
        this.saturation = 100;
        this.increment = this.config.speed * MAX_SPEED / 100;
        this.interval = setInterval(this.loop.bind(this), 60);
    }

    Stop() {
        clearInterval(this.interval);
    }

    UpdateConfig(config)  {
        super.UpdateConfig(config);
        this.increment = this.config.speed * MAX_SPEED / 100;
    }

    loop() {
        let pixels = new Uint32Array(this.config.numLeds);

        this.hue = this.h2;

        for(let i = 0; i < this.config.numLeds; i++) {
            let color = Color({
                h: this.hue,
                s: this.saturation,
                v: this.config.rgbLevel
            });
            pixels[i] = this.Color(color, 0);
            this.hue += 360 / this.config.numLeds;

            if(this.hue > 360) {
                this.hue = this.hue - 360;
            }
        }

        this.h2 += this.increment;

        if(this.h2 > 360) {
            this.h2 = this.h2 - 360;
        }

        ws281x.render(pixels);
    }
}

module.exports = RainbowMode;
