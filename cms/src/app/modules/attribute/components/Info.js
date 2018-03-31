import React, { PureComponent } from "react";
import {
	Row,
	Col,
	Form,
	Label,
	CardBody,
} from "reactstrap";

class Info extends PureComponent{

	render(){
		const { data } = this.props;

		let values = [];

		(data.get('values') || []).forEach(item => {
			values.push(item.get('name'))
		})

		return(
			<CardBody>
				<Row>
					<Col>
						<Form className="form-horizontal">
							<Row>
								<Col md="2">
									<Label><small>Name:</small></Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ data.get('name') || '--' }
									</p>
								</Col>
							</Row>
							<Row>
								<Col md="2">
									<Label><small>Code:</small></Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ data.get('code') || '--' }
									</p>
								</Col>
							</Row>
							<Row>
								<Col md="2">
									<Label>
										<small>Values:</small>
									</Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ values.join(', ') }
									</p>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
			</CardBody>
			);
	}
}

export default Info;