import { getMusic, getMusicInfo } from "./GameMusic.js";
let getMusicOutput_MobileSafari = function ({ browserWindow }) {
    let musicDictionary = {};
    let musicCounter = 0;
    let audioContext = new AudioContext();
    let bufferSource = null;
    let loadMusic = function () {
        let musicNamesArray = getMusic();
        for (let musicName of musicNamesArray) {
            if (musicDictionary[musicName] !== undefined)
                continue;
            let musicInfo = getMusicInfo(musicName);
            let musicPath = "Data/Music/" + (musicInfo.flacFilename !== null ? musicInfo.flacFilename : musicInfo.filename) + "?doNotCache=" + Date.now().toString();
            musicDictionary[musicName] = null;
            fetch(musicPath)
                .then(response => response.blob())
                .then(blob => blob.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => { musicDictionary[musicName] = audioBuffer; });
        }
        return true;
    };
    /*
        The current music being played, or null if no music is playing.
            
        This may not be the same as intendedMusic since it takes a while
        to fade out an existing music and fade in a new one
    */
    let currentMusic = null;
    // The intended music that should eventually play, or null if we should fade out all music
    let intendedMusic = null;
    /*
        From 0.0 to 1.0
            
        Normally, this value is 1.0
        However, when fading in/out, this value will decrease to represent the drop in music volume.
    */
    let currentFadeInAndOutVolume = 0.0;
    /*
        From 0 to 100.
            
        For currentMusic, the intended volume at which the music should be played.
        We allow this to be set since we might want to play a particular music at a different
        volume depending on circumstances (e.g. maybe the music should be played softer when
        the game is paused)
    */
    let currentMusicVolume = 0;
    /*
        From 0 to 100.
            
        For intendedMusic, the intended volume at which the music should be played.
    */
    let intendedMusicVolume = 0;
    // From 0 to 100
    let globalMusicVolume = 0;
    let playMusic = function (music, volume) {
        intendedMusic = music;
        intendedMusicVolume = volume;
    };
    let stopMusic = function () {
        intendedMusic = null;
    };
    let decreaseCurrentFadeInAndOutVolume = function ({ elapsedMicrosThisFrame }) {
        currentFadeInAndOutVolume = currentFadeInAndOutVolume - Math.max(1, Math.floor(elapsedMicrosThisFrame / 2000)) / 100.0;
        if (currentFadeInAndOutVolume < 0.0)
            currentFadeInAndOutVolume = 0.0;
    };
    let increaseCurrentFadeInAndOutVolume = function ({ elapsedMicrosThisFrame }) {
        currentFadeInAndOutVolume = currentFadeInAndOutVolume + Math.max(1, Math.floor(elapsedMicrosThisFrame / 2000)) / 100.0;
        if (currentFadeInAndOutVolume > 1.0)
            currentFadeInAndOutVolume = 1.0;
    };
    let playCurrentMusic = function () {
        musicCounter++;
        let currentMusicCounter = musicCounter;
        let audioBuffer = musicDictionary[currentMusic];
        let finalVolume = currentFadeInAndOutVolume * (currentMusicVolume / 100.0) * (globalMusicVolume / 100.0) * getMusicInfo(currentMusic).volume;
        if (finalVolume > 1.0)
            finalVolume = 1.0;
        if (finalVolume < 0.0)
            finalVolume = 0.0;
        if (audioBuffer === null || audioBuffer === undefined)
            return;
        if (audioContext.state === "suspended") {
            if (bufferSource !== null)
                bufferSource.audioBufferSourceNode.stop();
            bufferSource = null;
        }
        audioContext.resume().then(() => {
            if (currentMusicCounter !== musicCounter)
                return;
            if (bufferSource !== null && bufferSource.music === currentMusic) {
                bufferSource.gainNode.gain.setValueAtTime(finalVolume, 0);
                return;
            }
            if (bufferSource !== null)
                bufferSource.audioBufferSourceNode.stop();
            let audioBufferSourceNode = audioContext.createBufferSource();
            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.loop = true;
            let gainNode = new GainNode(audioContext, { gain: finalVolume });
            audioBufferSourceNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            audioBufferSourceNode.start();
            bufferSource = {
                audioBufferSourceNode: audioBufferSourceNode,
                gainNode: gainNode,
                music: currentMusic
            };
            if (audioContext.state === "suspended") {
                if (bufferSource !== null)
                    bufferSource.audioBufferSourceNode.stop();
                bufferSource = null;
            }
        });
    };
    let stopCurrentMusic = function () {
        musicCounter++;
        if (bufferSource !== null)
            bufferSource.audioBufferSourceNode.stop();
        bufferSource = null;
    };
    let updateCurrentMusic = function ({ elapsedMicrosThisFrame }) {
        if (intendedMusic === null) {
            if (currentMusic !== null) {
                decreaseCurrentFadeInAndOutVolume({ elapsedMicrosThisFrame: elapsedMicrosThisFrame });
                if (currentFadeInAndOutVolume === 0.0)
                    currentMusic = null;
            }
            return;
        }
        if (currentMusic === null) {
            currentMusic = intendedMusic;
            currentFadeInAndOutVolume = 0.0;
            currentMusicVolume = intendedMusicVolume;
            return;
        }
        if (currentMusic !== intendedMusic) {
            decreaseCurrentFadeInAndOutVolume({ elapsedMicrosThisFrame: elapsedMicrosThisFrame });
            if (currentFadeInAndOutVolume === 0.0)
                currentMusic = null;
            return;
        }
        if (currentMusicVolume < intendedMusicVolume) {
            let delta = Math.max(1, Math.floor(elapsedMicrosThisFrame / 5000));
            currentMusicVolume = currentMusicVolume + delta;
            if (currentMusicVolume > intendedMusicVolume)
                currentMusicVolume = intendedMusicVolume;
        }
        if (currentMusicVolume > intendedMusicVolume) {
            let delta = Math.max(1, Math.floor(elapsedMicrosThisFrame / 5000));
            currentMusicVolume = currentMusicVolume - delta;
            if (currentMusicVolume < intendedMusicVolume)
                currentMusicVolume = intendedMusicVolume;
        }
        increaseCurrentFadeInAndOutVolume({ elapsedMicrosThisFrame: elapsedMicrosThisFrame });
    };
    let processFrame = function ({ elapsedMicrosThisFrame }) {
        updateCurrentMusic({ elapsedMicrosThisFrame: elapsedMicrosThisFrame });
        if (currentMusic !== null)
            playCurrentMusic();
        else
            stopCurrentMusic();
    };
    let setMusicVolume = function (volume) {
        globalMusicVolume = volume;
    };
    let getMusicVolume = function () {
        return globalMusicVolume;
    };
    return {
        loadMusic,
        playMusic,
        stopMusic,
        setMusicVolume,
        getMusicVolume,
        processFrame
    };
};
export { getMusicOutput_MobileSafari };
