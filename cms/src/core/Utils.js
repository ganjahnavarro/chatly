import Fetch from './Fetch';
import { SERVER_URL, VIEWER_PATH, PDFS_DIRECTORY } from './Constants';

let Utils = {};

Utils.isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

Utils.getPDFPath = (fileName) => {
    const encodedFileName = encodeURIComponent(PDFS_DIRECTORY + fileName);
    return SERVER_URL + VIEWER_PATH + encodedFileName;
};

let preview = null;

Utils.open = (fileName) => {
    if (preview != null) {
        preview.close();
    }
    const params = ["height=" + window.screen.availHeight, "width=" + window.screen.availWidth].join(',');
    preview = window.open(Utils.getPDFPath(fileName), 'popup_window', params);
};

Utils.print = (type, requestData) => {
    Fetch.post(`reports/${type}`, requestData, (fileName) => {
        Utils.open(fileName);
    });
};

export default Utils;
