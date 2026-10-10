
const enum GameImage {
	SoundOn_Black,
	SoundOff_Black,
	SoundOn_White,
	SoundOff_White,
	MusicOn_Black,
	MusicOff_Black,
	MusicOn_White,
	MusicOff_White,
	WhitePawn,
	WhiteRook,
	WhiteKnight,
	WhiteBishop,
	WhiteQueen,
	WhiteKing,
	BlackPawn,
	BlackRook,
	BlackKnight,
	BlackBishop,
	BlackQueen,
	BlackKing
}

let getImageNames = function (): GameImage[] {
	return [
		GameImage.SoundOn_Black,
		GameImage.SoundOff_Black,
		GameImage.SoundOn_White,
		GameImage.SoundOff_White,
		GameImage.MusicOn_Black,
		GameImage.MusicOff_Black,
		GameImage.MusicOn_White,
		GameImage.MusicOff_White,
		GameImage.WhitePawn,
		GameImage.WhiteRook,
		GameImage.WhiteKnight,
		GameImage.WhiteBishop,
		GameImage.WhiteQueen,
		GameImage.WhiteKing,
		GameImage.BlackPawn,
		GameImage.BlackRook,
		GameImage.BlackKnight,
		GameImage.BlackBishop,
		GameImage.BlackQueen,
		GameImage.BlackKing
	];
};
	
let getFilename = function (image: GameImage): string {
	switch (image) {
		case GameImage.SoundOn_Black: return "Kenney/SoundOn_Black.png";
		case GameImage.SoundOff_Black: return "Kenney/SoundOff_Black.png";
		case GameImage.SoundOn_White: return "Kenney/SoundOn_White.png";
		case GameImage.SoundOff_White: return "Kenney/SoundOff_White.png";
		case GameImage.MusicOn_Black: return "Kenney/MusicOn_Black.png";
		case GameImage.MusicOff_Black: return "Kenney/MusicOff_Black.png";
		case GameImage.MusicOn_White: return "Kenney/MusicOn_White.png";
		case GameImage.MusicOff_White: return "Kenney/MusicOff_White.png";
		case GameImage.WhitePawn: return "Cburnett/WhitePawn.png";
		case GameImage.WhiteRook: return "Cburnett/WhiteRook.png";
		case GameImage.WhiteKnight: return "Cburnett/WhiteKnight.png";
		case GameImage.WhiteBishop: return "Cburnett/WhiteBishop.png";
		case GameImage.WhiteQueen: return "Cburnett/WhiteQueen.png";
		case GameImage.WhiteKing: return "Cburnett/WhiteKing.png";
		case GameImage.BlackPawn: return "Cburnett/BlackPawn.png";
		case GameImage.BlackRook: return "Cburnett/BlackRook.png";
		case GameImage.BlackKnight: return "Cburnett/BlackKnight.png";
		case GameImage.BlackBishop: return "Cburnett/BlackBishop.png";
		case GameImage.BlackQueen: return "Cburnett/BlackQueen.png";
		case GameImage.BlackKing: return "Cburnett/BlackKing.png";
	}
};

export { GameImage, getImageNames, getFilename };
