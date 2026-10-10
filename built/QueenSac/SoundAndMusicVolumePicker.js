import { getMusicVolumePicker } from "./MusicVolumePicker.js";
import { getSoundVolumePicker } from "./SoundVolumePicker.js";
let getSoundAndMusicVolumePicker = function ({ xPos, yPos, initialSoundVolume, initialMusicVolume, color, scalingFactor }) {
    let soundVolumePicker = getSoundVolumePicker({ xPos: xPos, yPos: yPos + 50 * scalingFactor, initialVolume: initialSoundVolume, color: color, scalingFactor: scalingFactor });
    let musicVolumePicker = getMusicVolumePicker({ xPos: xPos, yPos: yPos, initialVolume: initialMusicVolume, color: color, scalingFactor: scalingFactor });
    let processFrame = function ({ mouseInput, previousMouseInput }) {
        soundVolumePicker.processFrame({ mouseInput: mouseInput, previousMouseInput: previousMouseInput });
        musicVolumePicker.processFrame({ mouseInput: mouseInput, previousMouseInput: previousMouseInput });
    };
    let render = function (displayOutput) {
        soundVolumePicker.render(displayOutput);
        musicVolumePicker.render(displayOutput);
    };
    return {
        processFrame,
        getCurrentSoundVolume: function () { return soundVolumePicker.getCurrentSoundVolume(); },
        getCurrentMusicVolume: function () { return musicVolumePicker.getCurrentMusicVolume(); },
        render
    };
};
export { getSoundAndMusicVolumePicker };
