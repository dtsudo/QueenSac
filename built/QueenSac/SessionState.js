import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { deserializeGameState, serializeGameState } from "./GameState.js";
let generateInitialSessionState = function () {
    return {
        hasStarted: false,
        wasPlayerWhiteLastGame: null,
        gameState: null
    };
};
let clearSessionState = function (sessionState) {
    let newSessionState = generateInitialSessionState();
    sessionState.hasStarted = newSessionState.hasStarted;
    sessionState.wasPlayerWhiteLastGame = newSessionState.wasPlayerWhiteLastGame;
    sessionState.gameState = newSessionState.gameState;
};
let serializeSessionState = function (sessionState) {
    let byteListBuilder = getByteListBuilder();
    byteListBuilder.addBool(sessionState.hasStarted);
    byteListBuilder.addNullableBool(sessionState.wasPlayerWhiteLastGame);
    if (sessionState.gameState !== null) {
        byteListBuilder.addBool(true);
        byteListBuilder.addByteList(serializeGameState(sessionState.gameState));
    }
    else {
        byteListBuilder.addBool(false);
    }
    let returnValue = byteListBuilder.toByteList();
    return returnValue;
};
let deserializeSessionState = function (serializedSessionState, sessionState) {
    let byteListIterator = getByteListIterator(serializedSessionState);
    sessionState.hasStarted = byteListIterator.popBool();
    sessionState.wasPlayerWhiteLastGame = byteListIterator.popNullableBool();
    let hasGameState = byteListIterator.popBool();
    if (hasGameState) {
        sessionState.gameState = deserializeGameState(byteListIterator.popByteList());
    }
    else {
        sessionState.gameState = null;
    }
    if (byteListIterator.hasNextByte())
        throw new Error("Invalid serializedSessionState");
};
export { generateInitialSessionState, clearSessionState, serializeSessionState, deserializeSessionState };
