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

class EditProductModal extends PureComponent{

	handleChangeInput = (name) => e => {
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'product_form',
			data: { [name]: e.target.value }
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

	handleSubmit = (e) => {
		e.preventDefault();
		const { form, dispatch, productTypeId } = this.props;
		dispatch({
			type: c.EDIT_PRODUCT,
			args: form.toJS(),
			productTypeId
		})
	}

	render(){
		const { form } = this.props;
		return(
			<form onSubmit={ this.handleSubmit }>
				<ModalBody>
					<Row>
						<Col>
							<FormGroup>
								<Label>Price</Label>
								<Input
									onChange={ this.handleChangeInput('price') }
									value={ form.get('price') }
									type="text"
									placeholder="Price"
								/>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Label>Attributes</Label>
								<Input
									disabled
									onChange={ () => {} }
									value={ form.get('attributes') }
									type="text"
									placeholder="Attributes"
								/>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								<Label>Discription</Label>
								<Input
									onChange={ this.handleChangeInput('description') }
									value={ form.get('description') }
									type="textarea"
									placeholder="Discription"
								/>
							</FormGroup>
						</Col>
					</Row>
				</ModalBody>
				<ModalFooter>
					<Button color="success">
						Update
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

const mapStateToProps = ({ product_type, category, attribute }, routeParams) => {
	return {
		form: product_type.get('product_form'),
	};
};

export default withRouter(connect(mapStateToProps)(EditProductModal));
