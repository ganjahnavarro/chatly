import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as c from '../constants';
import { delay } from 'redux-saga';
import {
    auth,
    loading,
    alert,
    // history,
} from '../../../Utils';

const onCheckAuth = () => {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            console.log(user, 'sdfs')
            if(user){
                resolve({
                    email: user.email
                })
            }else{
                resolve(null)
            }
        })
    })
}

function* checkAuthentication() {
    yield put(loading('CHECK_AUTH'));

    const response = yield call(onCheckAuth)

    console.log(response, 'herer')

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

    // const token = sessionStorage.getItem('token');
    // if(token) {
    //     yield put({
    //         type: c.AUTHENTICATE,
    //         isSuccess: true
    //     })
    //     return;
    // }

    // yield put({
    //     type: c.AUTHENTICATE,
    //     isSuccess: false
    // })
}

function* login({ args }){
    yield put(loading('LOGIN'));

    const { email, password } = args;

    const authentication = auth.signInWithEmailAndPassword(email, password);

    authentication
        .then(res => {
            console.log(res, 'success')
        })
        .catch(err => {
            console.log(err, 'sdfsdf')
        })

    yield call(delay, 1000)

    sessionStorage.setItem('token', 'sampleToken');

    yield put({
        type: "AUTH/CHECK_AUTH",
        isSuccess: true
    })
    
    yield put(loading('LOGIN', false));
}

const onSignout = () => {
    return new Promise((resolve, reject) => {
        const firebaseSingout = auth.signOut();
        firebaseSingout
            .then(() => resolve())
            .catch(error => reject(reject))

    })
}


function* logout(){
    
    

    sessionStorage.clear();

    yield put({
        type: "AUTH/CHECK_AUTH",
        isSuccess: false
    })
    
}

const onSignUp = ({ email, password }) => {
    const firebaseSignUp = auth.createUserWithEmailAndPassword(email, password);

    return firebaseSignUp
        .then(res => {
            return res
        })
        .catch(err => {
            alert.error(err.message)
        })
    
}


function* signUp({ args }) {
    yield put(loading('CREATE_ACCOUNT'));

    const response = yield call(onSignUp, args)

    if(response){
        yield checkAuthentication()
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