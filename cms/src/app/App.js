import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Routes from "./Routes";
import Loading from "react-loading-bar";
import "react-loading-bar/dist/index.css";
import Modal from './modules/common/components/Modal';
import Alert from "react-s-alert";

class App extends Component {

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: "AUTH/CHECK_AUTH"
        });
    }

    render() {
        const { isAuthenticated, isLoading, isCheckAuth } = this.props;

        if(isCheckAuth)
            return(
                <div>
                    <Loading show={ isCheckAuth } showSpinner={false} color="red" />
                </div>
            );
        
        return (
            <div>
                <Loading show={ isLoading } showSpinner={false} color="red" />
                <Routes isAuthenticated={isAuthenticated} />
                <Modal />
                <Alert
                    stack={{ limit: 2 }}
                    effect="slide"
                />
            </div>
        );
    }
}

const mapStateToProps = ({ auth, loading }, routeParams) => {
    return {
        isCheckAuth: loading.loadingTypes.includes("CHECK_AUTH"),
        isAuthenticated: auth.get("isAuthenticated"),
        isLoading: loading.loadingTypes.length > 0
    };
};

export default withRouter(connect(mapStateToProps)(App));
