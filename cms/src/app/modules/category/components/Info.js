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
						</Form>
					</Col>
				</Row>
			</CardBody>
			);
	}
}

export default Info;