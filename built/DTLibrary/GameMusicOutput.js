import { getMusicOutput_MobileSafari } from "./GameMusicOutput_MobileSafari.js";
import { getMusicOutput_Generic } from "./GameMusicOutput_Generic.js";
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
let getMusicOutput = function ({ browserWindow }) {
    if (isMobileSafari(browserWindow))
        return getMusicOutput_MobileSafari({ browserWindow });
    else
        return getMusicOutput_Generic();
};
export { getMusicOutput };
