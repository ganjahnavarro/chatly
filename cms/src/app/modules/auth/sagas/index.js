import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as c from '../constants';
import {
    loading,
    // alert,
    // history,
    services,
    watchApiReponse
} from '../../../Utils';

function* checkAuthentication() {
    const token = sessionStorage.getItem('token');
    if(token) {
        yield put({
            type: c.AUTHENTICATE,
            isSuccess: true
        })
        return;
    }

    yield put({
        type: c.AUTHENTICATE,
        isSuccess: false
    })
}

function* login({ args }){
    yield put(loading('LOGIN'));

    const response = yield call(services.post(`/core/authenticate`), args);

    yield put(loading(null));

    yield call(watchApiReponse, response, function*(){
        console.log(response.data, 'dsfsdfs')
        const { token } = response.data;

        // if(profile_type === 'Administrator'){
            sessionStorage.setItem('token', token);
            // sessionStorage.setItem('profile_type', profile_type);

            yield put({
                type: "AUTHENTICATE",
                isSuccess: true
            })
        // }
    })
    
}

export default function* () {
    yield all([ 
        takeEvery(c.CHECK_AUTH, checkAuthentication),
        takeEvery(c.LOGIN, login)
    ])
}