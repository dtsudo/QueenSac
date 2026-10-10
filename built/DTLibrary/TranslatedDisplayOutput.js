let getTranslatedDisplayOutput = function (displayOutput, xOffsetInPixels, yOffsetInPixels) {
    let drawRectangle = function (x, y, width, height, color, fill) {
        displayOutput.drawRectangle(x + xOffsetInPixels, y + yOffsetInPixels, width, height, color, fill);
    };
    let drawRoundedRectangle = function (x, y, width, height, radius, color, fill) {
        displayOutput.drawRoundedRectangle(x + xOffsetInPixels, y + yOffsetInPixels, width, height, radius, color, fill);
    };
    let drawText = function (x, y, text, font, fontSize, color) {
        displayOutput.drawText(x + xOffsetInPixels, y + yOffsetInPixels, text, font, fontSize, color);
    };
    let tryDrawText = function (x, y, text, font, fontSize, color) {
        displayOutput.tryDrawText(x + xOffsetInPixels, y + yOffsetInPixels, text, font, fontSize, color);
    };
    let drawImage = function (image, x, y) {
        displayOutput.drawImage(image, x + xOffsetInPixels, y + yOffsetInPixels);
    };
    let drawImageRotatedClockwise = function (image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
        displayOutput.drawImageRotatedClockwise(image, imageX, imageY, imageWidth, imageHeight, x + xOffsetInPixels, y + yOffsetInPixels, degreesScaled, scalingFactorScaled, additionalOptions);
    };
    let drawOffscreenCanvasImageRotatedClockwise = function (offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
        displayOutput.drawOffscreenCanvasImageRotatedClockwise(offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x + xOffsetInPixels, y + yOffsetInPixels, degreesScaled, scalingFactorScaled, additionalOptions);
    };
    let getWidth = function (image) {
        return displayOutput.getWidth(image);
    };
    let getHeight = function (image) {
        return displayOutput.getHeight(image);
    };
    return {
        drawRectangle,
        drawRoundedRectangle,
        drawText,
        tryDrawText,
        drawImage,
        drawImageRotatedClockwise,
        drawOffscreenCanvasImageRotatedClockwise,
        getWidth,
        getHeight,
        getCanvasWidth: function () { return displayOutput.getCanvasWidth(); },
        getCanvasHeight: function () { return displayOutput.getCanvasHeight(); },
        isLandscapeOrientation: function () { return displayOutput.isLandscapeOrientation(); }
    };
};
export { getTranslatedDisplayOutput };
