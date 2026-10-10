
import { black, DTColor, white } from "../DTLibrary/DTColor.js";
import { GameFont } from "../DTLibrary/GameFont.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { IFrame, getNextFrame } from "../DTLibrary/IFrame.js";
import { GlobalState } from "./GlobalState.js";
import { SessionState } from "./SessionState.js";
import { IDisplayOutput, IDisplayProcessing } from "../DTLibrary/IDisplay.js";
import { IMusicOutput } from "../DTLibrary/IMusicOutput.js";
import { ISoundOutput } from "../DTLibrary/ISoundOutput.js";
import { Key } from "../DTLibrary/IKeyboard.js";
import { GameSound } from "../DTLibrary/GameSound.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
import { getChessboardUI } from "./ChessboardUI.js";
import { processMove } from "./GameState.js";
import { MoveInfo } from "./MoveInfo.js";
import { getMoveHistoryDisplay } from "./MoveHistoryDisplay.js";
import { getTranslatedDisplayOutput } from "../DTLibrary/TranslatedDisplayOutput.js";
import { getTranslatedMouse } from "../DTLibrary/TranslatedMouse.js";
import { getPausedGameFrame } from "./PausedGameFrame.js";
import { getResignConfirmationFrame } from "./ResignConfirmationFrame.js";
import { GameCompletedPanel, getGameCompletedPanel } from "./GameCompletedPanel.js";
import { getOpponentAI } from "./OpponentAI.js";
import { getResignButton } from "./ResignButton.js";
import { IMouse } from "../DTLibrary/IMouse.js";
import { Chess } from "../ChessJs/chess.js";
import { GameImage } from "../DTLibrary/GameImage.js";
import { IOffscreenCanvasImage } from "../DTLibrary/IOffscreenCanvasImage.js";

let getCustomMouse = function ({ x, y }: { x: number, y: number }): IMouse {
	return {
		isLeftMouseButtonPressed: function () { return false; },
		isRightMouseButtonPressed: function () { return false; },
		getX: function () { return x; },
		getY: function () { return y; }
	};
};

let getGameFrame = function ({ globalState, sessionState, soundOutput, musicOutput, displayProcessing }: { globalState: GlobalState, sessionState: SessionState, soundOutput: ISoundOutput, musicOutput: IMusicOutput, displayProcessing: IDisplayProcessing }): IFrame {

	let CHESSBOARD_UI_WIDTH_IN_PIXELS = 552;
	
	let chessboardUI = getChessboardUI({ boardState: sessionState.gameState!.boardState, widthInPixels: CHESSBOARD_UI_WIDTH_IN_PIXELS });
	let chessboardUIOffscreenCanvas: IOffscreenCanvasImage | null = null;
	
	let resignButton = getResignButton({ globalState: globalState, gameState: sessionState.gameState!, isLandscapeOrientation: displayProcessing.isLandscapeOrientation(), displayProcessing });

	let opponentAI = getOpponentAI({ globalState });

	let moveHistoryDisplay = getMoveHistoryDisplay();

	let gameCompletedPanel: GameCompletedPanel | null = null;

	let chessboardUI_xOffset = 0;
	let chessboardUI_yOffset = 0;

	let resignButton_xOffset = 0;
	let resignButton_yOffset = 0;

	let moveHistory_xOffset = 0;
	let moveHistory_yOffset = 0;

	let updateUI = function (displayProcessing: IDisplayProcessing) {
		let canvasWidth = displayProcessing.getCanvasWidth();
		let canvasHeight = displayProcessing.getCanvasHeight();

		if (displayProcessing.isLandscapeOrientation()) {			
			chessboardUI_xOffset = 54 + Math.floor((canvasWidth - 1000) / 2);
			chessboardUI_yOffset = canvasHeight - 39 - CHESSBOARD_UI_WIDTH_IN_PIXELS;
			
			resignButton_xOffset = chessboardUI_xOffset + CHESSBOARD_UI_WIDTH_IN_PIXELS + 20;
			resignButton_yOffset = chessboardUI_yOffset;

			moveHistory_xOffset = chessboardUI_xOffset + CHESSBOARD_UI_WIDTH_IN_PIXELS + 240;
			moveHistory_yOffset = canvasHeight - 39 - 500;
		} else {			
			chessboardUI_xOffset = 14;
			chessboardUI_yOffset = canvasHeight - 10 - CHESSBOARD_UI_WIDTH_IN_PIXELS;

			resignButton_xOffset = 14;
			resignButton_yOffset = chessboardUI_yOffset - 278;

			moveHistory_xOffset = chessboardUI_xOffset + CHESSBOARD_UI_WIDTH_IN_PIXELS + 20;
			moveHistory_yOffset = canvasHeight - 10 - 500;
		}
	};

	updateUI(displayProcessing);

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame, elapsedMicrosThisFrame }) {

		updateUI(displayProcessing);
		
		if (sessionState.gameState!.isGameCompleted && gameCompletedPanel === null) {
			gameCompletedPanel = getGameCompletedPanel({ globalState, gameState: sessionState.gameState!, displayProcessing });

			let chess = new Chess();
			for (let previousMove of sessionState.gameState!.previousMoves)
				chess.move(previousMove.moveSan);

			if (chess.isCheckmate() && (sessionState.gameState!.boardState.isPlayerWhite !== sessionState.gameState!.boardState.isWhiteTurn)) {
				globalState.saveAndLoadData.saveSessionState({ sessionState });
			}
		}

		let gameCompletedPanelResult = null;

		if (gameCompletedPanel !== null) {
			gameCompletedPanelResult = gameCompletedPanel.processFrame({ mouseInput, previousMouseInput, displayProcessing, elapsedMicrosThisFrame });

			if (gameCompletedPanelResult.wasButtonClicked) {
				soundOutput.playSound(GameSound.Click, 100);
				sessionState.gameState = null;
				globalState.saveAndLoadData.saveSessionState({ sessionState });
				return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
			}
		}

		let opponentMoveInfo: MoveInfo | null = opponentAI.processFrame({ gameState: sessionState.gameState!, elapsedMicrosThisFrame }).moveInfo;

		if (opponentMoveInfo !== null) {
			soundOutput.playSound(GameSound.Click, 100);
			sessionState.gameState = processMove({ gameState: sessionState.gameState!, moveInfo: opponentMoveInfo });
			globalState.saveAndLoadData.saveSessionState({ sessionState });
		}

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc) && !sessionState.gameState!.isGameCompleted) {
			soundOutput.playSound(GameSound.Click, 100);
			return getPausedGameFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing, underlyingFrame: thisFrame });
		}

		chessboardUI.updateBoardState({ boardState: sessionState.gameState!.boardState });
		let playerMoveInfo: MoveInfo | null = chessboardUI.processFrame({
			mouseInput:
				gameCompletedPanelResult !== null && gameCompletedPanelResult.isHoverOverPanel
					? getCustomMouse({ x: -5, y: -5 })
					: getTranslatedMouse(mouseInput, chessboardUI_xOffset, chessboardUI_yOffset),
			previousMouseInput: getTranslatedMouse(previousMouseInput, chessboardUI_xOffset, chessboardUI_yOffset),
			displayProcessing,
			soundOutput
		});

		if (playerMoveInfo !== null) {
			soundOutput.playSound(GameSound.Click, 100);
			sessionState.gameState = processMove({ gameState: sessionState.gameState!, moveInfo: playerMoveInfo });
			globalState.saveAndLoadData.saveSessionState({ sessionState });
		}

		let resignButtonProcessFrameResult = resignButton.processFrame({
			gameState: sessionState.gameState!,
			isLandscapeOrientation: displayProcessing.isLandscapeOrientation(),
			mouseInput:
				gameCompletedPanelResult !== null && gameCompletedPanelResult.isHoverOverPanel
					? getCustomMouse({ x: -5, y: -5 })
					: getTranslatedMouse(mouseInput, resignButton_xOffset, resignButton_yOffset),
			soundOutput: soundOutput
		});

		moveHistoryDisplay.setPreviousMoves({ previousMoves: sessionState.gameState!.previousMoves });
		let moveHistoryDisplayResult = moveHistoryDisplay.processFrame({
			mouseInput:
				gameCompletedPanelResult !== null && gameCompletedPanelResult.isHoverOverPanel
					? getCustomMouse({ x: -5, y: -5 })
					: getTranslatedMouse(mouseInput, moveHistory_xOffset, moveHistory_yOffset),
			isDesktop: globalState.isDesktop
		});

		if (moveHistoryDisplayResult.selectedBoardState !== null)
			chessboardUI.updateBoardState({ boardState: moveHistoryDisplayResult.selectedBoardState });
		else
			chessboardUI.updateBoardState({ boardState: sessionState.gameState!.boardState });

		if (chessboardUIOffscreenCanvas === null)
			chessboardUIOffscreenCanvas = displayProcessing.getOffscreenCanvasImage({ width: CHESSBOARD_UI_WIDTH_IN_PIXELS + 20, height: CHESSBOARD_UI_WIDTH_IN_PIXELS + 20 });
		
		chessboardUIOffscreenCanvas.clearCanvas();
		
		chessboardUI.render({
			drawRectangle: function (x: number, y: number, width: number, height: number, color: DTColor, fill: boolean) {
				if (chessboardUIOffscreenCanvas !== null)
					chessboardUIOffscreenCanvas.drawRectangle(x + 10, y + 10, width, height, color, fill);
			},
			drawText: function (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) {
				if (chessboardUIOffscreenCanvas !== null)
					chessboardUIOffscreenCanvas.drawText(x + 10, y + 10, text, font, fontSize, color);
			},
			drawImageRotatedClockwise: function (
					image: GameImage,
					imageX: number,
					imageY: number,
					imageWidth: number,
					imageHeight: number,
					x: number,
					y: number,
					degreesScaled: number,
					scalingFactorScaled: number,
					additionalOptions: { alphaTimes100?: number } | null) {
				if (chessboardUIOffscreenCanvas !== null)
					chessboardUIOffscreenCanvas.drawImageRotatedClockwise(
						image,
						imageX,
						imageY,
						imageWidth,
						imageHeight,
						x + 10,
						y + 10,
						degreesScaled,
						scalingFactorScaled,
						additionalOptions);
			}
		});
		
		if (resignButtonProcessFrameResult.clickedResignButton) {
			return getResignConfirmationFrame({ globalState, sessionState, displayProcessing, underlyingFrame: thisFrame });
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);

		if (chessboardUIOffscreenCanvas !== null)
			displayOutput.drawOffscreenCanvasImageRotatedClockwise(
				chessboardUIOffscreenCanvas,
				0,
				0,
				chessboardUIOffscreenCanvas.getWidth(),
				chessboardUIOffscreenCanvas.getHeight(),
				chessboardUI_xOffset - 10,
				chessboardUI_yOffset - 10,
				0,
				128,
				null);
		else
			chessboardUI.render(getTranslatedDisplayOutput(displayOutput, chessboardUI_xOffset, chessboardUI_yOffset));

		resignButton.render(getTranslatedDisplayOutput(displayOutput, resignButton_xOffset, resignButton_yOffset));

		moveHistoryDisplay.render(getTranslatedDisplayOutput(displayOutput, moveHistory_xOffset, moveHistory_yOffset));

		if (gameCompletedPanel !== null)
			gameCompletedPanel.render(displayOutput);
	};

	return {
		getNextFrame,
		render,
		getClickUrl: null,
		getCompletedAchievements: null
	};
};

export { getGameFrame };
