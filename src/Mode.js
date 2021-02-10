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


class Mode {
    constructor(config) {
        this.config = {
            numLeds: config.numLeds,
            color: Color(config.color),
            brightness: config.level,
            whiteLevel: config.level
        };
        this.update = function() {};
    }


    Stop() {
    }


    Update() {
        this.update();
    }


    UpdateColor(color) {
        this.config.color = Color(color);
        this.Update();
    }


    UpdateLevel(level) {
        this.config.brightness = level;
        this.Update();
    }


    Color(color, level) {
        let white = Math.round(255 * level / 100);

        return( (color.red()   << 16) |
            (color.green() <<  8) |
            (color.blue()  <<  0) |
            (white         << 24)   );
    }

    SetStripSolid() {
        let pixels = new Uint32Array(this.config.numLeds);

        for(let i = 0; i < this.config.numLeds; i++) {
            pixels[i] = this.Color(this.config.color, this.config.whiteLevel);
        }

        ws281x.render(pixels);
    }
}

module.exports = Mode;
