
import { black } from "../DTLibrary/DTColor.js";
import { GameFont } from "../DTLibrary/GameFont.js";
import { IDisplayOutput } from "../DTLibrary/IDisplay.js";
import { IMouse } from "../DTLibrary/IMouse.js";
import { BoardState } from "./BoardState.js";
import { PreviousMove } from "./PreviousMove.js";

let getMoveHistoryDisplay = function () {

	let previousMoves: ReadonlyArray<PreviousMove> = [];

	let selectedIndex: number | null = null;

	let setPreviousMoves = function (input: { previousMoves: ReadonlyArray<PreviousMove> }) {
		previousMoves = input.previousMoves;
	};

	let processFrame = function ({ mouseInput, isDesktop }: { mouseInput: IMouse, isDesktop: boolean }): { selectedBoardState: BoardState | null } {

		selectedIndex = null;

		if (!isDesktop && !mouseInput.isLeftMouseButtonPressed())
			return { selectedBoardState: null };

		let mouseX = mouseInput.getX();
		let mouseY = mouseInput.getY();

		let y = 50 * 10;

		for (let i = Math.max(0, previousMoves.length - 10); i < previousMoves.length; i++) {

			if (mouseX >= 0 && mouseX <= 100 && mouseY >= y - 50 && mouseY <= y) {
				selectedIndex = i;

				if (i + 1 < previousMoves.length) 
					return { selectedBoardState: previousMoves[i + 1]!.previousBoardState };
			}

			y -= 50;
		}

		return { selectedBoardState: null };
	};

	let render = function (displayOutput: IDisplayOutput) {

		let y = 50 * 10;

		for (let i = Math.max(0, previousMoves.length - 10); i < previousMoves.length; i++) {
			displayOutput.drawRectangle(
				0,
				y - 50,
				100,
				50,
				selectedIndex === i ? { r: 238, g: 255, b: 5, alpha: 255 } : { r: 200, g: 200, b: 200, alpha: 255 },
				true);
			displayOutput.drawRectangle(
				0,
				y - 50,
				100,
				50,
				black,
				false);

			displayOutput.drawText(
				10,
				y - 17,
				previousMoves[i]!.moveSan,
				GameFont.Roboto,
				22,
				black);

			y -= 50;
		}
	};

	return {
		setPreviousMoves,
		processFrame,
		render
	};
};

export { getMoveHistoryDisplay };
