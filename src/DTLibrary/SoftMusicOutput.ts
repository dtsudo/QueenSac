
import { IMusicOutput } from "./IMusicOutput.js";
import { GameMusic } from "./GameMusic.js";

let getMusicOutput = function ({ volume, underlyingMusicOutput }: { volume: number, underlyingMusicOutput: IMusicOutput }): IMusicOutput {

	let playMusic = function (music: GameMusic, v: number): void {

		let finalVolume = Math.floor(v * volume / 100);

		underlyingMusicOutput.playMusic(music, finalVolume);
	};

	return {
		loadMusic: function (): boolean { return underlyingMusicOutput.loadMusic(); },
		playMusic: playMusic,
		stopMusic: function (): void { underlyingMusicOutput.stopMusic(); },
		setMusicVolume: function (v: number): void { underlyingMusicOutput.setMusicVolume(v); },
		getMusicVolume: function (): number { return underlyingMusicOutput.getMusicVolume(); }
	};
};

export { getMusicOutput };
