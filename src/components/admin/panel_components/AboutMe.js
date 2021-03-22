import React, { Component } from 'react';
import {Spin} from 'antd';
// api url
import apiURL from '../../../apiURL';

export default class AboutMe extends Component {
    state = {
        aboutMe:null,

        loading:false,
        updateResponse:null
    }
    componentDidMount(){
        this.getAboutMe()
    }
    getAboutMe = () => {
        const url = apiURL + '/api/about_me';
        fetch(url)
        .then(response => response.json())
        .then(responseData => this.setState({aboutMe:responseData.aboutMe}))
    }
    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        let {aboutMe} = this.state;
        aboutMe[name] = value;
        
        this.setState({aboutMe})
    }
    saveButtonClicked = () => {
        const {aboutMe} = this.state;
        const url = apiURL + '/api/admin/update_about_me';
        this.setState({loading:true});

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization'  :'Bearer ' + sessionStorage.getItem('token')
            },
            body:JSON.stringify({
                instagramAddress:aboutMe.instagramAddress,
                facebookAddress:aboutMe.facebookAddress,
                twitterAddress:aboutMe.twitterAddress,
                youtubeAddress:aboutMe.youtubeAddress,
                about:aboutMe.about
            })
        })
        .then(response => response.json())
        .then(responseData => this.setState({updateResponse:responseData,loading:false}))
        .catch(() => {
            alert('Bilgi güncellemede hata oluştu.');
            this.setState({loading:false});
        })
    }
    renderUpdateResponse = () => {
        const {updateResponse} = this.state;
        
        if(updateResponse === null)
            return null;
        
        return(
            <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12 mb-4">
                <div class="alert alert-success text-center" role="alert">
                    {
                        updateResponse.message
                    }
                </div>
            </div>
        )
    }
    renderPage = () => {
        const {aboutMe,loading} = this.state;

        if(aboutMe === null)
            return (
                <div className="row d-flex justify-content-center">
                    <Spin size="default" tip="Yükleniyor..." /> 
                </div>
            )

        return (
            <div className="row d-flex justify-content-center">
                {
                    this.renderUpdateResponse()
                }
                <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                    <div className="input-group mb-3">
                        <span className="input-group-text">Instagram</span>
                        <input type="text" name="instagramAddress" className="form-control" value={aboutMe['instagramAddress']} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                    <div className="input-group mb-3">
                        <span className="input-group-text">Facebook</span>
                        <input type="text" name="facebookAddress" className="form-control" value={aboutMe['facebookAddress']} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                    <div className="input-group mb-3">
                        <span className="input-group-text">Youtube</span>
                        <input type="text" name="youtubeAddress" className="form-control" value={aboutMe['youtubeAddress']} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                    <div className="input-group mb-3">
                        <span className="input-group-text">Twitter</span>
                        <input type="text" name="twitterAddress" className="form-control" value={aboutMe['twitterAddress']} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                    <textarea className="form-control" name="about" value={aboutMe['about']} style={{height:120}} onChange={this.handleChange} />
                </div>
                <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12 mt-3">
                    {
                        loading === false
                        ? ( <button type="button" className="saveButton" onClick={this.saveButtonClicked}> Kaydet </button> )
                        : ( <Spin size="default" tip="Kaydediliyor..." /> ) 
                    }
                </div>
            </div>
        )
    }
    render() {
        return (
            <div className="about-me">
                {
                    this.renderPage()
                }
            </div>
        )
    }
}
