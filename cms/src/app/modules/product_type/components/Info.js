import React, { PureComponent } from "react";
import {
	Row,
	Col,
	Form,
	FormGroup,
	Label,
	CardBody,
} from "reactstrap";
import productPlaceholder from "assets/img/shop-placeholder.png";

class Info extends PureComponent{

	render(){
		const { data } = this.props;
		return(
			<CardBody>
				<Row>
					<Col md="4">
						<FormGroup row>
							<Col>
								<img alt=""
									style={{ border: '2px solid #8c8c8c', padding: 3 }}
									className="img-fluid" 
									src={ data.get('image_url') || productPlaceholder}/>
							</Col>
						</FormGroup>
					</Col>
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
									<Label><small>Price:</small></Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ data.get('price') ? `PHP ${data.get('price')}` : '--' }
									</p>
								</Col>
							</Row>
							<Row>
								<Col md="2">
									<Label>
										<small>Category:</small>
									</Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ data.getIn(['category', 'name']) || '--'}
									</p>
								</Col>
							</Row>
							<Row>
								<Col md="2">
									<Label>
										<small>Description:</small>
									</Label>
								</Col>
								<Col xs="12" md="10">
									<p className="form-control-static">
										{ data.get('description') || '--' }
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