
import { Version } from "./VersionInfo.js";
import { BrowserLocalStorage } from "./BrowserLocalStorage.js";

let getNamespace = function (fileId: number, version: Version): string {
	return "guid" + version.alphanumericVersionGuid + "_file" + fileId;
};

let convertToBase64 = function (byteList: number[]): string {
	let stringArray: string[] = [];
	for (let i = 0; i < byteList.length; i++)
		stringArray.push(String.fromCharCode(byteList[i]!));
		
	let str = stringArray.join("");
	return btoa(str);
};

let convertFromBase64 = function (str: string): number[] {
	let result = atob(str);

	let returnValue: number[] = [];

	for (let i = 0; i < result.length; i++) {
		returnValue.push(result.charCodeAt(i));
	}

	return returnValue;
};

let persistData = function ({ fileId, version, byteList, browserLocalStorage }: { fileId: number, version: Version, byteList: number[], browserLocalStorage: BrowserLocalStorage }): void {
	let namespace: string = getNamespace(fileId, version);
	let base64Data: string = convertToBase64(byteList);

	try {
		browserLocalStorage.setItem(namespace, base64Data);
	} catch (error) {
		// do nothing
	}
};

let fetchData = function ({ fileId, version, browserLocalStorage }: { fileId: number, version: Version, browserLocalStorage: BrowserLocalStorage }): number[] | null {
	let namespace: string = getNamespace(fileId, version);

	try {
		let value = browserLocalStorage.getItem(namespace);

		if (value === null)
			return null;

		return convertFromBase64(value);
	} catch (error) {
		return null;
	}
};

export { persistData, fetchData };
