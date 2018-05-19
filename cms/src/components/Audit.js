import React from 'react'

class Audit extends React.Component {

	render() {
		let { modifiedBy, modifiedDate } = this.props.value;

		let modifiedByComponent = <div className="ui label"
			data-inverted="" data-tooltip="Modified By" data-position="bottom left">
			<i className="icon user"></i> {modifiedBy}
		</div>;

		let modifiedDateComponent = <div className="ui label"
			data-inverted="" data-tooltip="Modified Date" data-position="bottom left">
			<i className="history icon"></i> {modifiedDate}
		</div>;

		let auditComponent = <div className="audit">
			{modifiedBy ? modifiedByComponent : null}
			{modifiedDate ? modifiedDateComponent : null}
		</div>;

		return modifiedBy || modifiedDate ? auditComponent : null;
	}

}

export default Audit;
