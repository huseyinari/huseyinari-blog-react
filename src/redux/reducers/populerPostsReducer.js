import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';

export default function populerPostsReducer(state = initialState.populerPosts,action){
    switch (action.type) {
        case actionTypes.getPopulerPosts:
            return action.payload;
        default:
            return state;
    }
}