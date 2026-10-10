import { black } from "../DTLibrary/DTColor.js";
let renderMusicCredits = function ({ displayOutput, width, height, buildType }) {
    let text;
    if (displayOutput.isLandscapeOrientation())
        text = "Music track authors: \n"
            + "* rezoner \n"
            + "\n"
            + "See the source code for more information (including licensing \n"
            + "details).";
    else
        text = "Music track authors: \n"
            + "* rezoner \n"
            + "\n"
            + "See the source code for more information \n"
            + "(including licensing details).";
    displayOutput.drawText(10, height - 10, text, 0 /* GameFont.SimpleFont */, 27, black);
};
export { renderMusicCredits };
