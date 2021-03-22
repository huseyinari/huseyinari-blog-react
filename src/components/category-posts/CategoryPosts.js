import React, { Component } from 'react'
import {Spin} from 'antd';

//router
import {Link} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
// my components
import PopulerPosts from '../common/PopulerPosts';
import Categories from '../common/Categories';
import SocialButtons from '../common/SocialButtons';
import MostReadPosts from '../common/MostReadPosts';
import GoToTopButton from '../common/GoToTopButton';
import Pagination from '../common/Pagination';
// api url
import apiURL from '../../apiURL';
// helper
import {convertDate} from '../../helpers/PostFunctions';

class CategoryPosts extends Component {
    state = {
      categoryDetails:null,

      posts:null,
      pageCount:null,
      currentPage:1
    }
    componentDidMount(){
      this.getDatasFromServer();
    }
    getDatasFromServer = () => {
      this.getCategoryDetails();  
      // postları çekme isteği , kategori varsa gerçekleşiyor. - getCategoryDetails() fonksiyonu fetch isteğinin başarılı kısmında
    }
    getCategoryDetails = () => {
      const categorySeo = this.props.match.params.seo;
      const url = apiURL + '/api/get_category_details/' + categorySeo;
      fetch(url)
      .then(response => response.json())
      .then(responseData => {
        if(responseData.status === true){
          const categoryDetails = responseData.category;
          this.setState({categoryDetails});
          this.getPosts(1);
        }else{
          const categoryDetails = false;
          this.setState({categoryDetails});
        }
      });
    }
    getPosts = (page = 1) => {
      const categorySeo = this.props.match.params.seo;
      const url = apiURL + '/api/get_category_posts/' + categorySeo + '?page=' + page;
      fetch(url)
      .then(response => response.json())
      .then(responseData => {
        if(responseData.status === true){
          const posts = responseData.posts.data;
          const pageCount = responseData.posts.last_page;
          const currentPage = page;
          this.setState({posts,pageCount,currentPage},() => window.scrollTo({top:0,behavior:'smooth'}));  // state güncellendikten sonra sayfayı animasyonlu bir şekilde en üste al
        }
      })
    }
    paginateClicked = (page) => {
      this.setState({posts:null});
      this.getPosts(page);
    }
    mapPosts = () => {
      const {posts,categoryDetails} = this.state;

      if(posts === null)
        return(
          <div className='posts-loading'>
            <Spin size="default" tip="Yükleniyor..." />
          </div>
        )
      
      return posts.map( (post,index) => (
        <div key={index}>
          <div className="blog-box row">
            <div className="col-md-4">
              <div className="post-media">
                <Link to={"/yazilar/" + post.seo} title>
                  <img src={post.coverPhoto} alt="" className="img-fluid" />
                  <div className="hovereffect" />
                </Link>
              </div>
            </div>
            <div className="blog-meta big-meta col-md-8">
              <h4><Link to={"/yazilar/" + post.seo} title>{post.title}</Link></h4>
              <p>{post.postContent.length >= 30 ? post.postContent.substr(0,30) + '...' : post.postContent}</p>
              <small className="firstsmall"><a className="bg-orange">{categoryDetails.categoryName}</a></small>
              <small>{convertDate(post.created_at)}</small>
              <small><Link to="/hakkimda" title>{post.get_post_owner.nameSurname}</Link></small>
              <small><i className="fa fa-eye" /> {post.viewCount}</small>
              <small><i class="fa fa-comment" aria-hidden="true"></i> {" " + post.commentCount} </small>
            </div>
          </div>
          <hr className="invis" />
        </div>
      ));
    }
    renderPage = () => {
      const {mostReadPosts,populerPosts,categories} = this.props;
      const {categoryDetails,currentPage,pageCount} = this.state;

      if(categoryDetails === null)
          return(
            <div className="page-loading">
                <Spin size="large" tip="Yükleniyor..." />               
            </div>
      )

      if(categoryDetails === false){  // eğer kategori bulunamazsa categoryDetails false olacak
        return (
          <div style={{display:'flex',height:'75vh',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
            <h1>Kategori Bulunamadı !</h1>
          </div>
        )
      }
        
      return (
            <div>
              <div className="page-title lb single-wrapper">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                      <h2>
                        <i className="fa fa-star bg-orange"/> 
                        {categoryDetails.categoryName} 
                        <small className="hidden-xs-down hidden-sm-down">{categoryDetails.categoryDescription}
                        </small>
                      </h2>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 hidden-xs-down hidden-sm-down">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item active"><a>Kategoriler</a></li>
                        <li className="breadcrumb-item active">{categoryDetails.categoryName}</li>
                      </ol>
                    </div>             
                  </div>
                </div>
              </div>
              <section className="section">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                      <div className="page-wrapper">
                        <div className="blog-list clearfix">
                          {
                            this.mapPosts()
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
      );
    }
    render() {
      return(
        <div className="category-posts">
          {
            this.renderPage()
          }
        </div>
      )
    }
}
function mapStateToProps(state){
    return{
        mostReadPosts:state.mostReadPostsReducer,
        populerPosts:state.populerPostsReducer,
        categories:state.categoriesReducer
    }
}
export default connect(mapStateToProps,null)(CategoryPosts);