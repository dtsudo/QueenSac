import { getByteListBuilder, getByteListIterator } from "../DTLibrary/ByteListUtil.js";
import { deserializeBoardState, serializeBoardState } from "./BoardState.js";
let serializePreviousMove = function (previousMove) {
    let byteListBuilder = getByteListBuilder();
    byteListBuilder.addString(previousMove.moveSan);
    byteListBuilder.addString(previousMove.moveLan);
    byteListBuilder.addInt(previousMove.moveNumber);
    byteListBuilder.addByteList(serializeBoardState(previousMove.previousBoardState));
    let returnValue = byteListBuilder.toByteList();
    return returnValue;
};
let deserializePreviousMove = function (serializedPreviousMove) {
    let byteListIterator = getByteListIterator(serializedPreviousMove);
    let moveSan = byteListIterator.popString();
    let moveLan = byteListIterator.popString();
    let moveNumber = byteListIterator.popInt();
    let previousBoardState = deserializeBoardState(byteListIterator.popByteList());
    if (byteListIterator.hasNextByte())
        throw new Error("Invalid serializedPreviousMove");
    return {
        moveSan,
        moveLan,
        moveNumber,
        previousBoardState
    };
};
export { serializePreviousMove, deserializePreviousMove };
