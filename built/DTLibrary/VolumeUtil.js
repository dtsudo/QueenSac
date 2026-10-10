let getVolumeSmoothed = function ({ currentVolume, desiredVolume, elapsedMicrosThisFrame }) {
    let maxChangePerFrame = Math.floor(elapsedMicrosThisFrame / 5000);
    if (maxChangePerFrame <= 0)
        maxChangePerFrame = 1;
    if (Math.abs(desiredVolume - currentVolume) <= maxChangePerFrame)
        return desiredVolume;
    else if (desiredVolume > currentVolume)
        return currentVolume + maxChangePerFrame;
    else
        return currentVolume - maxChangePerFrame;
};
export { getVolumeSmoothed };
