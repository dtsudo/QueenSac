let getVersionHistory = function () {
    return [
        { version: "1.00", alphanumericVersionGuid: "ba1fbb791e423621a85c7e450aa0d835" }
    ];
};
let getCurrentVersion = function () {
    let versionHistory = getVersionHistory();
    return versionHistory[versionHistory.length - 1];
};
export { getVersionHistory, getCurrentVersion };
