import React from 'react'
import Select from 'react-select';

class Dropdown extends React.Component {

	render() {
		/*
			https://github.com/JedWatson/react-select#further-options
		*/

		let { label, loadOptions, fieldClassName } = this.props;
		fieldClassName = fieldClassName ? fieldClassName + " wide field" : "field";

        let props = Object.assign({}, this.props);
		props.clearable = false;
		props.matchPos = "start"
		props.inputProps = {type: "react-type"};
        delete props.label;

		let asyncSelect = typeof loadOptions !== "undefined";
		let selectComponent = asyncSelect ? <Select.Async {...props} /> : <Select {...props} />;

		return <div className={fieldClassName}>
            {label ? <label>{label}</label> : null}
			{selectComponent}
        </div>
	}

}

export default Dropdown;
