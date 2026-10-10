import { getSounds, getSoundInfo } from "./GameSound.js";
import { getVolumeSmoothed } from "./VolumeUtil.js";
let getSoundOutput_MobileSafari = function () {
    let soundDictionary = {};
    let audioContext = new AudioContext();
    let loadSounds = function () {
        let soundNamesArray = getSounds();
        for (let soundName of soundNamesArray) {
            if (soundDictionary[soundName] !== undefined)
                continue;
            soundDictionary[soundName] = null;
            let soundPath = "Data/Sound/" + getSoundInfo(soundName).filename + "?doNotCache=" + Date.now().toString();
            fetch(soundPath)
                .then(response => response.blob())
                .then(blob => blob.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => { soundDictionary[soundName] = audioBuffer; });
        }
        return true;
    };
    let desiredSoundVolume = 0;
    let currentSoundVolume = 0;
    let playSound = function (sound, volume) {
        let finalVolume = getSoundInfo(sound).volume * (currentSoundVolume / 100.0) * (volume / 100.0);
        if (finalVolume > 1.0)
            finalVolume = 1.0;
        if (finalVolume <= 0.0)
            return;
        let audioBuffer = soundDictionary[sound];
        if (audioBuffer === null || audioBuffer === undefined)
            return;
        let source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        let gainNode = new GainNode(audioContext, { gain: finalVolume });
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    };
    let setSoundVolume = function (volume) {
        if (volume < 0)
            throw new Error("volume < 0");
        if (volume > 100)
            throw new Error("volume > 100");
        desiredSoundVolume = volume;
    };
    let getSoundVolume = function () {
        return desiredSoundVolume;
    };
    let processFrame = function ({ elapsedMicrosThisFrame }) {
        currentSoundVolume = getVolumeSmoothed({
            currentVolume: currentSoundVolume,
            desiredVolume: desiredSoundVolume,
            elapsedMicrosThisFrame: elapsedMicrosThisFrame
        });
    };
    return {
        loadSounds,
        setSoundVolume,
        getSoundVolume,
        playSound,
        processFrame
    };
};
export { getSoundOutput_MobileSafari };
