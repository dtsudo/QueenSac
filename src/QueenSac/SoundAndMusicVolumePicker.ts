
import { IDisplayOutput } from "../DTLibrary/IDisplay.js";
import { IMouse } from "../DTLibrary/IMouse.js";
import { getMusicVolumePicker, MusicVolumePicker } from "./MusicVolumePicker.js";
import { getSoundVolumePicker, SoundVolumePicker } from "./SoundVolumePicker.js";
import { VolumePickerColor } from "./VolumePickerColor.js";

type SoundAndMusicVolumePicker = {
	processFrame: (input: { mouseInput: IMouse, previousMouseInput: IMouse }) => void,
	getCurrentSoundVolume: () => number,
	getCurrentMusicVolume: () => number,
	render: (displayOutput: IDisplayOutput) => void
}

let getSoundAndMusicVolumePicker = function ({ xPos, yPos, initialSoundVolume, initialMusicVolume, color, scalingFactor }: { xPos: number, yPos: number, initialSoundVolume: number, initialMusicVolume: number, color: VolumePickerColor, scalingFactor: number }): SoundAndMusicVolumePicker {
	let soundVolumePicker: SoundVolumePicker = getSoundVolumePicker({ xPos: xPos, yPos: yPos + 50 * scalingFactor, initialVolume: initialSoundVolume, color: color, scalingFactor: scalingFactor });
	let musicVolumePicker: MusicVolumePicker = getMusicVolumePicker({ xPos: xPos, yPos: yPos, initialVolume: initialMusicVolume, color: color, scalingFactor: scalingFactor });

	let processFrame = function ({ mouseInput, previousMouseInput }: { mouseInput: IMouse, previousMouseInput: IMouse }) {
		soundVolumePicker.processFrame({ mouseInput: mouseInput, previousMouseInput: previousMouseInput });
		musicVolumePicker.processFrame({ mouseInput: mouseInput, previousMouseInput: previousMouseInput });
	};

	let render = function (displayOutput: IDisplayOutput) {
		soundVolumePicker.render(displayOutput);
		musicVolumePicker.render(displayOutput);
	};

	return {
		processFrame,
		getCurrentSoundVolume: function () { return soundVolumePicker.getCurrentSoundVolume(); },
		getCurrentMusicVolume: function () { return musicVolumePicker.getCurrentMusicVolume(); },
		render
	};
};

export { SoundAndMusicVolumePicker, getSoundAndMusicVolumePicker };
