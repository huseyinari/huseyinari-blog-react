import React,{Component} from 'react';

// redux
import {connect} from 'react-redux';
// router
import {Link} from 'react-router-dom';

class Footer extends Component{

    mapPopulerCategories = () => {
        const {categories} = this.props;
        const categoryCount = 5;    // footer'da kaç kategori gözükecek

        if(categories === null)
            return;
        
        return categories.map( (category,index) => {
            if(index <= categoryCount){
                return(
                    <li>
                        <Link to={"/kategoriler/" + category.seo} >
                            {category.categoryName} 
                            <span>{category.postCount}</span>
                        </Link>
                    </li>
                )
            }
        });
    }
    render(){

        return(
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="widget">
                                <div className="footer-text text-left">
                                    <p>Sosyal medya hesaplarımı takip edebilirsiniz...</p>
                                    <div className="social">
                                        <a href="https://www.facebook.com/hsyn.arii" target="_blank" data-toggle="tooltip" data-placement="bottom" title="Facebook"><i className="fa fa-facebook"></i></a>              
                                        <a href="https://www.instagram.com/hsynnari" target="_blank" data-toggle="tooltip" data-placement="bottom" title="Instagram"><i className="fa fa-instagram"></i></a>
                                        <a href="https://www.youtube.com/channel/UC4G-fAG-njYA8pA_14ocCBQ" target="_blank" data-toggle="tooltip" data-placement="bottom" title="Youtube"><i className="fa fa-youtube"></i></a>
                                        {/* 
                                            <a href="#" data-toggle="tooltip" data-placement="bottom" title="Twitter"><i className="fa fa-twitter"></i></a>
                                            <a href="#" data-toggle="tooltip" data-placement="bottom" title="Google Plus"><i className="fa fa-google-plus"></i></a>
                                            <a href="#" data-toggle="tooltip" data-placement="bottom" title="Pinterest"><i className="fa fa-pinterest"></i></a>
                                        */}
                                    </div>

                                    <hr className="invis" />

                                    <div className="newsletter-widget text-left">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget">
                                <h2 className="widget-title">Popüler Kategoriler</h2>
                                <div className="link-widget">
                                    <ul>
                                        {
                                            this.mapPopulerCategories()
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    {/* 
                        <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
                            <div className="widget">
                                <h2 className="widget-title">Copyrights</h2>
                                <div className="link-widget">
                                    <ul>
                                        <li><a href="#">About us</a></li>
                                        <li><a href="#">Advertising</a></li>
                                        <li><a href="#">Write for us</a></li>
                                        <li><a href="#">Trademark</a></li>
                                        <li><a href="#">License & Help</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    */}
                    </div>
                </div>
            </footer>
        );
    }
}
function mapStateToProps(state){
    return{
        categories:state.categoriesReducer
    }
}
export default connect(mapStateToProps,null)(Footer);