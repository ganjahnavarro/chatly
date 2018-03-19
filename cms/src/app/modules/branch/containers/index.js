import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import List from "../components/List";
import { Row, Col, Card, CardHeader, CardBody, Button, } from "reactstrap";
import * as c from "../constants";
import AddBranchModal from "./AddBranchModal";
import EditBranchModal from "./EditBranchModal";
import Info from '../components/Info';
import { _ } from 'app/Utils';

class Branch extends Component {

	componentWillMount() {
		const { dispatch, match } = this.props;

		if(!_.isNil(match.params.branchId)){
			dispatch({
				type: c.GET,
				branchId: match.params.branchId
			})
		}

		dispatch({
			type: c.GET_LIST
		});
	}

	componentDidUpdate(prevProps){
		const { match, list, dispatch, history } = this.props;
		if(!_.isEqual(list, prevProps.list) && list.size > 0 && _.isNil(match.params.branchId)){
			history.push(`/branches/${list.getIn([0, 'branchId'])}`)
		}
		if(!_.isEqual(prevProps.match.params.branchId, match.params.branchId) && !_.isNil(match.params.branchId)){
			dispatch({
				type: c.GET,
				branchId: match.params.branchId
			})
		}
	}

	handleAddBranch = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <AddBranchModal />,
				toggle: true,
				title: "Add Branch",
				modalSize: "modal-lg",
				className: "primary"
			}
		});
	}

	handleEditBranch = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <EditBranchModal />,
				toggle: true,
				title: "Edit Branch",
				modalSize: "modal-lg",
				className: "success"
			}
		});
	}

	handleClickRow = (branchId) => {
		const { history } = this.props;
		history.push(`/branches/${branchId}`);
	}

	handleDelete = (branchId) => e => {
		const { dispatch } = this.props;
		dispatch({
			type: c.DELETE,
			branchId
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
								<strong>Branches</strong>
								<Button
									onClick={ this.handleAddBranch }
									style={{ position: "absolute", right: 10 }}
									color="primary">
									Add Branch
								</Button>
							</CardHeader>
							<CardBody style={{ height: 500 }}>
								<List 
									data={ list } 
									activeKey={ match.params.branchId || null }
									handleClickRow={ this.handleClickRow }/>
							</CardBody>
						</Card>
					</Col>
					<Col md="8">
						<Card>
							<CardHeader>
								<strong>Branch Info</strong>
								{ selected.size > 0
									&& <div className="d-inline-block"
										style={{ position: "absolute", right: 10 }}>
										<Button
											onClick={ this.handleEditBranch }
											color="success">
											Edit Branch
										</Button>
										{" "}
										<Button onClick={ this.handleDelete(match.params.branchId) } color="danger">Delete Branch</Button>
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

const mapStateToProps = ({ branch }, routeParams) => {
	return {
		list: branch.get("list"),
		selected: branch.get("selected")
	};
};

export default withRouter(connect(mapStateToProps)(Branch));
