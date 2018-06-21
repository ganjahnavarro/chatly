import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Login from './Login'
import Dashboard from './Dashboard'

import Branches from './Branches'
import Categories from './Categories'
import Promos from './Promos'

import Todo from './Todo'

class App extends React.Component {

    render() {
        return <div className="ui container app">
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route path="/dashboard" component={Dashboard}/>

                <Route path="/categories" component={Categories} />
                <Route path="/branches" component={Branches} />
                <Route path="/promos" component={Promos} />

                <Route path="/todo" component={Todo} />
                <Route component={Todo}/>
            </Switch>
        </div>;
    }

}

export default App;
