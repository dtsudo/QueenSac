
import { IKeyboard, Key } from "./IKeyboard.js";

let getEmptyKeyboard = function (): IKeyboard {
	return {
		isPressed: function (key: Key) { return false; }
	};
};

export { getEmptyKeyboard };
