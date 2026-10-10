
import { BuildType } from "../DTLibrary/BuildType.js";
import { black } from "../DTLibrary/DTColor.js";
import { GameFont } from "../DTLibrary/GameFont.js";
import { IDisplayOutput } from "../DTLibrary/IDisplay.js";

let renderMusicCredits = function ({ displayOutput, width, height, buildType }: { displayOutput: IDisplayOutput, width: number, height: number, buildType: BuildType }): void {

	let text: string;

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

	displayOutput.drawText(
		10,
		height - 10,
		text,
		GameFont.SimpleFont,
		27,
		black);
};

export { renderMusicCredits };
