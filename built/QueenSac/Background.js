import { convertHSLToRGB } from "../DTLibrary/ColorUtil.js";
let getBackground = function () {
    const SQUARE_WIDTH = 100;
    let xDelta = 0;
    let yDelta = 0;
    let isDarkSquare = false;
    let isHueGoingUp = true;
    let milliHue = 45 * 1000;
    let processFrame = function ({ elapsedMicrosThisFrame }) {
        xDelta += Math.max(elapsedMicrosThisFrame >> 6, 1);
        yDelta += Math.max(elapsedMicrosThisFrame >> 5, 1);
        while (xDelta >= SQUARE_WIDTH * 1024) {
            xDelta -= SQUARE_WIDTH * 1024;
            isDarkSquare = !isDarkSquare;
        }
        while (yDelta >= SQUARE_WIDTH * 1024) {
            yDelta -= SQUARE_WIDTH * 1024;
            isDarkSquare = !isDarkSquare;
        }
        if (isHueGoingUp) {
            milliHue += Math.max(elapsedMicrosThisFrame >> 10, 1);
            if (milliHue >= 180 * 1000) {
                milliHue = 180 * 1000;
                isHueGoingUp = false;
            }
        }
        else {
            milliHue -= Math.max(elapsedMicrosThisFrame >> 10, 1);
            if (milliHue < 45 * 1000) {
                milliHue = 45 * 1000;
                isHueGoingUp = true;
            }
        }
    };
    let render = function (displayOutput) {
        let xEnd = displayOutput.getCanvasWidth() * 1024;
        let yEnd = displayOutput.getCanvasHeight() * 1024;
        let doesColumnStartWithDarkSquare = isDarkSquare;
        let darkSquare = convertHSLToRGB({ h: Math.floor(milliHue / 1000), s: 128, l: 180 });
        let lightSquare = convertHSLToRGB({ h: Math.floor(milliHue / 1000), s: 157, l: 180 });
        for (let xMibi = -(SQUARE_WIDTH * 1024) + xDelta; xMibi <= xEnd; xMibi += SQUARE_WIDTH * 1024) {
            let isDarkSquare = doesColumnStartWithDarkSquare;
            for (let yMibi = -(SQUARE_WIDTH * 1024) + yDelta; yMibi <= yEnd; yMibi += SQUARE_WIDTH * 1024) {
                displayOutput.drawRectangle(xMibi >> 10, yMibi >> 10, SQUARE_WIDTH, SQUARE_WIDTH, isDarkSquare ? { r: darkSquare.r, g: darkSquare.g, b: darkSquare.b, alpha: 255 } : { r: lightSquare.r, g: lightSquare.g, b: lightSquare.b, alpha: 255 }, true);
                isDarkSquare = !isDarkSquare;
            }
            doesColumnStartWithDarkSquare = !doesColumnStartWithDarkSquare;
        }
    };
    return {
        processFrame,
        render
    };
};
export { getBackground };
