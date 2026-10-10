import { Chess } from "../ChessJs/chess.js";
import { getBoardSquareCoordinates } from "./BoardState.js";
let convertMoveLanToMoveInfo = function ({ moveLan, isWhiteTurn }) {
    moveLan = moveLan.trim();
    let from = getBoardSquareCoordinates(moveLan.substring(0, 2));
    let to = getBoardSquareCoordinates(moveLan.substring(2, 4));
    let promotion;
    if (moveLan.length === 5) {
        switch (moveLan.substring(4)) {
            case "r":
                promotion = isWhiteTurn ? 3 /* PieceType.WhiteRook */ : 9 /* PieceType.BlackRook */;
                break;
            case "n":
                promotion = isWhiteTurn ? 1 /* PieceType.WhiteKnight */ : 7 /* PieceType.BlackKnight */;
                break;
            case "b":
                promotion = isWhiteTurn ? 2 /* PieceType.WhiteBishop */ : 8 /* PieceType.BlackBishop */;
                break;
            case "q":
                promotion = isWhiteTurn ? 4 /* PieceType.WhiteQueen */ : 10 /* PieceType.BlackQueen */;
                break;
            default: throw new Error("Unrecognized promotion");
        }
    }
    else {
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
let convertChessJsMoveToMoveInfo = function (move) {
    let from = move.from;
    let to = move.to;
    let fromCoordinates = getBoardSquareCoordinates(from);
    let toCoordinates = getBoardSquareCoordinates(to);
    let promotion;
    let isWhite = move.color === "w";
    if (move.promotion) {
        switch (move.promotion) {
            case "r":
                promotion = isWhite ? 3 /* PieceType.WhiteRook */ : 9 /* PieceType.BlackRook */;
                break;
            case "n":
                promotion = isWhite ? 1 /* PieceType.WhiteKnight */ : 7 /* PieceType.BlackKnight */;
                break;
            case "b":
                promotion = isWhite ? 2 /* PieceType.WhiteBishop */ : 8 /* PieceType.BlackBishop */;
                break;
            case "q":
                promotion = isWhite ? 4 /* PieceType.WhiteQueen */ : 10 /* PieceType.BlackQueen */;
                break;
            default: throw new Error("Unrecognized promotion");
        }
    }
    else {
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
let getMoveSanFromMoveInfo = function ({ fen, moveInfo }) {
    let chess = new Chess(fen);
    let allMoves = chess.moves({ verbose: true });
    let move = allMoves.find(m => {
        let mInfo = convertChessJsMoveToMoveInfo(m);
        return moveInfo.originSquareI === mInfo.originSquareI
            && moveInfo.originSquareJ === mInfo.originSquareJ
            && moveInfo.destinationSquareI === mInfo.destinationSquareI
            && moveInfo.destinationSquareJ === mInfo.destinationSquareJ
            && moveInfo.promotion === mInfo.promotion;
    });
    let moveSan = move.san;
    return moveSan;
};
let getColumnName = function (i) {
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
let getMoveLanFromMoveInfo = function ({ moveInfo }) {
    let moveLan = getColumnName(moveInfo.originSquareI)
        + (moveInfo.originSquareJ + 1)
        + getColumnName(moveInfo.destinationSquareI)
        + (moveInfo.destinationSquareJ + 1);
    if (moveInfo.promotion !== null) {
        switch (moveInfo.promotion) {
            case 3 /* PieceType.WhiteRook */:
            case 9 /* PieceType.BlackRook */:
                moveLan += "r";
                break;
            case 1 /* PieceType.WhiteKnight */:
            case 7 /* PieceType.BlackKnight */:
                moveLan += "n";
                break;
            case 2 /* PieceType.WhiteBishop */:
            case 8 /* PieceType.BlackBishop */:
                moveLan += "b";
                break;
            case 4 /* PieceType.WhiteQueen */:
            case 10 /* PieceType.BlackQueen */:
                moveLan += "q";
                break;
            default:
                throw new Error("Unrecognized promotion");
        }
    }
    return moveLan;
};
let getMoves = function ({ fen }) {
    let chess = new Chess(fen);
    if (chess.isGameOver())
        return [];
    let moves = chess.moves({ verbose: true });
    return moves.map(move => convertChessJsMoveToMoveInfo(move));
};
export { getMoves, getColumnName, getMoveSanFromMoveInfo, getMoveLanFromMoveInfo, convertMoveLanToMoveInfo, convertChessJsMoveToMoveInfo };
