
import { black } from "../DTLibrary/DTColor.js";
import { GameFont } from "../DTLibrary/GameFont.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { IFrame, getNextFrame } from "../DTLibrary/IFrame.js";
import { GlobalState } from "./GlobalState.js";
import { SessionState } from "./SessionState.js";
import { IDisplayOutput, IDisplayProcessing } from "../DTLibrary/IDisplay.js";
import { IMusicOutput } from "../DTLibrary/IMusicOutput.js";
import { ISoundOutput } from "../DTLibrary/ISoundOutput.js";
import { getSoundAndMusicVolumePicker } from "./SoundAndMusicVolumePicker.js";
import { VolumePickerColor } from "./VolumePickerColor.js";
import { GameMusic } from "../DTLibrary/GameMusic.js";
import { Key } from "../DTLibrary/IKeyboard.js";
import { Button, getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { GameSound } from "../DTLibrary/GameSound.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
import { getGameFrame } from "./GameFrame.js";
import { getInitialGameState, processMove } from "./GameState.js";
import { getTransitionAnimationFrame } from "./TransitionAnimationFrame.js";

let getInstructionsScreenFrame = function ({ globalState, sessionState, soundOutput, musicOutput, displayProcessing }: { globalState: GlobalState, sessionState: SessionState, soundOutput: ISoundOutput, musicOutput: IMusicOutput, displayProcessing: IDisplayProcessing }): IFrame {

	let volumePicker = getSoundAndMusicVolumePicker({
		xPos: 0,
		yPos: 0,
		initialSoundVolume: soundOutput.getSoundVolume(),
		initialMusicVolume: musicOutput.getMusicVolume(),
		color: VolumePickerColor.Black,
		scalingFactor: globalState.isDesktop ? 1 : 2
	});

	let continueButton: Button = getButton({
		x: 0,
		y: 0,
		width: 300,
		height: 100,
		roundedCornerRadius: 10,
		backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
		hoverColor: STANDARD_HOVER_COLOR,
		clickColor: STANDARD_CLICK_COLOR,
		text: "Begin",
		textXOffset: 108,
		textYOffset: 38,
		font: GameFont.Roboto,
		fontSize: 32,
		isDesktop: globalState.isDesktop
	});	

	let updateUI = function (displayProcessing: IDisplayProcessing) {
		continueButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 150);
		continueButton.setY(displayProcessing.getCanvasHeight() - 590);
	};

	updateUI(displayProcessing);

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame, elapsedMicrosThisFrame }) {

		updateUI(displayProcessing);

		globalState.background.processFrame({ elapsedMicrosThisFrame });

		volumePicker.processFrame({ mouseInput, previousMouseInput });
		soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
		musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());
		globalState.saveAndLoadData.saveSoundAndMusicVolume({ soundVolume: soundOutput.getSoundVolume(), musicVolume: musicOutput.getMusicVolume() });

		let wasButtonClicked = continueButton.processFrame({ mouseInput }).wasClicked;

		if (wasButtonClicked) {
			soundOutput.playSound(GameSound.Click, 100);

			let isPlayerWhite: boolean;

			if (sessionState.wasPlayerWhiteLastGame === null)
				isPlayerWhite = true;
			else if (sessionState.wasPlayerWhiteLastGame)
				isPlayerWhite = false;
			else
				isPlayerWhite = true;

			sessionState.wasPlayerWhiteLastGame = isPlayerWhite;

			sessionState.hasStarted = true;

			sessionState.gameState = getInitialGameState({
				isPlayerWhite: isPlayerWhite
			});

			globalState.saveAndLoadData.saveSessionState({ sessionState });

			let gameFrame = getGameFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });

			return getTransitionAnimationFrame({
				oldFrame: thisFrame,
				newFrame: gameFrame,
				displayProcessing,
				shouldKeepProcessingOldFrame: true,
				handleOldFrameCanvasResizing: function (displayProcessing) { }
			});
		}

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {
			soundOutput.playSound(GameSound.Click, 100);
			return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);

		globalState.background.render(displayOutput);

		displayOutput.drawText(
			Math.floor(displayOutput.getCanvasWidth() / 2) - 167,
			displayOutput.getCanvasHeight() - 100,
			"Instructions",
			GameFont.Roboto,
			64,
			black);

		volumePicker.render(displayOutput);

		continueButton.render(displayOutput);

		displayOutput.drawText(
			Math.floor(displayOutput.getCanvasWidth() / 2) - 220,
			displayOutput.getCanvasHeight() - 200,
			"You're playing against Stockfish, the strongest \n"
				+ "chess engine in the world. \n"
				+ "\n"
				+ "However, Stockfish has been modified so that \n"
				+ "if it can play a move that allows you to capture \n"
				+ "its queen, it must play such a move. \n"
				+ "\n"
				+ "Use this to your advantage to defeat Stockfish!",
			GameFont.Roboto,
			22,
			black);
	};

	return {
		getNextFrame,
		render,
		getClickUrl: null,
		getCompletedAchievements: null
	};
};

export { getInstructionsScreenFrame };
