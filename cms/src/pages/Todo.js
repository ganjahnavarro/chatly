import React from 'react'
import View from './abstract/View'

import Header from '../components/Header'

class Todo extends View {

	render() {
		return <div>
			<Header />
			<div className="screen-center">
				<div className="ui grey image">
					<img id="brand" src="resources/images/icon_todo.png" className="image" alt="Placeholder logo" />
				</div>
				<p className="message">This page is under construction.</p>
			</div>
		</div>;
	}
}

export default Todo;
