import React from 'react'
import View from './View'

import Fetch from '../../core/Fetch'
import Button from '../../components/Button'

class Detail extends View {

    constructor(props) {
        super(props);
        this.state = {value: this.props.value || {}};
    }

    componentWillReceiveProps(nextProps) {
		this.setState({value:  Object.assign({}, nextProps.value)});
	}

    onDelete() {
		Fetch.delete(this.endpoint, this.props.value._id, () => this.props.onFetch());
	}

	onSave() {
		this.state.updateMode === "CREATE" ? this.onCreate() :  this.onUpdate();
	}

	onCreate() {
		Fetch.post(this.endpoint, this.getRequestValue(), () => {
			this.setState({updateMode : null});
			this.props.onFetch();
		});
	}

	onUpdate() {
		Fetch.put(this.endpoint, this.getRequestValue(), () => {
			this.setState({updateMode : null});
			this.props.onFetch();
		});
	}

	onChange(event) {
	    let nextState = this.state.value || {};
	    nextState[event.target.name] = event.target.value;
	    this.setState(nextState);
	}

    onAdd() {
        this.setState({
            updateMode: "CREATE",
            previousValue: this.state.value,
            value: {}
        }, function() {
            this.initialInput.focus();
        });
    }

    onCancel() {
        this.setState({
            updateMode: null,
            value: this.state.previousValue
        });
    }

    onEdit() {
        this.setState({
            updateMode: "EDIT",
            previousValue: this.state.value
        }, function() {
            this.initialInput.focus();
        });
    }

    getActions() {
        let value = this.state.value;

        let viewingActions = <div>
            <Button className="ui green button" icon="add" onClick={() => this.onAdd()}>Add</Button>
            {value && value._id ? <Button className="ui blue button" icon="write" onClick={() => this.onEdit()}>Edit</Button> : null}
            {value && value._id ? <Button className="ui button" icon="trash" onClick={() => this.onDelete()}>Delete</Button> : null}
        </div>;

        let editingActions = <div>
            <Button className="ui green button" icon="save" onClick={() => this.onSave()}>Save</Button>
            <Button className="ui button" icon="ban" onClick={() => this.onCancel()}>Cancel</Button>
        </div>;

        return <div className="actions">
            {this.state.updateMode ? editingActions : viewingActions}
        </div>;
    }

    getRequestValue() {
        return this.state.value;
	}

}

export default Detail;
