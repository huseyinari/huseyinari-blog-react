import React from 'react';
import apiURL from '../../apiURL';

const PopulerPosts = ({posts}) => {
    if(posts === null)
        return null;
    
    return posts.map( (post,index) => (
        <a href={"/yazilar/" + post.seo} className="list-group-item list-group-item-action flex-column align-items-start" key={index}>
            <div className="w-100 justify-content-between">
                <img src={post.coverPhoto} alt="" className="img-fluid float-left" />
                <h5 className="mb-1">{post.title.length >= 25 ? post.title.substr(0,25) + '...' : post.title}</h5>
                <div>
                    <small>{post.commentCount + ' Yorum'}</small>
                </div>
            </div>
        </a>
    ));
}

export default PopulerPosts;