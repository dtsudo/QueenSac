import { black } from "../DTLibrary/DTColor.js";
import { getSoundAndMusicVolumePicker } from "./SoundAndMusicVolumePicker.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
import { getEmptyKeyboard } from "../DTLibrary/EmptyKeyboard.js";
import { getEmptyMouse } from "../DTLibrary/EmptyMouse.js";
let getPausedGameFrame = function ({ globalState, sessionState, soundOutput, musicOutput, displayProcessing, underlyingFrame }) {
    let previousCanvasWidth = null;
    let previousCanvasHeight = null;
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
        text: "Continue",
        textXOffset: 86,
        textYOffset: 38,
        font: 1 /* GameFont.Roboto */,
        fontSize: 32,
        isDesktop: globalState.isDesktop
    });
    let backToTitleScreenButton = getButton({
        x: 0,
        y: 0,
        width: 300,
        height: 100,
        roundedCornerRadius: 10,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Return to title screen",
        textXOffset: 3,
        textYOffset: 38,
        font: 1 /* GameFont.Roboto */,
        fontSize: 32,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function ({ displayProcessing, soundOutput, musicOutput }) {
        if (previousCanvasWidth === null || previousCanvasWidth !== displayProcessing.getCanvasWidth() || previousCanvasHeight !== displayProcessing.getCanvasHeight()) {
            previousCanvasWidth = displayProcessing.getCanvasWidth();
            previousCanvasHeight = displayProcessing.getCanvasHeight();
            volumePicker = getSoundAndMusicVolumePicker({
                xPos: Math.floor(displayProcessing.getCanvasWidth() / 2) - (globalState.isDesktop ? 83 : 165),
                yPos: displayProcessing.getCanvasHeight() - (globalState.isDesktop ? 260 : 310),
                initialSoundVolume: soundOutput.getSoundVolume(),
                initialMusicVolume: musicOutput.getMusicVolume(),
                color: 0 /* VolumePickerColor.Black */,
                scalingFactor: globalState.isDesktop ? 1 : 2
            });
        }
        continueButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 150);
        continueButton.setY(displayProcessing.getCanvasHeight() - 425);
        backToTitleScreenButton.setX(Math.floor(displayProcessing.getCanvasWidth() / 2) - 150);
        backToTitleScreenButton.setY(displayProcessing.getCanvasHeight() - 550);
    };
    updateUI({ displayProcessing, soundOutput, musicOutput });
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, elapsedMicrosThisFrame, thisFrame }) {
        updateUI({ displayProcessing, soundOutput, musicOutput });
        volumePicker.processFrame({ mouseInput, previousMouseInput });
        soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
        musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());
        globalState.saveAndLoadData.saveSoundAndMusicVolume({ soundVolume: soundOutput.getSoundVolume(), musicVolume: musicOutput.getMusicVolume() });
        let wasContinueButtonClicked = continueButton.processFrame({ mouseInput }).wasClicked;
        if (wasContinueButtonClicked) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return underlyingFrame;
        }
        if (keyboardInput.isPressed(45 /* Key.Esc */) && !previousKeyboardInput.isPressed(45 /* Key.Esc */)) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return underlyingFrame;
        }
        let wasBackToTitleScreenButtonClicked = backToTitleScreenButton.processFrame({ mouseInput }).wasClicked;
        if (wasBackToTitleScreenButtonClicked) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
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
    let render = function (displayOutput) {
        underlyingFrame.render(displayOutput);
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), { r: 0, g: 0, b: 0, alpha: 110 }, true);
        displayOutput.drawRoundedRectangle(Math.floor(displayOutput.getCanvasWidth() / 2) - 200, displayOutput.getCanvasHeight() - 600, 400, 500, 10, { r: 240, g: 240, b: 240, alpha: 255 }, true);
        displayOutput.drawRoundedRectangle(Math.floor(displayOutput.getCanvasWidth() / 2) - 200, displayOutput.getCanvasHeight() - 600, 400, 500, 10, black, false);
        volumePicker.render(displayOutput);
        continueButton.render(displayOutput);
        backToTitleScreenButton.render(displayOutput);
    };
    return {
        getNextFrame,
        render,
        getClickUrl: null,
        getCompletedAchievements: null
    };
};
export { getPausedGameFrame };
