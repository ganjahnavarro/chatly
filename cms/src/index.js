import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./app/Store";
import App from "./app/App";
import { ConnectedRouter } from "react-router-redux";
import history from "./app/History";
import registerServiceWorker from "./registerServiceWorker";


import 'flag-icon-css/css/flag-icon.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-select/dist/react-select.css';
import './assets/css/style.css';

const store = configureStore();

render(
    <Provider store={ store }>
        <ConnectedRouter history={ history }>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);
registerServiceWorker();
