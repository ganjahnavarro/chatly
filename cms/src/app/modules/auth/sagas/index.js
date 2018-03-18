import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as c from '../constants';
import { delay } from 'redux-saga';
import {
    loading,
    // alert,
    // history,
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

    
    yield call(delay, 1000)

    sessionStorage.setItem('token', 'sampleToken');

    yield put({
        type: "AUTH/CHECK_AUTH",
        isSuccess: true
    })
    
    yield put(loading('LOGIN', false));
}
function* logout(){

    sessionStorage.clear();

    yield put({
        type: "AUTH/CHECK_AUTH",
        isSuccess: false
    })
    
}


export default function* () {
    yield all([ 
        takeEvery(c.CHECK_AUTH, checkAuthentication),
        takeEvery(c.LOGIN, login),
        takeEvery(c.LOGOUT, logout)
    ])
}