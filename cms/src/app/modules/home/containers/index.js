import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";


class Home extends Component{

	render(){
		return(
			<div>Test</div>
			)
	}
}

const mapStateToProps = (state, routeParams) => {
    return {
        
    };
};

export default withRouter(connect(mapStateToProps)(Home));
