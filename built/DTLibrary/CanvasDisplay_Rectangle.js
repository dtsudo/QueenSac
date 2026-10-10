import { drawRectangle_Helper, drawRoundedRectangle_Helper } from "./CanvasDisplay_Helper.js";
let getCanvasDisplayRectangle = function ({ getCurrentCanvasHeight, canvas, canvasScalingFactor }) {
    let context = null;
    let drawRectangle = function (x, y, width, height, color, fill) {
        if (context === null) {
            context = canvas.getContext("2d", { alpha: false });
            context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
        }
        drawRectangle_Helper(context, getCurrentCanvasHeight(), x, y, width, height, color, fill);
    };
    let drawRoundedRectangle = function (x, y, width, height, radius, color, fill) {
        if (context === null) {
            context = canvas.getContext("2d", { alpha: false });
            context.setTransform(canvasScalingFactor, 0, 0, canvasScalingFactor, 0, 0);
        }
        drawRoundedRectangle_Helper(context, getCurrentCanvasHeight(), x, y, width, height, radius, color, fill);
    };
    return {
        drawRectangle,
        drawRoundedRectangle
    };
};
export { getCanvasDisplayRectangle };
