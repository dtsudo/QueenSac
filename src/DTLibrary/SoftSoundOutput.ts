
import { GameSound } from "./GameSound.js";
import { ISoundOutput } from "./ISoundOutput.js";

let getSoundOutput = function ({ volume, underlyingSoundOutput }: { volume: number, underlyingSoundOutput: ISoundOutput }): ISoundOutput {

	let playSound = function (sound: GameSound, v: number): void {

		let finalVolume = Math.floor(v * volume / 100);

		underlyingSoundOutput.playSound(sound, finalVolume);
	};

	return {
		loadSounds: function (): boolean { return underlyingSoundOutput.loadSounds(); },
		setSoundVolume: function (v: number): void { underlyingSoundOutput.setSoundVolume(v); },
		getSoundVolume: function (): number { return underlyingSoundOutput.getSoundVolume(); },
		playSound: playSound
	};
};

export { getSoundOutput };
