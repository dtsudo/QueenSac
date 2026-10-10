
import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { BoardState, deserializeBoardState, serializeBoardState } from "./BoardState.js";

type PreviousMove = {
	readonly moveSan: string,
	readonly moveLan: string,
	readonly moveNumber: number,
	readonly previousBoardState: BoardState
}

let serializePreviousMove = function (previousMove: PreviousMove): number[] {

	let byteListBuilder = getByteListBuilder();

	byteListBuilder.addString(previousMove.moveSan);
	byteListBuilder.addString(previousMove.moveLan);
	byteListBuilder.addInt(previousMove.moveNumber);
	byteListBuilder.addByteList(serializeBoardState(previousMove.previousBoardState));

	let returnValue: number[] = byteListBuilder.toByteList();
	return returnValue;
};

let deserializePreviousMove = function (serializedPreviousMove: number[]): PreviousMove {

	let byteListIterator = getByteListIterator(serializedPreviousMove);

	let moveSan: string = byteListIterator.popString();
	let moveLan: string = byteListIterator.popString();
	let moveNumber: number = byteListIterator.popInt();
	let previousBoardState: BoardState = deserializeBoardState(byteListIterator.popByteList());

	if (byteListIterator.hasNextByte())
		throw new Error("Invalid serializedPreviousMove");

	return {
		moveSan,
		moveLan,
		moveNumber,
		previousBoardState
	};
};

export { PreviousMove, serializePreviousMove, deserializePreviousMove };
