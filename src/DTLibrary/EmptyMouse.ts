
import { IMouse } from "./IMouse.js";

let getEmptyMouse = function (): IMouse {
	return {
		isLeftMouseButtonPressed: function () { return false; },
		isRightMouseButtonPressed: function () { return false; },
		getX: function () { return 0; },
		getY: function () { return 0; }
	};
};

export { getEmptyMouse };
