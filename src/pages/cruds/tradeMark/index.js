import React, {useEffect} from "react";
import ModalAdd from '../../../components/modalAdd';
import ModalEdit from '../../../components/modalEdit';
import ModalDeleteCrud from '../../../components/modalDeleteCrud'
import ModalStatus from '../../../components/modalStatus';
import ToastEx from "../../../components/toasts";
import CrudTable from '../../../components/crudTable'
import ModalSoftDelete from "../../../components/modalSoftDelete";

import {tradeMarkApi} from "../../../services/tdService";


function TradeMark(props){
    const {respData, setApi, setLoading, lang, TranslateExp, uploadExcel} = props;
    const title = TranslateExp(lang, "products.td"),
          addTitle = TranslateExp(lang, "cruds.td")+' '+TranslateExp(lang, "cruds.add"),
          editTitle = TranslateExp(lang, "cruds.td")+' '+TranslateExp(lang, "cruds.edit"),
        columns =[
            {
                Header: TranslateExp(lang, "table.id"),
                accessor: "counter",
            },
            {
                Header: TranslateExp(lang, "table.name"),
                accessor: "name_uz",
            }
        ];
    useEffect(()=>{
        setLoading(true);
        setApi(tradeMarkApi);
    },[])
    return(
        <>
            <ToastEx {...props}/>
            <CrudTable 
                title={title}
                uploadExcel={uploadExcel}
                columns={columns} 
                data={respData} 
                {...props}
            />
            <ModalAdd {...props} addTitle={addTitle}/>
            <ModalEdit {...props} editTitle={editTitle}/>
            <ModalDeleteCrud {...props}/>
            <ModalStatus {...props} />
            <ModalSoftDelete {...props} />
        </>
    )
    
}
export default TradeMark;