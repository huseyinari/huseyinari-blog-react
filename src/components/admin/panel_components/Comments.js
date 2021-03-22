import React, { Component } from 'react';
import {Badge,Spin,Modal} from 'antd';

// api url
import apiURL from '../../../apiURL';
// helper
import {convertDate} from '../../../helpers/PostFunctions';

export default class Comments extends Component {
    state = {
        comments:null,

        selectedComment:null, // silinmek için seçilen yorum

        selectedAnswer:null,  // silinmek için seçilen yanıt
        commentId:null, // silinmek için seçilen yanıtın hangi yoruma ait olduğunu tutuyor
    }
    componentDidMount(){
        this.getComments();
    }
    getComments = () => {
        const url = apiURL + '/api/admin/get_all_comments';
        fetch(url,{
            method:'GET',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                const comments = responseData.comments;
                this.setState({comments});
            }
        })
    }
    deleteCommentFromServer = () => {
        const url = apiURL + '/api/admin/delete_comment';
        const {selectedComment,comments} = this.state;

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            },
            body:JSON.stringify({id:selectedComment.id})
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                const updatedComments = comments.filter(comment => comment.id !== selectedComment.id);
                this.setState({comments:updatedComments,selectedComment:null});
            }
        })
    }
    deleteAnswerFromServer = () => {
        const url = apiURL + '/api/admin/delete_answer';
        const {selectedAnswer} = this.state;

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token') 
            },
            body:JSON.stringify({id:selectedAnswer.id})
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                let {selectedAnswer,comments,commentId} = this.state;

                const commentIndex = comments.findIndex(comment => comment.id === commentId);   // state'deki yanıtı silinecek yorumun id'si ile o yorumun index'ini buluyorum
                const updatedAnswers = comments[commentIndex].get_answers.filter(answer => answer.id !== selectedAnswer.id); // yoruma index'i ile ulaşarak içindeki yanıtları filtreliyorum.
                const updatedComment = { ...comments[commentIndex],get_answers:updatedAnswers }; // filtrelenmiş yanıtların, mevcut yanıtların yerine geçtiği yeni bir nesne oluşturuyorum.

                comments[commentIndex] = updatedComment;
                this.setState({comments,selectedAnswer:null,commentId:null});
            }
        })
    }
    mapAnswers = (answers,commentId) => {

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
                <small>{convertDate(answer.created_at)}</small>
                </h4>
                <p>{answer.answerContent}</p>
                <a className="btn-danger" onClick={() => this.setState({selectedAnswer:answer,commentId})}>Yanıtı Sil</a>
            </div>
        ));
    }
    mapComments = () => {
        const {comments} = this.state;

        if(comments === null)
            return (
                <div className="row md-12 xs-6 d-flex justify-content-center">
                    <Spin size="default" tip="Yükleniyor..." />
                </div>
            );

        return comments.map((comment,index) => (
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
                        <a href={"/yazilar/" + comment.get_post_details.seo }><b>{comment.get_post_details.title}</b></a>
                        <p>{comment.commentContent}</p>

                        <a className="btn-danger" onClick={() => this.setState({selectedComment:comment})}>Yorumu Sil</a>
                        <div>
                            {
                                this.mapAnswers(comment.get_answers,comment.id)
                            }
                        </div>
                    </div>
                </div>
        ))
    }
    render() {
        const {selectedComment,selectedAnswer} = this.state;

        return (
            <div className="comments">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body text-center">
                                <h4 className="card-title">Tüm Yorumlar</h4>
                            </div>
                            <div className="comments-list">
                                {
                                    this.mapComments()
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Modal  title="Yorumu Sil"
                        visible={selectedComment === null ? false : true} 
                        onOk={this.deleteCommentFromServer} 
                        onCancel={() => this.setState({selectedComment:null})} 
                        okText="Sil" 
                        cancelText="İptal"
                >
                    {
                        selectedComment !== null
                        ? <p><b>{selectedComment.commentContent}</b> yorumu silinecek...</p>
                        : null
                    }
                </Modal>

                <Modal  title="Yanıtı Sil"
                        visible={selectedAnswer === null ? false : true} 
                        onOk={this.deleteAnswerFromServer} 
                        onCancel={() => this.setState({selectedAnswer:null})} 
                        okText="Sil" 
                        cancelText="İptal"
                >
                    {
                        selectedAnswer !== null
                        ? <p><b>{selectedAnswer.answerContent}</b> yanıtı silinecek...</p>
                        : null
                    }
                </Modal>
            </div>
        )    
    }
}
