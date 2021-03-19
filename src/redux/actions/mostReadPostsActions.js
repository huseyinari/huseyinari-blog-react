import * as actionTypes from './actionTypes';
import apiURL from '../../apiURL';

export function getMostReadPostsSuccess(posts){
    return{
        type:actionTypes.getMostReadPosts,
        payload:posts
    }
}

export function getMostReadPosts(){
    return function(dispatch){
        const url = apiURL + '/api/get_most_read_posts';

        fetch(url)
        .then(response => response.json())
        .then(responseData => dispatch(getMostReadPostsSuccess(responseData.mostReadPosts)));
    }
}