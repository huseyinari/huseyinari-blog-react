import React, { Component } from 'react'
import {Table,Space,Spin,Modal} from 'antd';

// api url
import apiURL from '../../../apiURL';
// redux
import {connect} from 'react-redux';

class AllPosts extends Component {
    state = {
        posts:null,

        // yazı silme
        deleteModalVisible:false,
        selectedPost:null, // silinmek için seçilen yazı
        deleteResponse:null
    }
    componentDidMount(){
        this.getAllPosts();
    }
    getAllPosts = () => {
        const url = apiURL + '/api/admin/get_all_posts';
        
        fetch(url,{
            method:'GET',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(responseData => {
            const posts = responseData.posts;
            this.setState({posts});
        })
    }
    deletePostFromServer = () => {
        const url = apiURL + '/api/admin/delete_post';
        const {selectedPost} = this.state;

        if(selectedPost !== null){
            fetch(url,{
                method:'POST',
                headers:{
                    'Content-type' : 'application/json',
                    'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
                },
                body:JSON.stringify({id:selectedPost.id})
            })
            .then(response => response.json())
            .then(responseData => this.setState({deleteResponse:responseData}))
        }
    }
    renderDeleteResponse = () => {
        const {deleteResponse} = this.state;
        
        if(deleteResponse === null)
            return null;
        
        if(deleteResponse.status === true)
            window.location.reload();
        else
            alert(deleteResponse.message);
    }
    renderDeleteModal = () => {
        const {deleteModalVisible,selectedPost} = this.state;
        
        if(selectedPost === null)
            return null;
        
        return (
            <Modal  title="Kategoriyi Sil" 
                    visible={deleteModalVisible} 
                    okText="Sil" 
                    onOk={this.deletePostFromServer} 
                    cancelText="İptal"
                    onCancel={() => this.setState({deleteModalVisible:false,selectedPost:null})}
                    okButtonProps={{danger:true}}
            >
                {
                    this.renderDeleteResponse()
                }
                <p> <b> {selectedPost.title} </b> yazısını tamamen silmek istiyor musunuz ? </p>
            </Modal>
        )
    }
    renderPostsTable = () => {
        const {posts} = this.state;
        const {changeActivePage} = this.props;

        if(posts === null)
            return (<Spin size="default" tip="Yükleniyor..." style={{height:'80vh',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}/>)
        
        let dataSource = [];

        posts.forEach((post,index) => {
            dataSource.push({
                key:index,
                id:post.id,
                title:post.title,
                postContent:post.postContent,
                categoryId:post.categoryId,
                coverPhoto:post.coverPhoto
            })
        });

        return(
            <Table dataSource={dataSource} pagination={{hideOnSinglePage:true}} className="all-posts-table">
                <Table.Column title="Yazı Başlığı" dataIndex="title" />
                <Table.Column title="İşlemler" render={(value,record) => (
                    <Space size="middle">
                        <a className="edit-button" onClick={() => 
                            changeActivePage('AddPost',record)}>Düzenle</a> 
                        {/* düzenle butonu tıklandığında AddPost sayfasına geçiş yapılıyor ve tıklanan yazıyı da selectedPost olarak gönderiyor */}
                        <a className="delete-button" onClick={() => this.setState({deleteModalVisible:true,selectedPost:record})}>Sil</a>
                    </Space>
                )}>
                </Table.Column>
            </Table>
        )
    }
    render() {
        return (
            <div className="all-posts-wrapper">
                {
                    this.renderPostsTable()
                }
                {
                    this.renderDeleteModal()
                }
            </div>
        )
    }
}
export default AllPosts;