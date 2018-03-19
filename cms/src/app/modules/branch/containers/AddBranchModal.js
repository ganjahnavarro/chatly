import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
	ModalBody,
	ModalFooter,
	Button,
	FormGroup,
	Row,
	Col,
	Label,
	Input
} from "reactstrap";
import * as c from '../constants';

class AddBranchModal extends PureComponent {

	componentWillMount(){
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'branch_form',
			data: c.BRANCH_FORM
		})
	}

	handleCloseModal = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: false,
				content: null,
				title: "",
			}
		});
	}

	handleChangeInput = (name) => e => {
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'branch_form',
			data: { [name]: e.target.value }
		})
	}

	onUploaded = (data) => {
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'branch_form',
			data: { image_url: data }
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { form, dispatch } = this.props;
		const {
			address,
			lat,
			long,
			name,
		} = form.toJS();
		dispatch({
			type: c.ADD,
			args: {
				name,
				location: {
					address,
					lat,
					long,
				}
			},
		})
	}

	render() {
		const { form } = this.props;
		return (
			<form onSubmit={ this.handleSubmit }>
				<ModalBody>
					<Row>
						<Col>
							<Row>
								<Col>
									<FormGroup>
										<Label>Name</Label>
										<Input
											onChange={ this.handleChangeInput('name') }
											value={ form.get('name') }
											type="text"
											placeholder="Category Name"
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label>Name</Label>
										<Input
											onChange={ this.handleChangeInput('lat') }
											value={ form.get('lat') }
											type="number"
											placeholder="Latitude"
										/>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label>Name</Label>
										<Input
											onChange={ this.handleChangeInput('long') }
											value={ form.get('long') }
											type="number"
											placeholder="Longitude"
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label>Address</Label>
										<Input
											onChange={ this.handleChangeInput('address') }
											value={ form.get('address') }
											type="textarea"
											placeholder="Address"
										/>
									</FormGroup>
								</Col>
							</Row>
						</Col>
					</Row>
				</ModalBody>
				<ModalFooter>
					<Button color="primary">
						Create
					</Button>
					{" "}
					<Button color="secondary" onClick={this.handleCloseModal}>
						Cancel
					</Button>
				</ModalFooter>
			</form>
		);
	}
}

const mapStateToProps = ({ branch }, routeParams) => {
	return {
		form: branch.get('branch_form')
	};
};

export default withRouter(connect(mapStateToProps)(AddBranchModal));
