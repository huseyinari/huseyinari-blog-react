import React,{Component} from 'react';
import {Spin,Badge} from 'antd';

//api url
import apiURL from '../../apiURL';
//helpers
import {convertDate} from '../../helpers/PostFunctions';
// html parser
import ReactHtmlParser from 'react-html-parser';
//redux
import {connect} from 'react-redux';
// router
import {Link} from 'react-router-dom';
// my components
import MostReadPosts from '../common/MostReadPosts';
import PopulerPosts from '../common/PopulerPosts';
import Categories from '../common/Categories';
import SocialButtons from '../common/SocialButtons';
import GoToTopButton from '../common/GoToTopButton';

class Post extends Component{
    constructor(props){
        super(props);
        this.commentFormRef = React.createRef(); // sayfa içinde scroll'u konumlandırmak için kullanıyorum - goToCommentForm fonksiyonu
    }
    state = {
        postDetail:null,
        anotherPosts:null,  // okunan yazının kategorisindeki farklı post'lar bunda tutulacak ve sayfada önerilecek
        postError:null,  // seo olarak yazılan başlığa ait bir post yoksa ekranda yazacak hata bu değişkende tutuluyor
        
        // yorum yapma - yanıtlama
        commentData:{
            nameSurname:'',
            content:''
        },
        selectedComment:null, // yanıt verilmek üzere seçilen yorumu tutacak
        formErrors:null,    // yorum yapma formundan dönen hatalar
        commentLoading:false // true ise yorum yap butonu yerine spinner
    }
    componentDidMount(){
        window.scrollTo(0,0);
        setTimeout(this.getDatasFromServer,500); // bilgileri sunucudan getir
        this.timeout = setTimeout(this.setViewCountToServer,1000*30);  // 30 saniye sonra post'un görüntüleme sayısını 1 artır
    }
    componentWillUnmount(){ // component kaldırılacağı zaman post görüntülenme sayısını artıran geri sayımı durdur
        clearTimeout(this.timeout);
    }
    getDatasFromServer = () => {
        this.getPostDetail();
    }
    setViewCountToServer = () => { // post görüntülenme sayısını 1 artır
        const {postDetail} = this.state;
        const url = apiURL + '/api/increase_view_count';
        const reqBody = { id:postDetail.id }

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify(reqBody)
        });
    }
    getPostDetail = () => {
        const seo = this.props.match.params.seo;
        const url = apiURL + '/api/get_post_detail/' + seo;
        
        fetch(url,{
            method:'GET',
            headers:{
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                const postDetail = responseData.details;
                const anotherPosts = responseData.anotherPosts;
                this.setState({postDetail,anotherPosts});
            }else
                this.setState({postDetail:false,postError:responseData.message});
        })
    }
    setCommentToServer = () => {
        const {postDetail,commentData} = this.state;
        const commentUrl = apiURL + '/api/set_comment';

        fetch(commentUrl,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify({
                postId:postDetail.id,
                nameSurname:commentData.nameSurname,
                commentContent:commentData.content
            })
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                const formErrors = [];
                const commentLoading = false;
                const newCommentData = { nameSurname:commentData['nameSurname'], content:'' };
                // yeni eklenen yorumu state'deki bilgilerimize ekle
                let postDetail = {...this.state.postDetail}
                postDetail.get_comments.push({...responseData.newComment,get_answers:[]});
    
                this.setState({formErrors,commentLoading,commentData:newCommentData,postDetail});
            }else{
                const formErrors = responseData.errors;
                this.setState({formErrors,commentLoading:false});
            }
        })
    }
    setAnswerToServer = () => {
        const {selectedComment,commentData} = this.state;
        
        const answerUrl = apiURL + '/api/set_answer';

        fetch(answerUrl,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body:JSON.stringify({
                commentId:selectedComment.id,
                nameSurname:commentData.nameSurname,
                answerContent:commentData.content
            })
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                const formErrors = [];
                const commentLoading = false;
                const newCommentData = { nameSurname:commentData['nameSurname'], content:'' };
    
                // eklenen yanıtı yorumun yanıtları içerisine ekle
                let postDetail = {...this.state.postDetail}
                const selectedCommentIndex = postDetail.get_comments.findIndex(comment => comment.id === selectedComment.id);
                postDetail.get_comments[selectedCommentIndex].get_answers.push(responseData.newAnswer);
                
                this.setState({formErrors,commentLoading,commentData:newCommentData,postDetail,selectedComment,selectedComment:null});
            }else{
                const formErrors = responseData.errors;
                this.setState({formErrors,commentLoading:false});
            }
        })
    }
    setCommentOrAnswer = () => { // yorum veya yanıtlama api'sine istek gönder
        const {selectedComment} = this.state;
        
        if(selectedComment === null){   // seçili yorum yoksa yazıya yorum yapılacak demektir
            this.setCommentToServer();
        }else{ // seçili yorum varsa bir yoruma yanıt verilecek demektir
            this.setAnswerToServer();
        }
    }
    commentButtonClicked = () => {
        this.setState({commentLoading:true});   // yorum yap butonu yerine spinner gelsin
        setTimeout(this.setCommentOrAnswer,250);
    }
    goToCommentForm = () => {
        window.scrollTo({left:0,top:this.commentFormRef.current.offsetTop,behavior:'smooth'});  // scrollu yorum yapma formuna konumlandırıyor.
    }
    selectComment = (comment) => {  // yanıtlamak için bir yorum seçiyor
        this.setState({selectedComment:comment});
        this.goToCommentForm();
    }
    clearSelectedComment = () => {  // seçili yorumu sil
        this.setState({selectedComment:null});
    }
    handleChange = (e) => { // yorum yapma input'larının değişikliklerini yakala
        const name = e.target.name;
        const value = e.target.value;

        let {commentData} = this.state;
        commentData[name] = value;

        this.setState({commentData});
    }
    mapAnotherPosts = () => {
        const {anotherPosts,postDetail} = this.state;
        
        if(anotherPosts === null)
            return;
        else if(anotherPosts.length === 0){
            return <small><p>{postDetail.get_category.categoryName} kategorisinde başka bir yazı bulunmamaktadır...</p></small>
        }
        else    // post'ların içindeki a'ları Link yapmadım - çünkü yapınca /yazilar url'ine farklı seo ile yönlendirdiği için router componenti yeniden render etmiyor.
            return anotherPosts.map( (post,index) => (
                <div className="col-lg-6" key={index}>
                    <div className="blog-box">
                    <div className="post-media another-post-img">
                        <a href={"/yazilar/" + post.seo}>
                            <img src={apiURL + '/post_images/' + post.coverPhoto} className="img-fluid" />
                            <div className="hovereffect">
                                <span className />
                            </div>
                        </a>
                    </div>
                    <div className="blog-meta">
                        <h4><a href={"/yazilar/" + post.seo}>{post.title}</a></h4>
                        <small><a href={"/yazilar/" + post.seo}>{convertDate(post.created_at)}</a></small>
                    </div>
                    </div>
                </div>
            ));
    }
    mapAnswers = (answers) => {

        return answers.map( (answer,index) => (
            <div className="comment-answer" key={index}>
                <h4>
                {
                    answer.isAdminAnswer === 1 
                    ? (
                        <div>
                            {" " + answer.nameSurname + " "}
                            <Badge size="small" count={"Admin"}/>
                        </div>
                    )
                    : <span>{answer.nameSurname}</span>
                }
                </h4>
                <p>{answer.answerContent}</p>
            </div>
        ));
    }
    mapComments = () => {
        const {postDetail} = this.state;
        const comments = postDetail.get_comments;

        if(comments.length === 0)
            return ( <small><p>İlk yorumu yapan sen ol !</p></small> )
        else
            return comments.map( (comment,index) => (
                <div className="media" key={index}>
                    {
                        /* 
                            <a className="media-left" href="#">
                            <img src="/upload/author.jpg" alt="" className="rounded-circle" />
                            </a>                        
                        */
                    }
                    <div className="media-body">
                        <h4 className="media-heading user_name">
                            {
                                comment.isAdminComment === 1 
                                ? (
                                    <div>
                                        {" " + comment.nameSurname + " "}
                                        <Badge size="small" count={"Admin"}/>
                                    </div>
                                )
                                : <span>{comment.nameSurname}</span>
                            }
                            <small>{convertDate(comment.created_at)}</small>
                        </h4>
                        <p>{comment.commentContent}</p>
                        <a className="btn btn-primary btn-sm" onClick={() => this.selectComment(comment)}>Yanıtla</a>
                    </div>
                    <div>
                        {
                            this.mapAnswers(comment.get_answers)
                        }
                    </div>
                </div>
            ))
    }
    renderSelectedComment = () => {
        const {selectedComment} = this.state;

        if(selectedComment === null)
            return;
        
        return(
            <div className="selected-comment">
                <p>
                    {selectedComment.nameSurname}'nın yorumuna yanıt veriyorsunuz... 
                    <a onClick={this.clearSelectedComment} title="İptal Et"> 
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </a>
                </p>
            </div>
        )
    }
    renderFormErrors = () => {
        const {formErrors} = this.state;

        if(formErrors === null)
            return;
        else if(formErrors.length === 0)    // yorum başarıyla eklenince formErrors dizisi boş olarak güncellendiği için böyle kontrol ediyorum
            return ( 
                <div className="comment-success">
                    <small> Yorumunuz başarıyla eklendi...</small>
                </div> 
            )
        else{
            return Object.keys(formErrors).map( (error,index) => (
                <div className="comment-error" key={index}> 
                    <small>{formErrors[error][0]}</small> 
                </div>
            ));
        }
    }
    renderPage = () => {
        const {postDetail,postError,myRef,commentData,commentLoading} = this.state;
        const {mostReadPosts,populerPosts,categories} = this.props;
        
        if(postDetail === null || mostReadPosts === null || populerPosts === null || categories === null){ // anotherPosts değişkeni postDetail ile birlikte değiştirildiği için kontrol etmedim
            return(
                <div className="page-loading">
                    <Spin size="large" tip="Yükleniyor..." />               
                </div>
            )
        }
        if(postDetail === false){
            return(
                <div style={{display:'flex',height:'100vh',justifyContent:'center',alignItems:'center'}}>
                    <h1>{postError}</h1>
                </div>
            )
        }

        return (
            <div id="wrapper">
                <section className="section single-wrapper">
                <div className="container" ref={myRef}>
                    <div className="row">
                    <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                        <div className="page-wrapper">
                        <div className="blog-title-area text-center">
                            <ol className="breadcrumb hidden-xs-down">
                            <li className="breadcrumb-item"><Link to="/">Anasayfa</Link></li>
                            <li className="breadcrumb-item"><Link to="/">Son Yazılar</Link></li>
                            <li className="breadcrumb-item active">{postDetail.title}</li>
                            </ol>
                            <span className="color-orange"><Link to={"/kategoriler/" + postDetail.get_category.seo} title>{postDetail.get_category.categoryName}</Link></span>
                            <h3>{postDetail.title}</h3>
                            <div className="blog-meta big-meta">
                            <small>{convertDate(postDetail.created_at)}</small>
                            <small><Link to="/hakkimda" title>{postDetail.get_post_owner.nameSurname}</Link></small>
                            <small><i className="fa fa-eye" />{postDetail.viewCount}</small>
                            <small><i class="fa fa-comment" aria-hidden="true"></i>{" " + postDetail.get_comments.length}</small>
                            </div>
                            {/* PAYLAŞMA LİNKLERİ
                                <div className="post-sharing">
                                    <ul className="list-inline">
                                        <li><a href="#" className="fb-button btn btn-primary"><i className="fa fa-facebook" /> <span className="down-mobile">Share on Facebook</span></a></li>
                                        <li><a href="#" className="tw-button btn btn-primary"><i className="fa fa-twitter" /> <span className="down-mobile">Tweet on Twitter</span></a></li>
                                        <li><a href="#" className="gp-button btn btn-primary"><i className="fa fa-google-plus" /></a></li>
                                    </ul>
                                </div>
                            */}
                        </div>
                        <div className="single-post-media">
                            <img src={apiURL + '/post_images/' + postDetail.coverPhoto} alt="" className="img-fluid" />
                        </div>
                        <div className="blog-content">  
                            { ReactHtmlParser(postDetail.postContent) }
                        </div>
                        {/* PAYLAŞMA LİNKLERİ
                            <div className="blog-title-area">
                                <div className="post-sharing">
                                    <ul className="list-inline">
                                        <li><a href="#" className="fb-button btn btn-primary"><i className="fa fa-facebook" /> <span className="down-mobile">Share on Facebook</span></a></li>
                                        <li><a href="#" className="tw-button btn btn-primary"><i className="fa fa-twitter" /> <span className="down-mobile">Tweet on Twitter</span></a></li>
                                        <li><a href="#" className="gp-button btn btn-primary"><i className="fa fa-google-plus" /></a></li>
                                    </ul>
                                </div>
                            </div>
                        */}

                        {
                            /* REKLAM ALANI
                                <div className="row">
                                    <div className="col-lg-12">
                                    <div className="banner-spot clearfix">
                                        <div className="banner-img">
                                        <img src="/upload/banner_01.jpg" alt="" className="img-fluid" />
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            */
                        }
                        <hr className="invis1" />
                        {
                            /*   SONRAKİ VE ÖNCEKİ POST KISMI
                            
                                <div className="custombox prevnextpost clearfix">
                                    <div className="row">
                                    <div className="col-lg-6">
                                        <div className="blog-list-widget">
                                        <div className="list-group">
                                            <a href="tech-single.html" className="list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="w-100 justify-content-between text-right">
                                                <img src="/upload/tech_menu_19.jpg" alt="" className="img-fluid float-right" />
                                                <h5 className="mb-1">5 Beautiful buildings you need to before dying</h5>
                                                <small>Prev Post</small>
                                            </div>
                                            </a>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="blog-list-widget">
                                        <div className="list-group">
                                            <a href="tech-single.html" className="list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="w-100 justify-content-between">
                                                <img src="/upload/tech_menu_20.jpg" alt="" className="img-fluid float-left" />
                                                <h5 className="mb-1">Let's make an introduction to the glorious world of history</h5>
                                                <small>Next Post</small>
                                            </div>
                                            </a>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <hr className="invis1" />
                            */
                        }
                        <div className="custombox authorbox clearfix">
                            <h4 className="small-title">Yazar Hakkında</h4>
                            <div className="row">
                            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                                <img src={apiURL + '/author_images/' + postDetail.get_post_owner.photo} alt="" className="img-fluid rounded-circle" /> 
                            </div>
                            <div className="col-lg-10 col-md-10 col-sm-10 col-xs-12">
                                <h4><Link to="/hakkimda">{postDetail.get_post_owner.nameSurname}</Link></h4>
                                <p>{postDetail.get_post_owner.about}</p>
                                <div className="topsocial">
                                <a href={postDetail.get_post_owner.facebookAddress} target='_blank' data-toggle="tooltip" data-placement="bottom" title="Facebook"><i className="fa fa-facebook" /></a>
                                <a href={postDetail.get_post_owner.youtubeAddress} target='_blank' data-toggle="tooltip" data-placement="bottom" title="Youtube"><i className="fa fa-youtube" /></a>
                                {/* <a href="#" target='_blank' data-toggle="tooltip" data-placement="bottom" title="Pinterest"><i className="fa fa-pinterest" /></a> */}
                                <a href={postDetail.get_post_owner.twitterAddress} target='_blank' data-toggle="tooltip" data-placement="bottom" title="Twitter"><i className="fa fa-twitter" /></a>
                                <a href={postDetail.get_post_owner.instagramAddress} target='_blank' data-toggle="tooltip" data-placement="bottom" title="Instagram"><i className="fa fa-instagram" /></a>
                                {/* <a href="#" target='_blank' data-toggle="tooltip" data-placement="bottom" title="Website"><i className="fa fa-link" /></a> */}
                                </div>
                            </div>
                            </div>
                        </div>
                        <hr className="invis1" />
                        <div className="custombox clearfix">
                            <h4 className="small-title">{postDetail.get_category.categoryName} Kategorisindeki Bazı İçerikler</h4>
                            <div className="row">
                                {
                                    this.mapAnotherPosts()
                                }
                            </div>
                        </div>
                        <hr className="invis1" />
                        <div className="custombox clearfix">
                            <h4 className="small-title">{postDetail.get_comments.length + ' Yorum'}</h4>
                            <div className="row">
                            <div className="col-lg-12">
                                <div className="comments-list">
                                    {
                                        this.mapComments()
                                    }
                                </div>
                            </div>
                            </div>
                        </div>
                        <hr className="invis1" />
                        <div className="custombox clearfix" ref={this.commentFormRef}>
                            <h4 className="small-title">Yorum Yap</h4>
                            <div className="row">
                            <div className="col-lg-12">
                                {
                                    this.renderSelectedComment()
                                }
                                <form className="form-wrapper">
                                    <div className="comment-form-response">
                                        {
                                            this.renderFormErrors()
                                        }
                                    </div>
                                    <input  type="text" 
                                            className="form-control" 
                                            placeholder="Ad soyad"
                                            name="nameSurname"
                                            onChange={this.handleChange} 
                                            value={commentData.nameSurname} 
                                    />
                                    <textarea className="form-control comment-textarea" 
                                              placeholder="Söylemek istedikleriniz..." 
                                              value={commentData.content} 
                                              name="content" 
                                              onChange={this.handleChange}
                                    />
                                    {
                                        commentLoading === false 
                                        ? <button type="submit" className="btn btn-primary comment-button" onClick={this.commentButtonClicked}>Yorumu Yayınla</button>
                                        : <Spin size="default" />
                                    }
                                </form>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                        <div className="sidebar">
                        {/* -------------- REKLAM ALANI -------------

                            <div className="widget">
                                <div className="banner-spot clearfix">
                                <div className="banner-img">
                                    <img src="/upload/banner_07.jpg" alt="" className="img-fluid" />
                                </div>
                                </div>
                            </div>
                        */}
                        
                        <div className="widget">
                            <h2 className="widget-title">En Çok Okunanlar</h2>
                            <div className="blog-list-widget">
                            <div className="list-group">
                                <MostReadPosts 
                                    posts={mostReadPosts}
                                />
                            </div>
                            </div>
                        </div>
                        <div className="widget">
                            <h2 className="widget-title">Popüler Yazılar</h2>
                            <div className="blog-list-widget">
                            <div className="list-group">
                                <PopulerPosts 
                                    posts={populerPosts}
                                />
                            </div>
                            </div>
                        </div>
                        <div className="widget">
                            <h2 className="widget-title">Kategoriler</h2>
                            <div className="blog-list-widget">
                                <div className="list-group">
                                    <ul className="category-list" name="category-list">
                                        <Categories 
                                            categories={categories}
                                        />
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="widget">
                            <h2 className="widget-title">Takipte Kalın</h2>
                            <SocialButtons />
                        </div>
                        {/* ----------- REKLAM ALANI -----------
                            <div className="widget">
                                <div className="banner-spot clearfix">
                                <div className="banner-img">
                                    <img src="/upload/banner_03.jpg" alt="" className="img-fluid" />
                                </div>
                                </div>
                            </div>
                        */}
                        </div>
                    </div>
                    </div>
                </div>
                </section>
                <GoToTopButton />
            </div>
        );
    }
    render(){
        return(
            <div className="post-detail">
                {
                    this.renderPage()
                }
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        categories:state.categoriesReducer,
        mostReadPosts:state.mostReadPostsReducer,
        populerPosts:state.populerPostsReducer
    }
}
export default connect(mapStateToProps,null)(Post);