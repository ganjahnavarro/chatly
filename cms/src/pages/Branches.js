import React from 'react'

import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Audit from '../components/Audit'
import Header from '../components/Header'

class Branches extends ListView {

	constructor(props) {
	    super(props);
        this.endpoint = "branches/";
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
					<Branch value={selectedItem} onFetch={this.onFetch}/>
				</div>
		    </div>
		</div>;
	}
}

class Branch extends DetailView {

	constructor(props) {
	    super(props);
        this.endpoint = "branches/";
	}

	render() {
		const { value, updateMode } = this.state;
		const { name, description } = value;
		const location = value.location || {};
		const onChange = super.onChange.bind(this);

	    return <div>
			<div className="ui form">
				<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
					name="name" value={name} disabled={!updateMode}
					onChange={onChange} />

				<Textarea name="description" label="Description"
					value={description} disabled={!updateMode}
					onChange={onChange} />

				<Textarea name="location.address" label="Address"
					value={location.address} disabled={!updateMode}
					onChange={onChange} />

				<div className="fields">
					<Input label="Latitude" name="location.lat" value={location.lat} disabled={!updateMode}
						onChange={onChange} fieldClassName="eight" />

					<Input label="Longitude" name="location.long" value={location.long} disabled={!updateMode}
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

export default Branches;
