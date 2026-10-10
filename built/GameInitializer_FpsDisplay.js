let getFpsDisplayManager = function ({ fpsNode }) {
    var numberOfFrames = 0;
    var startTimeMillis = Date.now();
    var frameComputedAndRendered = function () {
        numberOfFrames++;
    };
    var displayFps = function () {
        var currentTimeMillis = Date.now();
        if (currentTimeMillis - startTimeMillis > 2000) {
            var actualFps = numberOfFrames / 2;
            fpsNode.textContent = actualFps.toString();
            numberOfFrames = 0;
            startTimeMillis = currentTimeMillis;
        }
    };
    return {
        frameComputedAndRendered: frameComputedAndRendered,
        displayFps: displayFps
    };
};
export { getFpsDisplayManager };
