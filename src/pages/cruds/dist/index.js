import React, {useEffect} from "react";
import ModalAdd from '../../../components/modalAdd';
import ModalEdit from '../../../components/modalEdit';
import ModalDeleteCrud from '../../../components/modalDeleteCrud'
import ModalStatus from '../../../components/modalStatus';
import ToastEx from "../../../components/toasts";
import CrudTable from '../../../components/crudTable'
import ModalSoftDelete from "../../../components/modalSoftDelete";

import {distApi} from "../../../services/distService";

function Dist(props){
    const {respData, setApi, setLoading, lang, TranslateExp, uploadExcel} = props;
    const title = TranslateExp(lang, "products.dist");
    const addTitle = TranslateExp(lang, "cruds.dist")+' '+TranslateExp(lang, "cruds.add");
    const editTitle = TranslateExp(lang, "cruds.dist")+' '+TranslateExp(lang, "cruds.edit");
    const columns = [
        {
            Header: TranslateExp(lang, "table.id"),
            accessor: "counter"
        },
        {   
            Header: TranslateExp(lang, "table.name"),
            accessor: "name_uz",
        }
    ]
    useEffect(()=>{
        setLoading(true);
        setApi(distApi);
    },[])
    return(
        <>
            <ToastEx {...props}/>
            <CrudTable 
                title={title}
                uploadExcel={uploadExcel}
                data={respData} 
                columns={columns} 
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
export default Dist;