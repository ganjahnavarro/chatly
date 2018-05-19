import _ from 'lodash'
import React from 'react'

class View extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    onChange(event) {
	    let nextState = this.state;
        _.set(nextState, event.target.name, event.target.value);
	    this.setState(nextState);
	}

}

export default View;
