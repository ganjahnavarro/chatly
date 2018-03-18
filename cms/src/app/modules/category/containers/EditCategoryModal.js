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
import { _ } from 'app/Utils';

class EditCategoryModal extends PureComponent {

	componentWillMount(){
		const { dispatch, selected } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'category_form',
			data: _.pick(selected.toJS(), _.keys(c.CATEGORY_FORM))
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
		const { form, dispatch, selected } = this.props;
		dispatch({
			type: c.EDIT,
			args: form.toJS(),
			categoryId: selected.get('categoryId')
		})
	}

	render() {
		const { form } = this.props;
		return (
			<form onSubmit={ this.handleSubmit }>
				<ModalBody>
					<Row>
						<Col>
							<FormGroup>
								<Label>Name</Label>
								<Input
									onChange={ this.handleChangeInput('name') }
									value={ form.get('name') }
									type="text"
									placeholder="Product Name"
								/>
							</FormGroup>
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

const mapStateToProps = ({ category }, routeParams) => {
	return {
		form: category.get('category_form'),
		selected: category.get("selected")
	};
};

export default withRouter(connect(mapStateToProps)(EditCategoryModal));
