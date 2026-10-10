import { black, white } from "../DTLibrary/DTColor.js";
let getMusicVolumePicker = function ({ xPos, yPos, initialVolume, color, scalingFactor }) {
    let currentVolume = initialVolume;
    let unmuteVolume = currentVolume;
    let isDraggingVolumeSlider = false;
    let processFrame = function ({ mouseInput, previousMouseInput }) {
        let mouseX = mouseInput.getX();
        let mouseY = mouseInput.getY();
        if (mouseInput.isLeftMouseButtonPressed()
            && !previousMouseInput.isLeftMouseButtonPressed()
            && xPos <= mouseX
            && mouseX <= xPos + 40 * scalingFactor
            && yPos <= mouseY
            && mouseY <= yPos + 50 * scalingFactor) {
            if (currentVolume === 0) {
                currentVolume = unmuteVolume === 0 ? 50 : unmuteVolume;
                unmuteVolume = currentVolume;
            }
            else {
                unmuteVolume = currentVolume;
                currentVolume = 0;
            }
        }
        if (mouseInput.isLeftMouseButtonPressed()
            && !previousMouseInput.isLeftMouseButtonPressed()
            && xPos + 50 * scalingFactor <= mouseX
            && mouseX <= xPos + 150 * scalingFactor
            && yPos + 10 * scalingFactor <= mouseY
            && mouseY <= yPos + 40 * scalingFactor) {
            isDraggingVolumeSlider = true;
        }
        if (isDraggingVolumeSlider && mouseInput.isLeftMouseButtonPressed()) {
            let volume = Math.floor(Math.round(mouseX - (xPos + 50 * scalingFactor)) / scalingFactor);
            if (volume < 0)
                volume = 0;
            if (volume > 100)
                volume = 100;
            currentVolume = volume;
            unmuteVolume = currentVolume;
        }
        if (!mouseInput.isLeftMouseButtonPressed())
            isDraggingVolumeSlider = false;
    };
    let getCurrentMusicVolume = function () {
        return currentVolume;
    };
    let render = function (displayOutput) {
        let gameImage;
        let dtColor;
        switch (color) {
            case 0 /* VolumePickerColor.Black */:
                gameImage = currentVolume > 0 ? 4 /* GameImage.MusicOn_Black */ : 5 /* GameImage.MusicOff_Black */;
                dtColor = black;
                break;
            case 1 /* VolumePickerColor.White */:
                gameImage = currentVolume > 0 ? 6 /* GameImage.MusicOn_White */ : 7 /* GameImage.MusicOff_White */;
                dtColor = white;
                break;
        }
        displayOutput.drawImageRotatedClockwise(gameImage, 0, 0, 100, 100, xPos, yPos, 0, (128 / 2) * scalingFactor, null);
        displayOutput.drawRectangle(xPos + 50 * scalingFactor, yPos + 10 * scalingFactor, 100 * scalingFactor + 1, 30 * scalingFactor + 1, dtColor, false);
        if (currentVolume > 0)
            displayOutput.drawRectangle(xPos + 50 * scalingFactor, yPos + 10 * scalingFactor, currentVolume * scalingFactor, 30 * scalingFactor + 1, dtColor, true);
    };
    return {
        processFrame,
        getCurrentMusicVolume,
        render
    };
};
export { getMusicVolumePicker };
