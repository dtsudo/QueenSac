
import { GameMusic } from "./GameMusic.js";

type IMusicOutput = {
	loadMusic: () => boolean,
	playMusic: (music: GameMusic, volume: number) => void,
	stopMusic: () => void,
	setMusicVolume: (volume: number) => void,
	getMusicVolume: () => number
}

type IMusicProcessing = {
	processFrame: (input: { elapsedMicrosThisFrame: number }) => void
}

export { IMusicOutput, IMusicProcessing };
