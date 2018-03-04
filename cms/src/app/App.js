import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Routes from "./Routes";

class App extends Component {

	componentWillMount(){
		const { dispatch } = this.props;
		dispatch({
            type: "AUTH/CHECK_AUTH"
        });
	}

    render() {
    	const { isAuthenticated } = this.props;
        return (
            <div>
                <Routes isAuthenticated={ isAuthenticated } />
            </div>
        );
    }
}

const mapStateToProps = ({ auth }, routeParams) => {
    return {
        isAuthenticated: auth.get('isAuthenticated')
    };
};

export default withRouter(connect(mapStateToProps)(App));
