import React from 'react';

const showAllCategories = () => {
    const categoriesList = document.getElementsByName('category-list')[0].children;
    
    for(let i=0; i<categoriesList.length; i++){
        categoriesList[i].style.display = 'list-item';
    }
    document.getElementsByClassName('show-all-categories')[0].style.display = 'none';
}
const Categories = ({categories}) => {
    const visibleCategoryCount = 5;  // ilk aşamada 5 tane kategori görünecek
    let categoriesJSX = [];

    if(categories === null)
        return null;
    
    categories.map((category,index) => (
        categoriesJSX.push((
            <li className={index >= visibleCategoryCount ? 'hidden-category' : 'visible-category'} key={index}>
                <a href={"/kategoriler/" + category.seo}>
                    {category.categoryName + " (" + category.postCount + ")"}
                </a>
            </li>
        ))
    ));
    
    if(categories.length > visibleCategoryCount){
        categoriesJSX.push((
            <li className="show-all-categories" onClick={showAllCategories}>
                <small>
                    <a><b style={{fontSize:13}}><u>Tüm kategorileri gör...</u></b></a>
                </small>
            </li>
        ))
    }
    
    return categoriesJSX;
}

export default Categories;