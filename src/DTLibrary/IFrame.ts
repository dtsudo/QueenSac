
import { IKeyboard } from "./IKeyboard.js";
import { IMouse } from "./IMouse.js";
import { IDisplayOutput, IDisplayProcessing } from "./IDisplay.js";
import { ISoundOutput } from "./ISoundOutput.js";
import { IMusicOutput } from "./IMusicOutput.js";

type getNextFrameInput = {
	elapsedMicrosThisFrame: number,
	keyboardInput: IKeyboard,
	mouseInput: IMouse,
	previousKeyboardInput: IKeyboard,
	previousMouseInput: IMouse,
	displayProcessing: IDisplayProcessing,
	soundOutput: ISoundOutput,
	musicOutput: IMusicOutput,
	thisFrame: IFrame
}

type getNextFrame = (input: getNextFrameInput) => IFrame

type IFrame = {
	getNextFrame: getNextFrame,
	render: (display: IDisplayOutput) => void,
	getClickUrl: (() => string | null) | null,
	getCompletedAchievements: (() => string[] | null) | null
}

export { getNextFrameInput, getNextFrame, IFrame };
