import React,{Component} from 'react';
import {Switch,Route} from 'react-router-dom';
/* sayfalar */
import Home from '../homepage/Home';
import NotFound from '../not_found/NotFound';
import Post from '../post_detail/Post';
import CategoryPosts from '../category-posts/CategoryPosts';
import Admin from '../admin/Admin';

class RouterComponent extends Component{
    render(){
        return(
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/yazilar/:seo" component={Post} />
                <Route exact path="/kategoriler/:seo" component={CategoryPosts}/>
                <Route exact path="/admin" component={Admin}/>
                <Route component={NotFound} />
            </Switch>
        );
    }
}

export default RouterComponent;