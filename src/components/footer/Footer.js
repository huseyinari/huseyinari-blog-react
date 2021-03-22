import React,{Component} from 'react';

// redux
import {connect} from 'react-redux';
// router
import {Link} from 'react-router-dom';
// my components
import SocialButtons from '../common/SocialButtons';

class Footer extends Component{

    mapPopulerCategories = () => {
        const {categories} = this.props;
        const categoryCount = 3;    // footer'da kaç kategori gözükecek

        if(categories === null)
            return;
        
        return categories.map( (category,index) => {
            if(index < categoryCount){
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

                        <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
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
                        <div className="col-lg-2"></div>
                        <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                            <h2 className="widget-title">Sosyal Medya Hesaplarım</h2>
                            <SocialButtons />
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