
import { black, DTColor } from "../DTLibrary/DTColor.js";
import { GameFont } from "../DTLibrary/GameFont.js";
import { IDisplayOutput } from "../DTLibrary/IDisplay.js";
import { IMouse } from "../DTLibrary/IMouse.js";
import { getSnapshot as getMouseSnapshot } from "../DTLibrary/CopiedMouse.js";

type Button = {
	processFrame: (input: { mouseInput: IMouse }) => { wasClicked: boolean },
	render: (displayOutput: IDisplayOutput) => void,
	setX: (x: number) => void,
	setY: (y: number) => void,
	setWidth: (width: number) => void,
	setHeight: (height: number) => void,
	setText: (text: string) => void,
	setTextXOffset: (textXOffset: number) => void,
	setTextYOffset: (textYOffset: number) => void,

	getX: () => number,
	getY: () => number,
	getWidth: () => number,
	getHeight: () => number
}

type getButtonInput = {
	x: number,
	y: number,
	width: number,
	height: number,
	roundedCornerRadius: number | null,
	backgroundColor: DTColor,
	hoverColor: DTColor,
	clickColor: DTColor,
	text: string,
	textXOffset: number,
	textYOffset: number,
	font: GameFont,
	fontSize: number,
	isDesktop: boolean
}

const STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR: DTColor = { r: 235, g: 235, b: 235, alpha: 255 };
const STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR: DTColor = { r: 200, g: 200, b: 200, alpha: 255 };
const STANDARD_HOVER_COLOR: DTColor = { r: 250, g: 249, b: 200, alpha: 255 };
const STANDARD_CLICK_COLOR: DTColor = { r: 252, g: 251, b: 154, alpha: 255 };

let getButton = function ({ x, y, width, height, roundedCornerRadius, backgroundColor, hoverColor, clickColor, text, textXOffset, textYOffset, font, fontSize, isDesktop }: getButtonInput): Button {

	let previousMouseInput: IMouse | null = null;
	let isHover = false;
	let isClicked = false;

	let isMouseInRange = function (mouseInput: IMouse): boolean {
		let mouseX = mouseInput.getX();
		let mouseY = mouseInput.getY();

		return x <= mouseX
			&& mouseX <= x + width
			&& y <= mouseY
			&& mouseY <= y + height;
	};

	let processFrame = function ({ mouseInput }: { mouseInput: IMouse }) {

		let didUserClickOnButton = false;

		if (isMouseInRange(mouseInput)) {
			isHover = true;

			if (mouseInput.isLeftMouseButtonPressed() && previousMouseInput !== null && !previousMouseInput.isLeftMouseButtonPressed())
				isClicked = true;

			if (isClicked && !mouseInput.isLeftMouseButtonPressed() && previousMouseInput !== null && previousMouseInput.isLeftMouseButtonPressed())
				didUserClickOnButton = true;

		} else {
			isHover = false;
		}

		if (!mouseInput.isLeftMouseButtonPressed())
			isClicked = false;

		previousMouseInput = getMouseSnapshot(mouseInput);

		return {
			wasClicked: didUserClickOnButton
		};
	};

	let render = function (displayOutput: IDisplayOutput): void {

		let color: DTColor = backgroundColor;
		if (isHover && isDesktop)
			color = hoverColor;
		if (isClicked)
			color = clickColor;

		displayOutput.drawRoundedRectangle(
			x,
			y,
			width,
			height,
			roundedCornerRadius ?? 0,
			color,
			true);

		displayOutput.drawRoundedRectangle(
			x,
			y,
			width,
			height,
			roundedCornerRadius ?? 0,
			black,
			false);

		displayOutput.drawText(
			x + textXOffset,
			y + height - textYOffset,
			text,
			font,
			fontSize,
			black);
	};

	return {
		processFrame,
		render,
		setX: function (input) { x = input; },
		setY: function (input) { y = input; },
		setWidth: function (w) { width = w; },
		setHeight: function (h) { height = h; },
		setText: function (s) { text = s; },
		setTextXOffset: function (x) { textXOffset = x; },
		setTextYOffset: function (y) { textYOffset = y; },
		getX: function () { return x; },
		getY: function () { return y; },
		getWidth: function () { return width; },
		getHeight: function () { return height; }
	};
};

export {
	Button,
	getButtonInput,
	STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
	STANDARD_SECONDARY_BUTTON_BACKGROUND_COLOR,
	STANDARD_HOVER_COLOR,
	STANDARD_CLICK_COLOR,
	getButton
};
