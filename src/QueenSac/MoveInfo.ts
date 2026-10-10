
import { Chess } from "../ChessJs/chess.js";
import { getBoardSquareCoordinates } from "./BoardState.js";
import { ChessJsVerboseMove } from "./ChessJsVerboseMove.js";
import { PieceType } from "./PieceType.js";

type MoveInfo = {
	readonly originSquareI: number,
	readonly originSquareJ: number,
	readonly destinationSquareI: number,
	readonly destinationSquareJ: number,
	readonly promotion: PieceType | null
}

let convertMoveLanToMoveInfo = function ({ moveLan, isWhiteTurn }: { moveLan: string, isWhiteTurn: boolean }): MoveInfo {

	moveLan = moveLan.trim();

	let from = getBoardSquareCoordinates(moveLan.substring(0, 2));
	let to = getBoardSquareCoordinates(moveLan.substring(2, 4));

	let promotion: PieceType | null;
	if (moveLan.length === 5) {
		switch (moveLan.substring(4)) {
			case "r": promotion = isWhiteTurn ? PieceType.WhiteRook : PieceType.BlackRook; break;
			case "n": promotion = isWhiteTurn ? PieceType.WhiteKnight : PieceType.BlackKnight; break;
			case "b": promotion = isWhiteTurn ? PieceType.WhiteBishop : PieceType.BlackBishop; break;
			case "q": promotion = isWhiteTurn ? PieceType.WhiteQueen : PieceType.BlackQueen; break;
			default: throw new Error("Unrecognized promotion");
		}
	} else {
		promotion = null;
	}

	return {
		originSquareI: from.i,
		originSquareJ: from.j,
		destinationSquareI: to.i,
		destinationSquareJ: to.j,
		promotion: promotion
	};
};

let convertChessJsMoveToMoveInfo = function (move: ChessJsVerboseMove): MoveInfo {
	let from: string = move.from;
	let to: string = move.to;

	let fromCoordinates = getBoardSquareCoordinates(from);
	let toCoordinates = getBoardSquareCoordinates(to);

	let promotion: PieceType | null;

	let isWhite: boolean = move.color === "w";

	if (move.promotion) {
		switch (move.promotion) {
			case "r": promotion = isWhite ? PieceType.WhiteRook : PieceType.BlackRook; break;
			case "n": promotion = isWhite ? PieceType.WhiteKnight : PieceType.BlackKnight; break;
			case "b": promotion = isWhite ? PieceType.WhiteBishop : PieceType.BlackBishop; break;
			case "q": promotion = isWhite ? PieceType.WhiteQueen : PieceType.BlackQueen; break;
			default: throw new Error("Unrecognized promotion");
		}
	} else {
		promotion = null;
	}

	return {
		originSquareI: fromCoordinates.i,
		originSquareJ: fromCoordinates.j,
		destinationSquareI: toCoordinates.i,
		destinationSquareJ: toCoordinates.j,
		promotion: promotion
	};
};

let getMoveSanFromMoveInfo = function ({ fen, moveInfo }: { fen: string, moveInfo: MoveInfo }): string {
	let chess = new Chess(fen);

	let allMoves: ChessJsVerboseMove[] = chess.moves({ verbose: true });

	let move = allMoves.find(m => {

		let mInfo: MoveInfo = convertChessJsMoveToMoveInfo(m);

		return moveInfo.originSquareI === mInfo.originSquareI
			&& moveInfo.originSquareJ === mInfo.originSquareJ
			&& moveInfo.destinationSquareI === mInfo.destinationSquareI
			&& moveInfo.destinationSquareJ === mInfo.destinationSquareJ
			&& moveInfo.promotion === mInfo.promotion;
	})!;

	let moveSan: string = move.san;

	return moveSan;
};

let getColumnName = function (i: number): string {
	switch (i) {
		case 0: return "a";
		case 1: return "b";
		case 2: return "c";
		case 3: return "d";
		case 4: return "e";
		case 5: return "f";
		case 6: return "g";
		case 7: return "h";
		default: throw new Error("Unrecognized value");
	}
};

let getMoveLanFromMoveInfo = function ({ moveInfo }: { moveInfo: MoveInfo }): string {
	let moveLan = getColumnName(moveInfo.originSquareI)
		+ (moveInfo.originSquareJ + 1)
		+ getColumnName(moveInfo.destinationSquareI)
		+ (moveInfo.destinationSquareJ + 1);

	if (moveInfo.promotion !== null) {
		switch (moveInfo.promotion) {
			case PieceType.WhiteRook:
			case PieceType.BlackRook:
				moveLan += "r";
				break;
			case PieceType.WhiteKnight:
			case PieceType.BlackKnight:
				moveLan += "n";
				break;
			case PieceType.WhiteBishop:
			case PieceType.BlackBishop:
				moveLan += "b";
				break;
			case PieceType.WhiteQueen:
			case PieceType.BlackQueen:
				moveLan += "q";
				break;
			default:
				throw new Error("Unrecognized promotion");
		}
	}

	return moveLan;
};

let getMoves = function ({ fen }: { fen: string }): MoveInfo[] {
	let chess = new Chess(fen);

	if (chess.isGameOver())
		return [];

	let moves: ChessJsVerboseMove[] = chess.moves({ verbose: true });

	return moves.map(move => convertChessJsMoveToMoveInfo(move));
};

export { MoveInfo, getMoves, getColumnName, getMoveSanFromMoveInfo, getMoveLanFromMoveInfo, convertMoveLanToMoveInfo, convertChessJsMoveToMoveInfo };
