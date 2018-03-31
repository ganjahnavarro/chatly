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

class AddAttributeModal extends PureComponent {

	state = {

	}

	componentWillMount(){
		const { dispatch } = this.props;
		dispatch({
			type: c.SET_FORM,
			form: 'attribute_form',
			data: {
				name: "",
				code: "",
				values: [ { name: "" } ]
			}
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
			form: 'attribute_form',
			data: { [name]: e.target.value }
		})
	}

	handleEditLength = (n, type) => e => {
		const { form, dispatch } = this.props;
		let values = form.toJS().values;

		if(type === "add")
			values.push({ name: "" })

		if(type === "remove")
			values = values.filter((item,i) => n !== i)

		dispatch({
			type: c.SET_FORM,
			form: 'attribute_form',
			data: { values }
		})
	}

	handleChangeInputLoop = (n, key) => e => {
		const { form, dispatch } = this.props;
		let values = form.toJS().values;

		values[n][key] = e.target.value;

		dispatch({
			type: c.SET_FORM,
			form: 'attribute_form',
			data: { values }
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

		const values = form.get('values').map((item,i) => (
			<Row key={`values-${i}`}>
				<Col xs="8">
					<FormGroup>
						<Label>Name Value</Label>
						<Input
							onChange={ this.handleChangeInputLoop(i, 'name') }
							value={ item.get("name") }
							type="text"
							placeholder="Name Value"
						/>
					</FormGroup>
				</Col>
				<Col>
					<FormGroup style={{marginTop: 30}}>
						<Button 
							onClick={ this.handleEditLength(i, "add") } 
							color="success">
							Add Value
						</Button>{" "}
						<Button 
							onClick={ this.handleEditLength(i, "remove") } 
							color="danger">
							Remove Value
						</Button>
					</FormGroup>
				</Col>
			</Row>
			)
		)


		return (
			<form onSubmit={ this.handleSubmit }>
				<ModalBody>
					<Row>
						<Col>
							<FormGroup>
								<Label>Attribute Name</Label>
								<Input
									onChange={ this.handleChangeInput('name') }
									value={ form.get('name') }
									type="text"
									placeholder="Name"
								/>
							</FormGroup>
						</Col>
						<Col xs="4">
							<FormGroup>
								<Label>Code</Label>
								<Input
									onChange={ this.handleChangeInput('code') }
									value={ form.get('code') }
									type="text"
									placeholder="Code"
								/>
							</FormGroup>
						</Col>
					</Row>
					{ values }
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

const mapStateToProps = ({ attribute }, routeParams) => {
	return {
		form: attribute.get('attribute_form')
	};
};

export default withRouter(connect(mapStateToProps)(AddAttributeModal));
