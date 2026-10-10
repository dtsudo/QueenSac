
import { GameSound } from "./GameSound.js";

type ISoundOutput = {
	loadSounds: () => boolean,
	setSoundVolume: (volume: number) => void,
	getSoundVolume: () => number,
	playSound: (sound: GameSound, volume: number) => void
}

type ISoundProcessing = {
	processFrame: (input: { elapsedMicrosThisFrame: number }) => void
}

export { ISoundOutput, ISoundProcessing };
