import React from 'react'
import View from './View'

import Fetch from '../../core/Fetch'

class Temp extends View {

    constructor(props) {
        super(props);
		this.onFetch = this.onFetch.bind(this);
    }

    componentDidMount() {
		this.onFetch(null);
	}

    onDelete() {
		let items = this.state.items.filter((item) => this.state.selectedItem.id !== item.id);
		this.setState({items});
		if (items) this.onItemClick(0);
	}

    onFilter(event) {
		super.onChange(event);
		this.onFetch({filter: event.target.value});
	}

	onFetch(extraParameters) {
		let defaultParameters = {
			orderedBy: "name",
			pageSize: 100,
			pageOffset: 0
		};

		let parameters = Object.assign({}, defaultParameters, extraParameters);

		Fetch.get(this.endpoint, parameters, (items) => {
			this.setState({items});
			if (items) this.onItemClick(0);
		});
	}

    renderItem(item, index) {
		return <li key={index} onClick={this.onItemClick.bind(this, index)}>
			{this.getDisplayName ? this.getDisplayName(item) : item.name}
		</li>;
	}

    firstItem() {
		this.onItemClick(0);
	}

	nextItem() {
		let { items, selectedIndex } = this.state;
		if (items.length - 1 > selectedIndex) {
			this.onItemClick(selectedIndex + 1);
		}
	}

	previousItem() {
		let { selectedIndex } = this.state;
		if (selectedIndex > 0) {
			this.onItemClick(selectedIndex - 1);
		}
	}

	lastItem() {
		this.onItemClick(this.state.items.length - 1);
	}

    onItemClick(index) {
        let item = this.state.items[index];

		this.setState({
			selectedItem: item,
			selectedIndex: index
		});
	}

}

export default Temp;
