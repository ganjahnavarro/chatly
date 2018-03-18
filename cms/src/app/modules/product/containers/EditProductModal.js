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
import productPlaceholder from "assets/img/shop-placeholder.png";
import Uploader from '../../common/components/Uploader';
import { _ } from 'app/Utils';

class EditProductModal extends PureComponent {

	componentWillMount(){
		const { dispatch, selected } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'product_form',
			data: _.pick(selected.toJS(), _.keys(c.PRODUCT_FORM))
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
			form: 'product_form',
			data: { [name]: e.target.value }
		})
	}

	onUploaded = (data) => {
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'product_form',
			data: { image_url: data }
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { form, dispatch, selected } = this.props;
		dispatch({
			type: c.EDIT,
			args: form.toJS(),
			productId: selected.get('productId')
		})
	}

	render() {
		const { form } = this.props;
		return (
			<form onSubmit={ this.handleSubmit }>
				<ModalBody>
					<Row>
						<Col className="pt-4 text-center" xs="3">
							<img alt=""
								src={ form.get('image_url') || productPlaceholder}
								style={{ border: '2px solid #8c8c8c', padding: 3 }}
								className="img-fluid" />

							<Uploader 
								className="btn "
								label="Upload"
                            	onUploaded={ this.onUploaded }/>

						</Col>
						<Col xs="9">
							<Row>
								<Col xs="6">
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
								<Col>
									<FormGroup>
										<Label>Category</Label>
										<Input
											onChange={ this.handleChangeInput('categoryId') }
											value={ form.get('categoryId') }
											type="select"
											placeholder="Category"
										/>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label>Price</Label>
										<Input
											onChange={ this.handleChangeInput('price') }
											value={ form.get('price') }
											type="number"
											placeholder="Price"
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col xs="12">
									<FormGroup>
										<Label>Description</Label>
										<Input
											onChange={ this.handleChangeInput('description') }
											value={ form.get('description') }
											type="textarea"
											placeholder="Description"
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

const mapStateToProps = ({ product }, routeParams) => {
	return {
		form: product.get('product_form'),
		selected: product.get("selected")
	};
};

export default withRouter(connect(mapStateToProps)(EditProductModal));
