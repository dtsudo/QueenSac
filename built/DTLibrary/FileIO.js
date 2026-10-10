let getNamespace = function (fileId, version) {
    return "guid" + version.alphanumericVersionGuid + "_file" + fileId;
};
let convertToBase64 = function (byteList) {
    let stringArray = [];
    for (let i = 0; i < byteList.length; i++)
        stringArray.push(String.fromCharCode(byteList[i]));
    let str = stringArray.join("");
    return btoa(str);
};
let convertFromBase64 = function (str) {
    let result = atob(str);
    let returnValue = [];
    for (let i = 0; i < result.length; i++) {
        returnValue.push(result.charCodeAt(i));
    }
    return returnValue;
};
let persistData = function ({ fileId, version, byteList, browserLocalStorage }) {
    let namespace = getNamespace(fileId, version);
    let base64Data = convertToBase64(byteList);
    try {
        browserLocalStorage.setItem(namespace, base64Data);
    }
    catch (error) {
        // do nothing
    }
};
let fetchData = function ({ fileId, version, browserLocalStorage }) {
    let namespace = getNamespace(fileId, version);
    try {
        let value = browserLocalStorage.getItem(namespace);
        if (value === null)
            return null;
        return convertFromBase64(value);
    }
    catch (error) {
        return null;
    }
};
export { persistData, fetchData };
