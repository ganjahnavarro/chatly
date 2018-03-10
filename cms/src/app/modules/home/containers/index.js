import React, { Component } from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import {Container} from 'reactstrap';
import Header from '../../common/components/Headers';
import Breadcrumb from '../../common/components/Breadcrumbs';
import Footer from '../../common/components/Footer';
import Sidebar from '../../common/components/Sidebar';

import Dashboard from '../../dashboard/container';

class Home extends Component{

	render(){
		return(
			<div className="app">
				<Header/>
				<div className="app-body">
					<Sidebar {...this.props}/>
					<main className="main">
						<Breadcrumb/>
						<Container fluid>
							<Switch>
								<Route exact path="/" name="Dashboard" component={ Dashboard }/>
							</Switch>
						</Container>
					</main>
				</div>
				<Footer/>
			</div>
			)
	}
}

const mapStateToProps = (state, routeParams) => {
    return {
        
    };
};

export default withRouter(connect(mapStateToProps)(Home));
