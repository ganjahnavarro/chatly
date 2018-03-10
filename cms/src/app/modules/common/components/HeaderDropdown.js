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

	render(){
		return(
			<Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
	        	<DropdownToggle nav>
	          		<img src={ profile_pic } className="img-avatar" alt="admin@bootstrapmaster.com"/>
	        	</DropdownToggle>
		        <DropdownMenu >
		          	{/*<DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
		          	<DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
		          	<DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
		          	<DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
		          	<DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>*/}
		          	<DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
		          	<DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
		          	<DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
		          	<DropdownItem divider/>
		          	{/*<DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>*/}
		          	<DropdownItem><i className="fa fa-lock"></i> Logout</DropdownItem>
		        </DropdownMenu>
	      	</Dropdown>
			)
	}
}

export default HeaderDropdown;