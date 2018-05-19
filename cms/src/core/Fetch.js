import { DEPLOYMENT_URL } from './Constants'
import Alert from './Alert'

let Fetch = {};

Fetch.get = function(resource, urlParameters, successCallback, errorCallback) {
    preFetch();
    let url = DEPLOYMENT_URL + resource + parseQuery(urlParameters);

    fetch(url, getDefaultHeaders())
        .then((response) => handleResponse(successCallback, errorCallback, response))
        .catch((error) => handleError(errorCallback, error));
};

Fetch.post = function(resource, requestBody, successCallback, errorCallback) {
    preFetch();
    let headers = Object.assign({}, getDefaultHeaders(), {
        method: "POST",
        body: JSON.stringify(requestBody)
    });

    fetch(DEPLOYMENT_URL + resource, headers)
        .then((response) => handleResponse(successCallback, errorCallback, response))
        .catch((error) => handleError(errorCallback, error));
}

Fetch.put = function(resource, requestBody, successCallback, errorCallback) {
    preFetch();
    let url = DEPLOYMENT_URL + resource + requestBody._id;
    let headers = Object.assign({}, getDefaultHeaders(), {
        method: "PUT",
        body: JSON.stringify(requestBody)
    });

    fetch(url, headers)
        .then((response) => handleResponse(successCallback, errorCallback, response))
        .catch((error) => handleError(errorCallback, error));
}

Fetch.delete = function(resource, id, successCallback, errorCallback) {
    preFetch();
    let url = DEPLOYMENT_URL + resource + id;
    let headers = Object.assign({}, getDefaultHeaders(), {
        method: "DELETE"
    });

    fetch(url, headers)
        .then((response) => successCallback())
        .catch((error) => handleError(errorCallback, error));
}

function preFetch() {
    // $("#loadingPanel").show();
    // $("#loadingPanel").addClass("active");
}

function postFetch() {
    // $("#loadingPanel").hide();
    // $("#loadingPanel").removeClass("active");
}

function getDefaultHeaders() {
    let headers = new Headers();
    headers.append("Accept", "application/json, text/plain, */*");
    headers.append("Content-Type", "application/json; charset=UTF-8");
    return { headers };
}

function handleResponse(successCallback, errorCallback, response) {
    response.ok ? handleSuccess(successCallback, response) : handleError(errorCallback, response);
    postFetch();
}

function handleSuccess(successCallback, response) {
    if (response && successCallback) {
        response.text().then((text) => {
            try {
                let value = JSON.parse(text);
                successCallback(value);
            } catch(err) {
                successCallback(text);
            }
        });
    }
}

function handleError(errorCallback, response) {
    if (response) {
        response.json().then((error) => {
            let message = error.message || error;
            Alert.error(message);
            if (errorCallback) errorCallback(message);
        });
    }
}

function parseQuery(urlParameters) {
    if (urlParameters) {
        let queryArray = [];

        for (let key in urlParameters) {
            if (urlParameters.hasOwnProperty(key)) {
               queryArray.push(key + "=" + urlParameters[key]);
            }
        }
        return "?" + queryArray.join("&");
    }
    return "";
}

export default Fetch;
