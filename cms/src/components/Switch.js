import React from 'react'

class Switch extends React.Component {

    onChange(event) {
        event.target.value = event.target.checked;
        this.props.onChange(event);
	}

	render() {
		let { label, fieldClassName, checked, onChange, ...rest } = this.props;
		fieldClassName = fieldClassName ? fieldClassName + " wide field" : "field";
        checked = checked !== undefined ? checked : false;

	    return <div className={fieldClassName}>
            <div className="inline field">
                <div className="ui toggle checkbox">
                    <input type="checkbox" tabIndex={0}
                        onChange={this.onChange.bind(this)} {...rest} />
                    <label>{label}</label>
                </div>
            </div>
		</div>
	}

}

export default Switch;
