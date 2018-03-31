import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import List from "../components/List";
import { Row, Col, Card, CardHeader, CardBody, Button, } from "reactstrap";
import * as c from "../constants";
import AddAttributeModal from "./AddAttributeModal";
import EditAttributeModal from "./EditAttributeModal";
import Info from '../components/Info';
import { _ } from 'app/Utils';

class Attribute extends Component {

	componentWillMount() {
		const { dispatch, match } = this.props;
		
		if(!_.isNil(match.params.attributeId)){
			dispatch({
				type: c.GET,
				attributeId: match.params.attributeId
			})
		}

		dispatch({
			type: c.GET_LIST
		});
	}

	componentDidUpdate(prevProps){
		const { match, list, dispatch, history } = this.props;
		if(!_.isEqual(list, prevProps.list) && list.size > 0 && _.isNil(match.params.attributeId)){
			history.push(`/attributes/${list.getIn([0, 'id'])}`)
		}
		if(!_.isEqual(prevProps.match.params.attributeId, match.params.attributeId) && !_.isNil(match.params.attributeId)){
			dispatch({
				type: c.GET,
				attributeId: match.params.attributeId
			})
		}
	}

	handleAddAttribute = e => {
		const { dispatch } = this.props;
		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <AddAttributeModal />,
				toggle: true,
				title: "Add Attribute",
				modalSize: "modal-lg",
				className: "primary"
			}
		});
	}

	handleEditAttribute = e => {
		const { dispatch, selected, match } = this.props;

		dispatch({
			type: c.SET_FORM,
			form: 'attribute_form',
			data: selected.toJS()
		})

		dispatch({
			type: "MODAL",
			data: {
				isOpen: true,
				content: <EditAttributeModal 
					attributeId={ match.params.attributeId || null }/>,
				toggle: true,
				title: "Edit Attribute",
				modalSize: "modal-lg",
				className: "success"
			}
		});
	}

	handleClickRow = (attributeId) => {
		const { history } = this.props;
		history.push(`/attributes/${attributeId}`);
	}

	handleDelete = (attributeId) => e => {
		const { dispatch } = this.props;
		dispatch({
			type: c.DELETE,
			attributeId
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
								<strong>Attributes</strong>
								<Button
									onClick={ this.handleAddAttribute }
									style={{ position: "absolute", right: 10 }}
									color="primary">
									Add Attribute
								</Button>
							</CardHeader>
							<CardBody style={{ height: 500 }}>
								<List 
									data={ list } 
									activeKey={ match.params.attributeId || null }
									handleClickRow={ this.handleClickRow }/>
							</CardBody>
						</Card>
					</Col>
					<Col md="8">
						<Card>
							<CardHeader>
								<strong>Attribute Info</strong>
								{ selected.size > 0
									&& <div className="d-inline-block"
										style={{ position: "absolute", right: 10 }}>
										<Button
											onClick={ this.handleEditAttribute }
											color="success">
											Edit Attribute
										</Button>
										{" "}
										<Button 
											color="danger"
											onClick={ this.handleDelete(match.params.attributeId) }>
											Delete Attribute
										</Button>
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

const mapStateToProps = ({ attribute }, routeParams) => {
	return {
		list: attribute.get("list"),
		selected: attribute.get("selected")
	};
};

export default withRouter(connect(mapStateToProps)(Attribute));
