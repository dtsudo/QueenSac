
import { IDisplay, IDisplayOutput } from "./IDisplay.js";
import { getCanvasDisplayRectangle } from "./CanvasDisplay_Rectangle.js";
import { getCanvasDisplayImages } from "./CanvasDisplay_Images.js";
import { getCanvasDisplayFont } from "./CanvasDisplay_Font.js";
import { GameImage } from "./GameImage.js";
import { IOffscreenCanvasImage } from "./IOffscreenCanvasImage.js";
import { DTColor } from "./DTColor.js";
import { GameFont } from "./GameFont.js";
import { getOffscreenCanvasImage_Helper } from "./OffscreenCanvasImage_Helper.js";

let getDisplay = function ({ getCurrentCanvasWidth, getCurrentCanvasHeight, imageSmoothingEnabled, canvasScalingFactor, canvas, browserDocument }: { getCurrentCanvasWidth: () => number, getCurrentCanvasHeight: () => number, imageSmoothingEnabled: boolean, canvasScalingFactor: number, canvas: HTMLCanvasElement, browserDocument: Document }): IDisplay {

	let canvasDisplayRectangle = getCanvasDisplayRectangle({
		getCurrentCanvasHeight: getCurrentCanvasHeight,
		canvas: canvas,
		canvasScalingFactor: canvasScalingFactor
	});

	let canvasDisplayImages = getCanvasDisplayImages({
		getCurrentCanvasHeight: getCurrentCanvasHeight,
		imageSmoothingEnabled: imageSmoothingEnabled,
		canvasScalingFactor: canvasScalingFactor,
		canvas: canvas
	});

	let canvasDisplayFont = getCanvasDisplayFont({
		getCurrentCanvasHeight: getCurrentCanvasHeight,
		canvas: canvas,
		canvasScalingFactor: canvasScalingFactor,
		browserDocument: browserDocument
	});

	let load = function () {
		let hasFinishedLoadingImages = canvasDisplayImages.loadImages();
		let hasFinishedLoadingFonts = canvasDisplayFont.loadFonts();

		return hasFinishedLoadingImages && hasFinishedLoadingFonts;
	};

	let getOffscreenCanvasImage = function ({
				width,
				height
			}: {
				width: number,
				height: number
			}) {

		return getOffscreenCanvasImage_Helper({
			width,
			height,
			canvasScalingFactor,
			imageSmoothingEnabled,
			imageDictionary: canvasDisplayImages.getImageDictionary(),
			fontDictionary: canvasDisplayFont.getFontDictionary()
		});
	};

	let getDisplaySnapshot = function ({ render }: { render: (displayOutput: IDisplayOutput) => void }): IOffscreenCanvasImage {

		let canvasWidth = getCurrentCanvasWidth();
		let canvasHeight = getCurrentCanvasHeight();

		let offscreenCanvas = getOffscreenCanvasImage({
			width: canvasWidth,
			height: canvasHeight
		});
		
		let drawImageRotatedClockwise = function (
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

			offscreenCanvas.drawImageRotatedClockwise(image, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions);
		};

		let drawOffscreenCanvasImageRotatedClockwise = function (
				offscreenCanvasImage: IOffscreenCanvasImage,
				imageX: number,
				imageY: number,
				imageWidth: number,
				imageHeight: number,
				x: number,
				y: number,
				degreesScaled: number,
				scalingFactorScaled: number,
				additionalOptions: { alphaTimes100?: number } | null) {

			offscreenCanvas.drawOffscreenCanvasImageRotatedClockwise(offscreenCanvasImage, imageX, imageY, imageWidth, imageHeight, x, y, degreesScaled, scalingFactorScaled, additionalOptions);
		};

		let drawRectangle = function (x: number, y: number, width: number, height: number, color: DTColor, fill: boolean) {
			offscreenCanvas.drawRectangle(x, y, width, height, color, fill);
		};

		let drawRoundedRectangle = function (x: number, y: number, width: number, height: number, radius: number | { topLeftRadius: number, topRightRadius: number, bottomLeftRadius: number, bottomRightRadius: number }, color: DTColor, fill: boolean) {
			offscreenCanvas.drawRoundedRectangle(x, y, width, height, radius, color, fill);
		};

		let drawText = function (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) {
			offscreenCanvas.drawText(x, y, text, font, fontSize, color);
		};

		let tryDrawText = function (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) {
			offscreenCanvas.drawText(x, y, text, font, fontSize, color);
		};
		
		render({
			drawRectangle,
			drawRoundedRectangle,
			drawText,
			tryDrawText,
			drawImage: function (image: GameImage, x: number, y: number) { drawImageRotatedClockwise(image, 0, 0, canvasDisplayImages.getWidth(image), canvasDisplayImages.getHeight(image), x, y, 0, 128, null); },
			drawImageRotatedClockwise,
			drawOffscreenCanvasImageRotatedClockwise,
			getWidth: canvasDisplayImages.getWidth,
			getHeight: canvasDisplayImages.getHeight,
			getCanvasWidth: function () { return canvasWidth; },
			getCanvasHeight: function () { return canvasHeight; },
			isLandscapeOrientation: function () { return canvasWidth > canvasHeight; }
		});

		return offscreenCanvas;
	};

	return {
		load,
		drawRectangle: canvasDisplayRectangle.drawRectangle,
		drawRoundedRectangle: canvasDisplayRectangle.drawRoundedRectangle,
		getWidth: canvasDisplayImages.getWidth,
		getHeight: canvasDisplayImages.getHeight,
		drawImage: canvasDisplayImages.drawImage,
		drawImageRotatedClockwise: canvasDisplayImages.drawImageRotatedClockwise,
		drawOffscreenCanvasImageRotatedClockwise: canvasDisplayImages.drawOffscreenCanvasImageRotatedClockwise,
		drawText: canvasDisplayFont.drawText,
		tryDrawText: canvasDisplayFont.tryDrawText,
		getOffscreenCanvasImage,
		getDisplaySnapshot,
		getCanvasWidth: function () { return getCurrentCanvasWidth(); },
		getCanvasHeight: function () { return getCurrentCanvasHeight(); },
		isLandscapeOrientation: function () { return getCurrentCanvasWidth() > getCurrentCanvasHeight(); }
	};
};

export { getDisplay };
