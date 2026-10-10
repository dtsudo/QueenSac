
import { black, DTColor, white } from "../DTLibrary/DTColor.js";
import { GameImage } from "../DTLibrary/GameImage.js";
import { IDisplayOutput } from "../DTLibrary/IDisplay.js";
import { IMouse } from "../DTLibrary/IMouse.js";
import { VolumePickerColor } from "./VolumePickerColor.js";

type SoundVolumePicker = {
	processFrame: (input: { mouseInput: IMouse, previousMouseInput: IMouse }) => void,
	getCurrentSoundVolume: () => number,
	render: (displayOutput: IDisplayOutput) => void
}

let getSoundVolumePicker = function ({ xPos, yPos, initialVolume, color, scalingFactor }: { xPos: number, yPos: number, initialVolume: number, color: VolumePickerColor, scalingFactor: number }): SoundVolumePicker {
	let currentVolume = initialVolume;
	let unmuteVolume = currentVolume;
	let isDraggingVolumeSlider = false;

	let processFrame = function ({ mouseInput, previousMouseInput }: { mouseInput: IMouse, previousMouseInput: IMouse }) {
		let mouseX = mouseInput.getX();
		let mouseY = mouseInput.getY();

		if (mouseInput.isLeftMouseButtonPressed()
				&& !previousMouseInput.isLeftMouseButtonPressed()
				&& xPos <= mouseX
				&& mouseX <= xPos + 40 * scalingFactor
				&& yPos <= mouseY
				&& mouseY <= yPos + 50 * scalingFactor) {
			if (currentVolume === 0) {
				currentVolume = unmuteVolume === 0 ? 50 : unmuteVolume;
				unmuteVolume = currentVolume;
			} else {
				unmuteVolume = currentVolume;
				currentVolume = 0;
			}
		}

		if (mouseInput.isLeftMouseButtonPressed()
				&& !previousMouseInput.isLeftMouseButtonPressed()
				&& xPos + 50 * scalingFactor <= mouseX
				&& mouseX <= xPos + 150 * scalingFactor
				&& yPos + 10 * scalingFactor <= mouseY
				&& mouseY <= yPos + 40 * scalingFactor) {
			isDraggingVolumeSlider = true;
		}

		if (isDraggingVolumeSlider && mouseInput.isLeftMouseButtonPressed()) {
			let volume = Math.floor(Math.round(mouseX - (xPos + 50 * scalingFactor)) / scalingFactor);
			if (volume < 0)
				volume = 0;
			if (volume > 100)
				volume = 100;

			currentVolume = volume;
			unmuteVolume = currentVolume;
		}

		if (!mouseInput.isLeftMouseButtonPressed())
			isDraggingVolumeSlider = false;
	};

	let getCurrentSoundVolume = function (): number {
		return currentVolume;
	};

	let render = function (displayOutput: IDisplayOutput) {

		let gameImage: GameImage;
		let dtColor: DTColor;

		switch (color) {
			case VolumePickerColor.Black:
				gameImage = currentVolume > 0 ? GameImage.SoundOn_Black : GameImage.SoundOff_Black;
				dtColor = black;
				break;
			case VolumePickerColor.White:
				gameImage = currentVolume > 0 ? GameImage.SoundOn_White : GameImage.SoundOff_White;
				dtColor = white;
				break;
		}

		displayOutput.drawImageRotatedClockwise(
			gameImage,
			0,
			0,
			100,
			100,
			xPos,
			yPos,
			0,
			(128 / 2) * scalingFactor,
			null);

		displayOutput.drawRectangle(
			xPos + 50 * scalingFactor,
			yPos + 10 * scalingFactor,
			100 * scalingFactor + 1,
			30 * scalingFactor + 1,
			dtColor,
			false);

		if (currentVolume > 0)
			displayOutput.drawRectangle(
				xPos + 50 * scalingFactor,
				yPos + 10 * scalingFactor,
				currentVolume * scalingFactor,
				30 * scalingFactor + 1,
				dtColor,
				true);
	};

	return {
		processFrame,
		getCurrentSoundVolume,
		render
	};
};

export { SoundVolumePicker, getSoundVolumePicker };
