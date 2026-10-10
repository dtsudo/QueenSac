
import { STOCKFISH_LOCATION_FROM_QUEEN_SACRIFICE_UCI_CHESS_ENGINE_FOLDER } from "../WebWorkerScripts.js";
import { getBestMoveFromBestMoveString } from "./queenSacrificeUciChessEngine_Util.js";

let getBaseEngineWrapper = function () {
	let baseChessEngine = new Worker(STOCKFISH_LOCATION_FROM_QUEEN_SACRIFICE_UCI_CHESS_ENGINE_FOLDER);

	let commands: { isWaiting?: boolean, fen?: string, isQuit?: boolean, searchmoves?: string[], bestMoveResolveFunction?: (value: string) => void, timeToThinkInMilliseconds?: number, quitResolveFunction?: (value: unknown) => void }[] = [];

	baseChessEngine.addEventListener("message", function (e) {
		let message: string = e.data.trim();
		
		if (message.startsWith("bestmove")) {
			if (!commands[0]!.isWaiting)
				throw new Error("Expected commands[0] to be isWaiting");
			
			let baseChessEngineBestMove = getBestMoveFromBestMoveString(message);
			
			commands[0]!.bestMoveResolveFunction!(baseChessEngineBestMove);
			commands.shift();
			setTimeout(processCommands, 0);
		}
	});

	baseChessEngine.postMessage("uci");
	baseChessEngine.postMessage("isready");
	
	let processCommands = function () {
		if (commands.length === 0)
			return;
		
		if (commands[0]!.isWaiting) 
			return;
		
		let command = commands.shift()!;
	
		if (command.fen) {
			commands.unshift({ isWaiting: true, bestMoveResolveFunction: command.bestMoveResolveFunction });
			baseChessEngine.postMessage("ucinewgame");
			baseChessEngine.postMessage("position fen " + command.fen);
			baseChessEngine.postMessage(
					"go movetime " + Math.min(command.timeToThinkInMilliseconds!, 250)
					+ (command.searchmoves && command.searchmoves.length > 0
						? " searchmoves " + command.searchmoves.join(" ")
						: "")
				);
			return;
		}
	
		if (command.isQuit) {
			baseChessEngine.postMessage("quit");
			command.quitResolveFunction!({ success: true });
			return;
		}
		
		throw new Error("Unexpected command");
	};
	
	let getBestMove = function (fen: string, timeToThinkInMilliseconds: number, searchmoves: string[]): Promise<string> {
		return new Promise((resolve, reject) => {
			commands.push({ fen: fen, timeToThinkInMilliseconds: timeToThinkInMilliseconds, searchmoves: searchmoves, bestMoveResolveFunction: resolve });
			setTimeout(processCommands, 0);
		});
	};
	
	let quit = function () {
		return new Promise((resolve, reject) => {
			commands.push({ isQuit: true, quitResolveFunction: resolve });
			setTimeout(processCommands, 0);
		});
	};
	
	return {
		getBestMove: getBestMove,
		quit: quit
	};
};

export { getBaseEngineWrapper };
