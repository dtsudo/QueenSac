import { drawImageRotatedClockwise_Helper, drawOffscreenCanvasImageRotatedClockwise_Helper } from "./CanvasDisplay_Helper.js";
import { getImageNames, getFilename } from "./GameImage.js";
let getCanvasDisplayImages = function ({ getCurrentCanvasHeight, imageSmoothingEnabled, canvasScalingFactor, canvas }) {
    let imgDict = {};
    let widthDict = {};
    let heightDict = {};
    let context = null;
    let numberOfImagesLoaded = 0;
    let loadImages = function () {
        let imageNamesArray = getImageNames();
        let count = 0;
        for (let imageName of imageNamesArray) {
            if (imgDict[imageName])
                continue;
            let fileName = getFilename(imageName);
            let imgPath = "Data/Images/" + fileName;
            let img = new Image();
            img.addEventListener("load", function () {
                numberOfImagesLoaded++;
                widthDict[imageName] = img.naturalWidth;
                heightDict[imageName] = img.naturalHeight;
            });
            img.src = imgPath;
            imgDict[imageName] = img;
            count++;
            if (count === 15) // arbitrary
                return false;
        }
        return numberOfImagesLoaded === imageNamesArray.length;
    };
    let drawImageRotatedClockwise = function (image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
        if (context === null) {
            context = canvas.getContext("2d", { alpha: false });
            context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
            context.imageSmoothingEnabled = imageSmoothingEnabled;
        }
        drawImageRotatedClockwise_Helper(context, getCurrentCanvasHeight(), canvasScalingFactor, imgDict, image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions);
    };
    let drawOffscreenCanvasImageRotatedClockwise = function (offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions) {
        if (context === null) {
            context = canvas.getContext("2d", { alpha: false });
            context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
            context.imageSmoothingEnabled = imageSmoothingEnabled;
        }
        drawOffscreenCanvasImageRotatedClockwise_Helper(context, getCurrentCanvasHeight(), canvasScalingFactor, offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions);
    };
    let getWidth = function (image) {
        return widthDict[image];
    };
    let getHeight = function (image) {
        return heightDict[image];
    };
    let drawImage = function (image, x, y) {
        drawImageRotatedClockwise(image, 0, 0, widthDict[image], heightDict[image], x, y, 0, 128, null);
    };
    let getImageDictionary = function () {
        return imgDict;
    };
    return {
        loadImages,
        drawImage,
        drawImageRotatedClockwise,
        drawOffscreenCanvasImageRotatedClockwise,
        getWidth,
        getHeight,
        getImageDictionary
    };
};
export { getCanvasDisplayImages };
