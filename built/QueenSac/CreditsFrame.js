import { black, white } from "../DTLibrary/DTColor.js";
import { getTranslatedDisplayOutput } from "../DTLibrary/TranslatedDisplayOutput.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR, STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { renderDesignAndCodingCredits } from "./CreditsFrame_DesignAndCoding.js";
import { renderFontCredits } from "./CreditsFrame_Font.js";
import { renderImagesCredits } from "./CreditsFrame_Images.js";
import { renderMusicCredits } from "./CreditsFrame_Music.js";
import { renderSoundCredits } from "./CreditsFrame_Sound.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";
let getCreditsFrame = function ({ globalState, sessionState, displayProcessing }) {
    let tabButtons = [
        { x: 20, y: 0, width: 234, height: 40, tab: 0 /* Tab.DesignAndCoding */, tabName: "Design and coding" },
        { x: 254, y: 0, width: 103, height: 40, tab: 1 /* Tab.Images */, tabName: "Images" },
        { x: 357, y: 0, width: 82, height: 40, tab: 2 /* Tab.Font */, tabName: "Font" },
        { x: 439, y: 0, width: 96, height: 40, tab: 3 /* Tab.Sound */, tabName: "Sound" },
        { x: 535, y: 0, width: 90, height: 40, tab: 4 /* Tab.Music */, tabName: "Music" }
    ];
    let selectedTab = 0 /* Tab.DesignAndCoding */;
    let hoverTab = null;
    let clickTab = null;
    let backButton = getButton({
        x: 0,
        y: 20,
        width: 200,
        height: 80,
        roundedCornerRadius: 10,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "Back",
        textXOffset: 67,
        textYOffset: 28,
        font: 0 /* GameFont.SimpleFont */,
        fontSize: 27,
        isDesktop: globalState.isDesktop
    });
    let updateUI = function (displayProcessing) {
        backButton.setX(displayProcessing.getCanvasWidth() - 220);
        for (let tabButton of tabButtons) {
            tabButton.y = displayProcessing.getCanvasHeight() - 131;
        }
    };
    updateUI(displayProcessing);
    let getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {
        updateUI(displayProcessing);
        let mouseX = mouseInput.getX();
        let mouseY = mouseInput.getY();
        hoverTab = null;
        for (let tabButton of tabButtons) {
            if (tabButton.x <= mouseX && mouseX <= tabButton.x + tabButton.width && tabButton.y <= mouseY && mouseY <= tabButton.y + tabButton.height)
                hoverTab = tabButton.tab;
        }
        if (mouseInput.isLeftMouseButtonPressed() && !previousMouseInput.isLeftMouseButtonPressed()) {
            if (hoverTab !== null)
                clickTab = hoverTab;
        }
        if (clickTab !== null && !mouseInput.isLeftMouseButtonPressed() && previousMouseInput.isLeftMouseButtonPressed()) {
            if (hoverTab !== null && hoverTab === clickTab) {
                soundOutput.playSound(0 /* GameSound.Click */, 100);
                selectedTab = clickTab;
            }
            clickTab = null;
        }
        if (keyboardInput.isPressed(45 /* Key.Esc */) && !previousKeyboardInput.isPressed(45 /* Key.Esc */)) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
        }
        let clickedBackButton = backButton.processFrame({ mouseInput }).wasClicked;
        if (clickedBackButton) {
            soundOutput.playSound(0 /* GameSound.Click */, 100);
            return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
        }
        return thisFrame;
    };
    let render = function (displayOutput) {
        displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);
        displayOutput.drawText(Math.floor(displayOutput.getCanvasWidth() / 2) - 78, displayOutput.getCanvasHeight() - 25, "Credits", 0 /* GameFont.SimpleFont */, 43, black);
        let tabContentWidth = displayOutput.getCanvasWidth() - 40;
        let tabContentHeight = displayOutput.getCanvasHeight() - 250;
        displayOutput.drawRectangle(20, 120, tabContentWidth, tabContentHeight, white, true);
        displayOutput.drawRectangle(20, 120, tabContentWidth, tabContentHeight, black, false);
        for (let tabButton of tabButtons) {
            let backgroundColor;
            if (tabButton.tab === selectedTab)
                backgroundColor = white;
            else if (clickTab !== null && clickTab === tabButton.tab)
                backgroundColor = STANDARD_CLICK_COLOR;
            else if (hoverTab !== null && hoverTab === tabButton.tab && globalState.isDesktop)
                backgroundColor = STANDARD_HOVER_COLOR;
            else
                backgroundColor = STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR;
            displayOutput.drawRectangle(tabButton.x, tabButton.y, tabButton.width, tabButton.height, backgroundColor, true);
            displayOutput.drawRectangle(tabButton.x, tabButton.y, tabButton.width, tabButton.height, black, false);
            if (selectedTab === tabButton.tab)
                displayOutput.drawRectangle(tabButton.x + 1, tabButton.y - 1, tabButton.width - 2, 3, white, true);
            displayOutput.drawText(tabButton.x + 10, tabButton.y + tabButton.height - 10, tabButton.tabName, 0 /* GameFont.SimpleFont */, 24, black);
        }
        backButton.render(displayOutput);
        let translatedDisplayOutput = getTranslatedDisplayOutput(displayOutput, 20, 120);
        if (selectedTab === 0 /* Tab.DesignAndCoding */)
            renderDesignAndCodingCredits({
                displayOutput: translatedDisplayOutput,
                width: tabContentWidth,
                height: tabContentHeight,
                buildType: globalState.buildType
            });
        if (selectedTab === 1 /* Tab.Images */)
            renderImagesCredits({
                displayOutput: translatedDisplayOutput,
                width: tabContentWidth,
                height: tabContentHeight,
                buildType: globalState.buildType
            });
        if (selectedTab === 2 /* Tab.Font */)
            renderFontCredits({
                displayOutput: translatedDisplayOutput,
                width: tabContentWidth,
                height: tabContentHeight,
                buildType: globalState.buildType
            });
        if (selectedTab === 3 /* Tab.Sound */)
            renderSoundCredits({
                displayOutput: translatedDisplayOutput,
                width: tabContentWidth,
                height: tabContentHeight,
                buildType: globalState.buildType
            });
        if (selectedTab === 4 /* Tab.Music */)
            renderMusicCredits({
                displayOutput: translatedDisplayOutput,
                width: tabContentWidth,
                height: tabContentHeight,
                buildType: globalState.buildType
            });
    };
    return {
        getNextFrame,
        render,
        getClickUrl: function () { return null; },
        getCompletedAchievements: function () { return null; }
    };
};
export { getCreditsFrame };
