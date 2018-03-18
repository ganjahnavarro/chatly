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

class AddCategoryModal extends PureComponent {

	componentWillMount(){
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'category_form',
			data: c.CATEGORY_FORM
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
			form: 'category_form',
			data: { [name]: e.target.value }
		})
	}

	onUploaded = (data) => {
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'category_form',
			data: { image_url: data }
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { form, dispatch } = this.props;
		dispatch({
			type: c.ADD,
			args: form.toJS()
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

const mapStateToProps = ({ category }, routeParams) => {
	return {
		form: category.get('category_form')
	};
};

export default withRouter(connect(mapStateToProps)(AddCategoryModal));
