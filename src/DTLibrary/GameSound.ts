
const enum GameSound {
	Click
}

let getSounds = function (): GameSound[] {
	return [
		GameSound.Click
	];
};

let getSoundInfo = function (sound: GameSound): { filename: string, volume: number } {
	switch (sound) {
		case GameSound.Click:
			return {
				filename: "Kenney/click3_Modified.wav",
				volume: 0.3
			};
	}
};

export { GameSound, getSounds, getSoundInfo };
