import { getGameManager } from "./GameInitializer.js";
import { createHtmlElements } from "./GameInitializer_CreateHtmlElements.js";
import { getFpsDisplayManager } from "./GameInitializer_FpsDisplay.js";
let beginGame = function () {
    let isEmbeddedVersion = false;
    let canvasScalingFactor = 2;
    setTimeout(function () { beginGameHelper({ isEmbeddedVersion: isEmbeddedVersion, canvasScalingFactor: canvasScalingFactor }); }, 10 /* arbitrary */);
};
let beginGameHelper = function ({ isEmbeddedVersion, canvasScalingFactor }) {
    let browserDocument = document;
    let browserWindow = window;
    var isElectronVersion = !isEmbeddedVersion
        && (browserWindow.navigator.userAgent.indexOf("Electron") >= 0 || browserWindow.navigator.userAgent.indexOf("electron") >= 0);
    var urlParams = (new URL(browserDocument.location)).searchParams;
    var showFps = urlParams.get("showfps") !== null
        ? (urlParams.get("showfps") === "true")
        : false;
    var debugMode = urlParams.get("debugmode") !== null
        ? (urlParams.get("debugmode") === "true")
        : false;
    let htmlElements = createHtmlElements({ showFps: showFps, browserDocument: browserDocument });
    let buildType;
    if (isElectronVersion)
        buildType = 2 /* BuildType.Electron */;
    else if (isEmbeddedVersion)
        buildType = 1 /* BuildType.WebEmbedded */;
    else
        buildType = 0 /* BuildType.WebStandalone */;
    let isLibrem5Mobile = browserWindow.navigator.userAgent.toLowerCase().includes("mobile")
        && browserWindow.navigator.userAgent.toLowerCase().includes("linux")
        && !browserWindow.navigator.userAgent.toLowerCase().includes("android")
        && (browserWindow.screen.height / browserWindow.screen.width === 2 || browserWindow.screen.width / browserWindow.screen.height === 2);
    let isDesktop = browserWindow.matchMedia("(pointer:fine)").matches
        && !isLibrem5Mobile;
    let gameManager = getGameManager({
        canvas: htmlElements.canvas,
        canvasScalingFactor: canvasScalingFactor,
        buildType: buildType,
        isDesktop: isDesktop,
        debugMode: debugMode,
        browserWindow: browserWindow,
        browserDocument: browserDocument
    });
    let requestAnimationFrameCallback;
    let lastTimestamp = null;
    let fpsDisplayManager = getFpsDisplayManager({ fpsNode: htmlElements.fpsNode });
    requestAnimationFrameCallback = function (timestamp) {
        if (lastTimestamp === null)
            lastTimestamp = timestamp;
        let elapsedMillis = timestamp - lastTimestamp;
        if (elapsedMillis < 5) {
            requestAnimationFrame(requestAnimationFrameCallback);
            return;
        }
        lastTimestamp = timestamp;
        let elapsedMicros = Math.floor(elapsedMillis * 1000);
        if (elapsedMicros > 50 * 1000)
            elapsedMicros = 50 * 1000;
        try {
            gameManager.computeAndRenderNextFrame({
                elapsedMicrosThisFrame: elapsedMicros
            });
        }
        catch (error) {
            gameManager.renderError({ errorMessage: "" + error });
            throw error;
        }
        fpsDisplayManager.frameComputedAndRendered();
        if (showFps)
            fpsDisplayManager.displayFps();
        requestAnimationFrame(requestAnimationFrameCallback);
    };
    requestAnimationFrame(requestAnimationFrameCallback);
};
export { beginGame };
