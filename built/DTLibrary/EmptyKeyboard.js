let getEmptyKeyboard = function () {
    return {
        isPressed: function (key) { return false; }
    };
};
export { getEmptyKeyboard };
