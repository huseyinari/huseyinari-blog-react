import React,{Component} from 'react';

class NotFound extends Component{
    componentDidMount(){
        window.scrollTo(0,0);
    }
    render(){
        return(
            <div style={{display:'flex',height:'75vh',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                <h1>Sayfa Bulunamadı !</h1>
            </div>
        )
    }
}

export default NotFound;