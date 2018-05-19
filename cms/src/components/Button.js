import React from 'react'

class Button extends React.Component {

	render() {
		let props = Object.assign({}, this.props);
		delete props.icon;

		let iconName = this.props.icon ? "icon " + this.props.icon : null;

	    return <button data-inverted="" data-position="bottom left" {...props}>
			{this.props.icon ? <i className={iconName}></i> : null}
			{this.props.children}
		</button>;
	}

}

export default Button;
