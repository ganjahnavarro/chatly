import React, { Component } from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import {Container} from 'reactstrap';
import Header from '../../common/components/Headers';
import Breadcrumb from '../../common/components/Breadcrumbs';
import Footer from '../../common/components/Footer';
import Sidebar from '../../common/components/Sidebar';

import Dashboard from '../../dashboard/container';
import Product from '../../product/containers';
import Category from '../../category/containers';
import Branch from '../../branch/containers';

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
								<Route exact path="/products/:productId?" name="Product" component={ Product }/>
								<Route exact path="/categories/:categoryId?" name="Category" component={ Category }/>
								<Route exact path="/branches/:branchId?" name="Branch" component={ Branch }/>
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
