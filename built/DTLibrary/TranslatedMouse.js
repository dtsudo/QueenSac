let getTranslatedMouse = function (mouseInput, xOffsetInPixels, yOffsetInPixels) {
    return {
        isLeftMouseButtonPressed: function () { return mouseInput.isLeftMouseButtonPressed(); },
        isRightMouseButtonPressed: function () { return mouseInput.isRightMouseButtonPressed(); },
        getX: function () { return mouseInput.getX() - xOffsetInPixels; },
        getY: function () { return mouseInput.getY() - yOffsetInPixels; }
    };
};
export { getTranslatedMouse };
