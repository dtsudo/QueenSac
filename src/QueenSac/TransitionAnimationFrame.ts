
import { IFrame, getNextFrame } from "../DTLibrary/IFrame.js";
import { IDisplayOutput, IDisplayProcessing } from "../DTLibrary/IDisplay.js";
import { IOffscreenCanvasImage } from "../DTLibrary/IOffscreenCanvasImage.js";
import { getEmptyKeyboard } from "../DTLibrary/EmptyKeyboard.js";
import { getEmptyMouse } from "../DTLibrary/EmptyMouse.js";

let getTransitionAnimationFrame = function ({ 
			oldFrame,
			newFrame, 
			displayProcessing,
			shouldKeepProcessingOldFrame,
			handleOldFrameCanvasResizing
		}: {
			oldFrame: IFrame,
			newFrame: IFrame,
			displayProcessing: IDisplayProcessing,
			shouldKeepProcessingOldFrame: boolean,
			handleOldFrameCanvasResizing: (displayProcessing: IDisplayProcessing) => void
		}): IFrame {
	
	let elapsedMicros = 0;
	
	let TRANSITION_DURATION_MICROS = 500 * 1000;

	let oldFrameOffscreenCanvas: IOffscreenCanvasImage = displayProcessing.getDisplaySnapshot({ render: function (displayOutput: IDisplayOutput) { oldFrame.render(displayOutput); } });
	let newFrameOffscreenCanvas: IOffscreenCanvasImage = displayProcessing.getDisplaySnapshot({ render: function (displayOutput: IDisplayOutput) { newFrame.render(displayOutput); } });
	
	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, elapsedMicrosThisFrame, thisFrame }): IFrame {
		
		elapsedMicros += elapsedMicrosThisFrame;

		if (shouldKeepProcessingOldFrame)
			oldFrame = oldFrame.getNextFrame({
				elapsedMicrosThisFrame,
				keyboardInput: getEmptyKeyboard(),
				previousKeyboardInput: getEmptyKeyboard(),
				mouseInput: getEmptyMouse(),
				previousMouseInput: getEmptyMouse(),
				displayProcessing,
				soundOutput,
				musicOutput,
				thisFrame: oldFrame
			});

		handleOldFrameCanvasResizing(displayProcessing);
		
		newFrame = newFrame.getNextFrame({
			elapsedMicrosThisFrame,
			keyboardInput,
			previousKeyboardInput,
			mouseInput,
			previousMouseInput,
			displayProcessing,
			soundOutput,
			musicOutput,
			thisFrame: newFrame
		});

		oldFrameOffscreenCanvas = displayProcessing.getDisplaySnapshot({ render: function (displayOutput: IDisplayOutput) { oldFrame.render(displayOutput); } });
		newFrameOffscreenCanvas = displayProcessing.getDisplaySnapshot({ render: function (displayOutput: IDisplayOutput) { newFrame.render(displayOutput); } });
		
		if (elapsedMicros > TRANSITION_DURATION_MICROS)
			return newFrame;
		
		return thisFrame;
	};

	let render = function (display: IDisplayOutput): void {

		let percentage = Math.floor(elapsedMicros * 100 / TRANSITION_DURATION_MICROS);

		if (percentage < 0)
			percentage = 0;

		if (percentage > 100)
			percentage = 100;

		display.drawOffscreenCanvasImageRotatedClockwise(
			oldFrameOffscreenCanvas,
			0,
			0,
			oldFrameOffscreenCanvas.getWidth(),
			oldFrameOffscreenCanvas.getHeight(),
			0,
			0,
			0,
			128,
			{ alphaTimes100: 100 - percentage });

		display.drawOffscreenCanvasImageRotatedClockwise(
			newFrameOffscreenCanvas,
			0,
			0,
			newFrameOffscreenCanvas.getWidth(),
			newFrameOffscreenCanvas.getHeight(),
			0,
			0,
			0,
			128,
			{ alphaTimes100: percentage });
	};
	
	let getClickUrl = function (): string | null {
		if (newFrame.getClickUrl === null)
			return null;
		
		return newFrame.getClickUrl();
	};

	let getCompletedAchievements = function () {
		if (newFrame.getCompletedAchievements === null)
			return null;
		
		return newFrame.getCompletedAchievements();
	};

	return {
		getNextFrame,
		render,
		getClickUrl,
        getCompletedAchievements
	};
};

export { getTransitionAnimationFrame };
