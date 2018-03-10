import axios from "axios";
import { transform } from "./Helpers";
import _ from "lodash";

const getToken = () => {
    const token = sessionStorage.getItem("token");
    return !_.isNil(token) ? token : false;
};


const instance = axios.create({
    timeout: 300000,
    baseURL: process.env.REACT_APP_END_POINT,
    transformRequest: transform,
    transformResponse: (response) => {
        return JSON.parse(response);
    },
    validateStatus: (status) => {
        return status >= 200;
    }
});
export const post = uri => args => {
    const token = getToken();
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance
        .post(uri, args)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
};

export const put = uri => args => {
    const token = getToken();
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance
        .put(uri, args)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
};

export const get = uri => params => {
    const token = getToken();
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance
        .get(uri, {
            params
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
};

export const remove = uri => args => {
    const token = getToken();
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance
        .delete(uri, args)
        .then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
};

export const getFullUrl = uri => {
    return `${process.env.REACT_APP_END_POINT}/${uri}?token=${getToken()}`
}

export const postFormData = url => (formdata, onProgress) => {
    return new Promise((resolve, reject) => {
        try{
            var xhr = new XMLHttpRequest();
            xhr.timeout = 300000;
            xhr.addEventListener("timeout", function(e) {
                return resolve({
                    status: 400,
                    message: "Request Timeout, Please try again."
                })
            });
            xhr.open('POST', `${process.env.REACT_APP_END_POINT}${url}?token=${getToken()}`);
            xhr.onload = () => {
                const jsonResponse = JSON.parse(xhr.response);
                const response = {
                    status: jsonResponse.status,
                    data: jsonResponse
                }
                return resolve(response);
            };
            xhr.onerror = () => {
                const errRes = {
                    data: false,
                    message: "Oops..Something went wrong."
                }
                return resolve(errRes)
            }

            if (xhr.upload) {
                xhr.upload.onprogress = (evt) => {
                    if (evt.lengthComputable) {
                        var progress = Math.ceil(((evt.loaded) / evt.total) * 100);
                        if(onProgress)
                            onProgress(progress)
                    }
                    
                }
            }

            xhr.send(formdata);

        }catch(err){
            return reject(err);
        }
    })
}