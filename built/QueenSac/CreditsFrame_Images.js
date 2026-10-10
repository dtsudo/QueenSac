import { black } from "../DTLibrary/DTColor.js";
let renderImagesCredits = function ({ displayOutput, width, height, buildType }) {
    let text;
    if (displayOutput.isLandscapeOrientation())
        text = "Image files created by: \n"
            + "* Cburnett \n"
            + "* Kenney \n"
            + "\n"
            + "See the source code for more information (including licensing \n"
            + "details).";
    else
        text = "Image files created by: \n"
            + "* Cburnett \n"
            + "* Kenney \n"
            + "\n"
            + "See the source code for more information \n"
            + "(including licensing details).";
    displayOutput.drawText(10, height - 10, text, 0 /* GameFont.SimpleFont */, 27, black);
};
export { renderImagesCredits };
