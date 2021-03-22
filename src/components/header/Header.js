import React,{Component} from 'react';
import { Link } from 'react-router-dom';
// icons
import {FaLaravel,FaReact,FaJava} from 'react-icons/fa';
import {SiJavascript} from 'react-icons/si';
// api url
import apiURL from '../../apiURL';

class Header extends Component{
    render(){
        return(
            <header className="tech-header header">
            <div className="container-fluid">
                <nav className="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
                    <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link to="/">
                        <a className="navbar-brand"><img src={apiURL + '/site_photos/nav-logo.png'} alt="" width={120} height={50}/></a>
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav mr-auto">
                            <Link to="/">
                                <li className="nav-item">
                                    <a className="nav-link">Anasayfa</a>
                                </li>
                            </Link>       
                            <Link to="/hakkimda" className="nav-item">
                                <a className="nav-link" href="/tech-category-03.html">Hakkımda</a>
                            </Link>
                        </ul>
                        <ul className="navbar-nav mr-2">
                            <li className="nav-item">
                                <a className="nav-link" href="#"><FaLaravel /></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><FaReact /></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><FaJava /></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><SiJavascript /></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
        )
    }
}

export default Header;