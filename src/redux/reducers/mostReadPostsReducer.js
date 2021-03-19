import * as actionTypes from '../actions/actionTypes';
import initialState from "./initialState";

export default function mostReadPostsReducer(state = initialState.mostReadPosts,action){
    switch (action.type) {
        case actionTypes.getMostReadPosts:
            return action.payload;
        default:
            return state;
    }
}