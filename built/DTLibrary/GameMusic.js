let getMusic = function () {
    return [
        0 /* GameMusic.Happy */
    ];
};
let getMusicInfo = function (music) {
    switch (music) {
        case 0 /* GameMusic.Happy */:
            return {
                filename: "rezoner/happy.mp3",
                flacFilename: null,
                volume: 0.15
            };
    }
};
export { getMusic, getMusicInfo };
