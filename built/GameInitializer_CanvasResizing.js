import { MINIMUM_WINDOW_SHORT_EDGE, MINIMUM_WINDOW_LONG_EDGE } from "./QueenSac/GlobalConstants.js";
let initializeCanvasResizing = function ({ debugMode, browserDocument, browserWindow, canvasScalingFactor, canvas }) {
    let useUnscaledCanvas = false;
    let isLandscapeOverride = null;
    if (debugMode) {
        browserDocument.addEventListener("keydown", function (e) {
            if (e.key === "0") {
                useUnscaledCanvas = !useUnscaledCanvas;
            }
            if (e.key === "9") {
                isLandscapeOverride = isLandscapeOverride === null
                    ? false
                    : !isLandscapeOverride;
            }
        }, false);
    }
    let context = canvas.getContext("2d", { alpha: false });
    let bodyElement = null;
    let currentCanvasWidth = MINIMUM_WINDOW_LONG_EDGE;
    let currentCanvasHeight = MINIMUM_WINDOW_SHORT_EDGE;
    let currentCanvasWidthNormalized = Math.floor(currentCanvasWidth / canvasScalingFactor);
    let currentCanvasHeightNormalized = Math.floor(currentCanvasHeight / canvasScalingFactor);
    let handleDisplayTypeChanges = function () {
        if (!bodyElement) {
            bodyElement = browserDocument.body;
            if (!bodyElement)
                return;
        }
        let innerWidth = browserWindow.innerWidth;
        let innerHeight = browserWindow.innerHeight;
        if (innerWidth < 5)
            innerWidth = 5;
        if (innerHeight < 5)
            innerHeight = 5;
        let isLandscape = innerWidth > innerHeight;
        if (isLandscapeOverride !== null)
            isLandscape = isLandscapeOverride;
        bodyElement.style.margin = "0px";
        let newCanvasWidth;
        let newCanvasHeight;
        if (isLandscape) {
            newCanvasWidth = canvasScalingFactor * Math.max(MINIMUM_WINDOW_LONG_EDGE, Math.round((innerWidth / innerHeight) * MINIMUM_WINDOW_SHORT_EDGE));
            newCanvasHeight = canvasScalingFactor * MINIMUM_WINDOW_SHORT_EDGE;
            if (newCanvasWidth > newCanvasHeight * 5)
                newCanvasWidth = newCanvasHeight * 5;
        }
        else {
            newCanvasWidth = canvasScalingFactor * MINIMUM_WINDOW_SHORT_EDGE;
            newCanvasHeight = canvasScalingFactor * Math.max(MINIMUM_WINDOW_LONG_EDGE, Math.round((innerHeight / innerWidth) * MINIMUM_WINDOW_SHORT_EDGE));
            if (newCanvasHeight > newCanvasWidth * 5)
                newCanvasHeight = newCanvasWidth * 5;
        }
        if (newCanvasWidth !== canvas.width)
            canvas.width = newCanvasWidth;
        if (newCanvasHeight !== canvas.height)
            canvas.height = newCanvasHeight;
        currentCanvasWidth = canvas.width;
        currentCanvasHeight = canvas.height;
        currentCanvasWidthNormalized = Math.floor(currentCanvasWidth / canvasScalingFactor);
        currentCanvasHeightNormalized = Math.floor(currentCanvasHeight / canvasScalingFactor);
        context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
        let canvasMarginTop;
        if (!useUnscaledCanvas) {
            let canvasScalingX = innerWidth / canvas.width;
            let canvasScalingY = innerHeight / canvas.height;
            let canvasScaling = Math.min(canvasScalingX, canvasScalingY);
            let newCanvasCssWidth = Math.floor(canvas.width * canvasScaling);
            let newCanvasCssHeight = Math.floor(canvas.height * canvasScaling);
            canvas.style.width = newCanvasCssWidth + "px";
            canvas.style.height = newCanvasCssHeight + "px";
            if (innerHeight > newCanvasCssHeight) {
                canvasMarginTop = Math.floor((innerHeight - newCanvasCssHeight) / 2);
            }
            else {
                canvasMarginTop = 0;
            }
        }
        else {
            canvas.style.width = Math.floor(canvas.width / canvasScalingFactor) + "px";
            canvas.style.height = Math.floor(canvas.height / canvasScalingFactor) + "px";
            canvasMarginTop = 0;
        }
        canvas.style.marginTop = canvasMarginTop + "px";
        bodyElement.style.backgroundColor = "#ebebeb";
    };
    let intervalId = setInterval(handleDisplayTypeChanges, 250);
    handleDisplayTypeChanges();
    return {
        getCurrentCanvasWidth: function () { return currentCanvasWidthNormalized; },
        getCurrentCanvasHeight: function () { return currentCanvasHeightNormalized; },
        cancelCanvasResizing: function () { clearInterval(intervalId); }
    };
};
export { initializeCanvasResizing };
