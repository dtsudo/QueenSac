let getSoundOutput = function ({ volume, underlyingSoundOutput }) {
    let playSound = function (sound, v) {
        let finalVolume = Math.floor(v * volume / 100);
        underlyingSoundOutput.playSound(sound, finalVolume);
    };
    return {
        loadSounds: function () { return underlyingSoundOutput.loadSounds(); },
        setSoundVolume: function (v) { underlyingSoundOutput.setSoundVolume(v); },
        getSoundVolume: function () { return underlyingSoundOutput.getSoundVolume(); },
        playSound: playSound
    };
};
export { getSoundOutput };
