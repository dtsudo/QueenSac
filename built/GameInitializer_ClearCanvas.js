let getClearCanvasManager = function ({ canvas }) {
    let canvasContext = canvas.getContext("2d", { alpha: false });
    let clearCanvas = function () {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    };
    return {
        clearCanvas
    };
};
export { getClearCanvasManager };
