import React, {useEffect, useState} from "react";
import st from '../crud.module.scss';
import {Button, Modal, Form} from "react-bootstrap";
import ModalDeleteCrud from '../../../components/modalDeleteCrud'
import ModalStatus from '../../../components/modalStatus';
import ToastEx from "../../../components/toasts";
import CrudTable from '../../../components/crudTable'
import ModalSoftDelete from "../../../components/modalSoftDelete";
import { NewsApi } from "../../../services/newsService";



function News (props) {
    const {lang, TranslateExp, uploadExcel} = props;
    const mainTitle = TranslateExp(lang, "sidebar.News")
    const newsPage = true;
    const [title,setTitle] = useState({title:""});
    const columns = [
        {
            notSort: true,
            Header: "№",
            Cell: (props) => +props.row.id+1        
        },
        {   
            Header: TranslateExp(lang, "table.title"),
            accessor: "title",
        }
    ];
    const[loading, setLoading] = useState(true);
    const[show, setShow] = useState(false);
    const[response, setResponse] = useState('');
    const[isMOpen,setIsMOpen] = useState(false);
    const[isOpenDelete,setIsOpenDelete] = useState(false);
    const[isOpenStatus, setIsOpenStatus] = useState(false);
    const[delId,setDelId] = useState(null);
    const[editModal,setEditModal] = useState(false);
    const[respData,setRespData] = useState([]);
    const[id,setId] = useState(null);
    const[filterStatus, setFilterStatus] = useState("active");
    const[isDeleted,setIsDeleted] = useState(false);
    const[isActive,setIsActive] = useState(true);
    const[data,setData] = useState('');
    const[desc,setDesc] = useState('');
    const[isOpenSoftDelete, setIsOpenSoftDelete] = useState(false);
    const[sfDeletedId, setSfDeletedId] = useState(undefined);
    const filter = () => {
        console.log('123');
        switch(filterStatus){
            case "active":
                NewsApi.getAllList().then(resp => {
                    setRespData(resp.data.data);
                    setLoading(false);
                });
                break;
            case "unactive":
                NewsApi.getUnactiveList().then(resp =>{
                    setRespData(resp.data.data)
                    setLoading(false);
                });
                break;
            case "deleted":
                NewsApi.getDeletedList().then(resp =>{
                    setRespData(resp.data.data)
                    setLoading(false);
                });
                break;
        }
    }

    useEffect(() => {
        setLoading(true);
        filter();
    }, [filterStatus]);
    const edit=(id)=> {
        if (id){
            setId(id);
            setTitle(respData.find(item=>item._id===id).title);
            setDesc(respData.find(item=>item._id===id).description);
            setEditModal(!editModal);
        }
    }

    function del(id) {
        const is_deleted = respData.find(data => data._id == id).is_deleted;
        NewsApi.delete(id, {is_deleted: !is_deleted}).then(res=>{
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
        NewsApi.softDelete(id).then(res => {
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
        NewsApi.changeStatus(id, {is_active: !is_active}).then(resp => {
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

    const closeDelModal = () => {
        setIsOpenDelete(false);
    }

    const showModalSoftDelete = (id) => {
        setSfDeletedId(id);
        setIsOpenSoftDelete(true);
    }

    const closeSoftDeleteModal = () => {
        setIsOpenSoftDelete(false);
    }

    const showModalStatus = (id) => {
        setDelId(id);
        setIsOpenStatus(true);
    }

    const closeStatusModal = () => {
        setIsOpenStatus(false);
    }
    const toggle = () => {
        setIsMOpen(!isMOpen);
        setIsActive(true);
    }
    function handleDelete(){
        if(isDeleted){
            setIsDeleted(false);
        } else {
            setIsDeleted(true);
            setIsActive(false);
        }
    }
    function handleActive(){
        if(isActive){
            setIsActive(false);
        } else {
            setIsActive(true);
            setIsDeleted(false);
        }
    }
    const editToggle = () => {
        setEditModal(!editModal);
    } 
    const addNews = e => {
        e.preventDefault();
        const slug = data.split(' ');
        NewsApi.save({title:data,description:desc,slug: (slug.join('-')).toLowerCase(),is_deleted:isDeleted,is_active:isActive,is_news:true}).then(resp=>{
            setShow(true);
            if (resp.status===200){
                setIsMOpen(!isMOpen);
                setResponse({
                    message: TranslateExp(lang, "content.messageAdded"),
                    status: resp.data.status
                });
            }

            if(resp.status != 200 &&  resp.status != 201){
                setShow(true)
                setResponse({
                    message: TranslateExp(lang, "content.messageErr"),
                    status: resp.data.status
                })
            }
            setLoading(true);
            filter();
            setIsDeleted(false);
        });
    };

    const saveEditNews = (e) => {
        e.preventDefault();
        const {is_deleted, is_active} = respData.find(d => d._id == id);

        NewsApi.edit(id,{
            title: title, /* this param doesn't work correctly*/
            description: desc,
            is_deleted,
            is_active,
            is_news: true
        }).then(res=>{
            setShow(true)
            setEditModal(!editModal)
            setResponse({
                message: res.data.message.ru,
                status: res.data.status
            })
            console.log(res);
            setLoading(true);
            filter()
        })
    };
    return(
        <div>
            <ToastEx {...props} response={response} show={show} setShow={setShow}/>
            <CrudTable 
                {...props}
                title={mainTitle}
                newsPage = {newsPage}
                data={respData} 
                columns={columns} 
                loading={loading} 
                uploadExcel={uploadExcel}
                showModalStatus={showModalStatus} 
                showModalDel={showModalDel}
                showModalSoftDelete={showModalSoftDelete}
                edit={edit}
                toggle={toggle}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />
            <Modal show={isMOpen} onHide={toggle}>
                <Modal.Header><h5 className='m-0'>{TranslateExp(lang, "content.adding")} {TranslateExp(lang, "table.text").toLowerCase()}</h5></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e=>addNews(e)}>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "table.title")}</Form.Label>
                            <Form.Control onChange={e=>{setData(e.target.value)}}
                                            name={"title"} type = 'text' placeholder = {TranslateExp(lang, "table.title")} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "table.text")}</Form.Label>
                            <Form.Control as="textarea" style={{minHeight: '150px'}} row={3} onChange={e=>{setDesc(e.target.value)}}
                                            name={"title"} type = 'text' placeholder = '...' required />
                        </Form.Group>
                        <div className='d-flex mb-3'>
                            <Form.Check type="switch" id="active" checked={isActive} label={TranslateExp(lang, "content.activeOne")} onChange={()=>handleActive()} className='mr-2' />
                            <Form.Check type="switch" id="delete" checked={isDeleted} onChange={()=>handleDelete()} label={TranslateExp(lang, "content.deletedOne")}/>
                            <br/>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <Button type='button' className={`btn ${st.btn__white}`} onClick={toggle}>{TranslateExp(lang, "content.cancel")}</Button>
                            <Button type='submit' className={`btn ${st.btn__primary}`}>{TranslateExp(lang, "content.toAdd")}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {/*    edit modal*/}
            <Modal show={editModal} onHide={editToggle}>
                <Modal.Header><h5 className='m-0'>{TranslateExp(lang, "content.editing")} {TranslateExp(lang, "table.text").toLowerCase()}</h5></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e=>saveEditNews(e)}>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "table.title")}</Form.Label>
                            <Form.Control 
                                onChange={e => setTitle(e.target.value)}
                                defaultValue={title} 
                                name={"title"} 
                                type = 'text' 
                                placeholder = {TranslateExp(lang, "table.title")}
                                required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "table.text")}</Form.Label>
                            <Form.Control as="textarea" 
                                style={{minHeight: '150px'}} 
                                row={3} 
                                onChange={e => setDesc(e.target.value)}
                                defaultValue={desc} 
                                name={"desc"} 
                                type = 'text' 
                                placeholder = '...' 
                                required />
                        </Form.Group>
                        <div className='d-flex justify-content-between'>
                            <Button type='button' className={`btn ${st.btn__white}`} onClick={editToggle}>{TranslateExp(lang, "content.cancel")}</Button>
                            <Button type='submit' className={`btn ${st.btn__primary}`}>{TranslateExp(lang, "content.save")}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <ModalDeleteCrud lang={lang} TranslateExp={TranslateExp} del={del} delId={delId} closeDelModal={closeDelModal} isOpenDelete={isOpenDelete}/>
            <ModalStatus lang={lang} TranslateExp={TranslateExp} changeStatus={changeStatus} delId={delId} closeStatusModal={closeStatusModal} isOpenStatus={isOpenStatus} />
            <ModalSoftDelete lang={lang} TranslateExp={TranslateExp} softDelete={softDelete} sfDeletedId={sfDeletedId} closeSoftDeleteModal={closeSoftDeleteModal} isOpenSoftDelete={isOpenSoftDelete} />
        </div>
    )
}

export default News;