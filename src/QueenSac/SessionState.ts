
import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { deserializeGameState, GameState, serializeGameState } from "./GameState.js";

type SessionState = {
	hasStarted: boolean,
	wasPlayerWhiteLastGame: boolean | null,
	gameState: GameState | null
}

let generateInitialSessionState = function (): SessionState {

	return {
		hasStarted: false,
		wasPlayerWhiteLastGame: null,
		gameState: null
	};
};

let clearSessionState = function (sessionState: SessionState): void {
	let newSessionState = generateInitialSessionState();

	sessionState.hasStarted = newSessionState.hasStarted;
	sessionState.wasPlayerWhiteLastGame = newSessionState.wasPlayerWhiteLastGame;
	sessionState.gameState = newSessionState.gameState;
};

let serializeSessionState = function (sessionState: SessionState): number[] {

	let byteListBuilder = getByteListBuilder();

	byteListBuilder.addBool(sessionState.hasStarted);

	byteListBuilder.addNullableBool(sessionState.wasPlayerWhiteLastGame);

	if (sessionState.gameState !== null) {
		byteListBuilder.addBool(true);
		byteListBuilder.addByteList(serializeGameState(sessionState.gameState));
	} else {
		byteListBuilder.addBool(false);
	}

	let returnValue: number[] = byteListBuilder.toByteList();
	return returnValue;
};

let deserializeSessionState = function (serializedSessionState: number[], sessionState: SessionState): void {

	let byteListIterator = getByteListIterator(serializedSessionState);

	sessionState.hasStarted = byteListIterator.popBool();

	sessionState.wasPlayerWhiteLastGame = byteListIterator.popNullableBool();

	let hasGameState = byteListIterator.popBool();
	if (hasGameState) {
		sessionState.gameState = deserializeGameState(byteListIterator.popByteList());
	} else {
		sessionState.gameState = null;
	}

	if (byteListIterator.hasNextByte())
		throw new Error("Invalid serializedSessionState");
};

export { SessionState, generateInitialSessionState, clearSessionState, serializeSessionState, deserializeSessionState };
