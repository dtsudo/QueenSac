import { black } from "../DTLibrary/DTColor.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { getSoundAndMusicVolumePicker } from "./SoundAndMusicVolumePicker.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
import { getGameFrame } from "./GameFrame.js";
import { getInitialGameState } from "./GameState.js";
import { getTransitionAnimationFrame } from "./TransitionAnimationFrame.js";
let getInstructionsScreenFrame = function ({ globalState, sessionState, soundOutput, musicOutput, displayProcessing }) {
    let volumePicker = getSoundAndMusicVolumePicker({
        xPos: 0,
        yPos: 0,
        initialSoundVolume: soundOutput.getSoundVolume(),
        initialMusicVolume: musicOutput.getMusicVolume(),
        color: 0 /* VolumePickerColor.Black */,
        scalingFactor: globalState.isDesktop ? 1 : 2
    });
    let continueButton = getButton({
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
        font: 1 /* GameFont.Roboto */,
        fontSize: 32,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function (displayProcessing) {
        continueButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 150);
        continueButton.setY(displayProcessing.getCanvasHeight() - 590);
    };
    updateUI(displayProcessing);
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame, elapsedMicrosThisFrame }) {
        updateUI(displayProcessing);
        globalState.background.processFrame({ elapsedMicrosThisFrame });
        volumePicker.processFrame({ mouseInput, previousMouseInput });
        soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
        musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());
        globalState.saveAndLoadData.saveSoundAndMusicVolume({ soundVolume: soundOutput.getSoundVolume(), musicVolume: musicOutput.getMusicVolume() });
        let wasButtonClicked = continueButton.processFrame({ mouseInput }).wasClicked;
        if (wasButtonClicked) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            let isPlayerWhite;
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
        if (keyboardInput.isPressed(45 /* Key.Esc */) && !previousKeyboardInput.isPressed(45 /* Key.Esc */)) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
        }
        return thisFrame;
    };
    let render = function (displayOutput) {
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);
        globalState.background.render(displayOutput);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 167, displayOutput.getCanvasHeight() - 100, "Instructions", 1 /* GameFont.Roboto */, 64, black);
        volumePicker.render(displayOutput);
        continueButton.render(displayOutput);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 220, displayOutput.getCanvasHeight() - 200, "You're playing against Stockfish, the strongest \n"
            + "chess engine in the world. \n"
            + "\n"
            + "However, Stockfish has been modified so that \n"
            + "if it can play a move that allows you to capture \n"
            + "its queen, it must play such a move. \n"
            + "\n"
            + "Use this to your advantage to defeat Stockfish!", 1 /* GameFont.Roboto */, 22, black);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: null,
        getCompletedAchievements: null
    };
};
export { getInstructionsScreenFrame };
