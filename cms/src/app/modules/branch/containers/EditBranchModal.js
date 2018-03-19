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

class EditBranchModal extends PureComponent {

	componentWillMount(){
		const { dispatch, selected } = this.props;
		const { name, location } = selected.toJS();
		dispatch({
			type: c.SET_FORM,
			form: 'branch_form',
			data: {
				address: location.address,
				lat: location.lat,
				long: location.long,
				name
			}
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
		const { form, dispatch, selected } = this.props;
		const {
			address,
			lat,
			long,
			name,
		} = form.toJS()

		dispatch({
			type: c.EDIT,
			args: {
				name,
				location: {
					address,
					lat,
					long,
				}
			},
			branchId: selected.get('branchId')
		})
	}

	render() {
		const { form } = this.props;
		console.log(form.toJS())
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
					<Button color="success">
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
		form: branch.get('branch_form'),
		selected: branch.get("selected")
	};
};

export default withRouter(connect(mapStateToProps)(EditBranchModal));
