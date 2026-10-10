let convertRGBToHSL = function ({ r, g, b }) {
    let maxValue = Math.max(r, g, b);
    let minValue = Math.min(r, g, b);
    let valueDiff = maxValue - minValue;
    let h;
    if (valueDiff === 0) {
        h = 0;
    }
    else if (maxValue === r) {
        h = Math.round((g - b) * 60 / valueDiff);
        if (h < 0)
            h += 360;
    }
    else if (maxValue === g) {
        h = Math.round((b - r) * 60 / valueDiff) + 120;
    }
    else {
        h = Math.round((r - g) * 60 / valueDiff) + 240;
    }
    let lTimes1000 = (maxValue + minValue) * 500;
    let s;
    if (lTimes1000 === 0 || lTimes1000 === 255000)
        s = 0;
    else
        s = Math.round((maxValue * 1000 - lTimes1000) * 255 / Math.min(lTimes1000, 255000 - lTimes1000));
    if (h < 0)
        h = 0;
    if (h > 359)
        h = 359;
    if (s < 0)
        s = 0;
    if (s > 255)
        s = 255;
    let l = Math.round(lTimes1000 / 1000);
    if (l < 0)
        l = 0;
    if (l > 255)
        l = 255;
    return {
        h,
        s,
        l
    };
};
let convertHSLToRGB = function ({ h, s, l }) {
    let c = Math.round((255 - Math.abs(2 * l - 255)) * s / 255);
    let modH = h;
    while (modH > 120)
        modH -= 120;
    let x = Math.round(c * (60 - Math.abs(modH - 60)) / 60);
    let r1;
    let g1;
    let b1;
    if (0 <= h && h < 60) {
        r1 = c;
        g1 = x;
        b1 = 0;
    }
    else if (60 <= h && h < 120) {
        r1 = x;
        g1 = c;
        b1 = 0;
    }
    else if (120 <= h && h < 180) {
        r1 = 0;
        g1 = c;
        b1 = x;
    }
    else if (180 <= h && h < 240) {
        r1 = 0;
        g1 = x;
        b1 = c;
    }
    else if (240 <= h && h < 300) {
        r1 = x;
        g1 = 0;
        b1 = c;
    }
    else {
        r1 = c;
        g1 = 0;
        b1 = x;
    }
    let m = Math.round(l - c / 2);
    let r = r1 + m;
    let g = g1 + m;
    let b = b1 + m;
    if (r < 0)
        r = 0;
    if (r > 255)
        r = 255;
    if (g < 0)
        g = 0;
    if (g > 255)
        g = 255;
    if (b < 0)
        b = 0;
    if (b > 255)
        b = 255;
    return { r, g, b };
};
export { convertRGBToHSL, convertHSLToRGB };
