
import { BuildType } from "../DTLibrary/BuildType.js";
import { Background } from "./Background.js";
import { SaveAndLoadData } from "./SaveAndLoadData.js";
import { QueenSacrificeUciChessEngineWrapper } from "./QueenSacrificeUciChessEngineWrapper.js";

type GlobalState = {
	buildType: BuildType,
	isDesktop: boolean,
	debugMode: boolean,
	saveAndLoadData: SaveAndLoadData,
	queenSacrificeUciChessEngineWrapper: QueenSacrificeUciChessEngineWrapper,
	background: Background
}

export { GlobalState };
