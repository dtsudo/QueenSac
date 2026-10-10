import { black } from "../DTLibrary/DTColor.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { getSoundAndMusicVolumePicker } from "./SoundAndMusicVolumePicker.js";
import { getCreditsFrame } from "./CreditsFrame.js";
import { getInstructionsScreenFrame } from "./InstructionsScreenFrame.js";
import { getGameFrame } from "./GameFrame.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR, STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { getCurrentVersion } from "../DTLibrary/VersionInfo.js";
import { getTransitionAnimationFrame } from "./TransitionAnimationFrame.js";
let getTitleScreenFrame = function ({ globalState, sessionState, soundOutput, musicOutput, displayProcessing }) {
    let volumePicker = getSoundAndMusicVolumePicker({
        xPos: 0,
        yPos: 0,
        initialSoundVolume: soundOutput.getSoundVolume(),
        initialMusicVolume: musicOutput.getMusicVolume(),
        color: 0 /* VolumePickerColor.Black */,
        scalingFactor: globalState.isDesktop ? 1 : 2
    });
    let startOrContinueButton = getButton({
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
        font: 1 /* GameFont.Roboto */,
        fontSize: 32,
        isDesktop: globalState.isDesktop
    });
    let creditsButton = getButton({
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
        font: 1 /* GameFont.Roboto */,
        fontSize: 20,
        isDesktop: globalState.isDesktop
    });
    let startedTransitionFrame = false;
    let updateUI = function (displayProcessing) {
        startOrContinueButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 150);
        startOrContinueButton.setY(displayProcessing.getCanvasHeight() - 400);
        startOrContinueButton.setText(sessionState.hasStarted && sessionState.gameState !== null ? "Continue" : "Start");
        startOrContinueButton.setTextXOffset(sessionState.hasStarted && sessionState.gameState !== null ? 86 : 115);
        startOrContinueButton.setTextYOffset(38);
        creditsButton.setX(displayProcessing.getCanvasWidth() - 150);
    };
    updateUI(displayProcessing);
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame, elapsedMicrosThisFrame }) {
        globalState.background.processFrame({ elapsedMicrosThisFrame });
        updateUI(displayProcessing);
        if (!startedTransitionFrame) {
            musicOutput.playMusic(0 /* GameMusic.Happy */, 100);
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
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            if (sessionState.gameState) {
                let gameFrame = getGameFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
                startedTransitionFrame = true;
                return getTransitionAnimationFrame({
                    oldFrame: thisFrame,
                    newFrame: gameFrame,
                    displayProcessing,
                    shouldKeepProcessingOldFrame: true,
                    handleOldFrameCanvasResizing: function (displayProcessing) { }
                });
            }
            else {
                return getInstructionsScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
            }
        }
        let wasCreditsButtonClicked = creditsButton.processFrame({ mouseInput }).wasClicked;
        if (wasCreditsButtonClicked) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getCreditsFrame({ globalState, sessionState, displayProcessing });
        }
        return thisFrame;
    };
    let render = function (displayOutput) {
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);
        globalState.background.render(displayOutput);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 152, displayOutput.getCanvasHeight() - 100, "Queen Sac", 1 /* GameFont.Roboto */, 64, black);
        volumePicker.render(displayOutput);
        startOrContinueButton.render(displayOutput);
        creditsButton.render(displayOutput);
        let version = getCurrentVersion().version;
        displayOutput.drawText(displayOutput.getCanvasWidth() - 55, 105, "v" + version, 1 /* GameFont.Roboto */, 20, black);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: null,
        getCompletedAchievements: null
    };
};
export { getTitleScreenFrame };
