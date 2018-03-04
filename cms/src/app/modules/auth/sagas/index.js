import { takeEvery, put, /*call,*/ all } from 'redux-saga/effects';
import * as c from '../constants';

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

export default function* () {
    yield all([ 
        takeEvery(c.CHECK_AUTH, checkAuthentication),
    ])
}