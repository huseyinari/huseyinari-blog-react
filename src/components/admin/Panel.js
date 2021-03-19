import React, { Component } from 'react';
// api url
import apiURL from '../../apiURL';
// icons
import {RiFileAddLine} from 'react-icons/ri';
import{AiFillTags} from 'react-icons/ai';
import {IoDocumentTextOutline} from 'react-icons/io5';
import {FaComments} from 'react-icons/fa';

// my components
import AddPost from './panel_components/AddPost';
import Categories from './panel_components/Categories';
import AllPosts from './panel_components/AllPosts';
import Comments from './panel_components/Comments';

export default class Panel extends Component {
    state = {
        activePage:'AddPost',

        selectedPost:null // AllPost componentinde düzenlenmek için post seçilirse , bu seçilen postu AddPost sayfasına iletmek için tutuyorum
    }
    componentDidMount(){
        document.getElementsByClassName('tech-header')[0].style.display = 'none';
        document.getElementsByClassName('footer')[0].style.display = 'none';
    }
    changeActivePage = (page,selectedPost) => {
        this.setState({activePage:page});
        
        if(selectedPost) // selectedPost da gönderildiyse
            this.setState({selectedPost});
        else    // selectedPost gönderilmediyse seçili postu null yap - sayfalar arası geçişte eski selectedPost'u tutmaya devam etmesin
            this.setState({selectedPost:null});
    }
    renderPageContent = () => {
        const {activePage,selectedPost} = this.state;

        if(activePage === 'AddPost')
            return <AddPost selectedPost={selectedPost}/>
        else if(activePage === 'Categories')
            return <Categories />
        else if(activePage === 'AllPosts')
            return <AllPosts changeActivePage={this.changeActivePage}/>
        else if(activePage === 'Comments')
            return <Comments />
        else
            return <div>asdasfsfafasfsa</div>
    }
    navbarCollapseClicked = () => { // küçük ekranda menüyü açma kısmı tıklandıgında
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('content').classList.toggle('active');
    }
    render() {
        const {activePage} = this.state;

        return(
            <div>
                {/* Vertical navbar */}
                <div className="vertical-nav bg-white" id="sidebar">
                <div className="py-4 px-3 mb-4 bg-light">
                    <div className="media d-flex align-items-center"><img src={apiURL + '/author_images/huseyin-ari.jpg'} alt="..." className="mr-3 rounded-circle img-thumbnail shadow-sm" width={65} />
                    <div className="media-body">
                        <h4 className="m-0">Hüseyin ARI</h4>
                        <p className="font-weight-light text-muted mb-0">Web Developer</p>
                    </div>
                    </div>
                </div>
                <p className="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Yönetim</p>
                <ul className="nav flex-column bg-white mb-0">
                    <li className="nav-item">
                        <a  className={activePage === 'AddPost' ? 'nav-link text-dark font-italic active-page' : 'nav-link text-dark font-italic'} 
                            onClick={() => this.changeActivePage('AddPost')}
                            href='#'
                        > 
                            <RiFileAddLine /> 
                            Yazı Ekle / Düzenle
                        </a>
                    </li>
                    <li className="nav-item">
                        <a  className={activePage === 'Categories' ? 'nav-link text-dark font-italic active-page' : 'nav-link text-dark font-italic'} 
                            onClick={() => this.changeActivePage('Categories')}
                            href='#'
                        > 
                            <AiFillTags /> Kategoriler
                        </a>
                    </li>
                    <li className="nav-item">
                        <a  className={activePage === 'AllPosts' ? 'nav-link text-dark font-italic active-page' : 'nav-link text-dark font-italic'} 
                            onClick={() => this.changeActivePage('AllPosts')}
                            href='#'
                        > 
                            <IoDocumentTextOutline/> Tüm Yazılar
                        </a>
                    </li>
                    <li className="nav-item">
                        <a  className={activePage === 'Comments' ? 'nav-link text-dark font-italic active-page' : 'nav-link text-dark font-italic'} 
                            onClick={() => this.changeActivePage('Comments')}
                            href='#'
                        > 
                            <FaComments /> Yorumlar
                        </a>
                    </li>
                </ul>
                <p className="text-gray font-weight-bold text-uppercase px-3 small py-4 mb-0">Charts</p>
                <ul className="nav flex-column bg-white mb-0">
                    <li className="nav-item">
                    <a href="#" className="nav-link text-dark font-italic">
                        <i className="fa fa-area-chart mr-3 text-primary fa-fw" />
                        Area charts
                    </a>
                    </li>
                    <li className="nav-item">
                    <a href="#" className="nav-link text-dark font-italic">
                        <i className="fa fa-bar-chart mr-3 text-primary fa-fw" />
                        Bar charts
                    </a>
                    </li>
                    <li className="nav-item">
                    <a href="#" className="nav-link text-dark font-italic">
                        <i className="fa fa-pie-chart mr-3 text-primary fa-fw" />
                        Pie charts
                    </a>
                    </li>
                    <li className="nav-item">
                    <a href="#" className="nav-link text-dark font-italic">
                        <i className="fa fa-line-chart mr-3 text-primary fa-fw" />
                        Line charts
                    </a>
                    </li>
                </ul>
                </div>

                <div className="page-content p-5" id="content">
                    <button id="sidebarCollapse" onClick={this.navbarCollapseClicked} type="button" className="btn btn-light bg-white rounded-pill shadow-sm px-4 mb-4"><i className="fa fa-bars mr-2" />
                        <small className="text-uppercase font-weight-bold">Menü</small>
                    </button>

                    {
                        this.renderPageContent()
                    }
                </div>
                {/* End demo content */}
            </div>
        )
    }
}
