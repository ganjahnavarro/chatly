import React from 'react'
import View from './abstract/View'
import { Link } from 'react-router-dom'

import Header from '../components/Header'

class Dashboard extends View {

	renderItem(item, index) {
		let colors = ["red", "orange", "yellow", "olive", "green", "teal",
			"blue", "violet", "purple", "pink"];

		return <div key={item.label} className={"ui card " + colors[index]}>
			<Link to={item.link} className="image">
				<div className="image-container">
					<img src={"resources/images/" + item.icon + ".png"} alt={item.label} />
				</div>
			</Link>

			<Link to={item.link} className="content">
				<span className="header">{item.label}</span>
			</Link>
		</div>
	}

	render() {
		let files = [
			{link: "/branches", label: "Branches", icon: "icon_branches"},
			{link: "/categories", label: "Categories", icon: "icon_categories"},
			{link: "/promos", label: "Promos", icon: "icon_promos"}
		];

		let filesComponents = files.map((item, index) => this.renderItem(item, index));

		/*
		let transactions = [];
		let reports = [];

		let transactionsComponents = transactions.map((item, index) => this.renderItem(item, index));
		let reportsComponents = reports.map((item, index) => this.renderItem(item, index));
		*/

		return <div>
			<Header />
			<div className="dashboard">
				<div className="group">
					<div className="ui large label teal">Files</div> <br/>
					<div className="ui link seven cards">
						{filesComponents}
					</div>
				</div>

				{/* <div className="group">
					<div className="ui large label blue">Transactions</div>
					<div className="ui link six cards">
						{transactionsComponents}
					</div>
				</div>

				<div className="group">
					<div className="ui large label violet">Reports</div>
					<div className="ui link five cards">
						{reportsComponents}
					</div>
				</div> */}
			</div>
		</div>
	}
}

export default Dashboard;
