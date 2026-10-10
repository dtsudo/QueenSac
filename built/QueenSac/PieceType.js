let isWhite = function (pieceType) {
    switch (pieceType) {
        case 0 /* PieceType.WhitePawn */:
        case 1 /* PieceType.WhiteKnight */:
        case 2 /* PieceType.WhiteBishop */:
        case 3 /* PieceType.WhiteRook */:
        case 4 /* PieceType.WhiteQueen */:
        case 5 /* PieceType.WhiteKing */:
            return true;
        case 6 /* PieceType.BlackPawn */:
        case 7 /* PieceType.BlackKnight */:
        case 8 /* PieceType.BlackBishop */:
        case 9 /* PieceType.BlackRook */:
        case 10 /* PieceType.BlackQueen */:
        case 11 /* PieceType.BlackKing */:
            return false;
    }
};
let getPieceTypeIdFromPieceType = function (pieceType) {
    switch (pieceType) {
        case 0 /* PieceType.WhitePawn */: return 1;
        case 1 /* PieceType.WhiteKnight */: return 2;
        case 2 /* PieceType.WhiteBishop */: return 3;
        case 3 /* PieceType.WhiteRook */: return 4;
        case 4 /* PieceType.WhiteQueen */: return 5;
        case 5 /* PieceType.WhiteKing */: return 6;
        case 6 /* PieceType.BlackPawn */: return 7;
        case 7 /* PieceType.BlackKnight */: return 8;
        case 8 /* PieceType.BlackBishop */: return 9;
        case 9 /* PieceType.BlackRook */: return 10;
        case 10 /* PieceType.BlackQueen */: return 11;
        case 11 /* PieceType.BlackKing */: return 12;
    }
};
let getPieceTypeFromPieceTypeId = function (pieceTypeId) {
    switch (pieceTypeId) {
        case 1: return 0 /* PieceType.WhitePawn */;
        case 2: return 1 /* PieceType.WhiteKnight */;
        case 3: return 2 /* PieceType.WhiteBishop */;
        case 4: return 3 /* PieceType.WhiteRook */;
        case 5: return 4 /* PieceType.WhiteQueen */;
        case 6: return 5 /* PieceType.WhiteKing */;
        case 7: return 6 /* PieceType.BlackPawn */;
        case 8: return 7 /* PieceType.BlackKnight */;
        case 9: return 8 /* PieceType.BlackBishop */;
        case 10: return 9 /* PieceType.BlackRook */;
        case 11: return 10 /* PieceType.BlackQueen */;
        case 12: return 11 /* PieceType.BlackKing */;
        default: throw new Error("Unrecognized pieceTypeId");
    }
};
let mapPieceTypeToGameImage = function (pieceType) {
    switch (pieceType) {
        case 0 /* PieceType.WhitePawn */: return 8 /* GameImage.WhitePawn */;
        case 1 /* PieceType.WhiteKnight */: return 10 /* GameImage.WhiteKnight */;
        case 2 /* PieceType.WhiteBishop */: return 11 /* GameImage.WhiteBishop */;
        case 3 /* PieceType.WhiteRook */: return 9 /* GameImage.WhiteRook */;
        case 4 /* PieceType.WhiteQueen */: return 12 /* GameImage.WhiteQueen */;
        case 5 /* PieceType.WhiteKing */: return 13 /* GameImage.WhiteKing */;
        case 6 /* PieceType.BlackPawn */: return 14 /* GameImage.BlackPawn */;
        case 7 /* PieceType.BlackKnight */: return 16 /* GameImage.BlackKnight */;
        case 8 /* PieceType.BlackBishop */: return 17 /* GameImage.BlackBishop */;
        case 9 /* PieceType.BlackRook */: return 15 /* GameImage.BlackRook */;
        case 10 /* PieceType.BlackQueen */: return 18 /* GameImage.BlackQueen */;
        case 11 /* PieceType.BlackKing */: return 19 /* GameImage.BlackKing */;
    }
};
export { getPieceTypeIdFromPieceType, getPieceTypeFromPieceTypeId, mapPieceTypeToGameImage, isWhite };
