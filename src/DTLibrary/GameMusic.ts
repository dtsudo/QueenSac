
const enum GameMusic {
	Happy
}

let getMusic = function (): GameMusic[] {
	return [
		GameMusic.Happy
	];
};

let getMusicInfo = function (music: GameMusic): { filename: string, flacFilename: string | null, volume: number } {
	switch (music) {
		case GameMusic.Happy:
			return {
				filename: "rezoner/happy.mp3",
				flacFilename: null,
				volume: 0.15
			};
	}
};

export { GameMusic, getMusic, getMusicInfo };
