
import { Chess } from "../ChessJs/chess.js";
import { ChessJsVerboseMove } from "./ChessJsVerboseMove.js";
import { GameState } from "./GameState.js";
import { GlobalState } from "./GlobalState.js";
import { convertMoveLanToMoveInfo, MoveInfo } from "./MoveInfo.js";

let getOpponentAI = function ({ globalState }: { globalState: GlobalState }) {

	const TIME_TO_THINK_IN_MILLISECONDS = 450;

	let elapsedMicros = 0;
	let isThinking = false;
	let opponentMoveLan: string | null = null;

	let processFrame = function ({ gameState, elapsedMicrosThisFrame }: { gameState: GameState, elapsedMicrosThisFrame: number }): { moveInfo: MoveInfo | null } {

		if (gameState.isGameCompleted)
			return { moveInfo: null };

		if (gameState.boardState.isPlayerWhite === gameState.boardState.isWhiteTurn)
			return { moveInfo: null };

		if (!isThinking) {
			isThinking = true;
			elapsedMicros = 0;
			opponentMoveLan = null;

			globalState.queenSacrificeUciChessEngineWrapper.getBestMove({
				previousMoves: gameState.previousMoves,
				timeToThinkInMilliseconds: TIME_TO_THINK_IN_MILLISECONDS
			}).then(result => {
				opponentMoveLan = result;
			});
		}

		elapsedMicros += elapsedMicrosThisFrame;

		if (opponentMoveLan !== null && elapsedMicros >= TIME_TO_THINK_IN_MILLISECONDS * 1000) {

			if (gameState.previousMoves.length <= 1) {
				let chess = new Chess(gameState.boardState.fen);
				let moves: ChessJsVerboseMove[] = chess.moves({ verbose: true });
				let move = moves[Math.floor(Math.random() * moves.length) % moves.length]!;
				opponentMoveLan = move.lan;
			}

			let moveInfo = convertMoveLanToMoveInfo({ moveLan: opponentMoveLan, isWhiteTurn: gameState.boardState.isWhiteTurn });
			let returnValue = { moveInfo: moveInfo };

			elapsedMicros = 0;
			isThinking = false;
			opponentMoveLan = null;

			return returnValue;
		}

		return { moveInfo: null };
	};

	return {
		processFrame
	};
};

export { getOpponentAI };
