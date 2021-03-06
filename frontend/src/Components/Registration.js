import React from "react";
import './content.css';
import './BoardPage/Column.css';
import Input from './UI/Input.js';

export default class Registration extends React.Component {

    constructor() {
        super();
        this.usernameField = React.createRef();
        this.emailField = React.createRef();
        this.passwordField = React.createRef();
        this.confirmField = React.createRef();
        this.state = {errorMessage: "", success: ""}
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    registerHandler = (event) => {
        event.preventDefault();
        if (this.state.success)
            window.location.href = '/';
        else
        {
            const username = this.usernameField.current.getValue(),
                password = this.passwordField.current.getValue(),
                confirm = this.confirmField.current.getValue(),
                email = this.emailField.current.getValue();

            if (username === "") {
                this.setState({errorMessage: "Enter login"});
                return;
            }
            if (email === "") {
                this.setState({errorMessage: "Enter email"});
                return;
            }
            if (password === "") {
                this.setState({errorMessage: "Enter password"});
                return;
            }
            if (!this.validateEmail(email)){
                this.setState({errorMessage: "Enter correct email address"});
                return;
            }
            if (confirm !== password) {
                this.setState({errorMessage: "Password and its confirm are different "});
                return;
            }
            if (username.toString().indexOf('@') !== -1) {
                this.setState({errorMessage: "Login must not contain symbol @"});
                return;
            }

            fetch('/api/reg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            }).then(res => {
                console.log(res);
                return res.json()
            }).then(res => {
                console.log(res);
                if (res.error)
                    this.setState({errorMessage: res.error.message || res.error});
                else {
                    this.setState({success: "Thank you for registering - please check your email"});
                }
            });
        }
    };

    render () {
        return(
            <>
                <div>
                    <h1>Sign up</h1>
                </div>
                <form className="content">
                    <Input ref={this.usernameField} label="Login" />
                    <Input ref={this.emailField} mail="true" label="Email" type='email'/>
                    <Input ref={this.passwordField}  label="Password" type='password'/>
                    <Input ref={this.confirmField}  label="Password confirm" type='password'/>
                    <div className='errorMessage'>{this.state.success ? null : this.state.errorMessage}</div>
                    {this.state.success ?
                        <div>
                            <label className="success smallText">{this.state.success}</label>
                            <br/>
                        </div>
                        :
                        null
                    }
                    <br/>
                    <button
                        type="success"
                        onClick={this.registerHandler}>
                        {this.state.success ? "Return to the homepage" : "Sign up"}
                    </button>
                </form>
            </>
        )
    }
}
