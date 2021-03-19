import React, { Component } from 'react'
import {Spin} from 'antd';
// my components
import Panel from './Panel';
import Login from './Login';
// api url
import apiURL from '../../apiURL';
// redux
import {connect} from 'react-redux';

class Admin extends Component {
    state = {
        isAdmin:null
    }
    componentDidMount(){
        this.adminControl();
    }
    adminControl = () => {  // tarayıcı deposundaki token var mı ? varsa geçerli bir anahtar mı ?
        const url = apiURL + '/api/admin/admin_control';

        fetch(url,{
            method:'GET',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                this.setState({isAdmin:true});
            }
            else
                this.setState({isAdmin:false});
        })
        .catch(() => this.setState({isAdmin:false}));
    }
    renderPage = () => {
        const {isAdmin} = this.state;
        const {categories} = this.props;
        
        if(isAdmin === null || categories === null){
            return(
                <div className="page-loading">
                    <Spin size="large" tip="Yükleniyor..." />               
                </div>
            )
        }else if(isAdmin === true)
            return <Panel />
        else
            return <Login />
    }
    render() {
        return(
            <div className="admin">
                {
                    this.renderPage()
                }
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        categories:state.categoriesReducer
    }
}
export default connect(mapStateToProps,null)(Admin);
