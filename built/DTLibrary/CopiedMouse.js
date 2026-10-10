let getSnapshot = function (mouse) {
    let isLeftMouseButtonPressed = mouse.isLeftMouseButtonPressed();
    let isRightMouseButtonPressed = mouse.isRightMouseButtonPressed();
    let x = mouse.getX();
    let y = mouse.getY();
    return {
        isLeftMouseButtonPressed: function () { return isLeftMouseButtonPressed; },
        isRightMouseButtonPressed: function () { return isRightMouseButtonPressed; },
        getX: function () { return x; },
        getY: function () { return y; }
    };
};
export { getSnapshot };
