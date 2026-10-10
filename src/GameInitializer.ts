
import { BuildType } from "./DTLibrary/BuildType.js";
import { IDisplay } from "./DTLibrary/IDisplay.js";
import { IFrame } from "./DTLibrary/IFrame.js";
import { IKeyboard } from "./DTLibrary/IKeyboard.js";
import { IMouse } from "./DTLibrary/IMouse.js";
import { IMusicOutput, IMusicProcessing } from "./DTLibrary/IMusicOutput.js";
import { ISoundOutput, ISoundProcessing } from "./DTLibrary/ISoundOutput.js";
import { getFirstFrame } from "./QueenSac/GameEntryFrame.js";
import { getKeyboard } from "./DTLibrary/GameKeyboard.js";
import { getMouse } from "./DTLibrary/GameMouse.js";
import { getEmptyKeyboard } from "./DTLibrary/EmptyKeyboard.js";
import { getEmptyMouse } from "./DTLibrary/EmptyMouse.js";
import { getSoundOutput } from "./DTLibrary/GameSoundOutput.js";
import { getMusicOutput } from "./DTLibrary/GameMusicOutput.js";
import { getSnapshot as getKeyboardSnapshot } from "./DTLibrary/CopiedKeyboard.js";
import { getSnapshot as getMouseSnapshot } from "./DTLibrary/CopiedMouse.js";
import { getDisplay } from "./DTLibrary/CanvasDisplay.js";
import { getClearCanvasManager } from "./GameInitializer_ClearCanvas.js";
import { initializeCanvasResizing } from "./GameInitializer_CanvasResizing.js";
import { getAchievementsManager } from "./GameInitializer_AchievementsManager.js";
import { GameFont } from "./DTLibrary/GameFont.js";
import { black, white } from "./DTLibrary/DTColor.js";

let getGameManager = function ({ canvas, canvasScalingFactor, buildType, isDesktop, debugMode, browserWindow, browserDocument }: { canvas: HTMLCanvasElement, canvasScalingFactor: number, buildType: BuildType, isDesktop: boolean, debugMode: boolean, browserWindow: Window, browserDocument: Document }) {

	let canvasResizing = initializeCanvasResizing({
		debugMode: debugMode,
		browserDocument: browserDocument,
		browserWindow: browserWindow,
		canvasScalingFactor: canvasScalingFactor,
		canvas: canvas
	});

	let browserLocalStorage = {
		setItem: function (key: string, value: string): void {
			try {
				browserWindow.localStorage.setItem(key, value);
			} catch (error) {
				// do nothing
			}
		},
		getItem: function (key: string): string | null {
			try {
				let item = browserWindow.localStorage.getItem(key);
				return item;
			} catch (error) {
				return null;
			}
		}
	};

	let clearCanvasManager = getClearCanvasManager({ canvas: canvas });

	let gameFrame: IFrame = getFirstFrame({ buildType: buildType, isDesktop: isDesktop, debugMode: debugMode, browserLocalStorage: browserLocalStorage });
	let gameKeyboard: IKeyboard = getKeyboard({
		disableArrowKeyScrolling: buildType === BuildType.WebEmbedded || buildType === BuildType.Electron,
		browserWindow: browserWindow,
		browserDocument: browserDocument
	});
	let gameMouse: IMouse & { processedInputs: () => void } = getMouse({ canvas: canvas, canvasScalingFactor: canvasScalingFactor, browserDocument: browserDocument });

	let display: IDisplay = getDisplay({
		getCurrentCanvasWidth: function () { return canvasResizing.getCurrentCanvasWidth(); },
		getCurrentCanvasHeight: function () { return canvasResizing.getCurrentCanvasHeight(); },
		imageSmoothingEnabled: true,
		canvasScalingFactor: canvasScalingFactor,
		canvas: canvas,
		browserDocument: browserDocument
	});
	let soundOutput: ISoundOutput & ISoundProcessing = getSoundOutput({ browserWindow });
	let musicOutput: IMusicOutput & IMusicProcessing = getMusicOutput({ browserWindow });

	let previousGameKeyboard: IKeyboard = getEmptyKeyboard();
	let previousGameMouse: IMouse = getEmptyMouse();

	clearCanvasManager.clearCanvas();
	gameFrame.render(display);

	let clickUrl: string | null = null;

	browserDocument.addEventListener("click", function (e) {
		if (clickUrl !== null && clickUrl !== "")
			browserWindow.open(clickUrl, "_blank");
	}, false);

	let achievementsManager: { addAchievements: (input: { achievements: string[] | null }) => void } = getAchievementsManager({ browserWindow: browserWindow });

	let computeAndRenderNextFrame = function ({ elapsedMicrosThisFrame }: { elapsedMicrosThisFrame: number }) {
		let currentKeyboard = getKeyboardSnapshot(gameKeyboard);
		let currentMouse = getMouseSnapshot(gameMouse);
		gameMouse.processedInputs();

		let getNextFrameFunc = gameFrame.getNextFrame;
		gameFrame = getNextFrameFunc({
			elapsedMicrosThisFrame: elapsedMicrosThisFrame,
			keyboardInput: currentKeyboard,
			mouseInput: currentMouse,
			previousKeyboardInput: previousGameKeyboard,
			previousMouseInput: previousGameMouse,
			displayProcessing: display,
			soundOutput: soundOutput,
			musicOutput: musicOutput,
			thisFrame: gameFrame
		});
		soundOutput.processFrame({ elapsedMicrosThisFrame: elapsedMicrosThisFrame });
		musicOutput.processFrame({ elapsedMicrosThisFrame: elapsedMicrosThisFrame });
		clearCanvasManager.clearCanvas();
		gameFrame.render(display);

		let achievements = gameFrame.getCompletedAchievements !== null ? gameFrame.getCompletedAchievements() : null;

		achievementsManager.addAchievements({ achievements: achievements });

		clickUrl = gameFrame.getClickUrl !== null ? gameFrame.getClickUrl() : null;

		previousGameKeyboard = currentKeyboard;
		previousGameMouse = currentMouse;
	};

	let renderError = function ({ errorMessage }: { errorMessage: string }): void {

		canvasResizing.cancelCanvasResizing();

		display.drawRectangle(
			0,
			0,
			display.getCanvasWidth(),
			display.getCanvasHeight(),
			white,
			true);

		display.tryDrawText(
			10,
			display.getCanvasHeight() - 50,
			errorMessage,
			GameFont.Roboto,
			20,
			black);
	};

	return {
		computeAndRenderNextFrame,
		renderError
	};
};

export { getGameManager };
