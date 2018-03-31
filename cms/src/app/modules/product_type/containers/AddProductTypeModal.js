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
import productPlaceholder from "assets/img/191x100.png";
import Uploader from '../../common/components/Uploader';
import Select from 'react-select';
import { _ } from 'app/Utils';

class AddProductTypeModal extends PureComponent{

	componentWillMount(){
		const { dispatch } = this.props;
		dispatch({
			type: "CATEGORY/GET_LIST"
		})
		dispatch({
			type: "ATTRIBUTE/GET_LIST"
		})
		dispatch({
			type: c.SET_FORM,
			form: 'product_type_form',
			data: c.PRODUCT_TYPE_FORM
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
			form: 'product_type_form',
			data: { [name]: e.target.value }
		})
	}

	handleChangeSelect = (name) => data => {
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'product_type_form',
			data: {[name]: data ? data.value : ''}
		})
	}

	handleChangeMultiSelect = (name) => data => {
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'product_type_form',
			data: {
				[name]: data,
				price: ""
			}
		})
	}

	onUploaded = (data) => {
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'product_type_form',
			data: { image_url: data }
		})
	}

	getAttribValues = (attributesForm) => {
		let attribValues = [];
		const { attributes } = this.props;
		attributesForm.forEach(item => {
			attributes.toJS().forEach(item2 => {
				if(item === item2.id){
					attribValues.push(item2)
				}
			})
		})
		return attribValues;
	}


	handleSubmit = (e) => {
		e.preventDefault();
		const { form, dispatch} = this.props;
		const attributesForm = form.get('attributes').split(',')
		const attribValues = this.getAttribValues(attributesForm)

		dispatch({
			type: c.ADD,
			args: {
				..._.omit(form.toJS(), ['attributes']),
				attributes: attributesForm,
				attribValues
			}
		})
	}

	render() {
		const { form, categories, attributes } = this.props;
		
		let categoriesOption = [];
		let attributesOption = []

		categories.forEach(item => {
			categoriesOption.push({
				label: item.get('name'),
				value: item.get('categoryId')
			})
		})
		
		attributes.forEach(item => {
			attributesOption.push({
				label: item.get("name"),
				value: item.get("id")
			})
		})
		
		return (
			<form onSubmit={ this.handleSubmit }>
				<ModalBody>
					<Row>
						<Col className="pt-4 text-center">
							<img alt=""
								src={ form.get('image_url') || productPlaceholder}
								style={{ width: '100%', border: '2px solid #8c8c8c', padding: 3 }}
								className="img-fluid mb-1" />

							<Uploader 
								crop="191x100"
								// className="btn btn-info"
								label="Upload"
                            	onUploaded={ this.onUploaded }/>

						</Col>
						<Col xs="8">
							<Row>
								<Col>
									<FormGroup>
										<Label>Name</Label>
										<Input
											required
											onChange={ this.handleChangeInput('name') }
											value={ form.get('name') }
											type="text"
											placeholder="Product Name"
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label>Attribute</Label>
										<Select 
											required
											multi simpleValue
											closeOnSelect={ false }
											placeholder="Attribute"
											options={ attributesOption }
											value={ form.get('attributes') }
											onChange={ this.handleChangeMultiSelect('attributes') }
											/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<FormGroup>
										<Label>Category</Label>
										<Select 
											required
											placeholder="Category"
											options={ categoriesOption }
											value={ form.get('category_id') }
											onChange={ this.handleChangeSelect('category_id') }
											/>
									</FormGroup>
								</Col>
								<Col>
									<FormGroup>
										<Label>Price</Label>
										<Input
											required
											disabled={ form.get('attributes') !== "" }
											onChange={ this.handleChangeInput('price') }
											value={ form.get('price') }
											type="number"
											placeholder="Price"
										/>
									</FormGroup>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row>
						<Col xs="12">
							<FormGroup>
								<Label>Description</Label>
								<Input
									required
									onChange={ this.handleChangeInput('description') }
									value={ form.get('description') }
									type="textarea"
									placeholder="Description"
								/>
							</FormGroup>
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

const mapStateToProps = ({ product_type, category, attribute }, routeParams) => {
	return {
		form: product_type.get('product_type_form'),
		categories: category.get("list"),
		attributes: attribute.get('list')
	};
};

export default withRouter(connect(mapStateToProps)(AddProductTypeModal));
