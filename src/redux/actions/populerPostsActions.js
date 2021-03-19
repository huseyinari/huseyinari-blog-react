import apiURL from '../../apiURL';
import * as actionTypes from './actionTypes';

export function getPopulerPostsSuccess(posts){
    return{
        type:actionTypes.getPopulerPosts,
        payload:posts
    }
}

export function getPopulerPosts(){
    return function(dispatch){
        const url = apiURL + '/api/get_populer_posts';

        fetch(url)
        .then(response => response.json())
        .then(responseData => dispatch(getPopulerPostsSuccess(responseData.populerPosts)));
    }
}