import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Modal, ModalHeader } from "reactstrap";

class ModalContainer extends PureComponent {

	handleToggle = (e) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'MODAL',
			data: {
				isOpen: false,
				content: null,
				toggle: true,
				title: 'Modal Title',
				modalSize: 'modal-md',
				className: 'primary'
			}
		})
	}

	render() {
		const { data } = this.props;
		return (
			<Modal
				isOpen={ data.get('isOpen') }
				toggle={ this.handleToggle }
				className={`modal-${data.get('className')} ${ data.get('modalSize') }`}>
				<ModalHeader toggle={this.togglePrimary}>
					{ data.get('title') }
				</ModalHeader>
				{ data.get('content') }
			</Modal>
		);
	}
}

const mapStateToProps = ({ modal }, routeParams) => {
	return{
		data: modal
	}
}

export default withRouter(connect(mapStateToProps)(ModalContainer));
