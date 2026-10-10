import { getCurrentVersion } from "../DTLibrary/VersionInfo.js";
import { getBackground } from "./Background.js";
import { getInitialLoadingScreenFrame } from "./InitialLoadingScreenFrame.js";
import { getSaveAndLoadData } from "./SaveAndLoadData.js";
import { getQueenSacrificeUciChessEngineWrapper } from "./QueenSacrificeUciChessEngineWrapper.js";
let getFirstFrame = function ({ buildType, isDesktop, debugMode, browserLocalStorage }) {
    let versionInfo = getCurrentVersion();
    if (versionInfo.version === "1.00") {
        // migrateAllDataFromOlderVersionsToV1_00IfNeeded({ browserLocalStorage });
    }
    else {
        throw new Error("Unrecognized version");
    }
    let globalState = {
        buildType: buildType,
        isDesktop: isDesktop,
        debugMode: debugMode,
        saveAndLoadData: getSaveAndLoadData({ browserLocalStorage: browserLocalStorage }),
        queenSacrificeUciChessEngineWrapper: getQueenSacrificeUciChessEngineWrapper(),
        background: getBackground()
    };
    return getInitialLoadingScreenFrame({ globalState: globalState });
};
export { getFirstFrame };
