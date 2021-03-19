import React, { Component } from 'react';
import {Badge} from 'antd';

// api url
import apiURL from '../../../apiURL';
// helper
import {convertDate} from '../../../helpers/PostFunctions';
// router
import {Link} from 'react-router-dom';

export default class Comments extends Component {
    state = {
        comments:null,
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
                <a className="btn-danger">Yanıtı Sil</a>
            </div>
        ));
    }
    mapComments = () => {
        const {comments} = this.state;

        if(comments === null)
            return null;

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
                        <a className="btn-danger">Yorumu Sil</a>

                        <div>
                            {
                                this.mapAnswers(comment.get_answers)
                            }
                        </div>
                    </div>
                </div>
        ))
    }
    render() {
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
            </div>
        )    
    }
}
