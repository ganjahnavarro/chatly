import React, { PureComponent } from "react";
import {
	Nav,
	// NavbarBrand,
	NavbarToggler,
	NavItem,
	// NavLink,
	// Badge
} from "reactstrap";
import HeaderDropdown from "./HeaderDropdown";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

class Headers extends PureComponent {

	sidebarToggle = (e) => {
	    e.preventDefault();
	    document.body.classList.toggle('sidebar-hidden');
	}

	sidebarMinimize = (e) => {
	    e.preventDefault();
	    document.body.classList.toggle('sidebar-minimized');
	}

	mobileSidebarToggle = (e) => {
	    e.preventDefault();
	    document.body.classList.toggle('sidebar-mobile-show');
	}

	asideToggle = (e) => {
	    e.preventDefault();
	    document.body.classList.toggle('aside-menu-hidden');
	}

	handleLogout = () => {
		const { dispatch } = this.props;
		dispatch({
			type: "LOGOUT"
		})
	}

	render() {
		return (
			<header className="app-header navbar">
				<NavbarToggler
					className="d-lg-none"
					onClick={this.mobileSidebarToggle}>
					<span className="navbar-toggler-icon" />
				</NavbarToggler>
				<h4 className="text-center" 
					style={{
					display: 'inline-block',
				    width: 155,
				    height: 55,
				    marginRight: 0,
				    backgroundColor: '#fff',
				    verticalAlign: 'middle',
				    paddingTop: 15,
				    color: '#585858'
				}}>CHATLY!</h4>
				
				{/*<NavbarBrand href="#" />*/}
				<NavbarToggler
					className="d-md-down-none"
					onClick={this.sidebarToggle}>
					<span className="navbar-toggler-icon" />
				</NavbarToggler>
				<Nav className="d-md-down-none" navbar>
					<NavItem className="px-3">
						<Link to="/">Dashboard</Link>
					</NavItem>
					<NavItem className="px-3">
						<Link to="/products">Products</Link>
					</NavItem>
					<NavItem className="px-3">
						<Link to="/categories">Categories</Link>
					</NavItem>
				</Nav>
				<Nav className="ml-auto" navbar>
					<HeaderDropdown  handleLogout={ this.handleLogout }/>
				</Nav>
			</header>
		);
	}
}

const mapStateToProps = (state, routeParams) => {
    return {
        
    };
};

export default withRouter(connect(mapStateToProps)(Headers));

