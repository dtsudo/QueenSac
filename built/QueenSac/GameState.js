import { Chess } from "../ChessJs/chess.js";
import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { deserializeBoardState, getInitialBoardState, getNewBoardStateAfterMove, serializeBoardState } from "./BoardState.js";
import { getMoveLanFromMoveInfo, getMoveSanFromMoveInfo } from "./MoveInfo.js";
import { deserializePreviousMove, serializePreviousMove } from "./PreviousMove.js";
let serializeGameState = function (gameState) {
    let byteListBuilder = getByteListBuilder();
    byteListBuilder.addByteList(serializeBoardState(gameState.boardState));
    byteListBuilder.addInt(gameState.previousMoves.length);
    for (let previousMove of gameState.previousMoves) {
        byteListBuilder.addByteList(serializePreviousMove(previousMove));
    }
    byteListBuilder.addBool(gameState.isGameCompleted);
    let returnValue = byteListBuilder.toByteList();
    return returnValue;
};
let deserializeGameState = function (serializedGameState) {
    let byteListIterator = getByteListIterator(serializedGameState);
    let boardState = deserializeBoardState(byteListIterator.popByteList());
    let previousMovesLength = byteListIterator.popInt();
    let previousMoves = [];
    for (let i = 0; i < previousMovesLength; i++)
        previousMoves.push(deserializePreviousMove(byteListIterator.popByteList()));
    let isGameCompleted = byteListIterator.popBool();
    if (byteListIterator.hasNextByte())
        throw new Error("Invalid serializedGameState");
    return {
        boardState,
        previousMoves,
        isGameCompleted
    };
};
let processMove = function ({ gameState, moveInfo }) {
    let newBoardState = getNewBoardStateAfterMove({ boardState: gameState.boardState, moveInfo: moveInfo });
    let newPreviousMoves = [...gameState.previousMoves];
    newPreviousMoves.push({
        moveSan: getMoveSanFromMoveInfo({ fen: gameState.boardState.fen, moveInfo: moveInfo }),
        moveLan: getMoveLanFromMoveInfo({ moveInfo: moveInfo }),
        moveNumber: Math.floor(gameState.previousMoves.length / 2) + 1,
        previousBoardState: {
            board: gameState.boardState.board,
            isWhiteTurn: gameState.boardState.isWhiteTurn,
            isPlayerWhite: gameState.boardState.isPlayerWhite,
            fen: gameState.boardState.fen
        }
    });
    let chess = new Chess();
    for (let previousMove of newPreviousMoves)
        chess.move(previousMove.moveSan);
    return {
        boardState: newBoardState,
        previousMoves: newPreviousMoves,
        isGameCompleted: chess.isGameOver()
    };
};
let getInitialGameState = function ({ isPlayerWhite }) {
    return {
        boardState: getInitialBoardState({ isPlayerWhite }),
        previousMoves: [],
        isGameCompleted: false
    };
};
export { serializeGameState, deserializeGameState, getInitialGameState, processMove };
