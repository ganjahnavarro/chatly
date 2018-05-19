import React from 'react'

import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Switch from '../components/Switch'
import Textarea from '../components/Textarea'
import Audit from '../components/Audit'
import Header from '../components/Header'

class Promos extends ListView {

	constructor(props) {
	    super(props);
        this.endpoint = "promos/";
		this.getDisplayName = (item) => item.code;
	}

	render() {
		let items = [];
		let selectedItem = this.state.selectedItem;

		if (this.state.items) {
			items = this.state.items.map(this.renderItem.bind(this));
		}

	    return <div>
			<Header />
			<div className="ui grid">
				<div className="five wide column ui form">
					<Input label="Search" value={this.state.filter} name="filter"
						onChange={this.onFilter.bind(this)} placeholder="Type here to search" />

					<div className="ui divider"></div>
					<div className="files">
						<ul className="ui list">{items}</ul>
					</div>
				</div>

				<div className="eleven wide column">
					<Promo value={selectedItem} onFetch={this.onFetch}/>
				</div>
		    </div>
		</div>;
	}
}

class Promo extends DetailView {

	constructor(props) {
	    super(props);
        this.endpoint = "promos/";
	}

	render() {
		const onChange = super.onChange.bind(this);

		const { value, updateMode } = this.state;
		const {
			code,
			description,
			discount_amount: discountAmount,
			start_date: startDate,
			end_date: endDate,
			active
		} = value;

	    return <div>
			<div className="ui form">
				<div className="fields">
					<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Code"
						name="code" value={code} disabled={!updateMode}
						onChange={onChange} fieldClassName="eight" />

					<Input label="Discount Amount" name="discount_amount"
						value={discountAmount} disabled={!updateMode}
						onChange={onChange} fieldClassName="eight" />
				</div>

				<Switch name="active" label="Active"
					checked={active} disabled={!updateMode}
					onChange={onChange} />

				<Textarea name="description" label="Description"
					value={description} disabled={!updateMode}
					onChange={onChange} />

				<div className="fields">
					<Input label="Start Date" name="start_date"
						value={startDate} disabled={!updateMode}
						onChange={onChange} fieldClassName="eight" />

					<Input label="End Date" name="end_date"
						value={endDate} disabled={!updateMode}
						onChange={onChange} fieldClassName="eight" />
				</div>
			</div>

			<div>
				<Audit value={value} />
				{super.getActions()}
			</div>
	    </div>
	}
}

export default Promos;
