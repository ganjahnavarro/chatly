import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
    Container,
    Row,
    Col,
    CardGroup,
    Card,
    CardBody,
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";

class CreateAccount extends Component{

    state = {
        email: '',
        password: ''
    }

    handleChangeInput = ({ target }) => {
        this.setState({[target.name]: target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({
            type: "CREATE_ACCOUNT",
            args: this.state
        })
    }


    render(){
        console.log('here')
        return(
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="8">
                            <CardGroup>
                                <Card className="p-4">
                                    <form onSubmit={ this.handleSubmit }>
                                        <CardBody>
                                            <h1>Create an Account</h1>
                                            <p className="text-muted">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit
                                            </p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    autoComplete="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    value={ this.state.email }
                                                    name="email"
                                                    onChange={ this.handleChangeInput }
                                                />
                                            </InputGroup>
                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    autoComplete="current-password"
                                                    type="password"
                                                    placeholder="Password"
                                                    value={ this.state.password }
                                                    name="password"
                                                    onChange={ this.handleChangeInput }
                                                />
                                            </InputGroup>
                                            <Row>
                                                <Col xs="6">
                                                    <Button
                                                        color="success"
                                                        className="px-4">
                                                        Sign Up
                                                    </Button>
                                                </Col>
                                                <Col xs="6" className="text-right">
                                                    <Button
                                                        color="link"
                                                        className="px-0">
                                                        Forgot password?
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </form>
                                </Card>
                                <Card
                                    className="text-white bg-success py-5 d-md-down-none"
                                    style={{ width: 44 + "%" }}>
                                    <CardBody className="text-center">
                                        <div>
                                            <h2>Chatly!</h2>
                                           <p>
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                                                labore et dolore magna aliqua.
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
            );
    }
}

const mapStateToProps = (state, routeParams) => {
    return {};
};

export default withRouter(connect(mapStateToProps)(CreateAccount));
