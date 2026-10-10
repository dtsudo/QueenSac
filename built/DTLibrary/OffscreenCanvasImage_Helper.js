import { drawImageRotatedClockwise_Helper, drawOffscreenCanvasImageRotatedClockwise_Helper, drawRectangle_Helper, drawRoundedRectangle_Helper, drawText_Helper } from "./CanvasDisplay_Helper.js";
let getOffscreenCanvasImage_Helper = function ({ width, height, canvasScalingFactor, imageSmoothingEnabled, imageDictionary, fontDictionary }) {
    let offscreenCanvas = new OffscreenCanvas(width * canvasScalingFactor, height * canvasScalingFactor);
    let offscreenCanvasContext = offscreenCanvas.getContext("2d", { alpha: true });
    offscreenCanvasContext.imageSmoothingEnabled = imageSmoothingEnabled;
    offscreenCanvasContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCanvasContext.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
    let drawRectangle = function (x, y, w, h, color, fill) {
        drawRectangle_Helper(offscreenCanvasContext, height, x, y, w, h, color, fill);
    };
    let drawRoundedRectangle = function (x, y, w, h, radius, color, fill) {
        drawRoundedRectangle_Helper(offscreenCanvasContext, height, x, y, w, h, radius, color, fill);
    };
    let drawImageRotatedClockwise = function (image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
        drawImageRotatedClockwise_Helper(offscreenCanvasContext, height, canvasScalingFactor, imageDictionary, image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions);
    };
    let drawOffscreenCanvasImageRotatedClockwise = function (offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
        drawOffscreenCanvasImageRotatedClockwise_Helper(offscreenCanvasContext, height, canvasScalingFactor, offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions);
    };
    let drawText = function (x, y, text, font, fontSize, color) {
        drawText_Helper(offscreenCanvasContext, height, fontDictionary, x, y, text, font, fontSize, color);
    };
    let getOffscreenCanvas = function () {
        return offscreenCanvas;
    };
    let clearCanvas = function () {
        offscreenCanvasContext.clearRect(0, 0, width, height);
    };
    return {
        clearCanvas,
        drawRectangle,
        drawRoundedRectangle,
        drawImageRotatedClockwise,
        drawOffscreenCanvasImageRotatedClockwise,
        drawText,
        getWidth: function () { return width; },
        getHeight: function () { return height; },
        _getOffscreenCanvas: getOffscreenCanvas
    };
};
export { getOffscreenCanvasImage_Helper };
