
import { black, white } from "../DTLibrary/DTColor.js";
import { GameFont } from "../DTLibrary/GameFont.js";
import { IFrame, getNextFrame } from "../DTLibrary/IFrame.js";
import { GlobalState } from "./GlobalState.js";
import { SessionState } from "./SessionState.js";
import { IDisplayOutput, IDisplayProcessing } from "../DTLibrary/IDisplay.js";
import { Key } from "../DTLibrary/IKeyboard.js";
import { Button, getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR, STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { GameSound } from "../DTLibrary/GameSound.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
import { getEmptyKeyboard } from "../DTLibrary/EmptyKeyboard.js";
import { getEmptyMouse } from "../DTLibrary/EmptyMouse.js";

let getResignConfirmationFrame = function ({ globalState, sessionState, displayProcessing, underlyingFrame }: { globalState: GlobalState, sessionState: SessionState, displayProcessing: IDisplayProcessing, underlyingFrame: IFrame }): IFrame {

	let yesButton: Button = getButton({
		x: 0,
		y: 0,
		width: 200,
		height: 100,
		roundedCornerRadius: 10,
		backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
		hoverColor: STANDARD_HOVER_COLOR,
		clickColor: STANDARD_CLICK_COLOR,
		text: "Yes",
		textXOffset: 75,
		textYOffset: 38,
		font: GameFont.Roboto,
		fontSize: 32,
		isDesktop: globalState.isDesktop
	});

	let noButton: Button = getButton({
		x: 0,
		y: 0,
		width: 200,
		height: 100,
		roundedCornerRadius: 10,
		backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
		hoverColor: STANDARD_HOVER_COLOR,
		clickColor: STANDARD_CLICK_COLOR,
		text: "No",
		textXOffset: 79,
		textYOffset: 38,
		font: GameFont.Roboto,
		fontSize: 32,
		isDesktop: globalState.isDesktop
	});

	let updateUI = function (displayProcessing: IDisplayProcessing) {
		yesButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 225);
		yesButton.setY(displayProcessing.getCanvasHeight() - 450);

		noButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) + 25);
		noButton.setY(displayProcessing.getCanvasHeight() - 450);
	};

	updateUI(displayProcessing);

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, elapsedMicrosThisFrame, thisFrame }) {

		updateUI(displayProcessing);

		let wasYesButtonClicked = yesButton.processFrame({ mouseInput }).wasClicked;

		if (wasYesButtonClicked) {
			soundOutput.playSound(GameSound.Click, 100);
			sessionState.gameState = null;
			globalState.saveAndLoadData.saveSessionState({ sessionState });
			return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
		}

		let wasNoButtonClicked = noButton.processFrame({ mouseInput }).wasClicked;

		if (wasNoButtonClicked) {
			soundOutput.playSound(GameSound.Click, 100);
			return underlyingFrame;
		}

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {
			soundOutput.playSound(GameSound.Click, 100);
			return underlyingFrame;
		}

		underlyingFrame = underlyingFrame.getNextFrame({
			keyboardInput: getEmptyKeyboard(),
			mouseInput: getEmptyMouse(),
			previousKeyboardInput: getEmptyKeyboard(),
			previousMouseInput: getEmptyMouse(),
			displayProcessing,
			soundOutput,
			musicOutput,
			elapsedMicrosThisFrame,
			thisFrame: underlyingFrame
		});

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		underlyingFrame.render(displayOutput);

		displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), { r: 0, g: 0, b: 0, alpha: 110 }, true);

		displayOutput.drawRoundedRectangle(
			Math.floor(displayOutput.getCanvasWidth() / 2) - 275,
			displayOutput.getCanvasHeight() - 500,
			550,
			300,
			10,
			{ r: 240, g: 240, b: 240, alpha: 255 },
			true);

		displayOutput.drawRoundedRectangle(
			Math.floor(displayOutput.getCanvasWidth() / 2) - 275,
			displayOutput.getCanvasHeight() - 500,
			550,
			300,
			10,
			black,
			false);

		displayOutput.drawText(
			Math.floor(displayOutput.getCanvasWidth() / 2) - 230,
			displayOutput.getCanvasHeight() - 250,
			"Are you sure you want to resign?",
			GameFont.Roboto,
			32,
			black);

		yesButton.render(displayOutput);
		noButton.render(displayOutput);
	};

	return {
		getNextFrame,
		render,
		getClickUrl: null,
		getCompletedAchievements: null
	};
};

export { getResignConfirmationFrame };
