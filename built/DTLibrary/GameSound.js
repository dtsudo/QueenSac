let getSounds = function () {
    return [
        0 /* GameSound.Click */
    ];
};
let getSoundInfo = function (sound) {
    switch (sound) {
        case 0 /* GameSound.Click */:
            return {
                filename: "Kenney/click3_Modified.wav",
                volume: 0.3
            };
    }
};
export { getSounds, getSoundInfo };
