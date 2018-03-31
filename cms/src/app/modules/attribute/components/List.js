import React, { PureComponent } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";

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
				height: 450,
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
							<h6 className="d-inline-block pl-3 m-0"
								style={{
									verticalAlign: "middle"
								}}>{ item.get('name')} <br/>
								<small>{ item.get('code') }</small>
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
