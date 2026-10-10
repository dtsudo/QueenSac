import { black } from "../DTLibrary/DTColor.js";
let renderDesignAndCodingCredits = function ({ displayOutput, width, height, buildType }) {
    let text;
    if (displayOutput.isLandscapeOrientation())
        text = "Design and coding by dtsudo. \n"
            + "\n"
            + "Libraries used: \n"
            + "* Stockfish \n"
            + "* Chess.js \n"
            + "\n"
            + "This game is open source, licensed under GPL 3.0. \n"
            + "(Code dependencies, images, font, sound, and music licensed under \n"
            + "other open source licenses.) \n"
            + "\n"
            + "For the desktop version, this game uses the Electron framework \n"
            + "(https://www.electronjs.org) \n"
            + "\n"
            + "See the source code for more information (including licensing \n"
            + "details).";
    else
        text = "Design and coding by dtsudo. \n"
            + "\n"
            + "Libraries used: \n"
            + "* Stockfish \n"
            + "* Chess.js \n"
            + "\n"
            + "This game is open source, licensed under GPL 3.0. \n"
            + "(Code dependencies, images, font, sound, and \n"
            + "music licensed under other open source \n"
            + "licenses.) \n"
            + "\n"
            + "For the desktop version, this game uses the \n"
            + "Electron framework \n"
            + "(https://www.electronjs.org) \n"
            + "\n"
            + "See the source code for more information \n"
            + "(including licensing details).";
    displayOutput.drawText(10, height - 10, text, 0 /* GameFont.SimpleFont */, 27, black);
};
export { renderDesignAndCodingCredits };
