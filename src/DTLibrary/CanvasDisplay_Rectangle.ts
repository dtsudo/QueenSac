
import { drawRectangle_Helper, drawRoundedRectangle_Helper } from "./CanvasDisplay_Helper.js";
import { DTColor } from "./DTColor.js";

let getCanvasDisplayRectangle = function ({ getCurrentCanvasHeight, canvas, canvasScalingFactor }: { getCurrentCanvasHeight: () => number, canvas: HTMLCanvasElement, canvasScalingFactor: number }) {
	let context: CanvasRenderingContext2D | null = null;

	let drawRectangle = function (x: number, y: number, width: number, height: number, color: DTColor, fill: boolean) {

		if (context === null) {
			context = canvas.getContext("2d", { alpha: false })!;
			context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
		}

		drawRectangle_Helper(
			context,
			getCurrentCanvasHeight(),
			x,
			y,
			width,
			height,
			color,
			fill);
	};

	let drawRoundedRectangle = function (x: number, y: number, width: number, height: number, radius: number | { topLeftRadius: number, topRightRadius: number, bottomLeftRadius: number, bottomRightRadius: number }, color: DTColor, fill: boolean) {

		if (context === null) {
			context = canvas.getContext("2d", { alpha: false })!;
			context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
		}

		drawRoundedRectangle_Helper(
			context,
			getCurrentCanvasHeight(),
			x,
			y,
			width,
			height,
			radius,
			color,
			fill);
	};

	return {
		drawRectangle,
		drawRoundedRectangle
	};
};

export { getCanvasDisplayRectangle };
