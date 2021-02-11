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

const Mode = require('../Mode.js');
const Color = require('color');


/***
 * Class StaticColorMode lights the SK6812 strip to the given color and intensity.
 */
class StaticColorMode extends Mode {
    constructor(config) {
        super(config);
        this.config.whiteLevel = 0;
        this.update = super.SetStripSolid.bind(this);
        this.UpdateBrightness();
        console.log(`Static: ${this.config.color.hex()} @ ${this.config.rgbLevel}`);
        this.Update();
    }

    UpdateConfig(config) {
        this.config.rgbLevel = config.level;
        this.config.color = Color(config.color);
        console.log(`Static: ${this.config.color.hex()} @ ${this.config.rgbLevel}`);
        this.UpdateBrightness();
        this.Update();
    }

    UpdateBrightness() {
        let hsv = this.config.color.hsv().round().object();
        hsv.v = this.config.rgbLevel;
        this.config.color = Color(hsv);
    }
}

module.exports = StaticColorMode;