import * as actionTypes from './actionTypes';
import apiURL from '../../apiURL';

export function getCategoriesSuccess(categories){
    return{
        type:actionTypes.getCategories,
        payload:categories
    }
}

export function getCategories(){
    return function(dispatch){
        const url = apiURL + '/api/get_categories';
        
        fetch(url)
        .then(response => response.json())
        .then(responseData => dispatch(getCategoriesSuccess(responseData.categories)))
    }
}

export function setCategory(newCategory){
    return{
        type:actionTypes.setCategory,
        payload:{...newCategory,postCount:0}
    }
}

export function deleteCategory(categoryId){
    return{
        type:actionTypes.deleteCategory,
        payload:categoryId
    }
}

export function updateCategory(category){
    return{
        type:actionTypes.updateCategory,
        payload:category
    }
}