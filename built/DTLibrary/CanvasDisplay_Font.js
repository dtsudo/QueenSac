import { getFontFilename, getFontNames } from "./GameFont.js";
import { drawText_Helper } from "./CanvasDisplay_Helper.js";
let getCanvasDisplayFont = function ({ canvas, canvasScalingFactor, browserDocument, getCurrentCanvasHeight }) {
    let fontDictionary = {};
    let context = null;
    let fontFamilyCount = 0;
    let numberOfFontObjectsLoaded = 0;
    let finishedLoading = false;
    let loadFonts = function () {
        let fontNamesArray = getFontNames();
        let numberOfFontObjects = fontNamesArray.length;
        for (let fontName of fontNamesArray) {
            if (fontDictionary[fontName])
                continue;
            let fileName = getFontFilename(fontName);
            let fontFamilyName = "DTFontFamily" + fontFamilyCount;
            fontFamilyCount++;
            let font = new FontFace(fontFamilyName, "url(Data/Font/" + fileName + ")");
            fontDictionary[fontName] = fontFamilyName;
            font.load().then(function () {
                browserDocument.fonts.add(font);
                numberOfFontObjectsLoaded++;
            });
        }
        finishedLoading = numberOfFontObjects === numberOfFontObjectsLoaded;
        return finishedLoading;
    };
    let drawText = function (x, y, str, fontName, fontSize, color) {
        if (context === null) {
            context = canvas.getContext("2d", { alpha: false });
            context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
        }
        drawText_Helper(context, getCurrentCanvasHeight(), fontDictionary, x, y, str, fontName, fontSize, color);
    };
    let tryDrawText = function (x, y, str, fontName, fontSize, color) {
        if (!finishedLoading)
            return;
        drawText(x, y, str, fontName, fontSize, color);
    };
    let getFontDictionary = function () {
        return fontDictionary;
    };
    return {
        loadFonts,
        drawText,
        tryDrawText,
        getFontDictionary
    };
};
export { getCanvasDisplayFont };
