import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ProductTypeList from "../components/List";
import { Row, Col, Card, CardHeader, CardBody, Button, } from "reactstrap";
import * as c from "../constants";
import AddProductTypeModal from "./AddProductTypeModal";
import EditProductTypeModal from "./EditProductTypeModal";
import Info from '../components/Info';
import { _ } from 'app/Utils';
import ProductList from '../components/ProductList';
import { List } from 'immutable';
import EditProductModal from './EditProductModal';

class Product extends Component {

	componentWillMount() {
		const { dispatch, match } = this.props;

		if(!_.isNil(match.params.productTypeId)){
			dispatch({
				type: c.GET,
				id: match.params.productTypeId
			})
		}

		dispatch({
			type: c.GET_LIST
		});
	}

	componentDidUpdate(prevProps){
		const { match, list, dispatch, history } = this.props;
		if(!_.isEqual(list, prevProps.list) && list.size > 0 && _.isNil(match.params.productTypeId)){
			history.push(`/product-types/${list.getIn([0, 'id'])}`)
		}
		if(!_.isEqual(prevProps.match.params.productTypeId, match.params.productTypeId) && !_.isNil(match.params.productTypeId)){
			dispatch({
				type: c.GET,
				id: match.params.productTypeId
			})
		}
	}

	handleAddProduct = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <AddProductTypeModal />,
				toggle: true,
				title: "Add Product Type",
				modalSize: "modal-lg",
				className: "primary"
			}
		});
	}

	handleEditProductType = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <EditProductTypeModal />,
				toggle: true,
				title: "Edit Product Type",
				modalSize: "modal-lg",
				className: "success"
			}
		});
	}

	handleClickRow = (productTypeId) => {
		const { history } = this.props;
		history.push(`/product-types/${productTypeId}`);
	}

	handleDelete = (productTypeId) => e => {
		const { dispatch } = this.props;
		dispatch({
			type: c.DELETE,
			productTypeId
		})
	}

	handleEditProduct = (data) => {
		const { dispatch, match } = this.props;

		let attrib = [];

		data.get('attribute_values').forEach(item => {
			attrib.push(item.getIn(['attribute_value', 'name']))
		})

		dispatch({
			type: c.SET_FORM,
			form: "product_form",
			data: {
				..._.omit(data.toJS(), ['attribute_values']),
				attributes: attrib.join(', '),
			}
		})

		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <EditProductModal 
					productTypeId={ match.params.productTypeId } />,
				toggle: true,
				title: "Edit Product",
				modalSize: "modal-lg",
				className: "success"
			}
		});
	}

	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type: c.CLEAR_STATE
		})
	}

	render() {
		const { list, selected, match } = this.props;
		return (
			<div className="animated fadeIn">
				<Row>
					<Col md="4">
						<Card>
							<CardHeader>
								<strong>Product Types</strong>
								<Button
									onClick={ this.handleAddProduct }
									style={{ position: "absolute", right: 10 }}
									color="primary">
									Add Product Type
								</Button>
							</CardHeader>
							<CardBody style={{ height: 600 }}>
								<ProductTypeList 
									data={ list } 
									activeKey={ match.params.productTypeId || null }
									handleClickRow={ this.handleClickRow }/>
							</CardBody>
						</Card>
					</Col>
					<Col md="8">
						<Card>
							<CardHeader>
								<strong>Product Type Info</strong>
								{ selected.size > 0
									&& <div className="d-inline-block"
										style={{ position: "absolute", right: 10 }}>
										<Button
											onClick={ this.handleEditProductType }
											color="success">
											Edit Product
										</Button>
										{" "}
										<Button onClick={ this.handleDelete(match.params.productTypeId) } color="danger">Delete Branch</Button>
									</div>
								}
							</CardHeader>
							<Info data={ selected } />
						</Card>
						<Card>
							<CardHeader>
								<strong>Products Info</strong>
							</CardHeader>
							<CardBody style={{ height: 350 }}>
								<ProductList 
									handleEditProduct={ this.handleEditProduct }
									data={ selected.get('products') || List([]) }/>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = ({ product_type }, routeParams) => {
	return {
		list: product_type.get("list"),
		selected: product_type.get("selected")
	};
};

export default withRouter(connect(mapStateToProps)(Product));
