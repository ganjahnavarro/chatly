import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import List from "../components/List";
import { Row, Col, Card, CardHeader, CardBody, Button, } from "reactstrap";
import * as c from "../constants";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import Info from '../components/Info';
import { _ } from 'app/Utils';

class Product extends Component {

	componentWillMount() {
		const { dispatch, match } = this.props;

		if(!_.isNil(match.params.productId)){
			dispatch({
				type: c.GET,
				productId: match.params.productId
			})
		}

		dispatch({
			type: c.GET_LIST
		});
	}

	componentDidUpdate(prevProps){
		const { match, list, dispatch, history } = this.props;
		if(!_.isEqual(list, prevProps.list) && list.size > 0 && _.isNil(match.params.productId)){
			history.push(`/products/${list.getIn([0, 'productId'])}`)
		}
		if(!_.isEqual(prevProps.match.params.productId, match.params.productId) && !_.isNil(match.params.productId)){
			dispatch({
				type: c.GET,
				productId: match.params.productId
			})
		}
	}

	handleAddProduct = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <AddProductModal />,
				toggle: true,
				title: "Add Branch",
				modalSize: "modal-lg",
				className: "primary"
			}
		});
	}

	handleEditProduct = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <EditProductModal />,
				toggle: true,
				title: "Edit Branch",
				modalSize: "modal-lg",
				className: "success"
			}
		});
	}

	handleClickRow = (productId) => {
		const { history } = this.props;
		history.push(`/products/${productId}`);
	}

	handleDelete = (productId) => e => {
		const { dispatch } = this.props;
		dispatch({
			type: c.DELETE,
			productId
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
								<strong>Products</strong>
								<Button
									onClick={ this.handleAddProduct }
									style={{ position: "absolute", right: 10 }}
									color="primary">
									Add Product
								</Button>
							</CardHeader>
							<CardBody style={{ height: 500 }}>
								<List 
									data={ list } 
									activeKey={ match.params.productId || null }
									handleClickRow={ this.handleClickRow }/>
							</CardBody>
						</Card>
					</Col>
					<Col md="8">
						<Card>
							<CardHeader>
								<strong>Admin Info</strong>
								{ selected.size > 0
									&& <div className="d-inline-block"
										style={{ position: "absolute", right: 10 }}>
										<Button
											onClick={ this.handleEditProduct }
											color="success">
											Edit Product
										</Button>
										{" "}
										<Button onClick={ this.handleDelete(match.params.productId) } color="danger">Delete Branch</Button>
									</div>
								}
							</CardHeader>
							<Info data={ selected } />
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

const mapStateToProps = ({ product }, routeParams) => {
	return {
		list: product.get("list"),
		selected: product.get("selected")
	};
};

export default withRouter(connect(mapStateToProps)(Product));
