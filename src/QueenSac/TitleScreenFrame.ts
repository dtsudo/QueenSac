
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
import { getCreditsFrame } from "./CreditsFrame.js";
import { getInstructionsScreenFrame } from "./InstructionsScreenFrame.js";
import { getGameFrame } from "./GameFrame.js";
import { Button, getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR, STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { getCurrentVersion } from "../DTLibrary/VersionInfo.js";
import { GameSound } from "../DTLibrary/GameSound.js";
import { getTransitionAnimationFrame } from "./TransitionAnimationFrame.js";

let getTitleScreenFrame = function ({ globalState, sessionState, soundOutput, musicOutput, displayProcessing }: { globalState: GlobalState, sessionState: SessionState, soundOutput: ISoundOutput, musicOutput: IMusicOutput, displayProcessing: IDisplayProcessing }): IFrame {

	let volumePicker = getSoundAndMusicVolumePicker({
		xPos: 0,
		yPos: 0,
		initialSoundVolume: soundOutput.getSoundVolume(),
		initialMusicVolume: musicOutput.getMusicVolume(),
		color: VolumePickerColor.Black,
		scalingFactor: globalState.isDesktop ? 1 : 2
	});

	let startOrContinueButton: Button = getButton({
		x: 0,
		y: 0,
		width: 300,
		height: 100,
		roundedCornerRadius: 10,
		backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
		hoverColor: STANDARD_HOVER_COLOR,
		clickColor: STANDARD_CLICK_COLOR,
		text: "",
		textXOffset: 0,
		textYOffset: 0,
		font: GameFont.Roboto,
		fontSize: 32,
		isDesktop: globalState.isDesktop
	});

	let creditsButton: Button = getButton({
		x: 0,
		y: 5,
		width: 145,
		height: 80,
		roundedCornerRadius: 10,
		backgroundColor: STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR,
		hoverColor: STANDARD_HOVER_COLOR,
		clickColor: STANDARD_CLICK_COLOR,
		text: "Credits",
		textXOffset: 40,
		textYOffset: 33,
		font: GameFont.Roboto,
		fontSize: 20,
		isDesktop: globalState.isDesktop
	});
	
	let startedTransitionFrame = false;

	let updateUI = function (displayProcessing: IDisplayProcessing) {
		startOrContinueButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 150);
		startOrContinueButton.setY(displayProcessing.getCanvasHeight() - 400);
		startOrContinueButton.setText(sessionState.hasStarted && sessionState.gameState !== null ? "Continue" : "Start");
		startOrContinueButton.setTextXOffset(sessionState.hasStarted && sessionState.gameState !== null ? 86 : 115);
		startOrContinueButton.setTextYOffset(38);

		creditsButton.setX(displayProcessing.getCanvasWidth() - 150);
	};

	updateUI(displayProcessing);

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame, elapsedMicrosThisFrame }) {

		globalState.background.processFrame({ elapsedMicrosThisFrame });
		
		updateUI(displayProcessing);

		if (!startedTransitionFrame) {
			musicOutput.playMusic(GameMusic.Happy, 100);

			volumePicker.processFrame({ mouseInput, previousMouseInput });
			soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
			musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());
			globalState.saveAndLoadData.saveSoundAndMusicVolume({
				soundVolume: soundOutput.getSoundVolume(),
				musicVolume: musicOutput.getMusicVolume()
			});
		}

		let wasStartOrContinueButtonClicked = startOrContinueButton.processFrame({ mouseInput }).wasClicked;

		if (wasStartOrContinueButtonClicked) {
			soundOutput.playSound(GameSound.Click, 100);
			if (sessionState.gameState) {
				let gameFrame = getGameFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });

				startedTransitionFrame = true;
				return getTransitionAnimationFrame({
					oldFrame: thisFrame,
					newFrame: gameFrame,
					displayProcessing,
					shouldKeepProcessingOldFrame: true,
					handleOldFrameCanvasResizing: function (displayProcessing: IDisplayProcessing) { }
				});
			} else {
				return getInstructionsScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
			}	
		}

		let wasCreditsButtonClicked = creditsButton.processFrame({ mouseInput }).wasClicked;

		if (wasCreditsButtonClicked) {
			soundOutput.playSound(GameSound.Click, 100);
			return getCreditsFrame({ globalState, sessionState, displayProcessing });
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);

		globalState.background.render(displayOutput);

		displayOutput.drawText(
			Math.floor(displayOutput.getCanvasWidth() / 2) - 152,
			displayOutput.getCanvasHeight() - 100,
			"Queen Sac",
			GameFont.Roboto,
			64,
			black);

		volumePicker.render(displayOutput);

		startOrContinueButton.render(displayOutput);

		creditsButton.render(displayOutput);

		let version: string = getCurrentVersion().version;

		displayOutput.drawText(
			displayOutput.getCanvasWidth() - 55,
			105,
			"v" + version,
			GameFont.Roboto,
			20,
			black);
	};

	return {
		getNextFrame,
		render,
		getClickUrl: null,
		getCompletedAchievements: null
	};
};

export { getTitleScreenFrame };
