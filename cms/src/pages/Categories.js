import React from 'react'

import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Audit from '../components/Audit'
import Header from '../components/Header'

class Categories extends ListView {

	constructor(props) {
	    super(props);
        this.endpoint = "categories/";
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
					<Category value={selectedItem} onFetch={this.onFetch}/>
				</div>
		    </div>
		</div>;
	}
}

class Category extends DetailView {

	constructor(props) {
	    super(props);
        this.endpoint = "categories/";
	}

	render() {
		const { value, updateMode } = this.state;
		const { name, description, image_url: imageUrl } = value;
		const onChange = super.onChange.bind(this);

	    return <div>
			<div className="ui form">
				<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
					name="name" value={name} disabled={!updateMode}
					onChange={onChange} />

				<Input name="imageUrl" label="Image URL" value={imageUrl}
					disabled={!updateMode} onChange={onChange} />

				<Textarea name="description" label="Description"
					value={description} disabled={!updateMode}
                    onChange={onChange} />
			</div>

			<div>
				<Audit value={value} />
				{super.getActions()}
			</div>
	    </div>
	}
}

export default Categories;
