
import { IMouse } from "./IMouse.js";

let getTranslatedMouse = function (mouseInput: IMouse, xOffsetInPixels: number, yOffsetInPixels: number): IMouse {
	return {
		isLeftMouseButtonPressed: function () { return mouseInput.isLeftMouseButtonPressed(); },
		isRightMouseButtonPressed: function () { return mouseInput.isRightMouseButtonPressed(); },
		getX: function () { return mouseInput.getX() - xOffsetInPixels; },
		getY: function () { return mouseInput.getY() - yOffsetInPixels; }
	};
};

export { getTranslatedMouse };
