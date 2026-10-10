let radianConversion = 1.0 / 128.0 * (2.0 * Math.PI / 360.0);
let drawRectangle_Helper = function (context, canvasHeight, x, y, width, height, color, fill) {
    y = canvasHeight - y - height;
    let red = color.r;
    let green = color.g;
    let blue = color.b;
    let alpha = color.alpha;
    context.fillStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
    context.strokeStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
    if (fill)
        context.fillRect(x, y, width, height);
    else
        context.strokeRect(x, y, width, height);
};
let drawRoundedRectangle_Helper = function (context, canvasHeight, x, y, width, height, radius, color, fill) {
    y = canvasHeight - y - height;
    let red = color.r;
    let green = color.g;
    let blue = color.b;
    let alpha = color.alpha;
    context.fillStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
    context.strokeStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
    context.beginPath();
    context.roundRect(x, y, width, height, (typeof radius) === "number" ? radius : [radius.topLeftRadius, radius.topRightRadius, radius.bottomRightRadius, radius.bottomLeftRadius]);
    if (fill)
        context.fill();
    else
        context.stroke();
    context.beginPath();
};
let drawImageRotatedClockwise_Helper = function (context, canvasHeight, canvasScalingFactor, imageDictionary, image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
    let scaledHeight = imageHeight * scalingFactorScaled / 128;
    y = Math.floor(canvasHeight - y - scaledHeight);
    let img = imageDictionary[image];
    let scalingFactor = scalingFactorScaled / 128.0;
    context.translate(x, y);
    context.scale(scalingFactor, scalingFactor);
    if (degreesScaled !== 0) {
        context.translate(imageWidth / 2, imageHeight / 2);
        context.rotate(degreesScaled * radianConversion);
        context.translate(-imageWidth / 2, -imageHeight / 2);
    }
    let globalAlpha = (additionalOptions !== null && additionalOptions.alphaTimes100 !== undefined) ? (additionalOptions.alphaTimes100 / 100) : null;
    if (globalAlpha !== null)
        context.globalAlpha = globalAlpha;
    context.drawImage(img, imageX, imageY, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
    if (globalAlpha !== null)
        context.globalAlpha = 1.0;
    context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
};
let drawOffscreenCanvasImageRotatedClockwise_Helper = function (context, canvasHeight, canvasScalingFactor, offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
    let scaledHeight = imageHeight * scalingFactorScaled / 128;
    y = Math.floor(canvasHeight - y - scaledHeight);
    let scalingFactor = scalingFactorScaled / 128.0;
    context.setTransform(1, 0, 0, 1, 0, 0);
    imageX = imageX * canvasScalingFactor;
    imageY = imageY * canvasScalingFactor;
    imageWidth = imageWidth * canvasScalingFactor;
    imageHeight = imageHeight * canvasScalingFactor;
    x = x * canvasScalingFactor;
    y = y * canvasScalingFactor;
    context.translate(x, y);
    context.scale(scalingFactor, scalingFactor);
    if (degreesScaled !== 0) {
        context.translate(imageWidth / 2, imageHeight / 2);
        context.rotate(degreesScaled * radianConversion);
        context.translate(-imageWidth / 2, -imageHeight / 2);
    }
    let globalAlpha = (additionalOptions !== null && additionalOptions.alphaTimes100 !== undefined) ? (additionalOptions.alphaTimes100 / 100) : null;
    if (globalAlpha !== null)
        context.globalAlpha = globalAlpha;
    context.drawImage(offscreenCanvasImage._getOffscreenCanvas(), imageX, imageY, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
    if (globalAlpha !== null)
        context.globalAlpha = 1.0;
    context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
};
let drawText_Helper = function (context, canvasHeight, fontDictionary, x, y, str, fontName, fontSize, color) {
    x = Math.floor(x);
    y = Math.floor(canvasHeight - y - 1);
    let lineHeight = fontSize;
    let red = color.r;
    let green = color.g;
    let blue = color.b;
    let alpha = color.alpha;
    context.textBaseline = "top";
    context.fillStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
    context.strokeStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
    context.font = fontSize + 'px "' + fontDictionary[fontName] + '"';
    let strArray = str.split("\n");
    let lineY = y;
    for (let i = 0; i < strArray.length; i++) {
        context.fillText(strArray[i], x, Math.round(lineY));
        lineY += lineHeight;
    }
};
export { drawImageRotatedClockwise_Helper, drawOffscreenCanvasImageRotatedClockwise_Helper, drawRectangle_Helper, drawRoundedRectangle_Helper, drawText_Helper };
