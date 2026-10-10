
import { GameFont } from "../DTLibrary/GameFont.js";
import { GameSound } from "../DTLibrary/GameSound.js";
import { IDisplayOutput, IDisplayProcessing } from "../DTLibrary/IDisplay.js";
import { IMouse } from "../DTLibrary/IMouse.js";
import { ISoundOutput } from "../DTLibrary/ISoundOutput.js";
import { Button, getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { GameState } from "./GameState.js";
import { GlobalState } from "./GlobalState.js";

let getResignButton = function ({ globalState, gameState, isLandscapeOrientation, displayProcessing }: { globalState: GlobalState, gameState: GameState, isLandscapeOrientation: boolean, displayProcessing: IDisplayProcessing }) {
	
	let resignButton: Button = getButton({
		x: 0,
		y: 0,
		width: 200,
		height: 80,
		roundedCornerRadius: 10,
		backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
		hoverColor: STANDARD_HOVER_COLOR,
		clickColor: STANDARD_CLICK_COLOR,
		text: "Resign",
		textXOffset: 59,
		textYOffset: 30,
		font: GameFont.Roboto,
		fontSize: 27,
		isDesktop: globalState.isDesktop
	});	

	let updateUI = function () {
		if (isLandscapeOrientation) {
			resignButton.setX(0);
			resignButton.setY(0);
		} else {
			resignButton.setX(472);
			resignButton.setY(118);
		}
	};

	updateUI();

	let processFrame = function (input: { gameState: GameState, isLandscapeOrientation: boolean, mouseInput: IMouse, soundOutput: ISoundOutput }): { clickedResignButton: boolean } {
		gameState = input.gameState;
		isLandscapeOrientation = input.isLandscapeOrientation;

		updateUI();

		let mouseInput = input.mouseInput;
		let soundOutput = input.soundOutput;

		let clickedResignButton: boolean;

		if (gameState.isGameCompleted)
			clickedResignButton = false;
		else
			clickedResignButton = resignButton.processFrame({ mouseInput }).wasClicked;

		if (clickedResignButton)
			soundOutput.playSound(GameSound.Click, 100);

		return {
			clickedResignButton: clickedResignButton
		};
	};

	let render = function (displayOutput: IDisplayOutput) {
		if (!gameState.isGameCompleted)
			resignButton.render(displayOutput);
	};

	return {
		processFrame,
		render
	};
};

export { getResignButton };
