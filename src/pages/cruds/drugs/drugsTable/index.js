import React, {useEffect, useState, useContext} from "react";
import ModalDeleteCrud from '../../../../components/modalDeleteCrud'
import ModalStatus from '../../../../components/modalStatus';
import ModalSoftDelete from "../../../../components/modalSoftDelete";
import ToastEx from "../../../../components/toasts";
import CrudTable from '../../../../components/crudTable'
import {useHistory} from "react-router-dom";
import {medApi} from "../../../../services/medService";
import UserContext from "../../../../context/UserContext";

function DrugsTable(props){
    const {setStateValue} = useContext(UserContext);
    const {lang, TranslateExp, uploadExcel, setApi} = props;
    const title = TranslateExp(lang, "products.med");
    const history = useHistory();
    const columns=[
        {
            Header: TranslateExp(lang, "table.id"),
            accessor:'counter'
        },
        {
            Header: TranslateExp(lang, "table.name"),
            accessor: "name_uz",
        },
        {
            Header: TranslateExp(lang, "products.mnn"),
            accessor: "drug_inn.name_uz",
        }
    ];
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [response, setResponse] = useState('');
    const[isOpenDelete,setIsOpenDelete] = useState(false);
    const[isOpenStatus, setIsOpenStatus] = useState(false);
    const[delId,setDelId] = useState(null);
    const[respData,setRespData] = useState([{}])
    const[filterStatus, setFilterStatus] = useState("all");
    const[sfDeletedId, setSfDeletedId] = useState(undefined);
    const[isOpenSoftDelete, setIsOpenSoftDelete] = useState(false);
      const filter = () => {
        switch(filterStatus){
            case "all":
            medApi.getList().then(resp => { 
                    ChangeData(resp.data.data)
                    setLoading(false);
                });
                break;
            case "active":
                medApi.getActiveList().then(resp => { 
                        ChangeData(resp.data.data)
                        setLoading(false);
                    })
                break;
            case "unactive":
                medApi.getUnactiveList().then(resp => {
                        ChangeData(resp.data.data)
                        setLoading(false)
                    })
                break;
            case "deleted":
                medApi.getDeletedList().then(resp => {
                        ChangeData(resp.data.data)
                        setLoading(false)
                    })
                break;
        }

    }
    function ChangeData(data){
        const DATA =[];
        data.forEach((key,id)=>{
            DATA.push({...key, counter: id+1});
        })
        setRespData(DATA);
    }
    useEffect(() => {
        setLoading(true);
        filter();
        console.log(respData);
    }, [filterStatus]);
    useEffect(() => {
        setApi(medApi);
    }, []);
    const toggle = ()=> {
        history.push("/admin/drugs/add");
    };
    const edit = (id) => {
        history.push(`/admin/drugs/update/${id}`);
    };
    function del(id) {
        const is_deleted = respData.find(data => data._id == id).is_deleted;
        medApi.delete(id, {is_deleted: !is_deleted}).then(res=>{
            setShow(true);
            setResponse({
                message: res.data.message.ru,
                status: res.data.status
            });
            setLoading(true);
            filter();
        })
        closeDelModal();
    }
    function softDelete(id){
        medApi.softDelete(id).then(res => {
            setShow(true);
            setResponse({
                message: res.data.message.ru,
                status:res.data.status
            });
            setLoading(true);
            filter();
        });
        closeSoftDeleteModal();
    }
    function changeStatus(id){
        const is_active = respData.find(data => data._id === id).is_active;
        medApi.changeStatus(id, {is_active: !is_active}).then(resp => {
            setShow(true);
            setResponse({
                message: resp.data.message.ru,
                status:resp.data.status
            });
            filter();
        });
        closeStatusModal();
    }

    const showModalDel=(id)=>{
        const is_deleted = respData.find(d => d._id == id).is_deleted;
        setDelId({id, is_deleted});;
        setIsOpenDelete(true);
    }
    const showModalSoftDelete = (id) => {
        setSfDeletedId(id);
        setIsOpenSoftDelete(true);
    }

    const closeSoftDeleteModal = () => {
        setIsOpenSoftDelete(false);
    }

    const closeDelModal = () => {
        setIsOpenDelete(false);
    }

    const showModalStatus = (id) => {
        setDelId(id);
        setIsOpenStatus(true);
    }

    const closeStatusModal = () => {
        setIsOpenStatus(false);
    }
    
    return(
        <>
            <ToastEx {...props} response={response} show={show} setShow={setShow}/>
            <CrudTable
                {...props} 
                title={title}
                data={respData} 
                columns={columns} 
                loading={loading} 
                showModalStatus={showModalStatus} 
                showModalDel={showModalDel}
                showModalSoftDelete={showModalSoftDelete}
                uploadExcel={uploadExcel}
                edit={edit}
                toggle={toggle}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />
            <ModalDeleteCrud 
                lang={lang} 
                TranslateExp={TranslateExp} 
                del={del} 
                delId={delId} 
                closeDelModal={closeDelModal} 
                isOpenDelete={isOpenDelete}
            />
            <ModalStatus lang={lang} TranslateExp={TranslateExp} changeStatus={changeStatus} delId={delId} closeStatusModal={closeStatusModal} isOpenStatus={isOpenStatus} />
            <ModalSoftDelete lang={lang} TranslateExp={TranslateExp} softDelete={softDelete} sfDeletedId={sfDeletedId} closeSoftDeleteModal={closeSoftDeleteModal} isOpenSoftDelete={isOpenSoftDelete} />
        </>
    )
    
}
export default DrugsTable;
