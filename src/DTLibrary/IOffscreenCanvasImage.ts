
import { GameImage } from "./GameImage.js";
import { DTColor } from "./DTColor.js";
import { GameFont } from "./GameFont.js";

type IOffscreenCanvasImage = {
	clearCanvas: () => void,
	drawRectangle: (x: number, y: number, width: number, height: number, color: DTColor, fill: boolean) => void,
	drawRoundedRectangle: (x: number, y: number, width: number, height: number, radius: number | { topLeftRadius: number, topRightRadius: number, bottomLeftRadius: number, bottomRightRadius: number }, color: DTColor, fill: boolean) => void,
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
		additionalOptions: { alphaTimes100?: number } | null) => void,
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
		additionalOptions: { alphaTimes100?: number } | null) => void,
	drawText: (x: number, y: number, text: string, font: GameFont, fontSize: number, color: DTColor) => void,
	getWidth: () => number,
	getHeight: () => number,
	_getOffscreenCanvas: () => OffscreenCanvas
}

export { IOffscreenCanvasImage };
