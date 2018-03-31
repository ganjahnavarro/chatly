import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as c from '../constants';
import {
    auth,
    loading,
    alert,
    history,
} from '../../../Utils';

const onCheckAuth = () => {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            if(user){
                resolve({ email: user.email })
            }else{
                resolve(null)
            }
        })
    })
}

function* checkAuthentication() {
    yield put(loading('CHECK_AUTH'));

    const response = yield call(onCheckAuth)

    if(response){
        yield put({
            type: c.AUTHENTICATE,
            isSuccess: true
        })
    }else{
        yield put({
            type: c.AUTHENTICATE,
            isSuccess: false
        })
    }

    yield put(loading('CHECK_AUTH', false));
}

const onLogin = ({ email, password }) => {
    return new Promise((resolve, reject) => {
        auth.signInWithEmailAndPassword(email, password)
            .then(res => resolve(res))
            .catch(err => {
                console.log(err)
                alert.error(err.message)
                resolve(false)
            })
    })
}

function* login({ args }){
    yield put(loading('LOGIN'));

    const response = yield call(onLogin, args)

    yield put({
        type: c.AUTHENTICATE,
        isSuccess: response ? true : false
    })

    yield put(loading('LOGIN', false));
}

export const onSignout = () => {
    return new Promise((resolve, reject) => {
        const firebaseSingout = auth.signOut();
        firebaseSingout
            .then(() => resolve(false))
            .catch(error => resolve(true))

    })
}


function* logout(){
    yield put(loading('LOGOUT'));

    const response = yield call(onSignout)

    yield put({
        type: c.AUTHENTICATE,
        isSuccess: response
    })

    if(!response)   
        history.push("/")
    
    yield put(loading('LOGOUT', false));
}

const onSignUp = ({ email, password }) => {
    const firebaseSignUp = auth.createUserWithEmailAndPassword(email, password);

    return firebaseSignUp
        .then(res => res)
        .catch(err => alert.error(err.message))
    
}


function* signUp({ args }) {
    yield put(loading('CREATE_ACCOUNT'));

    const response = yield call(onSignUp, args)

    if(response){
        yield checkAuthentication()
        history.push("/")
    }

    yield put(loading('CREATE_ACCOUNT', false));
}

export default function* () {
    yield all([ 
        takeEvery(c.CHECK_AUTH, checkAuthentication),
        takeEvery(c.LOGIN, login),
        takeEvery(c.LOGOUT, logout),
        takeEvery(c.CREATE_ACCOUNT, signUp)
    ])
}