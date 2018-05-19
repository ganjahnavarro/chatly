import React from 'react'

class Input extends React.Component {

	constructor(props) {
		super(props);
		this.value = this.props.value;
	}

	focus() {
		this.selectedInput.focus();
	}

	highlight() {
		if (this.selectedInput && this.value) {
			let element = this.selectedInput;
			element.setSelectionRange(0, this.value.toString().length);
		}
	}

	componentWillReceiveProps(nextProps) {
		this.value = nextProps.value;
	}

	render() {
		let { icon, label, fieldClassName } = this.props;
		fieldClassName = fieldClassName ? fieldClassName + " wide field" : "field";

		let props = Object.assign({}, this.props);

		if (typeof props.defaultValue === "undefined") {
			props.value = props.value || "";
		}
		delete props.label;
		delete props.icon;
		delete props.fieldClassName;

		let htmlInput = <textarea rows="3" ref={(input) => {this.selectedInput = input}} {...props} />;
		let component = htmlInput;

		if (this.props.icon) {
			component = <div className="ui left icon input">
				<i className={"icon " + icon}></i>
				{htmlInput}
			</div>
		}



	    return <div className={fieldClassName}>
			{label ? <label>{label}</label> : null}
			{component}
		</div>
	}

}

export default Input;
