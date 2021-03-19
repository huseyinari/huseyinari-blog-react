const PostStars = ({starCount}) => {
    let starsJSX = [];
    let i=0;
    // postun yıldız sayısını dön
    for(i; i<starCount; i++){
        starsJSX.push(
            <i className="fa fa-star" />
        )
    }
    // kalan yıldızları gri olarak göster
    for(i; i<5; i++){
        starsJSX.push(
            <i className="fa fa-star" style={{color:'lightgray'}} />
        )
    }
    return starsJSX;
}

export default PostStars;