import { Chess } from "../ChessJs/chess.js";
import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { getMoveSanFromMoveInfo } from "./MoveInfo.js";
import { getPieceTypeFromPieceTypeId, getPieceTypeIdFromPieceType } from "./PieceType.js";
let serializeBoardState = function (boardState) {
    let byteListBuilder = getByteListBuilder();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let pieceType = boardState.board[i][j].pieceType;
            let pieceTypeId = pieceType !== null ? getPieceTypeIdFromPieceType(pieceType) : null;
            byteListBuilder.addNullableInt(pieceTypeId);
            byteListBuilder.addNullableInt(boardState.board[i][j].pieceId);
        }
    }
    byteListBuilder.addBool(boardState.isWhiteTurn);
    byteListBuilder.addBool(boardState.isPlayerWhite);
    byteListBuilder.addString(boardState.fen);
    let returnValue = byteListBuilder.toByteList();
    return returnValue;
};
let deserializeBoardState = function (serializedBoardState) {
    let byteListIterator = getByteListIterator(serializedBoardState);
    let board = [];
    for (let i = 0; i < 8; i++) {
        let boardColumn = [];
        for (let j = 0; j < 8; j++)
            boardColumn.push({ pieceType: null, pieceId: null });
        board.push(boardColumn);
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let pieceTypeId = byteListIterator.popNullableInt();
            let pieceType = pieceTypeId !== null ? getPieceTypeFromPieceTypeId(pieceTypeId) : null;
            let pieceId = byteListIterator.popNullableInt();
            board[i][j] = { pieceType, pieceId };
        }
    }
    let isWhiteTurn = byteListIterator.popBool();
    let isPlayerWhite = byteListIterator.popBool();
    let fen = byteListIterator.popString();
    if (byteListIterator.hasNextByte())
        throw new Error("Invalid serializedBoardState");
    return {
        board: board,
        isWhiteTurn: isWhiteTurn,
        isPlayerWhite: isPlayerWhite,
        fen: fen
    };
};
let copyBoard = function (board) {
    let newBoard = [];
    for (let i = 0; i < 8; i++) {
        let boardColumn = [];
        for (let j = 0; j < 8; j++)
            boardColumn.push({ pieceType: board[i][j].pieceType, pieceId: board[i][j].pieceId });
        newBoard.push(boardColumn);
    }
    return newBoard;
};
let getBoardSquareCoordinates = function (boardSquare) {
    let letter = boardSquare.substring(0, 1);
    let i;
    switch (letter) {
        case "a":
            i = 0;
            break;
        case "b":
            i = 1;
            break;
        case "c":
            i = 2;
            break;
        case "d":
            i = 3;
            break;
        case "e":
            i = 4;
            break;
        case "f":
            i = 5;
            break;
        case "g":
            i = 6;
            break;
        case "h":
            i = 7;
            break;
        default: throw new Error("Unrecognized letter");
    }
    let j = parseInt(boardSquare.substring(1), 10) - 1;
    return { i: i, j: j };
};
let getNewBoardStateAfterMove = function ({ boardState, moveInfo }) {
    let originalBoard = boardState.board;
    let isEnPassant = (originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ].pieceType === 0 /* PieceType.WhitePawn */ || originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ].pieceType === 6 /* PieceType.BlackPawn */)
        && moveInfo.originSquareI !== moveInfo.destinationSquareI
        && originalBoard[moveInfo.destinationSquareI][moveInfo.destinationSquareJ].pieceType === null;
    let isCastling = (originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ].pieceType === 5 /* PieceType.WhiteKing */ || originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ].pieceType === 11 /* PieceType.BlackKing */)
        && Math.abs(moveInfo.originSquareI - moveInfo.destinationSquareI) === 2;
    let newBoard = copyBoard(originalBoard);
    newBoard[moveInfo.destinationSquareI][moveInfo.destinationSquareJ] = originalBoard[moveInfo.originSquareI][moveInfo.originSquareJ];
    newBoard[moveInfo.originSquareI][moveInfo.originSquareJ] = { pieceType: null, pieceId: null };
    if (isEnPassant)
        newBoard[moveInfo.destinationSquareI][moveInfo.originSquareJ] = { pieceType: null, pieceId: null };
    if (isCastling) {
        if (moveInfo.destinationSquareI === 2) {
            newBoard[3][moveInfo.destinationSquareJ] = originalBoard[0][moveInfo.destinationSquareJ];
            newBoard[0][moveInfo.destinationSquareJ] = { pieceType: null, pieceId: null };
        }
        else if (moveInfo.destinationSquareI === 6) {
            newBoard[5][moveInfo.destinationSquareJ] = originalBoard[7][moveInfo.destinationSquareJ];
            newBoard[7][moveInfo.destinationSquareJ] = { pieceType: null, pieceId: null };
        }
        else {
            throw new Error("Unrecognized castling");
        }
    }
    if (moveInfo.promotion !== null) {
        newBoard[moveInfo.destinationSquareI][moveInfo.destinationSquareJ] = {
            pieceType: moveInfo.promotion,
            pieceId: newBoard[moveInfo.destinationSquareI][moveInfo.destinationSquareJ].pieceId
        };
    }
    let moveSan = getMoveSanFromMoveInfo({ fen: boardState.fen, moveInfo: moveInfo });
    let chess = new Chess(boardState.fen);
    chess.move(moveSan);
    return {
        board: newBoard,
        isWhiteTurn: !boardState.isWhiteTurn,
        isPlayerWhite: boardState.isPlayerWhite,
        fen: chess.fen()
    };
};
let getInitialBoardState = function ({ isPlayerWhite }) {
    let board = [];
    for (let i = 0; i < 8; i++) {
        let boardColumn = [];
        for (let j = 0; j < 8; j++)
            boardColumn.push({ pieceType: null, pieceId: null });
        board.push(boardColumn);
    }
    board[0][0] = { pieceType: 3 /* PieceType.WhiteRook */, pieceId: 1 };
    board[1][0] = { pieceType: 1 /* PieceType.WhiteKnight */, pieceId: 2 };
    board[2][0] = { pieceType: 2 /* PieceType.WhiteBishop */, pieceId: 3 };
    board[3][0] = { pieceType: 4 /* PieceType.WhiteQueen */, pieceId: 4 };
    board[4][0] = { pieceType: 5 /* PieceType.WhiteKing */, pieceId: 5 };
    board[5][0] = { pieceType: 2 /* PieceType.WhiteBishop */, pieceId: 6 };
    board[6][0] = { pieceType: 1 /* PieceType.WhiteKnight */, pieceId: 7 };
    board[7][0] = { pieceType: 3 /* PieceType.WhiteRook */, pieceId: 8 };
    board[0][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 9 };
    board[1][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 10 };
    board[2][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 11 };
    board[3][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 12 };
    board[4][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 13 };
    board[5][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 14 };
    board[6][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 15 };
    board[7][1] = { pieceType: 0 /* PieceType.WhitePawn */, pieceId: 16 };
    board[0][7] = { pieceType: 9 /* PieceType.BlackRook */, pieceId: 17 };
    board[1][7] = { pieceType: 7 /* PieceType.BlackKnight */, pieceId: 18 };
    board[2][7] = { pieceType: 8 /* PieceType.BlackBishop */, pieceId: 19 };
    board[3][7] = { pieceType: 10 /* PieceType.BlackQueen */, pieceId: 20 };
    board[4][7] = { pieceType: 11 /* PieceType.BlackKing */, pieceId: 21 };
    board[5][7] = { pieceType: 8 /* PieceType.BlackBishop */, pieceId: 22 };
    board[6][7] = { pieceType: 7 /* PieceType.BlackKnight */, pieceId: 23 };
    board[7][7] = { pieceType: 9 /* PieceType.BlackRook */, pieceId: 24 };
    board[0][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 25 };
    board[1][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 26 };
    board[2][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 27 };
    board[3][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 28 };
    board[4][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 29 };
    board[5][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 30 };
    board[6][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 31 };
    board[7][6] = { pieceType: 6 /* PieceType.BlackPawn */, pieceId: 32 };
    return {
        board: board,
        isWhiteTurn: true,
        isPlayerWhite: isPlayerWhite,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    };
};
export { serializeBoardState, deserializeBoardState, copyBoard, getBoardSquareCoordinates, getInitialBoardState, getNewBoardStateAfterMove };
