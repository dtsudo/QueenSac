let getMouse = function ({ canvas, canvasScalingFactor, browserDocument }) {
    let mouseXPosition = -50;
    let mouseYPosition = -50;
    let mouseMoveHandler = function (e) {
        let canvasCssWidth = canvas.offsetWidth;
        let canvasCssHeight = canvas.offsetHeight;
        let xPosition = (e.pageX !== null && e.pageX !== undefined ? e.pageX : e.clientX) - canvas.offsetLeft;
        let canvasXScaling = canvasCssWidth / canvas.width;
        if (canvasXScaling < 0.001)
            canvasXScaling = 0.001;
        xPosition = Math.round(xPosition / canvasXScaling);
        if (xPosition < -5)
            xPosition = -5;
        if (xPosition > canvas.width + 5)
            xPosition = canvas.width + 5;
        let yPosition = (e.pageY !== null && e.pageY !== undefined ? e.pageY : e.clientY) - canvas.offsetTop;
        let canvasYScaling = canvasCssHeight / canvas.height;
        if (canvasYScaling < 0.001)
            canvasYScaling = 0.001;
        yPosition = Math.round(yPosition / canvasYScaling);
        if (yPosition < -5)
            yPosition = -5;
        if (yPosition > canvas.height + 5)
            yPosition = canvas.height + 5;
        mouseXPosition = Math.floor(xPosition / canvasScalingFactor);
        mouseYPosition = Math.floor((canvas.height - yPosition - 1) / canvasScalingFactor);
    };
    let isLeftMouseButtonPressed = false;
    let isRightMouseButtonPressed = false;
    let previousIsLeftMouseButtonPressed = false;
    let previousIsRightMouseButtonPressed = false;
    let shouldProcessLeftMouseButtonPress = false;
    let shouldProcessRightMouseButtonPress = false;
    let checkMouseButtonHandler = function (e) {
        if ((e.buttons & 1) === 1) {
            isLeftMouseButtonPressed = true;
            if (!previousIsLeftMouseButtonPressed)
                shouldProcessLeftMouseButtonPress = true;
        }
        else {
            isLeftMouseButtonPressed = false;
        }
        if ((e.buttons & 2) === 2) {
            isRightMouseButtonPressed = true;
            if (!previousIsRightMouseButtonPressed)
                shouldProcessRightMouseButtonPress = true;
        }
        else {
            isRightMouseButtonPressed = false;
        }
    };
    let processedInputs = function () {
        previousIsLeftMouseButtonPressed = isLeftMouseButtonPressed || shouldProcessLeftMouseButtonPress;
        previousIsRightMouseButtonPressed = isRightMouseButtonPressed || shouldProcessRightMouseButtonPress;
        shouldProcessLeftMouseButtonPress = false;
        shouldProcessRightMouseButtonPress = false;
    };
    let disableContextMenu;
    disableContextMenu = function () {
        canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    };
    disableContextMenu();
    browserDocument.addEventListener("pointermove", function (e) { mouseMoveHandler(e); checkMouseButtonHandler(e); }, false);
    browserDocument.addEventListener("pointerdown", function (e) { mouseMoveHandler(e); checkMouseButtonHandler(e); }, false);
    browserDocument.addEventListener("pointerup", function (e) { mouseMoveHandler(e); checkMouseButtonHandler(e); }, false);
    browserDocument.addEventListener("pointercancel", function (e) { mouseMoveHandler(e); checkMouseButtonHandler(e); });
    return {
        isLeftMouseButtonPressed: function () { return isLeftMouseButtonPressed || shouldProcessLeftMouseButtonPress; },
        isRightMouseButtonPressed: function () { return isRightMouseButtonPressed || shouldProcessRightMouseButtonPress; },
        getX: function () { return Math.round(mouseXPosition); },
        getY: function () { return Math.round(mouseYPosition); },
        processedInputs: processedInputs
    };
};
export { getMouse };
