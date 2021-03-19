import React, { Component } from 'react'
import './App.css';
// my components
import RouterComponent from '../router/RouterComponent';
import Header from '../header/Header';
import Footer from '../footer/Footer';
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as categoriesActions from '../../redux/actions/categoriesActions';
import * as mostReadPostsActions from '../../redux/actions/mostReadPostsActions';
import * as populerPostsActions from '../../redux/actions/populerPostsActions';


class App extends Component {
  componentDidMount(){  // en çok okunan gönderiler,popüler gönderiler ve kategoriler bütün sayfalarda kullanıldığı için App componentinde veri tabanından action'lar ile çekerek redux'a alıyorum
    const {getCategories,getMostReadPosts,getPopulerPosts} = this.props.actions;

    getCategories();
    getMostReadPosts();
    getPopulerPosts();
  }

  render() {
    return (
      <div>
        <Header />
        <RouterComponent />
        <Footer />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch){
  return{
    actions:{
      getCategories:bindActionCreators(categoriesActions.getCategories,dispatch),
      getPopulerPosts:bindActionCreators(populerPostsActions.getPopulerPosts,dispatch),
      getMostReadPosts:bindActionCreators(mostReadPostsActions.getMostReadPosts,dispatch)
    }
  }
}
export default connect(null,mapDispatchToProps)(App);
