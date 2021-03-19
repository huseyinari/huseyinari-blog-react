import React, { Component } from 'react'
import {Button,Modal,Spin} from 'antd';
import {BiBookAdd} from 'react-icons/bi';
// text editor
import { HtmlEditor, MenuBar } from '@aeaton/react-prosemirror'
import { options, menu } from '@aeaton/react-prosemirror-config-default'
// redux
import {connect} from 'react-redux';
import apiURL from '../../../apiURL';

class AddPost extends Component {
    state = {
        postData:{
            postContent: this.props.selectedPost !== null ? this.props.selectedPost.postContent : '', // componentdidmount içerisindeki güncellemede editör kendini güncellemiyor.onun için burada yazdım
            title:'',
            categoryId:'',
            coverPhoto:''
        },
        addOrUpdateResponse:null,
        loading:false,

        // resim ekleme modal
        addImageModalVisible:false,
        image:'',
        addImageResult:null, // sunucudan dönen değeri tutacak (başarıylıysa status:true,url:resim url ----- başarısızsa status:false)
        copyUrlResult:null  // yüklenen resmin url'ini kopyalama işleminden sonra 2 saniye ekranda görünecek "Resim adresi kopyalandı yazısı"
    }
    componentDidMount(){
        const {selectedPost} = this.props;

        if(selectedPost !== null){
            this.setState({postData:selectedPost});
        }
    }
    handleChange = (e) => {
        let {postData} = this.state;
        const name = e.target.name;

        postData[name] = e.target.value;

        this.setState({postData},() => console.log(postData));
    }
    editorOnChange = (value) => {
        let {postData} = this.state;
        postData['postContent'] = value;
        this.setState({postData},() => console.log(postData));
    }
    /* --------------------- Resim Yükle -------------------------- */
    imageInputChanged = (e,type) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        if(type === 'coverPhoto')
            this.createImage(files[0],'coverPhoto');
        else
            this.createImage(files[0],'image');
    }
    createImage = (file,type) => {
        let imageReader = new FileReader();     // post içeriği için yüklenecek resim
        imageReader.onload = (e) => {
          this.setState({image: e.target.result});
        };

        let coverPhotoReader = new FileReader();    // post'un kapak fotoğrafı
        coverPhotoReader.onload = (e) => {
            this.setState({postData:{...this.state.postData,coverPhoto:e.target.result}});
        }

        if(type === 'coverPhoto')   // parametre olarak gelen type değişkeni ile state'deki kapak fotoğrafı mı yoksa image nesnesi mi yazılacak onu belirliyorum
            coverPhotoReader.readAsDataURL(file);
        else
            imageReader.readAsDataURL(file);
    }
    imageUpload = () => {
        const {image} = this.state;
        const url = apiURL + '/api/admin/add_image';
        const formData = {file: image}

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            },
            body:JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(responseData => this.setState({addImageResult:responseData}));
    }  
    /* --------------------------------------------------------- */
    saveButtonClicked = () => {    // yazıyı ekle butonuna tıklandıktan 250ms sonra istek at - loading efekti için
        this.setState({loading:true});
        const {selectedPost} = this.props;

        if(selectedPost === null)
            setTimeout(this.addPostToServer,250);
        else
            setTimeout(this.updatePostToServer,250);
    }
    addPostToServer = () => {
        const url = apiURL + '/api/admin/add_post';
        const {postData} = this.state;

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            },
            body:JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(responseData => this.setState({addOrUpdateResponse:responseData,loading:false}));
    }
    updatePostToServer = () => {
        const url = apiURL + '/api/admin/update_post';
        const {postData} = this.state;

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            },
            body:JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(responseData => this.setState({addOrUpdateResponse:responseData,loading:false}));
    }
    copyUrlToClipboard = (e) => { // post resmi yüklendikten sonra verilen resim url'ini kopyalama tuşu tıklandığında çalışacak fonksiyon
        // görünmez bir textarea oluşturup, value olarak yüklenen resmin url'ini veriyoruz ve textarea elemanını seçtikten sonra kopyalama fonksiyonunu çalıştırıyoruz
        const textarea = document.createElement('textarea');
        textarea.value = this.state.addImageResult.url;
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999999px';
        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand('copy');
        this.setState({copyUrlResult:'Resim adresi kopyalandı...'});
        
        document.body.removeChild(textarea);
        setTimeout(() => this.setState({copyUrlResult:''}),2000); // 2 saniye sonra resim adresi kopyalandı yazısı kaybolsun
    }
    mapCategories = () => {
        const {categories} = this.props;
        
        return categories.map( category => (
            <option value={category.id}>{category.categoryName}</option>
        ));
    }
    renderFormResponse = () => {
        const {addOrUpdateResponse} = this.state;

        if(addOrUpdateResponse === null)
            return null;
        else if(addOrUpdateResponse.status === true)
            return(<div className="alert alert-success text-center">{addOrUpdateResponse.message}</div>)
        else
            return Object.keys(addOrUpdateResponse.errors).map(error => (
                <div><small style={{color:'red'}}>{addOrUpdateResponse.errors[error]}</small></div>
            ))
    }
    renderModalFeedback = () => {
        const {addImageResult,copyUrlResult} = this.state;

        if(addImageResult === null)
            return null;
        else if(addImageResult.status === false)
            return (<div><small style={{color:'red'}}>Resim yükleme başarısız oldu.</small></div>)
        else 
            return (
                <div>
                    <small style={{color:'green'}}>{addImageResult.url}</small>
                    <a style={{color:'orangered'}} onClick={this.copyUrlToClipboard} title="Adresi kopyala"> - Kopyala </a>
                    <hr />
                    <div><small style={{color:'lightgreen'}}> {copyUrlResult} </small></div> {/* resim adresi kopyalandı... yazısı */}
                    <br />
                </div>
            )
        
    }
    render() {
        const {postData,loading} = this.state;
        return (
            <div className="row">
                <div className="col-md-12 add-post-wrapper">
                    {
                        this.renderFormResponse()
                    }
                    <hr />
                    <div>
                        <div className="input-text" >Yazı Başlığı : </div>
                        <input className="post-title" placeholder="Yazı Başlığı" name="title" value={postData['title']} onChange={this.handleChange} minLength={5} maxLength={100}/>
                    </div>
                    <div>
                        <div className="input-text">Yazı Kapak Resmi : </div>
                        <input type="file" className="post-cover-photo" onChange={(e) => this.imageInputChanged(e,'coverPhoto')}/>
                    </div>
                    <div>
                        <div className="input-text">Yazı Kategorisi : </div>
                        <select className="category-select" name="categoryId" onChange={this.handleChange} value={postData['categoryId']}>
                            <option value={''}>Kategori seçiniz</option>
                            {
                                this.mapCategories()
                            }
                        </select>
                    </div>

                    <div className="editor-wrapper">
                        <HtmlEditor
                            options={options}
                            value={postData['postContent']}
                            onChange={this.editorOnChange}
                            render={({ editor, view }) => (
                            <div>
                                <MenuBar menu={menu} view={view} />
                                {editor}
                            </div>
                            )}
                        />
                    </div>
                    <div>
                        {
                            loading === true
                            ? <Spin size="default" />
                            : <Button className="add-post-button" type="primary" icon={<BiBookAdd />} size="large" onClick={this.saveButtonClicked}> Kaydet </Button>
                        }
                        <Button type="dashed" icon={<BiBookAdd />} size="large" style={{marginLeft:10}} onClick={() => this.setState({addImageModalVisible:true})}>
                            Resim Ekle
                        </Button>
                    </div>

                    {/* resim ekleme modal */}
                    <Modal title="Sunucuya Resim Ekle" 
                        visible={this.state.addImageModalVisible} 
                        okText="Tamam"
                        onOk={this.imageUpload} 
                        cancelText="İptal"
                        onCancel={() => this.setState({addImageModalVisible:false})}
                    >
                        {
                            this.renderModalFeedback()
                        }
                        <input type="file" onChange={(e) => this.imageInputChanged(e,'image')}></input>
                    </Modal>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        categories:state.categoriesReducer
    }
}
export default connect(mapStateToProps,null)(AddPost);
