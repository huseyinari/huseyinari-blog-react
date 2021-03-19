import React,{Component} from 'react';

class Pagination extends Component{
    render(){
        const {currentPage,totalPage,paginateCount,handleClick} = this.props;
        const paginateElements = [];
        
        const firstPage = currentPage - (paginateCount/2);  // başlangıç sayfa numarası
        const lastPage = firstPage < 0 ? currentPage + (paginateCount/2) + (firstPage*-1) : currentPage + (paginateCount/2); // bitiş sayfa numarası
        // lastPage için eğer başlangıç numarası negatifse : örneğin -3 ise bunun negatif kısmını yani 3 adet sayfayı bitiş numarasına ekliyorum: 1. sayfadan başlayınca da sayfada 10 adet paginate elemanı olması için

        paginateElements.push(
            <li className="page-item">
                <a className="page-link" onClick={() => handleClick(1)}>İlk</a>
            </li>
        )

        for(let i=firstPage; i<=lastPage; i++){
            if(i>0 && i<=totalPage){
                paginateElements.push(
                    <li className="page-item">
                        <a className={i===currentPage ? "page-link active-link" : 'page-link'} onClick={() => handleClick(i)}>
                            {i}
                        </a>
                    </li>
                )
            }    
        }

        let nextPage = currentPage === totalPage ? 1 : currentPage + 1;
        paginateElements.push(
            <li className="page-item">
                <a className="page-link" onClick={() => handleClick(nextPage)}>{'>'}</a>
            </li>
        )

        paginateElements.push(
            <li className="page-item">
                <a className="page-link" onClick={() => handleClick(totalPage)}>Son</a>
            </li>
        )
        return paginateElements;
    }
}
export default Pagination;