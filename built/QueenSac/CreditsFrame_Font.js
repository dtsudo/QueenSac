import { black } from "../DTLibrary/DTColor.js";
let renderFontCredits = function ({ displayOutput, width, height, buildType }) {
    let text;
    if (displayOutput.isLandscapeOrientation())
        text = "Fonts created by: \n"
            + "* Metaflop (www.metaflop.com/modulator) \n"
            + "* The Roboto Project Authors \n"
            + "\n"
            + "See the source code for more information (including licensing \n"
            + "details).";
    else
        text = "Fonts created by: \n"
            + "* Metaflop (www.metaflop.com/modulator) \n"
            + "* The Roboto Project Authors \n"
            + "\n"
            + "See the source code for more information \n"
            + "(including licensing details).";
    displayOutput.drawText(10, height - 10, text, 0 /* GameFont.SimpleFont */, 27, black);
};
export { renderFontCredits };
