
type Version = {
	version: string,
	alphanumericVersionGuid: string
};

let getVersionHistory = function (): Version[] {
	return [
		{ version: "1.00", alphanumericVersionGuid: "ba1fbb791e423621a85c7e450aa0d835" }
	];
};

let getCurrentVersion = function (): Version {
	let versionHistory = getVersionHistory();
	return versionHistory[versionHistory.length - 1]!;
};

export { Version, getVersionHistory, getCurrentVersion };
