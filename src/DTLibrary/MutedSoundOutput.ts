
import { GameSound } from "./GameSound.js";
import { ISoundOutput } from "./ISoundOutput.js";

let getSoundOutput = function (soundOutput: ISoundOutput): ISoundOutput {
	return {
		loadSounds: function () { return soundOutput.loadSounds(); },
		setSoundVolume: function (volume: number) { soundOutput.setSoundVolume(volume); },
		getSoundVolume: function () { return soundOutput.getSoundVolume(); },
		playSound: function (sound: GameSound, volume: number) { }
	};
};

export { getSoundOutput };
