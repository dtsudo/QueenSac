import { fetchData, persistData } from "../DTLibrary/FileIO.js";
import { getCurrentVersion } from "../DTLibrary/VersionInfo.js";
import { FILE_ID_FOR_SESSION_STATE, FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME } from "./GlobalConstants.js";
import { deserializeSessionState, serializeSessionState } from "./SessionState.js";
let getSaveAndLoadData = function ({ browserLocalStorage }) {
    let savedSoundVolume = null;
    let savedMusicVolume = null;
    let savedSessionState = null;
    let saveSessionState = function ({ sessionState }) {
        let serializedSessionState = serializeSessionState(sessionState);
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
    let saveSoundAndMusicVolume = function ({ soundVolume, musicVolume }) {
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
    let saveAllData = function ({ sessionState, soundVolume, musicVolume }) {
        saveSessionState({ sessionState: sessionState });
        saveSoundAndMusicVolume({ soundVolume: soundVolume, musicVolume: musicVolume });
    };
    let loadSessionState = function ({ sessionState }) {
        let version = getCurrentVersion();
        let serializedSessionState = fetchData({
            fileId: FILE_ID_FOR_SESSION_STATE,
            version: version,
            browserLocalStorage: browserLocalStorage
        });
        if (serializedSessionState === null)
            return;
        deserializeSessionState(serializedSessionState, sessionState);
    };
    let loadSoundVolume = function () {
        let version = getCurrentVersion();
        let data = fetchData({ fileId: FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME, version: version, browserLocalStorage: browserLocalStorage });
        if (data === null)
            return null;
        if (data.length === 0)
            return null;
        let soundVolume = data[0];
        if (soundVolume < 0 || soundVolume > 100)
            return null;
        return soundVolume;
    };
    let loadMusicVolume = function () {
        let version = getCurrentVersion();
        let data = fetchData({ fileId: FILE_ID_FOR_SOUND_AND_MUSIC_VOLUME, version: version, browserLocalStorage: browserLocalStorage });
        if (data === null)
            return null;
        if (data.length <= 1)
            return null;
        let musicVolume = data[1];
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
export { getSaveAndLoadData };
