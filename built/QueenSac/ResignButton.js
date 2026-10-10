import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
let getResignButton = function ({ globalState, gameState, isLandscapeOrientation, displayProcessing }) {
    let resignButton = getButton({
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
        font: 1 /* GameFont.Roboto */,
        fontSize: 27,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function () {
        if (isLandscapeOrientation) {
            resignButton.setX(0);
            resignButton.setY(0);
        }
        else {
            resignButton.setX(472);
            resignButton.setY(118);
        }
    };
    updateUI();
    let processFrame = function (input) {
        gameState = input.gameState;
        isLandscapeOrientation = input.isLandscapeOrientation;
        updateUI();
        let mouseInput = input.mouseInput;
        let soundOutput = input.soundOutput;
        let clickedResignButton;
        if (gameState.isGameCompleted)
            clickedResignButton = false;
        else
            clickedResignButton = resignButton.processFrame({ mouseInput }).wasClicked;
        if (clickedResignButton)
            soundOutput.playSound(0 /* GameSound.Click */, 100);
        return {
            clickedResignButton: clickedResignButton
        };
    };
    let render = function (displayOutput) {
        if (!gameState.isGameCompleted)
            resignButton.render(displayOutput);
    };
    return {
        processFrame,
        render
    };
};
export { getResignButton };
