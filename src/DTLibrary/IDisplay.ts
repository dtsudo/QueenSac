
import { GameImage } from "./GameImage.js";
import { GameFont } from "./GameFont.js";
import { DTColor } from "./DTColor.js";
import { IOffscreenCanvasImage } from "./IOffscreenCanvasImage.js";

type IDisplay = IDisplayProcessing & IDisplayOutput;

type IDisplayProcessing = {
	load: () => boolean,
	getWidth: (image: GameImage) => number,
	getHeight: (image: GameImage) => number,
	getCanvasWidth: () => number,
	getCanvasHeight: () => number,
	isLandscapeOrientation: () => boolean,
	getOffscreenCanvasImage: ({ width, height }: { width: number, height: number }) => IOffscreenCanvasImage,
	getDisplaySnapshot: ({ render }: { render: (displayOutput: IDisplayOutput) => void }) => IOffscreenCanvasImage
}

type IDisplayOutput = {
	drawRectangle: (x: number, y: number, width: number, height: number, color: DTColor, fill: boolean) => void,
	drawRoundedRectangle: (x: number, y: number, width: number, height: number, radius: number | { topLeftRadius: number, topRightRadius: number, bottomLeftRadius: number, bottomRightRadius: number }, color: DTColor, fill: boolean) => void,
	drawText: (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) => void,
	tryDrawText: (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) => void,
	drawImage: (image: GameImage, x: number, y: number) => void,
	drawImageRotatedClockwise: (
			image: GameImage,
			imageX: number,
			imageY: number,
			imageWidth: number,
			imageHeight: number,
			x: number,
			y: number,
			degreesScaled: number,
			scalingFactorScaled: number,
			additionalOptions: { alphaTimes100?: number } | null)
		=> void,
	drawOffscreenCanvasImageRotatedClockwise: (
			offscreenCanvasImage: IOffscreenCanvasImage,
			imageX: number,
			imageY: number,
			imageWidth: number,
			imageHeight: number,
			x: number,
			y: number,
			degreesScaled: number,
			scalingFactorScaled: number,
			additionalOptions: { alphaTimes100?: number } | null)
		=> void,
	getWidth: (image: GameImage) => number,
	getHeight: (image: GameImage) => number,
	getCanvasWidth: () => number,
	getCanvasHeight: () => number,
	isLandscapeOrientation: () => boolean
}

export { IDisplay, IDisplayProcessing, IDisplayOutput };
