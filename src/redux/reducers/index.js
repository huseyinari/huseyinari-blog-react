import {combineReducers} from 'redux';
import categoriesReducer from './categoriesReducer';
import mostReadPostsReducer from './mostReadPostsReducer';
import populerPostsReducer from './populerPostsReducer';

const rootReducer = combineReducers({
    categoriesReducer,
    mostReadPostsReducer,
    populerPostsReducer,
});

export default rootReducer;