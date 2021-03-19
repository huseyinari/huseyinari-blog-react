import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';

export default function categoriesReducer(state = initialState.categories,action){
    switch (action.type) {
        case actionTypes.getCategories:
            return action.payload
        case actionTypes.setCategory:
            let categories = [action.payload,...state]; // yeni geleni kategorilerin başına ekle 
            return categories;
        case actionTypes.deleteCategory:
            let removedCategories = state.filter(category => category.id !== action.payload); // payload ile id'si gönderilen kategoriyi çıkart
            return removedCategories;
        case actionTypes.updateCategory: // payload olarak gelen güncellenmiş kategoriyi kategoriler içerisinde güncelle
            let index = state.findIndex(category => category.id === action.payload.id) 
            let updatedCategory = {...state[index],categoryName:action.payload.categoryName,categoryDescription:action.payload.categoryDescription};
            state[index] = updatedCategory;
            return state;
        default:
            return state;
    }
}