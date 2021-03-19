import React, { Component } from 'react'
import {Table,Space,Button,Modal,Input,Spin} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

//redux
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as categoryActions from '../../../redux/actions/categoriesActions';
// api url
import apiURL from '../../../apiURL';

class Categories extends Component {
    state = {
        addOrUpdateData:{
            categoryName:'',
            categoryDescription:''
        },
        addOrUpdateModalVisible:false,
        addOrUpdateLoading:false,
        addOrUpdateErrors:null,

        selectedCategory:null, // silinmek veya düzenlenmek için tıklanan kategoriyi tutacak

        deleteModalVisible:false,
    }
    /* ------------------------------------------------------------- kategori ekleme-düzenleme -------------------------------------------------------- */
    openAddCategoryModal = () => {
        let {addOrUpdateData,addOrUpdateModalVisible,selectedCategory} = this.state;
        
        addOrUpdateData['categoryName'] = '';
        addOrUpdateData['categoryDescription'] = '';
        selectedCategory = null;
        addOrUpdateModalVisible = true;

        this.setState({addOrUpdateData,selectedCategory,addOrUpdateModalVisible});
    }
    openUpdateCategoryModal = (_selectedCategory) => {
        let {addOrUpdateData,addOrUpdateModalVisible,selectedCategory} = this.state;

        addOrUpdateData['categoryName'] = _selectedCategory.categoryName;
        addOrUpdateData['categoryDescription'] = _selectedCategory.categoryDescription;
        
        addOrUpdateModalVisible = true;
        selectedCategory = _selectedCategory;
        
        this.setState({addOrUpdateData,addOrUpdateModalVisible,selectedCategory});
    }
    cancelAddOrUpdate = () => { // iptal etme butonu
        const addOrUpdateModalVisible = false;
        const addOrUpdateErrors = null;
        this.setState({addOrUpdateModalVisible,addOrUpdateErrors});
    }
    saveButtonClicked = () => { // kaydet butonu tıklandığında
        const {selectedCategory} = this.state;

        this.setState({addOrUpdateLoading:true});
        
        if(selectedCategory === null)
            setTimeout(this.addCategoryToServer,250);
        else
            setTimeout(this.updateCategoryToServer,250);
    }
    addCategoryToServer = () => { // server'a istek gönderme
        const url = apiURL + '/api/admin/add_category';
        const {addOrUpdateData} = this.state;
        const {setCategory} = this.props.actions;

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            },
            body:JSON.stringify(addOrUpdateData)
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === false){
                const addOrUpdateLoading = false;
                const addOrUpdateErrors = responseData.errors;
                this.setState({addOrUpdateLoading,addOrUpdateErrors});
            }else{
                const addOrUpdateLoading = false;
                const addOrUpdateModalVisible = false;
                const newCategory = responseData.newCategory;
                setCategory(newCategory);   // redux'a yeni eklenen kategoriyi ekle (sayfa yenilenmeden görülebilsin)
                this.setState({addOrUpdateLoading,addOrUpdateModalVisible}); // loading icon'unu ve modal'ı kapat
            }
        });
    }
    updateCategoryToServer = () => {
        const url = apiURL + '/api/admin/update_category';
        const {addOrUpdateData,selectedCategory} = this.state;
        const {updateCategory} = this.props.actions;

        const formData = {id:selectedCategory.id,...addOrUpdateData};
        
        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            },
            body:JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === false){
                const addOrUpdateLoading = false;
                const addOrUpdateErrors = responseData.errors;
                this.setState({addOrUpdateLoading,addOrUpdateErrors});
            }else{
                const addOrUpdateLoading = false;
                const addOrUpdateModalVisible = false;
                const updatedCategory = responseData.category;
                updateCategory(updatedCategory);    // redux'taki kategoriler dizisinde de güncellemeyi yap
                this.setState({addOrUpdateLoading,addOrUpdateModalVisible});
            }
        })
        
    }
    addOrUpdateHandleChange = (e) => { // input'ların değişikliğini yakala
        let {addOrUpdateData} = this.state;
        const name = e.target.name;
        const value = e.target.value;
        addOrUpdateData[name] = value;
        this.setState({addOrUpdateData});
    }
    /* ------------------------------------------------------------------------------------------------------------------------------------------- */
    /* ----------------------------------------------------------- kategori sil ------------------------------------------------------------------ */
    deleteCategoryFromServer = () => {
        const url = apiURL + '/api/admin/delete_category';
        const {deleteCategory} = this.props.actions;
        const {selectedCategory} = this.state;

        if(selectedCategory === null)
            return;

        fetch(url,{
            method:'POST',
            headers:{
                'Content-type' : 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            },
            body:JSON.stringify({id:selectedCategory.id})
        })
        .then(response => response.json())
        .then(responseData => {
            if(responseData.status === true){
                deleteCategory(selectedCategory.id); // silinen kategoriyi redux'tan da çıkart
                this.setState({deleteModalVisible:false});
            }
        })
    }
    cancelModalDelete = () => {
        const deleteModalVisible = false;
        const selectedCategory = null;

        this.setState({deleteModalVisible,selectedCategory});
    }
    /* --------------------------------------------------------------------------------------------------------------------------------------------*/
    renderAddCategoryErrors = () => {
        const {addOrUpdateErrors} = this.state;

        if(addOrUpdateErrors === null)
            return null;

        return Object.keys(addOrUpdateErrors).map( error => (
            <li style={{color:'red'}}><small>{addOrUpdateErrors[error]}</small></li>
        ));
    }
    renderAddOrUpdateModal = () => {
        const {addOrUpdateModalVisible,addOrUpdateLoading,addOrUpdateData} = this.state;

        return(
            <Modal title="Kategori Ekle / Düzenle" visible={addOrUpdateModalVisible} okText="Kaydet" onOk={this.saveButtonClicked} cancelText="İptal" onCancel={this.cancelAddOrUpdate}>
                <ul>
                    {
                        this.renderAddCategoryErrors()
                    }
                </ul>
                <Input  name="categoryName" 
                        placeholder="Kategori Adı" 
                        value={addOrUpdateData['categoryName']}
                        onChange={this.addOrUpdateHandleChange}
                        maxLength={100}
                />
                <Input.TextArea name="categoryDescription" 
                                placeholder="Kategori Açıklama"
                                value={addOrUpdateData['categoryDescription']} 
                                onChange={this.addOrUpdateHandleChange} 
                                rows={5} 
                                showCount={true} 
                                maxLength={500} 
                                style={{marginTop:5}}
                />
                {
                    addOrUpdateLoading === true
                    ? <Spin size="default" tip="Kaydediliyor..."/>
                    : null
                }
            </Modal>
        )
    }
    renderDeleteModal = () => {
        const {deleteModalVisible} = this.state;
        return (
            <Modal  title="Kategoriyi Sil" 
                    visible={deleteModalVisible} 
                    okText="Sil" 
                    onOk={this.deleteCategoryFromServer} 
                    cancelText="İptal" 
                    onCancel={this.cancelModalDelete}
                    okButtonProps={{danger:true}}
            >
                <p style={{color:"red"}}>Devam ederseniz kategori içerdiği yazılarla birlikte tamamen silinecek !</p>
            </Modal>
        )
    }
    renderCategoriesTable = () => {
        const {categories} = this.props;
        let dataSource = [];

        categories.forEach((category,index) => {
            dataSource.push({
                key:index,
                id:category.id,
                categoryName:category.categoryName,
                categoryDescription:category.categoryDescription
            })
        });

        return(
            <Table dataSource={dataSource} pagination={{hideOnSinglePage:true}} className="admin-page-table">
                <Table.Column title="Kategori Adı" dataIndex="categoryName" />
                <Table.Column title="Açıklama" dataIndex="categoryDescription" />
                <Table.Column title="İşlemler" render={(value,record) => (
                    <Space size="middle">
                        <a className="edit-button" onClick={() => this.openUpdateCategoryModal(record)}>Düzenle</a>
                        <a className="delete-button" onClick={() => this.setState({selectedCategory:record,deleteModalVisible:true})}>Sil</a>
                    </Space>
                )}>
                </Table.Column>
            </Table>
        )
    }
    render() {
        return (
            <div className="categories">

                <Button type="primary" className="add-category-btn" onClick={this.openAddCategoryModal}>Kategori Ekle</Button>
                {
                    this.renderCategoriesTable()
                }
                {
                    this.renderAddOrUpdateModal()
                }
                {
                    this.renderDeleteModal()
                }
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        categories:state.categoriesReducer
    }
}
function mapDispatchToProps(dispatch){
    return{
        actions:{
            setCategory:bindActionCreators(categoryActions.setCategory,dispatch),
            deleteCategory:bindActionCreators(categoryActions.deleteCategory,dispatch),
            updateCategory:bindActionCreators(categoryActions.updateCategory,dispatch)
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Categories);