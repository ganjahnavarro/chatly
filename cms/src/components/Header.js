import React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.Component {

	render() {
		return <div>
			<div className="ui secondary menu">
				<Link to="/dashboard" className="active green item">
					Dashboard
				</Link>

				<div className="right menu">
					<Link to="/" className="ui item">
						Logout
					</Link>
				</div>
			</div>
        </div>
	}

}

export default Header;
