import React, { PureComponent } from 'react';
import {
  // Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';

import profile_pic from '../../../../assets/img/avatars/6.jpg';

class HeaderDropdown extends PureComponent{

	state = {
		dropdownOpen: false
	}

	toggle = (e) => {
		this.setState({
      		dropdownOpen: !this.state.dropdownOpen
    	});
	}

	handleLogout = (e) => {
		this.props.handleLogout();
	}

	render(){
		return(
			<Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
	        	<DropdownToggle nav>
	          		<img src={ profile_pic } className="img-avatar" alt="admin@bootstrapmaster.com"/>
	        	</DropdownToggle>
		        <DropdownMenu >
		          	<DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
		          	<DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
		          	<DropdownItem onClick={ this.handleLogout }><i className="fa fa-lock"></i> Logout</DropdownItem>
		        </DropdownMenu>
	      	</Dropdown>
			)
	}
}

export default HeaderDropdown;