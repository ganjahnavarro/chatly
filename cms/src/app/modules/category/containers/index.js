import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import List from "../components/List";
import { Row, Col, Card, CardHeader, CardBody, Button, } from "reactstrap";
import * as c from "../constants";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import Info from '../components/Info';
import { _ } from 'app/Utils';

class Category extends Component {

	componentWillMount() {
		const { dispatch, match } = this.props;

		if(!_.isNil(match.params.categoryId)){
			dispatch({
				type: c.GET,
				categoryId: match.params.categoryId
			})
		}

		dispatch({
			type: c.GET_LIST
		});
	}

	componentDidUpdate(prevProps){
		const { match, list, dispatch, history } = this.props;
		if(!_.isEqual(list, prevProps.list) && list.size > 0 && _.isNil(match.params.categoryId)){
			history.push(`/categories/${list.getIn([0, 'categoryId'])}`)
		}
		if(!_.isEqual(prevProps.match.params.categoryId, match.params.categoryId) && !_.isNil(match.params.categoryId)){
			dispatch({
				type: c.GET,
				categoryId: match.params.categoryId
			})
		}
	}

	handleAddCategory = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <AddCategoryModal />,
				toggle: true,
				title: "Add Category",
				modalSize: "modal-lg",
				className: "primary"
			}
		});
	}

	handleEditCategory = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <EditCategoryModal />,
				toggle: true,
				title: "Edit Branch",
				modalSize: "modal-lg",
				className: "success"
			}
		});
	}

	handleClickRow = (categoryId) => {
		const { history } = this.props;
		history.push(`/categories/${categoryId}`);
	}

	handleDelete = (categoryId) => e => {
		const { dispatch } = this.props;
		dispatch({
			type: c.DELETE,
			categoryId
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
								<strong>Categories</strong>
								<Button
									onClick={ this.handleAddCategory }
									style={{ position: "absolute", right: 10 }}
									color="primary">
									Add Category
								</Button>
							</CardHeader>
							<CardBody style={{ height: 500 }}>
								<List 
									data={ list } 
									activeKey={ match.params.categoryId || null }
									handleClickRow={ this.handleClickRow }/>
							</CardBody>
						</Card>
					</Col>
					<Col md="8">
						<Card>
							<CardHeader>
								<strong>Category Info</strong>
								{ selected.size > 0
									&& <div className="d-inline-block"
										style={{ position: "absolute", right: 10 }}>
										<Button
											onClick={ this.handleEditCategory }
											color="success">
											Edit Category
										</Button>
										{" "}
										<Button onClick={ this.handleDelete(match.params.categoryId) } color="danger">Delete Branch</Button>
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

const mapStateToProps = ({ category }, routeParams) => {
	return {
		list: category.get("list"),
		selected: category.get("selected")
	};
};

export default withRouter(connect(mapStateToProps)(Category));
