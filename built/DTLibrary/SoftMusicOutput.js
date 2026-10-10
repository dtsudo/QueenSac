let getMusicOutput = function ({ volume, underlyingMusicOutput }) {
    let playMusic = function (music, v) {
        let finalVolume = Math.floor(v * volume / 100);
        underlyingMusicOutput.playMusic(music, finalVolume);
    };
    return {
        loadMusic: function () { return underlyingMusicOutput.loadMusic(); },
        playMusic: playMusic,
        stopMusic: function () { underlyingMusicOutput.stopMusic(); },
        setMusicVolume: function (v) { underlyingMusicOutput.setMusicVolume(v); },
        getMusicVolume: function () { return underlyingMusicOutput.getMusicVolume(); }
    };
};
export { getMusicOutput };
