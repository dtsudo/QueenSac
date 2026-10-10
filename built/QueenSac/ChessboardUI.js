import { Chess } from "../ChessJs/chess.js";
import { black, white } from "../DTLibrary/DTColor.js";
import { convertChessJsMoveToMoveInfo } from "./MoveInfo.js";
import { isWhite, mapPieceTypeToGameImage } from "./PieceType.js";
let getChessboardUI = function ({ boardState, widthInPixels }) {
    let mouseDownI = null;
    let mouseDownJ = null;
    let selectedI = null;
    let selectedJ = null;
    let promotionPanel = null;
    let promotionPanelMouseDown = null;
    let mouseX = 0;
    let mouseY = 0;
    let mapColumnToLetter = function (i) {
        switch (i) {
            case 0: return "a";
            case 1: return "b";
            case 2: return "c";
            case 3: return "d";
            case 4: return "e";
            case 5: return "f";
            case 6: return "g";
            case 7: return "h";
            default: throw new Error("Unrecognized column (" + i + ")");
        }
    };
    let updateBoardState = function (input) {
        boardState = input.boardState;
    };
    let updateWidthInPixels = function (input) {
        widthInPixels = input.widthInPixels;
    };
    let getWidthOfChessSquare = function () {
        return Math.floor(widthInPixels / 8);
    };
    let mapDisplayCoordinateToBoardCoordinate = function (x) {
        if (x < 0 || x >= 8)
            return x;
        if (boardState.isPlayerWhite)
            return x;
        else
            return 7 - x;
    };
    let getPromotionPanelInfo = function () {
        if (promotionPanel === null)
            throw new Error("promotionPanel cannot be null");
        let panelWidth = getWidthOfChessSquare() * 5;
        let panelHeight = Math.floor(getWidthOfChessSquare() * 3 / 2);
        let promotionPanelStartX = promotionPanel.isLeftAligned ? promotionPanel.x : (promotionPanel.x - panelWidth);
        let promotionPanelEndX = promotionPanel.isLeftAligned ? (promotionPanel.x + panelWidth) : promotionPanel.x;
        let promotionPanelStartY = promotionPanel.y - panelHeight;
        let promotionPanelEndY = promotionPanel.y;
        if (promotionPanelStartX < 0) {
            let delta = -promotionPanelStartX;
            promotionPanelStartX += delta;
            promotionPanelEndX += delta;
        }
        if (promotionPanelEndX > widthInPixels) {
            let delta = promotionPanelEndX - widthInPixels;
            promotionPanelStartX -= delta;
            promotionPanelEndX -= delta;
        }
        if (promotionPanelStartY < 0) {
            let delta = -promotionPanelStartY;
            promotionPanelStartY += delta;
            promotionPanelEndY += delta;
        }
        if (promotionPanelEndY > widthInPixels) {
            let delta = promotionPanelEndY - widthInPixels;
            promotionPanelStartY -= delta;
            promotionPanelEndY -= delta;
        }
        let gap = Math.floor(getWidthOfChessSquare() / 5);
        let promotionPanelPieces = [0 /* PromotionType.Queen */, 1 /* PromotionType.Rook */, 2 /* PromotionType.Bishop */, 3 /* PromotionType.Knight */].map((promotionType, index) => {
            return {
                promotionType: promotionType,
                x: promotionPanelStartX + gap + gap * index + getWidthOfChessSquare() * index,
                y: promotionPanelStartY + gap
            };
        });
        return {
            promotionPanelStartX,
            promotionPanelEndX,
            promotionPanelStartY,
            promotionPanelEndY,
            promotionPanelPieces
        };
    };
    let processFrame = function ({ mouseInput, previousMouseInput, displayProcessing, soundOutput }) {
        let isPlayerMove = boardState.isPlayerWhite === boardState.isWhiteTurn;
        if (!isPlayerMove) {
            promotionPanel = null;
            promotionPanelMouseDown = null;
        }
        let promotionPanelInfo = promotionPanel !== null
            ? getPromotionPanelInfo()
            : null;
        mouseX = mouseInput.getX();
        mouseY = mouseInput.getY();
        let widthOfChessSquare = getWidthOfChessSquare();
        let isMouseOverPromotionPanel = promotionPanelInfo !== null
            && promotionPanelInfo.promotionPanelStartX <= mouseX
            && mouseX <= promotionPanelInfo.promotionPanelEndX
            && promotionPanelInfo.promotionPanelStartY <= mouseY
            && mouseY <= promotionPanelInfo.promotionPanelEndY;
        let mouseOverPromotionPiece = null;
        if (promotionPanelInfo !== null) {
            for (let promo of promotionPanelInfo.promotionPanelPieces) {
                if (promo.x <= mouseX && mouseX <= promo.x + widthOfChessSquare && promo.y <= mouseY && mouseY <= promo.y + widthOfChessSquare)
                    mouseOverPromotionPiece = promo.promotionType;
            }
        }
        if (mouseInput.isLeftMouseButtonPressed() && !previousMouseInput.isLeftMouseButtonPressed()) {
            if (isMouseOverPromotionPanel) {
                mouseDownI = null;
                mouseDownJ = null;
                promotionPanelMouseDown = mouseOverPromotionPiece;
            }
            else {
                let i = Math.floor(mouseX / widthOfChessSquare);
                let j = Math.floor(mouseY / widthOfChessSquare);
                if (0 <= i && i < 8 && 0 <= j && j < 8) {
                    mouseDownI = mapDisplayCoordinateToBoardCoordinate(i);
                    mouseDownJ = mapDisplayCoordinateToBoardCoordinate(j);
                    promotionPanel = null;
                    promotionPanelMouseDown = null;
                    if (selectedI !== mouseDownI || selectedJ !== mouseDownJ) {
                        let mouseDownPiece = boardState.board[mouseDownI][mouseDownJ].pieceType;
                        if (mouseDownPiece !== null && (isWhite(mouseDownPiece) && boardState.isPlayerWhite || !isWhite(mouseDownPiece) && !boardState.isPlayerWhite)) {
                            selectedI = null;
                            selectedJ = null;
                        }
                    }
                }
            }
        }
        if (!mouseInput.isLeftMouseButtonPressed() && previousMouseInput.isLeftMouseButtonPressed()) {
            if (isMouseOverPromotionPanel) {
                if (mouseOverPromotionPiece !== null && mouseOverPromotionPiece === promotionPanelMouseDown) {
                    let chess = new Chess(boardState.fen);
                    let moves = chess.moves({ verbose: true });
                    let from = mapColumnToLetter(selectedI) + (selectedJ + 1);
                    let to = mapColumnToLetter(promotionPanel.promotionSquareI) + (promotionPanel.promotionSquareJ + 1);
                    let moveLan;
                    switch (promotionPanelMouseDown) {
                        case 0 /* PromotionType.Queen */:
                            moveLan = from + to + "q";
                            break;
                        case 1 /* PromotionType.Rook */:
                            moveLan = from + to + "r";
                            break;
                        case 2 /* PromotionType.Bishop */:
                            moveLan = from + to + "b";
                            break;
                        case 3 /* PromotionType.Knight */:
                            moveLan = from + to + "n";
                            break;
                    }
                    let move = moves.find((move) => move.lan === moveLan);
                    mouseDownI = null;
                    mouseDownJ = null;
                    selectedI = null;
                    selectedJ = null;
                    promotionPanel = null;
                    promotionPanelMouseDown = null;
                    return convertChessJsMoveToMoveInfo(move);
                }
                else {
                    mouseDownI = null;
                    mouseDownJ = null;
                    promotionPanelMouseDown = null;
                }
            }
            else {
                let i = mapDisplayCoordinateToBoardCoordinate(Math.floor(mouseX / widthOfChessSquare));
                let j = mapDisplayCoordinateToBoardCoordinate(Math.floor(mouseY / widthOfChessSquare));
                if (i === mouseDownI && j === mouseDownJ) {
                    if (selectedI === i && selectedJ === j) {
                        mouseDownI = null;
                        mouseDownJ = null;
                        selectedI = null;
                        selectedJ = null;
                        promotionPanel = null;
                        promotionPanelMouseDown = null;
                    }
                    else if (selectedI !== null && isPlayerMove) {
                        let chess = new Chess(boardState.fen);
                        let moves = chess.moves({ verbose: true });
                        let from = mapColumnToLetter(selectedI) + (selectedJ + 1);
                        let to = mapColumnToLetter(i) + (j + 1);
                        let move = moves.find((move) => move.from === from && move.to === to);
                        if (move) {
                            if (move.promotion) {
                                mouseDownI = null;
                                mouseDownJ = null;
                                promotionPanelMouseDown = null;
                                promotionPanel = {
                                    promotionSquareI: i,
                                    promotionSquareJ: j,
                                    x: mouseX,
                                    y: mouseY,
                                    isLeftAligned: true
                                };
                            }
                            else {
                                let moveInfo = {
                                    originSquareI: selectedI,
                                    originSquareJ: selectedJ,
                                    destinationSquareI: i,
                                    destinationSquareJ: j,
                                    promotion: null
                                };
                                mouseDownI = null;
                                mouseDownJ = null;
                                selectedI = null;
                                selectedJ = null;
                                promotionPanel = null;
                                promotionPanelMouseDown = null;
                                return moveInfo;
                            }
                        }
                        else {
                            mouseDownI = null;
                            mouseDownJ = null;
                            selectedI = i;
                            selectedJ = j;
                            promotionPanel = null;
                            promotionPanelMouseDown = null;
                        }
                    }
                    else {
                        mouseDownI = null;
                        mouseDownJ = null;
                        selectedI = i;
                        selectedJ = j;
                        promotionPanel = null;
                        promotionPanelMouseDown = null;
                    }
                }
                else if (mouseDownI !== null && isPlayerMove && 0 <= i && i < 8 && 0 <= j && j < 8) {
                    let chess = new Chess(boardState.fen);
                    let moves = chess.moves({ verbose: true });
                    let from = mapColumnToLetter(mouseDownI) + (mouseDownJ + 1);
                    let to = mapColumnToLetter(i) + (j + 1);
                    let move = moves.find((move) => move.from === from && move.to === to);
                    if (move) {
                        if (move.promotion) {
                            selectedI = mouseDownI;
                            selectedJ = mouseDownJ;
                            mouseDownI = null;
                            mouseDownJ = null;
                            promotionPanelMouseDown = null;
                            promotionPanel = {
                                promotionSquareI: i,
                                promotionSquareJ: j,
                                x: mouseX,
                                y: mouseY,
                                isLeftAligned: true
                            };
                        }
                        else {
                            let moveInfo = {
                                originSquareI: mouseDownI,
                                originSquareJ: mouseDownJ,
                                destinationSquareI: i,
                                destinationSquareJ: j,
                                promotion: null
                            };
                            mouseDownI = null;
                            mouseDownJ = null;
                            selectedI = null;
                            selectedJ = null;
                            promotionPanel = null;
                            promotionPanelMouseDown = null;
                            return moveInfo;
                        }
                    }
                    else {
                        mouseDownI = null;
                        mouseDownJ = null;
                        selectedI = null;
                        selectedJ = null;
                        promotionPanel = null;
                        promotionPanelMouseDown = null;
                    }
                }
                else {
                    mouseDownI = null;
                    mouseDownJ = null;
                    selectedI = null;
                    selectedJ = null;
                    promotionPanel = null;
                    promotionPanelMouseDown = null;
                }
            }
        }
        return null;
    };
    let render = function (displayOutput) {
        let widthOfChessSquare = getWidthOfChessSquare();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                displayOutput.drawRectangle(i * widthOfChessSquare, j * widthOfChessSquare, widthOfChessSquare, widthOfChessSquare, (i + j) % 2 === 0 ? { r: 166, g: 127, b: 55, alpha: 255 } : { r: 181, g: 133, b: 43, alpha: 255 }, true);
                if (selectedI === mapDisplayCoordinateToBoardCoordinate(i) && selectedJ === mapDisplayCoordinateToBoardCoordinate(j))
                    displayOutput.drawRectangle(i * widthOfChessSquare, j * widthOfChessSquare, widthOfChessSquare, widthOfChessSquare, { r: 255, g: 255, b: 255, alpha: 255 }, true);
                else if (mouseDownI === mapDisplayCoordinateToBoardCoordinate(i) && mouseDownJ === mapDisplayCoordinateToBoardCoordinate(j) && selectedI === null)
                    displayOutput.drawRectangle(i * widthOfChessSquare, j * widthOfChessSquare, widthOfChessSquare, widthOfChessSquare, { r: 255, g: 255, b: 255, alpha: 255 }, true);
                let pieceType = boardState.board[mapDisplayCoordinateToBoardCoordinate(i)][mapDisplayCoordinateToBoardCoordinate(j)].pieceType;
                if (pieceType !== null) {
                    let gameImage = mapPieceTypeToGameImage(pieceType);
                    displayOutput.drawImageRotatedClockwise(gameImage, 0, 0, 500, 500, i * widthOfChessSquare, j * widthOfChessSquare, 0, Math.floor(128 * widthOfChessSquare / 500), null);
                }
            }
        }
        if (mouseDownI !== null && mouseDownJ !== null) {
            let piece = boardState.board[mouseDownI][mouseDownJ].pieceType;
            if (piece !== null && (isWhite(piece) && boardState.isPlayerWhite || !isWhite(piece) && !boardState.isPlayerWhite)) {
                let gameImage = mapPieceTypeToGameImage(piece);
                displayOutput.drawImageRotatedClockwise(gameImage, 0, 0, 500, 500, mouseX - Math.floor(widthOfChessSquare / 2), mouseY - Math.floor(widthOfChessSquare / 2), 0, Math.floor(128 * widthOfChessSquare / 500), null);
            }
        }
        for (let i = 0; i < 8; i++) {
            displayOutput.drawText(i * widthOfChessSquare + 2, 12, mapColumnToLetter(mapDisplayCoordinateToBoardCoordinate(i)), 1 /* GameFont.Roboto */, 12, black);
        }
        for (let j = 0; j < 8; j++) {
            displayOutput.drawText(8 * widthOfChessSquare - 9, (j + 1) * widthOfChessSquare - 3, (mapDisplayCoordinateToBoardCoordinate(j) + 1).toString(), 1 /* GameFont.Roboto */, 12, black);
        }
        if (promotionPanel !== null) {
            let promotionPanelInfo = getPromotionPanelInfo();
            displayOutput.drawRectangle(promotionPanelInfo.promotionPanelStartX, promotionPanelInfo.promotionPanelStartY, promotionPanelInfo.promotionPanelEndX - promotionPanelInfo.promotionPanelStartX, promotionPanelInfo.promotionPanelEndY - promotionPanelInfo.promotionPanelStartY, white, true);
            for (let p of promotionPanelInfo.promotionPanelPieces) {
                let pieceType;
                switch (p.promotionType) {
                    case 0 /* PromotionType.Queen */:
                        pieceType = boardState.isPlayerWhite ? 4 /* PieceType.WhiteQueen */ : 10 /* PieceType.BlackQueen */;
                        break;
                    case 1 /* PromotionType.Rook */:
                        pieceType = boardState.isPlayerWhite ? 3 /* PieceType.WhiteRook */ : 9 /* PieceType.BlackRook */;
                        break;
                    case 2 /* PromotionType.Bishop */:
                        pieceType = boardState.isPlayerWhite ? 2 /* PieceType.WhiteBishop */ : 8 /* PieceType.BlackBishop */;
                        break;
                    case 3 /* PromotionType.Knight */:
                        pieceType = boardState.isPlayerWhite ? 1 /* PieceType.WhiteKnight */ : 7 /* PieceType.BlackKnight */;
                        break;
                }
                displayOutput.drawImageRotatedClockwise(mapPieceTypeToGameImage(pieceType), 0, 0, 500, 500, p.x, p.y, 0, Math.floor(128 * widthOfChessSquare / 500), null);
            }
        }
    };
    return {
        processFrame,
        render,
        updateBoardState,
        updateWidthInPixels
    };
};
export { getChessboardUI };
