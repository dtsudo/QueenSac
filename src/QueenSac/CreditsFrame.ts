
import { black, DTColor, white } from "../DTLibrary/DTColor.js";
import { GameFont } from "../DTLibrary/GameFont.js";
import { GameSound } from "../DTLibrary/GameSound.js";
import { IDisplayOutput, IDisplayProcessing } from "../DTLibrary/IDisplay.js";
import { getNextFrame, IFrame } from "../DTLibrary/IFrame.js";
import { Key } from "../DTLibrary/IKeyboard.js";
import { getTranslatedDisplayOutput } from "../DTLibrary/TranslatedDisplayOutput.js";
import { Button, getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR, STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
import { renderDesignAndCodingCredits } from "./CreditsFrame_DesignAndCoding.js";
import { renderFontCredits } from "./CreditsFrame_Font.js";
import { renderImagesCredits } from "./CreditsFrame_Images.js";
import { renderMusicCredits } from "./CreditsFrame_Music.js";
import { renderSoundCredits } from "./CreditsFrame_Sound.js";
import { STANDARD_BACKGROUND_COLOR } from "./GlobalConstants.js";
import { GlobalState } from "./GlobalState.js";
import { SessionState } from "./SessionState.js";
import { getTitleScreenFrame } from "./TitleScreenFrame.js";

let getCreditsFrame = function ({ globalState, sessionState, displayProcessing }: { globalState: GlobalState, sessionState: SessionState, displayProcessing: IDisplayProcessing }): IFrame {

	const enum Tab {
		DesignAndCoding,
		Images,
		Font,
		Sound,
		Music
	}

	type TabButton = {
		x: number,
		y: number,
		width: number,
		height: number,
		tab: Tab,
		tabName: string
	}

	let tabButtons: TabButton[] = [
		{ x: 20, y: 0, width: 234, height: 40, tab: Tab.DesignAndCoding, tabName: "Design and coding" },
		{ x: 254, y: 0, width: 103, height: 40, tab: Tab.Images, tabName: "Images" },
		{ x: 357, y: 0, width: 82, height: 40, tab: Tab.Font, tabName: "Font" },
		{ x: 439, y: 0, width: 96, height: 40, tab: Tab.Sound, tabName: "Sound" },
		{ x: 535, y: 0, width: 90, height: 40, tab: Tab.Music, tabName: "Music" }
	];

	let selectedTab: Tab = Tab.DesignAndCoding;
	let hoverTab: Tab | null = null;
	let clickTab: Tab | null = null;

	let backButton: Button = getButton({
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
		font: GameFont.SimpleFont,
		fontSize: 27,
		isDesktop: globalState.isDesktop
	});		

	let updateUI = function (displayProcessing: IDisplayProcessing) {
		backButton.setX(displayProcessing.getCanvasWidth() - 220);

		for (let tabButton of tabButtons) {
			tabButton.y = displayProcessing.getCanvasHeight() - 131;
		}
	};

	updateUI(displayProcessing);

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

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
				soundOutput.playSound(GameSound.Click, 100);
				selectedTab = clickTab;
			}

			clickTab = null;
		}

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {
			soundOutput.playSound(GameSound.Click, 100);
			return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
		}

		let clickedBackButton = backButton.processFrame({ mouseInput }).wasClicked;
		if (clickedBackButton) {
			soundOutput.playSound(GameSound.Click, 100);
			return getTitleScreenFrame({ globalState, sessionState, soundOutput, musicOutput, displayProcessing });
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {

		displayOutput.drawRectangle(0, 0, displayOutput.getCanvasWidth(), displayOutput.getCanvasHeight(), STANDARD_BACKGROUND_COLOR, true);

		displayOutput.drawText(
			Math.floor(displayOutput.getCanvasWidth() / 2) - 78,
			displayOutput.getCanvasHeight() - 25,
			"Credits",
			GameFont.SimpleFont,
			43,
			black);

		let tabContentWidth = displayOutput.getCanvasWidth() - 40;
		let tabContentHeight = displayOutput.getCanvasHeight() - 250;

		displayOutput.drawRectangle(
			20,
			120,
			tabContentWidth,
			tabContentHeight,
			white,
			true);

		displayOutput.drawRectangle(
			20,
			120,
			tabContentWidth,
			tabContentHeight,
			black,
			false);

		for (let tabButton of tabButtons) {
			let backgroundColor: DTColor;

			if (tabButton.tab === selectedTab)
				backgroundColor = white;
			else if (clickTab !== null && clickTab === tabButton.tab)
				backgroundColor = STANDARD_CLICK_COLOR;
			else if (hoverTab !== null && hoverTab === tabButton.tab && globalState.isDesktop)
				backgroundColor = STANDARD_HOVER_COLOR;
			else
				backgroundColor = STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR;

			displayOutput.drawRectangle(
				tabButton.x,
				tabButton.y,
				tabButton.width,
				tabButton.height,
				backgroundColor,
				true);

			displayOutput.drawRectangle(
				tabButton.x,
				tabButton.y,
				tabButton.width,
				tabButton.height,
				black,
				false);

			if (selectedTab === tabButton.tab)
				displayOutput.drawRectangle(
					tabButton.x + 1,
					tabButton.y - 1,
					tabButton.width - 2,
					3,
					white,
					true);

			displayOutput.drawText(
				tabButton.x + 10,
				tabButton.y + tabButton.height - 10,
				tabButton.tabName,
				GameFont.SimpleFont,
				24,
				black);
		}

		backButton.render(displayOutput);

		let translatedDisplayOutput: IDisplayOutput = getTranslatedDisplayOutput(displayOutput, 20, 120);

		if (selectedTab === Tab.DesignAndCoding)
			renderDesignAndCodingCredits({
				displayOutput: translatedDisplayOutput,
				width: tabContentWidth,
				height: tabContentHeight,
				buildType: globalState.buildType
			});
		if (selectedTab === Tab.Images)
			renderImagesCredits({
				displayOutput: translatedDisplayOutput,
				width: tabContentWidth,
				height: tabContentHeight,
				buildType: globalState.buildType
			});
		if (selectedTab === Tab.Font)
			renderFontCredits({
				displayOutput: translatedDisplayOutput,
				width: tabContentWidth,
				height: tabContentHeight,
				buildType: globalState.buildType
			});
		if (selectedTab === Tab.Sound)
			renderSoundCredits({
				displayOutput: translatedDisplayOutput,
				width: tabContentWidth,
				height: tabContentHeight,
				buildType: globalState.buildType
			});
		if (selectedTab === Tab.Music)
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
