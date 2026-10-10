
import { fetchData, persistData } from "../DTLibrary/FileIO.js";
import { getCurrentVersion } from "../DTLibrary/VersionInfo.js";
import { FILE_ID_FOR_SESSION_STATE, FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME } from "./GlobalConstants.js";
import { SessionState, deserializeSessionState, serializeSessionState } from "./SessionState.js";
import { BrowserLocalStorage } from "../DTLibrary/BrowserLocalStorage.js";

type SaveAndLoadData = {
	saveAllData: (input: { sessionState: SessionState, soundVolume: number, musicVolume: number }) => void,
	saveSessionState: (input: { sessionState: SessionState }) => void,
	saveSoundAndMusicVolume: (input: { soundVolume: number, musicVolume: number }) => void,
	loadSessionState: (input: { sessionState: SessionState }) => void,
	loadSoundVolume: () => number | null,
	loadMusicVolume: () => number | null
};

let getSaveAndLoadData = function ({ browserLocalStorage }: { browserLocalStorage: BrowserLocalStorage }): SaveAndLoadData {
	let savedSoundVolume: number | null = null;
	let savedMusicVolume: number | null = null;
	let savedSessionState: number[] | null = null;

	let saveSessionState = function ({ sessionState }: { sessionState: SessionState }) {
		let serializedSessionState: number[] = serializeSessionState(sessionState);

		if (savedSessionState !== null) {
			if (savedSessionState.length === serializedSessionState.length) {
				let isEqual = true;
				for (let i = 0; i < savedSessionState.length; i++) {
					if (savedSessionState[i] !== serializedSessionState[i]) {
						isEqual = false;
						break;
					}
				}

				if (isEqual)
					return;
			}
		}

		savedSessionState = serializedSessionState;

		let version = getCurrentVersion();
		persistData({
			fileId: FILE_ID_FOR_SESSION_STATE,
			version: version,
			byteList: serializedSessionState,
			browserLocalStorage: browserLocalStorage
		});
	};

	let saveSoundAndMusicVolume = function ({ soundVolume, musicVolume }: { soundVolume: number, musicVolume: number }) {
		if (savedSoundVolume !== null && savedMusicVolume !== null && savedSoundVolume === soundVolume && savedMusicVolume === musicVolume)
			return;

		savedSoundVolume = soundVolume;
		savedMusicVolume = musicVolume;

		let version = getCurrentVersion();
		let byteList = [soundVolume, musicVolume];
		persistData({
			fileId: FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME,
			version: version,
			byteList: byteList,
			browserLocalStorage: browserLocalStorage
		});
	};

	let saveAllData = function ({ sessionState, soundVolume, musicVolume }: { sessionState: SessionState, soundVolume: number, musicVolume: number }): void {
		saveSessionState({ sessionState: sessionState });
		saveSoundAndMusicVolume({ soundVolume: soundVolume, musicVolume: musicVolume });
	};

	let loadSessionState = function ({ sessionState }: { sessionState: SessionState }): void {
		let version = getCurrentVersion();
		let serializedSessionState: number[] | null = fetchData({
			fileId: FILE_ID_FOR_SESSION_STATE,
			version: version,
			browserLocalStorage: browserLocalStorage
		});

		if (serializedSessionState === null)
			return;

		deserializeSessionState(serializedSessionState, sessionState);
	};

	let loadSoundVolume = function (): number | null {
		let version = getCurrentVersion();
		let data: number[] | null = fetchData({ fileId: FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME, version: version, browserLocalStorage: browserLocalStorage });

		if (data === null)
			return null;

		if (data.length === 0)
			return null;

		let soundVolume = data[0]!;

		if (soundVolume < 0 || soundVolume > 100)
			return null;

		return soundVolume;
	};

	let loadMusicVolume = function (): number | null {
		let version = getCurrentVersion();
		let data: number[] | null = fetchData({ fileId: FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME, version: version, browserLocalStorage: browserLocalStorage });

		if (data === null)
			return null;

		if (data.length <= 1)
			return null;

		let musicVolume = data[1]!;

		if (musicVolume < 0 || musicVolume > 100)
			return null;

		return musicVolume;
	};

	return {
		saveAllData,
		saveSessionState,
		saveSoundAndMusicVolume,
		loadSessionState,
		loadSoundVolume,
		loadMusicVolume
	};
};

export { SaveAndLoadData, getSaveAndLoadData };
