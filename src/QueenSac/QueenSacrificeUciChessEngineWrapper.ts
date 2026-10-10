
import { PreviousMove } from "./PreviousMove.js";
import { getQueenSacrificeUciChessEngineHelper, QueenSacrificeUciChessEngineHelper } from "./QueenSacrificeUciChessEngineHelper.js";

type QueenSacrificeUciChessEngineWrapper = {
	getBestMove: (input: { previousMoves: ReadonlyArray<PreviousMove>, timeToThinkInMilliseconds: number }) => Promise<string>,
	quit: () => void
}

let getQueenSacrificeUciChessEngineWrapper = function (): QueenSacrificeUciChessEngineWrapper {

	let queenSacrificeUciChessEngineHelper: QueenSacrificeUciChessEngineHelper = getQueenSacrificeUciChessEngineHelper();

	let getBestMove = function ({ previousMoves, timeToThinkInMilliseconds }: { previousMoves: ReadonlyArray<PreviousMove>, timeToThinkInMilliseconds: number }): Promise<string> {

		if (!queenSacrificeUciChessEngineHelper.isIdle()) {
			queenSacrificeUciChessEngineHelper.quit();
			queenSacrificeUciChessEngineHelper = getQueenSacrificeUciChessEngineHelper();
		}

		return queenSacrificeUciChessEngineHelper.getBestMove({ previousMoves, timeToThinkInMilliseconds });
	};

	let quit = function (): void {
		queenSacrificeUciChessEngineHelper.quit();
	};

	return {
		getBestMove,
		quit
	};
};

export { QueenSacrificeUciChessEngineWrapper, getQueenSacrificeUciChessEngineWrapper };
