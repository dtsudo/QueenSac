import { QUEEN_SACRIFICE_UCI_CHESS_ENGINE_LOCATION } from "../WebWorkerScripts.js";
let getQueenSacrificeUciChessEngineHelper = function () {
    let chessEngine = new Worker(QUEEN_SACRIFICE_UCI_CHESS_ENGINE_LOCATION, { type: "module" });
    let postMessage = function (str) {
        chessEngine.postMessage(str);
    };
    let commands = [];
    let getBestMoveFromBestMoveString = function (str) {
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
        let message = e.data.trim();
        if (message.startsWith("bestmove")) {
            if (commands.length === 0)
                throw new Error("Expected commands to not be empty");
            let commandType = commands[0].commandType;
            if (commandType !== 1 /* CommandType.GetBestMove_WaitingForChessEngine */)
                throw new Error("Expected commands[0] to be GetBestMove_WaitingForChessEngine");
            let chessEngineBestMove = getBestMoveFromBestMoveString(message);
            (commands[0].bestMoveResolveFunction)(chessEngineBestMove);
            commands.shift();
            setTimeout(processCommands, 0);
        }
    });
    postMessage("uci");
    postMessage("isready");
    let processCommands = function () {
        if (commands.length === 0)
            return;
        if (commands[0].commandType === 1 /* CommandType.GetBestMove_WaitingForChessEngine */)
            return;
        let command = commands.shift();
        if (command.commandType === 0 /* CommandType.GetBestMove */) {
            commands.unshift({ commandType: 1 /* CommandType.GetBestMove_WaitingForChessEngine */, bestMoveResolveFunction: command.bestMoveResolveFunction });
            postMessage("ucinewgame");
            if (command.previousMoves.length > 0)
                postMessage("position startpos moves " + command.previousMoves.map(previousMove => previousMove.moveLan).join(" "));
            else
                postMessage("position startpos");
            postMessage("go movetime " + command.timeToThinkInMilliseconds);
            return;
        }
        if (command.commandType === 2 /* CommandType.Quit */) {
            postMessage("quit");
            setTimeout(function () {
                chessEngine.terminate();
            }, 10000 /* arbitrary */);
            return;
        }
        throw new Error("Unexpected command");
    };
    let getBestMove = function ({ previousMoves, timeToThinkInMilliseconds }) {
        return new Promise((resolve, reject) => {
            commands.push({ commandType: 0 /* CommandType.GetBestMove */, previousMoves: [...previousMoves], timeToThinkInMilliseconds: timeToThinkInMilliseconds, bestMoveResolveFunction: resolve });
            setTimeout(processCommands, 0);
        });
    };
    let isIdle = function () {
        return commands.length === 0;
    };
    let quit = function () {
        commands.push({ commandType: 2 /* CommandType.Quit */ });
        setTimeout(processCommands, 0);
    };
    return {
        getBestMove,
        quit,
        isIdle
    };
};
export { getQueenSacrificeUciChessEngineHelper };
