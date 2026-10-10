import { Chess } from "../ChessJs/chess.js";
import { black } from "../DTLibrary/DTColor.js";
import { getButton, STANDARD_CLICK_COLOR, STANDARD_HOVER_COLOR, STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR } from "./Button.js";
let getGameCompletedPanel = function ({ globalState, gameState, displayProcessing }) {
    let chess = new Chess();
    for (let previousMove of gameState.previousMoves)
        chess.move(previousMove.moveSan);
    if (!gameState.isGameCompleted)
        throw new Error("Expected game to be completed");
    if (!chess.isGameOver())
        throw new Error("Expected game to be completed");
    let panelWidth = 300;
    let panelHeight = 300;
    let panelX = Math.floor(displayProcessing.getCanvasWidth() / 2) - Math.floor(panelWidth / 2);
    let panelY = Math.floor(displayProcessing.getCanvasHeight() / 2) - Math.floor(panelHeight / 2);
    let previousMouseX = null;
    let previousMouseY = null;
    let elapsedMicros = 0;
    let ELAPSED_MICROS_UNTIL_PANEL_APPEARS = 1000 * 1000;
    let okButton = getButton({
        x: 0,
        y: 0,
        width: 200,
        height: 80,
        roundedCornerRadius: 10,
        backgroundColor: STANDARD_PRIMARY_BUTTON_BACKGROUND_COLOR,
        hoverColor: STANDARD_HOVER_COLOR,
        clickColor: STANDARD_CLICK_COLOR,
        text: "OK",
        textXOffset: 78,
        textYOffset: 28,
        font: 1 /* GameFont.Roboto */,
        fontSize: 32,
        isDesktop: globalState.isDesktop
    });
    let updateOkButtonUI = function () {
        okButton.setX(panelX + 50);
        okButton.setY(panelY + 50);
    };
    updateOkButtonUI();
    let processFrame = function ({ mouseInput, previousMouseInput, displayProcessing, elapsedMicrosThisFrame }) {
        if (elapsedMicros < ELAPSED_MICROS_UNTIL_PANEL_APPEARS) {
            elapsedMicros += elapsedMicrosThisFrame;
            return {
                wasButtonClicked: false,
                isHoverOverPanel: false
            };
        }
        let wasButtonClicked = okButton.processFrame({ mouseInput }).wasClicked;
        let mouseX = mouseInput.getX();
        let mouseY = mouseInput.getY();
        let isHoverOverButton = okButton.getX() <= mouseX
            && mouseX <= okButton.getX() + okButton.getWidth()
            && okButton.getY() <= mouseY
            && mouseY <= okButton.getY() + okButton.getHeight();
        let isHoverOverPanel = panelX <= mouseX
            && mouseX <= panelX + panelWidth
            && panelY <= mouseY
            && mouseY <= panelY + panelHeight;
        if (mouseInput.isLeftMouseButtonPressed() && !previousMouseInput.isLeftMouseButtonPressed() && isHoverOverPanel && !isHoverOverButton) {
            previousMouseX = mouseX;
            previousMouseY = mouseY;
        }
        if (mouseInput.isLeftMouseButtonPressed() && previousMouseX !== null) {
            let deltaX = mouseX - previousMouseX;
            let deltaY = mouseY - previousMouseY;
            panelX += deltaX;
            panelY += deltaY;
            previousMouseX = mouseX;
            previousMouseY = mouseY;
        }
        if (!mouseInput.isLeftMouseButtonPressed()) {
            previousMouseX = null;
            previousMouseY = null;
            if (panelX < 0)
                panelX = 0;
            if (panelX + panelWidth > displayProcessing.getCanvasWidth())
                panelX = displayProcessing.getCanvasWidth() - panelWidth;
            if (panelY < 0)
                panelY = 0;
            if (panelY + panelHeight > displayProcessing.getCanvasHeight())
                panelY = displayProcessing.getCanvasHeight() - panelHeight;
        }
        updateOkButtonUI();
        return {
            wasButtonClicked,
            isHoverOverPanel
        };
    };
    let render = function (displayOutput) {
        if (elapsedMicros < ELAPSED_MICROS_UNTIL_PANEL_APPEARS)
            return;
        displayOutput.drawRoundedRectangle(panelX, panelY, panelWidth, panelHeight, 10, { r: 240, g: 240, b: 240, alpha: 255 }, true);
        displayOutput.drawRoundedRectangle(panelX, panelY, panelWidth, panelHeight, 10, black, false);
        okButton.render(displayOutput);
        let gameResultLine1;
        let gameResultLine1XOffset;
        let gameResultLine1YOffset;
        let gameResultLine2;
        let gameResultLine2XOffset;
        if (chess.isCheckmate() && (gameState.boardState.isPlayerWhite === gameState.boardState.isWhiteTurn)) {
            gameResultLine1 = "Defeat!";
            gameResultLine1XOffset = 48;
            gameResultLine1YOffset = 50;
            gameResultLine2 = "";
            gameResultLine2XOffset = 0;
        }
        else if (chess.isCheckmate()) {
            gameResultLine1 = "Victory!";
            gameResultLine1XOffset = 43;
            gameResultLine1YOffset = 50;
            gameResultLine2 = "";
            gameResultLine2XOffset = 0;
        }
        else if (chess.isStalemate()) {
            gameResultLine1 = "Draw";
            gameResultLine1XOffset = 75;
            gameResultLine1YOffset = 40;
            gameResultLine2 = "by stalemate";
            gameResultLine2XOffset = 81;
        }
        else if (chess.isThreefoldRepetition()) {
            gameResultLine1 = "Draw";
            gameResultLine1XOffset = 75;
            gameResultLine1YOffset = 40;
            gameResultLine2 = "by threefold repetition";
            gameResultLine2XOffset = 33;
        }
        else if (chess.isInsufficientMaterial()) {
            gameResultLine1 = "Draw";
            gameResultLine1XOffset = 75;
            gameResultLine1YOffset = 40;
            gameResultLine2 = "by insufficient material";
            gameResultLine2XOffset = 29;
        }
        else if (chess.isDraw()) {
            gameResultLine1 = "Draw";
            gameResultLine1XOffset = 75;
            gameResultLine1YOffset = 40;
            gameResultLine2 = "by the 50-move rule";
            gameResultLine2XOffset = 45;
        }
        else {
            throw new Error("Unexpected result");
        }
        displayOutput.drawText(panelX + gameResultLine1XOffset, panelY + panelHeight - gameResultLine1YOffset, gameResultLine1, 1 /* GameFont.Roboto */, 64, black);
        displayOutput.drawText(panelX + gameResultLine2XOffset, panelY + panelHeight - gameResultLine1YOffset - 70, gameResultLine2, 1 /* GameFont.Roboto */, 24, black);
    };
    return {
        processFrame,
        render
    };
};
export { getGameCompletedPanel };
