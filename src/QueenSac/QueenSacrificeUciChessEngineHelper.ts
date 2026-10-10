
import { PreviousMove } from "./PreviousMove.js";
import { QUEEN_SACRIFICE_UCI_CHESS_ENGINE_LOCATION } from "../WebWorkerScripts.js";

type QueenSacrificeUciChessEngineHelper = {
	getBestMove: (input: { previousMoves: ReadonlyArray<PreviousMove>, timeToThinkInMilliseconds: number }) => Promise<string>,
	quit: () => void,
	isIdle: () => boolean
}

const enum CommandType {
	GetBestMove,
	GetBestMove_WaitingForChessEngine,
	Quit
}

type Command = {
	commandType: CommandType,
	previousMoves?: ReadonlyArray<PreviousMove>,
	timeToThinkInMilliseconds?: number,
	bestMoveResolveFunction?: (bestMove: string) => void
}

let getQueenSacrificeUciChessEngineHelper = function (): QueenSacrificeUciChessEngineHelper {
	let chessEngine = new Worker(QUEEN_SACRIFICE_UCI_CHESS_ENGINE_LOCATION, { type: "module" });

	let postMessage = function (str: string) {
		chessEngine.postMessage(str);
	};

	let commands: Command[] = [];

	let getBestMoveFromBestMoveString = function (str: string) {
		str = str.trim();

		if (!str.startsWith("bestmove")) {
			throw new Error("Expected input to start with bestmove: " + str);
		}

		let ponderIndex = str.indexOf("ponder");

		if (ponderIndex >= 0)
			str = str.substring(0, ponderIndex);

		return str.substring(8).trim();
	};

	chessEngine.addEventListener("message", function (e) {
		let message: string = e.data.trim();

		if (message.startsWith("bestmove")) {
			if (commands.length === 0)
				throw new Error("Expected commands to not be empty");

			let commandType = commands[0]!.commandType;

			if (commandType !== CommandType.GetBestMove_WaitingForChessEngine)
				throw new Error("Expected commands[0] to be GetBestMove_WaitingForChessEngine");

			let chessEngineBestMove = getBestMoveFromBestMoveString(message);
			(commands[0]!.bestMoveResolveFunction!)(chessEngineBestMove);

			commands.shift();
			setTimeout(processCommands, 0);
		}
	});

	postMessage("uci");
	postMessage("isready");

	let processCommands = function () {
		if (commands.length === 0)
			return;

		if (commands[0]!.commandType === CommandType.GetBestMove_WaitingForChessEngine)
			return;

		let command = commands.shift()!;

		if (command.commandType === CommandType.GetBestMove) {
			commands.unshift({ commandType: CommandType.GetBestMove_WaitingForChessEngine, bestMoveResolveFunction: command.bestMoveResolveFunction });
			postMessage("ucinewgame");
			if (command.previousMoves!.length > 0)
				postMessage("position startpos moves " + command.previousMoves!.map(previousMove => previousMove.moveLan).join(" "));
			else
				postMessage("position startpos");
			postMessage("go movetime " + command.timeToThinkInMilliseconds!);
			return;
		}

		if (command.commandType === CommandType.Quit) {
			postMessage("quit");
			setTimeout(function () {
				chessEngine.terminate();
			}, 10000 /* arbitrary */);
			return;
		}

		throw new Error("Unexpected command");
	};

	let getBestMove = function ({ previousMoves, timeToThinkInMilliseconds }: { previousMoves: ReadonlyArray<PreviousMove>, timeToThinkInMilliseconds: number }) {
		return new Promise((resolve: (str: string) => void, reject) => {
			commands.push({ commandType: CommandType.GetBestMove, previousMoves: [...previousMoves], timeToThinkInMilliseconds: timeToThinkInMilliseconds, bestMoveResolveFunction: resolve });
			setTimeout(processCommands, 0);
		});
	};

	let isIdle = function () {
		return commands.length === 0;
	};

	let quit = function () {
		commands.push({ commandType: CommandType.Quit });
		setTimeout(processCommands, 0);
	};

	return {
		getBestMove,
		quit,
		isIdle
	};
};

export { QueenSacrificeUciChessEngineHelper, getQueenSacrificeUciChessEngineHelper };
