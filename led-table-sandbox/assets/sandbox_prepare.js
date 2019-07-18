classes = {};

(function() {
    const convert = require('color-convert');

    function convertColor(obj) {
        if (typeof obj === 'object') {
            if (obj.hasOwnProperty('hue') && obj.hasOwnProperty('sat') && obj.hasOwnProperty('bri')) {
                const arr = [obj.hue, obj.sat, obj.bri];
                const convertedArr = convert.hsv.rgb(arr);

                return { red: convertedArr[0], green: convertedArr[1], blue: convertedArr[2] };
            }
        }

        return { red: obj.red, green: obj.green, blue: obj.blue };
    }

    function Color(obj) {
        //TODO convert hexstring to rgbobj
        obj = convertColor(obj);
        Object.assign(this, { red: 0, green: 0, blue: 0 }, obj);
    }

    /*
        returns new Color object with applied brightness
        the brightness is a decimal number between 0.0 and 1.0
    */
    Color.prototype.withBrightness = function(brightness) {
        const rgbArr = this.toRGBArray();
        const hsvArr = convert.rgb.hsv(rgbArr);
        hsvArr[2] = hsvArr[2] * brightness;
        return new Color({hue: hsvArr[0], sat: hsvArr[1], bri: hsvArr[2]});
    }

    Color.prototype.toRGBArray = function () {
        return [this.red, this.green, this.blue];
    };

    classes.Color = Color;
})();

(function() {
    function Frame() {
        this.data = {};
    }
    
    Frame.prototype.setPixel = function (x, y, color) {
        if (!this.data.hasOwnProperty(x) || !this.data[x]) {
            this.data[x] = {};
        }
        const col = this.data[x];
    
        col[y] = color;
    }
    
    Frame.prototype.fill = function (display, color) {
        for (let x = 0; x < display.width; x++) {
            this.fillColumn(x, display, color);
        }
    }
    
    Frame.prototype.fillColumn = function (x, display, color) {
        for (let y = 0; y < display.height; y++) {
            this.setPixel(x, y, color);
        }
    }
    
    Frame.prototype.fillRow = function (y, display, color) {
        for (let x = 0; x < display.width; x++) {
            this.setPixel(x, y, color);
        }
    }
    
    Frame.prototype.toPixelObject = function (width, height) {
        const obj = {};
        const getPixelIndex = (x, y) => {
            const evenRow = y % 2 === 0;
            return (y * width) + (evenRow ? x : width - x - 1);
        };
    
        Object.keys(this.data).forEach(x => {
            x = parseInt(x);
            const col = this.data[x];
            Object.keys(col).forEach(y => {
                y = parseInt(y);
    
                let cell = col[y];
                if (cell && cell.toRGBArray && typeof cell.toRGBArray === 'function') {
                    const pixelIndex = getPixelIndex(x, y);
                    obj[pixelIndex] = cell.toRGBArray();
                }
            });
        });
    
        return obj;
    }
    
    classes.Frame = Frame;
})();