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
		return(
			<CardBody>
				<Row>
					<Col md="8">
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
									<Label><small>Latitude:</small></Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ data.getIn(['location', 'lat']) || '--' }
									</p>
								</Col>
							</Row>
							<Row>
								<Col md="2">
									<Label><small>Longitude:</small></Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ data.getIn(['location', 'long']) || '--' }
									</p>
								</Col>
							</Row>
							<Row>
								<Col md="2">
									<Label><small>Address:</small></Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ data.getIn(['location', 'address']) || '--' }
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