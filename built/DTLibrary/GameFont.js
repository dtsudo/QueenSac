let getFontNames = function () {
    return [
        0 /* GameFont.SimpleFont */,
        1 /* GameFont.Roboto */
    ];
};
let getFontFilename = function (font) {
    switch (font) {
        case 0 /* GameFont.SimpleFont */: return "Metaflop/dtsimplefont.woff";
        case 1 /* GameFont.Roboto */: return "Roboto/Roboto-Regular.ttf";
    }
};
export { getFontNames, getFontFilename };
