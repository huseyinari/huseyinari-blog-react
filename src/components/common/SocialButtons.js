import React,{Component} from 'react';

// api url
import apiURL from '../../apiURL';

export default class SocialButtons extends Component{
    state = {
        aboutMe:null
    }
    componentDidMount(){
        this.getAboutMe();
    }
    getAboutMe = () => {
        const url = apiURL + '/api/about_me';
        
        fetch(url)
        .then(response => response.json())
        .then(responseData => this.setState({aboutMe:responseData.aboutMe}))
    }
    render(){
        const {aboutMe} = this.state;

        if(aboutMe === null)
            return null;
            
        return(
            <div className="row text-center">
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href={aboutMe.facebookAddress} target="_blank" className="social-button facebook-button">
                        <i className="fa fa-facebook"></i>
                        <p>{/* takipçi sayısı */}</p>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href={aboutMe.instagramAddress} target="_blank" className="social-button instagram-button">
                        <i className="fa fa-instagram"></i>
                        <p>{/* takipçi sayısı */}</p>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href={aboutMe.youtubeAddress} target="_blank" className="social-button youtube-button">
                        <i className="fa fa-youtube"></i>
                        <p>{/* takipçi sayısı */}</p>
                    </a>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                    <a href={aboutMe.twitterAddress} target="_blank" className="social-button twitter-button">
                        <i className="fa fa-twitter"></i>
                        <p>{/* takipçi sayısı */}</p>
                    </a>
                </div>
                
                {
                    /* 
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                            <a href="#" className="social-button google-button">
                                <i className="fa fa-google-plus"></i>
                                <p>{takipçi sayısı}</p>
                            </a>
                        </div>
                    */
                }
            </div>
        )
    }
}