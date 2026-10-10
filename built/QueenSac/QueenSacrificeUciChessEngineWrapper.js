import { getQueenSacrificeUciChessEngineHelper } from "./QueenSacrificeUciChessEngineHelper.js";
let getQueenSacrificeUciChessEngineWrapper = function () {
    let queenSacrificeUciChessEngineHelper = getQueenSacrificeUciChessEngineHelper();
    let getBestMove = function ({ previousMoves, timeToThinkInMilliseconds }) {
        if (!queenSacrificeUciChessEngineHelper.isIdle()) {
            queenSacrificeUciChessEngineHelper.quit();
            queenSacrificeUciChessEngineHelper = getQueenSacrificeUciChessEngineHelper();
        }
        return queenSacrificeUciChessEngineHelper.getBestMove({ previousMoves, timeToThinkInMilliseconds });
    };
    let quit = function () {
        queenSacrificeUciChessEngineHelper.quit();
    };
    return {
        getBestMove,
        quit
    };
};
export { getQueenSacrificeUciChessEngineWrapper };
