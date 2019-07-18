modules = {};
classes = {};
function require(moduleName) {
    return modules[moduleName];
}


(async function () {
    await new Promise((resolve) => { setTimeout(() => resolve(), 3000); });

    await (async function () {
        convert = {
            rgb: { channels: 3, labels: 'rgb' },
            hsl: { channels: 3, labels: 'hsl' },
            hsv: { channels: 3, labels: 'hsv' },
            hwb: { channels: 3, labels: 'hwb' },
            cmyk: { channels: 4, labels: 'cmyk' },
            xyz: { channels: 3, labels: 'xyz' },
            lab: { channels: 3, labels: 'lab' },
            lch: { channels: 3, labels: 'lch' },
            hex: { channels: 1, labels: ['hex'] },
            keyword: { channels: 1, labels: ['keyword'] },
            ansi16: { channels: 1, labels: ['ansi16'] },
            ansi256: { channels: 1, labels: ['ansi256'] },
            hcg: { channels: 3, labels: ['h', 'c', 'g'] },
            apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
            gray: { channels: 1, labels: ['gray'] }
        };

        convert.rgb.hsv = function (rgb) {
            let rdif;
            let gdif;
            let bdif;
            let h;
            let s;

            const r = rgb[0] / 255;
            const g = rgb[1] / 255;
            const b = rgb[2] / 255;
            const v = Math.max(r, g, b);
            const diff = v - Math.min(r, g, b);
            const diffc = function (c) {
                return (v - c) / 6 / diff + 1 / 2;
            };

            if (diff === 0) {
                h = 0;
                s = 0;
            } else {
                s = diff / v;
                rdif = diffc(r);
                gdif = diffc(g);
                bdif = diffc(b);

                if (r === v) {
                    h = bdif - gdif;
                } else if (g === v) {
                    h = (1 / 3) + rdif - bdif;
                } else if (b === v) {
                    h = (2 / 3) + gdif - rdif;
                }

                if (h < 0) {
                    h += 1;
                } else if (h > 1) {
                    h -= 1;
                }
            }

            return [
                h * 360,
                s * 100,
                v * 100
            ];
        };

        convert.hsv.rgb = function (hsv) {
            const h = hsv[0] / 60;
            const s = hsv[1] / 100;
            let v = hsv[2] / 100;
            const hi = Math.floor(h) % 6;
        
            const f = h - Math.floor(h);
            const p = 255 * v * (1 - s);
            const q = 255 * v * (1 - (s * f));
            const t = 255 * v * (1 - (s * (1 - f)));
            v *= 255;
        
            switch (hi) {
                case 0:
                    return [v, t, p];
                case 1:
                    return [q, v, p];
                case 2:
                    return [p, v, t];
                case 3:
                    return [p, q, v];
                case 4:
                    return [t, p, v];
                case 5:
                    return [v, p, q];
            }
        };

        modules['color-convert'] = convert;
    })();

    const colorPromise = (async function () {
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
        Color.prototype.withBrightness = function (brightness) {
            const hsbColor = this.toHsv();
            hsbColor.bri = hsbColor.bri * brightness;
            return new Color(hsbColor);
        }

        Color.prototype.toHsb = function () {
            const rgbArr = this.toRGBArray();
            const hsvArr = convert.rgb.hsv(rgbArr);
            return { hue: hsvArr[0], sat: hsvArr[1], bri: hsvArr[2] };
        }

        Color.prototype.toRGBArray = function () {
            return [this.red, this.green, this.blue];
        };

        classes.Color = Color;
    })();

    const framePromise = (async function () {
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

    await colorPromise;
    await framePromise;
})();