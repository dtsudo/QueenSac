import { getSoundOutput_MobileSafari } from "./GameSoundOutput_MobileSafari.js";
import { getSoundOutput_Generic } from "./GameSoundOutput_Generic.js";
let isMobileSafari = function (browserWindow) {
    let isDesktop = browserWindow.matchMedia("(pointer:fine)").matches;
    if (isDesktop)
        return false;
    let userAgent = browserWindow.navigator.userAgent.toLowerCase();
    if (userAgent.includes("chrome"))
        return false;
    if (userAgent.includes("chromium"))
        return false;
    if (!userAgent.includes("safari"))
        return false;
    return true;
};
let getSoundOutput = function ({ browserWindow }) {
    if (isMobileSafari(browserWindow))
        return getSoundOutput_MobileSafari();
    else
        return getSoundOutput_Generic();
};
export { getSoundOutput };
