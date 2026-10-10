
import { GameImage } from "./GameImage.js";
import { IOffscreenCanvasImage } from "./IOffscreenCanvasImage.js";
import {
	drawImageRotatedClockwise_Helper,
	drawOffscreenCanvasImageRotatedClockwise_Helper,
	drawRectangle_Helper,
	drawRoundedRectangle_Helper,
	drawText_Helper
} from "./CanvasDisplay_Helper.js";
import { DTColor } from "./DTColor.js";
import { GameFont } from "./GameFont.js";

let getOffscreenCanvasImage_Helper = function ({
			width,
			height,
			canvasScalingFactor,
			imageSmoothingEnabled,
			imageDictionary,
			fontDictionary
		}: {
			width: number,
			height: number,
			canvasScalingFactor: number,
			imageSmoothingEnabled: boolean,
			imageDictionary: { [index: number]: HTMLImageElement },
			fontDictionary: { [index: number]: string }
		}): IOffscreenCanvasImage {

	let offscreenCanvas = new OffscreenCanvas(width * canvasScalingFactor, height * canvasScalingFactor);
	let offscreenCanvasContext = offscreenCanvas.getContext("2d", { alpha: true })!;
	offscreenCanvasContext.imageSmoothingEnabled = imageSmoothingEnabled;
	offscreenCanvasContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

	offscreenCanvasContext.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);

	let drawRectangle = function(x: number, y: number, w: number, h: number, color: DTColor, fill: boolean) {
		drawRectangle_Helper(
			offscreenCanvasContext,
			height,
			x,
			y,
			w,
			h,
			color,
			fill);
	};
	
	let drawRoundedRectangle = function(x: number, y: number, w: number, h: number, radius: number | { topLeftRadius: number, topRightRadius: number, bottomLeftRadius: number, bottomRightRadius: number }, color: DTColor, fill: boolean) {
		drawRoundedRectangle_Helper(
			offscreenCanvasContext,
			height,
			x,
			y,
			w,
			h,
			radius,
			color,
			fill);
	};
	
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

		drawImageRotatedClockwise_Helper(
			offscreenCanvasContext,
			height,
			canvasScalingFactor,
			imageDictionary,
			image,
			imageX,
			imageY,
			imageWidth,
			imageHeight,
			x,
			y,
			degreesScaled,
			scalingFactorScaled,
			additionalOptions);
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

		drawOffscreenCanvasImageRotatedClockwise_Helper(
			offscreenCanvasContext,
			height,
			canvasScalingFactor,
			offscreenCanvasImage,
			imageX,
			imageY,
			imageWidth,
			imageHeight,
			x,
			y,
			degreesScaled,
			scalingFactorScaled,
			additionalOptions);
	};

	let drawText = function(x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) {
		drawText_Helper(
			offscreenCanvasContext,
			height,
			fontDictionary,
			x,
			y,
			text,
			font,
			fontSize,
			color);
	};
	
	let getOffscreenCanvas = function (): OffscreenCanvas {
		return offscreenCanvas;
	};
	
	let clearCanvas = function () {
		offscreenCanvasContext.clearRect(0, 0, width, height);
	};

	return {
		clearCanvas,
		drawRectangle,
		drawRoundedRectangle,
		drawImageRotatedClockwise,
		drawOffscreenCanvasImageRotatedClockwise,
		drawText,
		getWidth: function () { return width; },
		getHeight: function () { return height; },
		_getOffscreenCanvas: getOffscreenCanvas
	};
};

export { getOffscreenCanvasImage_Helper };
