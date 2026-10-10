
import { GameImage } from "../DTLibrary/GameImage.js";

const enum PieceType {
	WhitePawn,
	WhiteKnight,
	WhiteBishop,
	WhiteRook,
	WhiteQueen,
	WhiteKing,
	BlackPawn,
	BlackKnight,
	BlackBishop,
	BlackRook,
	BlackQueen,
	BlackKing
}

let isWhite = function (pieceType: PieceType): boolean {
	switch (pieceType) {
		case PieceType.WhitePawn: 
		case PieceType.WhiteKnight: 
		case PieceType.WhiteBishop: 
		case PieceType.WhiteRook: 
		case PieceType.WhiteQueen: 
		case PieceType.WhiteKing: 
			return true;
		case PieceType.BlackPawn: 
		case PieceType.BlackKnight: 
		case PieceType.BlackBishop: 
		case PieceType.BlackRook: 
		case PieceType.BlackQueen: 
		case PieceType.BlackKing:
			return false;
	}
};

let getPieceTypeIdFromPieceType = function (pieceType: PieceType): number {
	switch (pieceType) {
		case PieceType.WhitePawn: return 1;
		case PieceType.WhiteKnight: return 2;
		case PieceType.WhiteBishop: return 3;
		case PieceType.WhiteRook: return 4;
		case PieceType.WhiteQueen: return 5;
		case PieceType.WhiteKing: return 6;
		case PieceType.BlackPawn: return 7;
		case PieceType.BlackKnight: return 8;
		case PieceType.BlackBishop: return 9;
		case PieceType.BlackRook: return 10;
		case PieceType.BlackQueen: return 11;
		case PieceType.BlackKing: return 12;
	}
};

let getPieceTypeFromPieceTypeId = function (pieceTypeId: number): PieceType {
	switch (pieceTypeId) {
		case 1: return PieceType.WhitePawn;
		case 2: return PieceType.WhiteKnight;
		case 3: return PieceType.WhiteBishop;
		case 4: return PieceType.WhiteRook;
		case 5: return PieceType.WhiteQueen;
		case 6: return PieceType.WhiteKing;
		case 7: return PieceType.BlackPawn;
		case 8: return PieceType.BlackKnight;
		case 9: return PieceType.BlackBishop;
		case 10: return PieceType.BlackRook;
		case 11: return PieceType.BlackQueen;
		case 12: return PieceType.BlackKing;
		default: throw new Error("Unrecognized pieceTypeId");
	}
};

let mapPieceTypeToGameImage = function (pieceType: PieceType): GameImage {
	switch (pieceType) {
		case PieceType.WhitePawn: return GameImage.WhitePawn;
		case PieceType.WhiteKnight: return GameImage.WhiteKnight;
		case PieceType.WhiteBishop: return GameImage.WhiteBishop;
		case PieceType.WhiteRook: return GameImage.WhiteRook;
		case PieceType.WhiteQueen: return GameImage.WhiteQueen;
		case PieceType.WhiteKing: return GameImage.WhiteKing;
		case PieceType.BlackPawn: return GameImage.BlackPawn;
		case PieceType.BlackKnight: return GameImage.BlackKnight;
		case PieceType.BlackBishop: return GameImage.BlackBishop;
		case PieceType.BlackRook: return GameImage.BlackRook;
		case PieceType.BlackQueen: return GameImage.BlackQueen;
		case PieceType.BlackKing: return GameImage.BlackKing;
	}
};

export { PieceType, getPieceTypeIdFromPieceType, getPieceTypeFromPieceTypeId, mapPieceTypeToGameImage, isWhite };
