import React, { PureComponent } from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";


class ProductList extends PureComponent{

	handleEditProduct = (data) => e => {
		this.props.handleEditProduct(data);
	}

	render() {
		const { data } = this.props;
		return (
			<ListGroup style={{
				height: 300,
    			overflow: 'auto',
    			border: '2px solid #8c8c8c'
			}}>
				{ data.size > 0
					? data.map((item,i) => {
						let attributes = [];

						item.get('attribute_values').forEach(value => {
							attributes.push(value.getIn(['attribute_value', 'name']))
						})

						return (
							<ListGroupItem key={`product-${i}`}>
								<h6 className="d-inline-block m-0"
									style={{
										width: "80%",
										verticalAlign: "middle"
									}}>
									<table className="table table-bordered" width="100%">
										<tbody>
											<tr>
												<td width="30%"><small>Price</small></td>
												<td>{ `PHP ${item.get('price')}` || '--' }</td>
											</tr>
											<tr>
												<td width="30%"><small>Description</small></td>
												<td>{ item.get('description') || '--' }</td>
											</tr>
											<tr>
												<td width="30%"><small>Attributes</small></td>
												<td>{ attributes.join(', ')}</td>
											</tr>
										</tbody>
									</table>
								</h6>
								<div className="d-inline-block text-right" style={{width: "20%"}}>
									<Button size="sm" color="success"
										onClick={ this.handleEditProduct(item)}>
										Edit Product
									</Button>
								</div>
							</ListGroupItem>
						)
					})
					: <div className="text-center">
						<h4>
							<p><i className="fa fa-file fa-lg mt-4" /></p>
							<p>Not Found</p>
						</h4>
					</div>
				}
			</ListGroup>
		);
	}

}

export default ProductList;