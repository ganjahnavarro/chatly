import { loading } from './modules/common/action'; 
// import { getFirstMessage } from './Helpers';
import { call } from 'redux-saga/effects';
import * as services from './Services';
import alert from 'react-s-alert';
import history from './History';
import _ from 'lodash';
import database, { auth } from './firebase';
import Promise from 'promise';

function* watchApiReponse(response = {}, responseOk = function* (){}, response404 = function* (){}){
    if(response.status === 200 || response.status === 201){
        yield call(responseOk);
    }
    if(response.status === 404){
        yield call(response404);
    }
    if(response.status !== 404 && (!response.status || (response.status >= 400 && response.status < 500))){
        // alert.error(getFirstMessage(response.data.errors || response.data.message));
    }
    if(response.status === 504){
        alert.error("Request cannot be processed right now. Please try again.");
    }
}

export {
    loading,
    alert,
    history,
    services,
    watchApiReponse,
    _,
    database,
    auth,
    Promise,
}