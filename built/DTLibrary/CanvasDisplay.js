import { getCanvasDisplayRectangle } from "./CanvasDisplay_Rectangle.js";
import { getCanvasDisplayImages } from "./CanvasDisplay_Images.js";
import { getCanvasDisplayFont } from "./CanvasDisplay_Font.js";
import { getOffscreenCanvasImage_Helper } from "./OffscreenCanvasImage_Helper.js";
let getDisplay = function ({ getCurrentCanvasWidth, getCurrentCanvasHeight, imageSmoothingEnabled, canvasScalingFactor, canvas, browserDocument }) {
    let canvasDisplayRectangle = getCanvasDisplayRectangle({
        getCurrentCanvasHeight: getCurrentCanvasHeight,
        canvas: canvas,
        canvasScalingFactor: canvasScalingFactor
    });
    let canvasDisplayImages = getCanvasDisplayImages({
        getCurrentCanvasHeight: getCurrentCanvasHeight,
        imageSmoothingEnabled: imageSmoothingEnabled,
        canvasScalingFactor: canvasScalingFactor,
        canvas: canvas
    });
    let canvasDisplayFont = getCanvasDisplayFont({
        getCurrentCanvasHeight: getCurrentCanvasHeight,
        canvas: canvas,
        canvasScalingFactor: canvasScalingFactor,
        browserDocument: browserDocument
    });
    let load = function () {
        let hasFinishedLoadingImages = canvasDisplayImages.loadImages();
        let hasFinishedLoadingFonts = canvasDisplayFont.loadFonts();
        return hasFinishedLoadingImages && hasFinishedLoadingFonts;
    };
    let getOffscreenCanvasImage = function ({ width, height }) {
        return getOffscreenCanvasImage_Helper({
            width,
            height,
            canvasScalingFactor,
            imageSmoothingEnabled,
            imageDictionary: canvasDisplayImages.getImageDictionary(),
            fontDictionary: canvasDisplayFont.getFontDictionary()
        });
    };
    let getDisplaySnapshot = function ({ render }) {
        let canvasWidth = getCurrentCanvasWidth();
        let canvasHeight = getCurrentCanvasHeight();
        let offscreenCanvas = getOffscreenCanvasImage({
            width: canvasWidth,
            height: canvasHeight
        });
        let drawImageRotatedClockwise = function (image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
            offscreenCanvas.drawImageRotatedClockwise(image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions);
        };
        let drawOffscreenCanvasImageRotatedClockwise = function (offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
            offscreenCanvas.drawOffscreenCanvasImageRotatedClockwise(offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions);
        };
        let drawRectangle = function (x, y, width, height, color, fill) {
            offscreenCanvas.drawRectangle(x, y, width, height, color, fill);
        };
        let drawRoundedRectangle = function (x, y, width, height, radius, color, fill) {
            offscreenCanvas.drawRoundedRectangle(x, y, width, height, radius, color, fill);
        };
        let drawText = function (x, y, text, font, fontSize, color) {
            offscreenCanvas.drawText(x, y, text, font, fontSize, color);
        };
        let tryDrawText = function (x, y, text, font, fontSize, color) {
            offscreenCanvas.drawText(x, y, text, font, fontSize, color);
        };
        render({
            drawRectangle,
            drawRoundedRectangle,
            drawText,
            tryDrawText,
            drawImage: function (image, x, y) { drawImageRotatedClockwise(image, 0, 0, canvasDisplayImages.getWidth(image), canvasDisplayImages.getHeight(image), x, y, 0, 128, null); },
            drawImageRotatedClockwise,
            drawOffscreenCanvasImageRotatedClockwise,
            getWidth: canvasDisplayImages.getWidth,
            getHeight: canvasDisplayImages.getHeight,
            getCanvasWidth: function () { return canvasWidth; },
            getCanvasHeight: function () { return canvasHeight; },
            isLandscapeOrientation: function () { return canvasWidth > canvasHeight; }
        });
        return offscreenCanvas;
    };
    return {
        load,
        drawRectangle: canvasDisplayRectangle.drawRectangle,
        drawRoundedRectangle: canvasDisplayRectangle.drawRoundedRectangle,
        getWidth: canvasDisplayImages.getWidth,
        getHeight: canvasDisplayImages.getHeight,
        drawImage: canvasDisplayImages.drawImage,
        drawImageRotatedClockwise: canvasDisplayImages.drawImageRotatedClockwise,
        drawOffscreenCanvasImageRotatedClockwise: canvasDisplayImages.drawOffscreenCanvasImageRotatedClockwise,
        drawText: canvasDisplayFont.drawText,
        tryDrawText: canvasDisplayFont.tryDrawText,
        getOffscreenCanvasImage,
        getDisplaySnapshot,
        getCanvasWidth: function () { return getCurrentCanvasWidth(); },
        getCanvasHeight: function () { return getCurrentCanvasHeight(); },
        isLandscapeOrientation: function () { return getCurrentCanvasWidth() > getCurrentCanvasHeight(); }
    };
};
export { getDisplay };
