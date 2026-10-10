
import { BrowserLocalStorage } from "../DTLibrary/BrowserLocalStorage.js";
import { BuildType } from "../DTLibrary/BuildType.js";
import { IFrame } from "../DTLibrary/IFrame.js";
import { getCurrentVersion, Version } from "../DTLibrary/VersionInfo.js";
import { getBackground } from "./Background.js";
import { GlobalState } from "./GlobalState.js";
import { getInitialLoadingScreenFrame } from "./InitialLoadingScreenFrame.js";
import { getSaveAndLoadData } from "./SaveAndLoadData.js";
import { getQueenSacrificeUciChessEngineWrapper } from "./QueenSacrificeUciChessEngineWrapper.js";

let getFirstFrame = function ({ buildType, isDesktop, debugMode, browserLocalStorage }: { buildType: BuildType, isDesktop: boolean, debugMode: boolean, browserLocalStorage: BrowserLocalStorage }): IFrame {

	let versionInfo: Version = getCurrentVersion();

	if (versionInfo.version === "1.00") {
		// migrateAllDataFromOlderVersionsToV1_00IfNeeded({ browserLocalStorage });
	} else {
		throw new Error("Unrecognized version");
	}

	let globalState: GlobalState = {
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
