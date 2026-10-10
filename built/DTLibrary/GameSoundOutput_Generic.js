import { getSounds, getSoundInfo } from "./GameSound.js";
import { getVolumeSmoothed } from "./VolumeUtil.js";
let getSoundOutput_Generic = function () {
    let soundDictionary = {};
    let numberOfAudioObjectsLoaded = 0;
    let hasFinishedLoading = false;
    let loadSounds = function () {
        let soundNamesArray = getSounds();
        let numberOfAudioObjects = soundNamesArray.length * 4;
        for (let soundName of soundNamesArray) {
            if (soundDictionary[soundName])
                continue;
            soundDictionary[soundName] = [];
            let soundPath = "Data/Sound/" + getSoundInfo(soundName).filename + "?doNotCache=" + Date.now().toString();
            for (let i = 0; i < 4; i++) {
                let audio = new Audio(soundPath);
                let hasAudioLoaded = false;
                audio.addEventListener("canplaythrough", function () {
                    if (!hasAudioLoaded) {
                        hasAudioLoaded = true;
                        numberOfAudioObjectsLoaded++;
                    }
                });
                soundDictionary[soundName].push(audio);
            }
        }
        hasFinishedLoading = numberOfAudioObjects === numberOfAudioObjectsLoaded;
        return hasFinishedLoading;
    };
    let desiredSoundVolume = 0;
    let currentSoundVolume = 0;
    let playSound = function (sound, volume) {
        if (!hasFinishedLoading)
            return;
        let finalVolume = getSoundInfo(sound).volume * (currentSoundVolume / 100.0) * (volume / 100.0);
        if (finalVolume > 1.0)
            finalVolume = 1.0;
        if (finalVolume <= 0.0)
            return;
        let soundArray = soundDictionary[sound];
        let audio = soundArray[0];
        for (let i = 0; i < soundArray.length; i++) {
            if (i === soundArray.length - 1)
                soundArray[i] = audio;
            else
                soundArray[i] = soundArray[i + 1];
        }
        audio.volume = finalVolume;
        audio.play();
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
export { getSoundOutput_Generic };
