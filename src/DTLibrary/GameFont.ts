
const enum GameFont {
	SimpleFont,
	Roboto
}

let getFontNames = function (): GameFont[] {
	return [
		GameFont.SimpleFont,
		GameFont.Roboto
	];
};

let getFontFilename = function (font: GameFont): string {
	switch (font) {
		case GameFont.SimpleFont: return "Metaflop/dtsimplefont.woff";
		case GameFont.Roboto: return "Roboto/Roboto-Regular.ttf";
	}
};

export { GameFont, getFontNames, getFontFilename };
