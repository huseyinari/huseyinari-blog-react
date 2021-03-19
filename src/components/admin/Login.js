import React, { Component } from 'react';
import apiURL from '../../apiURL';

export default class Login extends Component {
    state = {
        inputData:{
            email:'',
            password:''
        },
        loginError:null // giriş yaptıktan sonra oluşacak hatayı tutacak
    }
    loginFormSubmited = (e) => {
        e.preventDefault();
        
        const url = apiURL + '/api/login';
        const {inputData} = this.state;
        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(inputData)
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                const token = responseData.token;
                sessionStorage.setItem('token',token);
                window.location.reload();
            }else
                this.setState({loginError:responseData.error})
        });
    }
    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let {inputData} = this.state;
        inputData[name] = value;
        this.setState({inputData});
    }
    renderFormError = () => {
        const {loginError} = this.state;
        
        if(loginError !== null)
            return(
                <small className="login-error">{loginError}</small>
            )
    }
    render() {
        const {inputData} = this.state;
        return (
            <div className="login-page">
                <div className="login">
                    <div className="login-triangle"></div>
                    <h2 className="login-header">Admin Paneli</h2>
                    <form className="login-container" onSubmit={this.loginFormSubmited}>
                        {
                            this.renderFormError()
                        }
                        <p><input type="email" placeholder="Email" name="email" value={inputData.email} onChange={this.handleChange} required/></p>
                        <p><input type="password" placeholder="Şifre" name="password" value={inputData.password} onChange={this.handleChange} required/></p>
                        <p><input type="submit" value="Giriş"/></p>
                    </form>
                </div>
            </div>
        )
    }
}
