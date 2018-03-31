import React, { PureComponent } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import productPlaceholder from "assets/img/shop-placeholder.png";

class List extends PureComponent {


	handleClickRow = (data) => (e) => {
		const { activeKey, handleClickRow } = this.props;
		if(activeKey !== data.get('id')){
			handleClickRow(data.get('id'))
		}
	}

	render() {
		const { data, activeKey } = this.props;
		return (
			<ListGroup style={{
				height: 550,
    			overflow: 'auto',
    			border: '2px solid #8c8c8c'
			}}>
				{ data.size > 0
					? data.map((item,i) => (
						<ListGroupItem 
							key={`product-${i}`} 
							onClick={ this.handleClickRow(item) } 
							action 
							active={ item.get('id') === activeKey }>
							<img alt=""
								style={{ width: "20%" }}
								src={ item.get('image_url') || productPlaceholder }
								className="img-fluid"
							/>
							<h6 className="d-inline-block pl-3 m-0"
								style={{
									width: "80%",
									verticalAlign: "middle"
								}}>{ item.get('name')} <br/>
								<small>{ item.get('description') }</small>
							</h6>
						</ListGroupItem>
					))
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

export default List;
