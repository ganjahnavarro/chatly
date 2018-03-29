import React, { Component } from "react";
import { Switch, Route, Redirect, } from "react-router-dom";
import Home from './modules/home/containers';
import SignIn from './modules/auth/containers/SignIn';
import CreateAccount from './modules/auth/containers/CreateAccount';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        rest.isAuthenticated ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/',
                state: { from: props.location }
            }}/>
        )
    )}/>
)

class MainRoutes extends Component{

	render(){
		const { isAuthenticated } = this.props

        if(isAuthenticated){
            return <PrivateRoute isAuthenticated={isAuthenticated} component={Home}/>
        }

        return (
            <Switch>
                <Route exact path='/sign-up' component={ CreateAccount } />
                <Route exact path="/" component={ SignIn } />
            </Switch>
        )
	}
}

export default MainRoutes;