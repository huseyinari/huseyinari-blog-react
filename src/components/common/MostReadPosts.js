import React from 'react';
import {convertDate} from '../../helpers/PostFunctions';
import apiURL from '../../apiURL';

const MostReadPosts = ({posts}) => {

    if(posts === null)
        return null;
    
    return posts.map( (post,index) => (
        <a href={"/yazilar/" + post.seo} className="list-group-item list-group-item-action flex-column align-items-start" key={index}>
            <div className="w-100 justify-content-between">
                <img src={apiURL + '/post_images/' + post.coverPhoto} alt="" className="float-left" />
                <h5 className="mb-1">{post.title.length >= 25 ? post.title.substr(0,25) + '...' : post.title}</h5>
                <small> {convertDate(post.created_at) + ' '} </small>
                <small>
                    <i className="fa fa-eye"></i> 
                    {" " + post.viewCount}
                </small>
            </div>
        </a>
    ));
}

export default MostReadPosts;