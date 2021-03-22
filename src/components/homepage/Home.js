import React,{Component} from 'react';
import {Spin} from 'antd';
// router
import { Link } from 'react-router-dom';
// api url
import apiURL from '../../apiURL';
// helpers
import {convertDate} from '../../helpers/PostFunctions';
// my components
import Pagination from '../common/Pagination';
import MostReadPosts from '../common/MostReadPosts';
import PopulerPosts from '../common/PopulerPosts';
import Categories from '../common/Categories';
import SocialButtons from '../common/SocialButtons';
import GoToTopButton from '../common/GoToTopButton';
// redux
import {connect} from 'react-redux';

class Home extends Component{
    constructor(props) {
        super(props)
        this.myRef = React.createRef(); // sayfa içinde scroll'u konumlandırmak için kullanıyorum - goToLatestPosts fonksiyonu
    }
    state = {
        // son yazılar
        latestPosts:null,
        currentPage:sessionStorage.getItem('currentPage') ? sessionStorage.getItem('currentPage') : 1,   // session storage içerisinde sayfa değeri varsa o , yoksa null
        pageCount:null,
        // random yazılar
        randomPosts:null,
    }
    componentDidMount(){
        window.scrollTo(0,0);
        this.getDatasFromServer(); // sayfa yüklendikten 500 ms sonra verileri çek - yükleniyor animasyonu bir miktar beklesin diye
    }
    getDatasFromServer = () => {
        const {currentPage} = this.state;

        this.getRandomPosts();
        this.getLatestPosts(currentPage);
    }
    getLatestPosts = (page) => {
        const url = apiURL + '/api/get_latest_posts?page=' + page;
        fetch(url,{
            method:'GET',
            headers:{
                'Content-type' : 'application/json'
            }
        })   
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                const latestPosts = responseData.latestPosts.data;
                const currentPage = responseData.latestPosts.current_page;
                const pageCount = responseData.latestPosts.last_page;
                this.setState({latestPosts,currentPage,pageCount});
            }
        })
    }
    getRandomPosts = () => {
        const url = apiURL + '/api/get_random_posts';
        fetch(url,{
            method:'GET',
            headers:{
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                const randomPosts = responseData.randomPosts;
                this.setState({randomPosts});
            }
        });
    }
    goToLatestPosts = () => {
        this.myRef.current.scrollIntoView();    // sayfa değiştirme işlemi gerçekleştiğinde scroll'u referans verdiğim section'a konumlandır
    }
    paginateClicked = (page) => {
        this.setState({latestPosts:null});
        this.goToLatestPosts();
        sessionStorage.setItem('currentPage',page);
        this.getLatestPosts(page);
    }
    mapRandomPosts = () => {
        const {randomPosts} = this.state;
        
        if(randomPosts === null)
            return;

        return randomPosts.map( (post,index) => (
            <div className="second-slot" key={index}>
                <div className="masonry-box post-media">
                    <img src={post.coverPhoto} alt="" width="25%" height={400} />
                    <div className="shadoweffect">
                        <div className="shadow-desc">
                            <div className="blog-meta">
                                <span className="bg-orange">
                                    <Link to={"/kategoriler/" + post.get_category.seo} title="">
                                        {post.get_category.categoryName}
                                    </Link>
                                </span>
                                <h4>
                                    <Link to={"/yazilar/" + post.seo}>
                                        {post.title}
                                    </Link>
                                </h4>
                                <small>
                                    <Link to={"/yazilar/" + post.seo}>
                                        {convertDate(post.created_at)}
                                    </Link>
                                </small>
                                <small>
                                    <Link to="/hakkimda">
                                        {post.get_post_owner.nameSurname}
                                    </Link>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    }
    mapLatestPosts = () => {
        const {latestPosts} = this.state;

        return latestPosts.map( (post,index) => (
            <div>
                <div className="blog-box row" key={index}>
                    <div className="col-md-4">
                        <div className="post-media">
                            <Link to={"/yazilar/" + post.seo}>
                                <img src={post.coverPhoto} alt="" width={250} height={150} />
                                <div className="hovereffect"></div>
                            </Link>
                        </div>
                    </div>

                    <div className="blog-meta big-meta col-md-8">
                        <h4>
                            <Link to={"/yazilar/" + post.seo}>
                                {post.title}
                            </Link>
                        </h4>
                        <p>{ post.postContent.length >= 100 ? post.postContent.substr(0,100) + '...' : post.postContent }</p>
                        <small className="firstsmall">
                            <Link to={"/kategoriler/" + post.get_category.seo} className="bg-orange">
                                {post.get_category.categoryName}
                            </Link>
                        </small>
                        <small>
                            {convertDate(post.created_at)}
                        </small>
                        <small>
                            <Link to="/hakkimda" title="">
                                {post.get_post_owner.nameSurname}
                            </Link>
                        </small>
                        <small>
                            <i className="fa fa-eye"></i> 
                            {" " + post.viewCount}
                        </small>
                        <small>
                            <i class="fa fa-comment" aria-hidden="true"></i>
                            {" " + post.commentCount}
                        </small>
                    </div>
                </div>
                <hr className="invis" />
            </div>
        ));
    }
    renderLatestPostsOrSpinner = () => {
        const {latestPosts} = this.state;

        if(latestPosts === null){
            return(
                <div className="latest-posts-spinner">
                    <Spin size="default" tip="Yükleniyor..." />
                </div>
            )
        }else{
            return this.mapLatestPosts();
        }
    }
    renderPage = () => {
        const {randomPosts,currentPage,pageCount} = this.state;
        const {mostReadPosts,populerPosts,categories} = this.props;
        
        if(mostReadPosts === null || populerPosts === null || randomPosts === null || categories === null){  // && kullandım çünkü sadece hepsi birlikte null olduğunda,sayfanın tamamında yükleniyor ikonu gözükecek (sayfa ilk açıldığında)
            return(
                <div className="page-loading">
                    <Spin size="large" tip="Yükleniyor..." />               
                </div>
            )
        }
        return(
            <div id="wrapper">
                <section className="section first-section">
                    <div className="container-fluid">
                        <div className="masonry-blog clearfix">
                            {
                                this.mapRandomPosts()
                            }
                        </div>
                    </div>
                </section>
                <section className="section" ref={this.myRef}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12" >
                                <div className="page-wrapper">
                                    <div className="blog-top clearfix">
                                        <h4 className="pull-left"> Son Yazılar <a href="#"><i className="fa fa-rss"></i></a></h4>
                                    </div>

                                    <div className="blog-list clearfix">
                                        {
                                            this.renderLatestPostsOrSpinner()
                                        }
                                        {   // REKLAM ALANI
                                            /* 
                                                <div className="row">
                                                    <div className="col-lg-10 offset-lg-1">
                                                        <div className="banner-spot clearfix">
                                                            <div className="banner-img">
                                                                <img src="upload/banner_02.jpg" alt="" className="img-fluid" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr className="invis" />
                                            */
                                        }
                                    </div>
                                </div>

                                <hr className="invis" />

                                <div className="row">
                                    <div className="col-md-12">
                                        <nav aria-label="Page navigation">
                                            <ul className="pagination justify-content-start">
                                                <Pagination 
                                                    currentPage={currentPage}
                                                    totalPage={pageCount}
                                                    paginateCount={8}
                                                    handleClick={this.paginateClicked}
                                                />
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                                <div className="widget">
                                    <h2 className="widget-title">En Çok Okunanlar</h2>
                                    <div className="blog-list-widget">
                                        <div className="list-group">
                                            <MostReadPosts 
                                                posts={mostReadPosts} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="widget">
                                    <h2 className="widget-title">Popüler Yazılar</h2>
                                    <div className="blog-list-widget">
                                        <div className="list-group">
                                            <PopulerPosts 
                                                posts={populerPosts}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="widget">
                                    <h2 className="widget-title">Kategoriler</h2>
                                    <div className="blog-list-widget">
                                        <div className="list-group">
                                            <ul className="category-list" name="category-list">
                                                <Categories 
                                                    categories={categories}
                                                />
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <GoToTopButton />
            </div>
        )
    }
    render(){
        return(
            <div className="home">
                {
                    this.renderPage()
                }
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        categories:state.categoriesReducer,
        mostReadPosts:state.mostReadPostsReducer,
        populerPosts:state.populerPostsReducer,
    }
}
export default connect(mapStateToProps,null)(Home);