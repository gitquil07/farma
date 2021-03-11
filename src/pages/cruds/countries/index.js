import React, {useEffect, useState} from "react";
import {Button, Modal,Form} from "react-bootstrap";
import st from "../crud.module.scss";
import ModalDeleteCrud from '../../../components/modalDeleteCrud'
import ModalSoftDelete from "../../../components/modalSoftDelete";
import ModalStatus from '../../../components/modalStatus';
import ToastEx from "../../../components/toasts";
import CrudTable from '../../../components/crudTable';
import {countryApi} from "../../../services/countryService";

function Countries(props){
    const {edit, saveEditCountry, addCountry, code, setCode, setEditingCode, respData, setApi, setLoading, lang, TranslateExp, uploadExcel} = props;
    const title = TranslateExp(lang, "products.mfc");
    const columns = [
        {
            Header: TranslateExp(lang, "table.id"),
            accessor: "counter"
        },
        {   
            Header: TranslateExp(lang, "table.name"),
            accessor: "name_uz",
        },
        
        {   
            Header: TranslateExp(lang, "table.codeCity"),
            accessor: "code"
        }
    ]


    useEffect(()=>{
        setLoading(true);
        setApi(countryApi);
    },[])

    
    return(
        <>
            <ToastEx {...props}/>
            <CrudTable 
                uploadExcel={uploadExcel}
                title={title}
                data={respData} 
                columns={columns} 
                {...props}
            />
            <Modal show={props.isMOpen} onHide={props.toggle}>
                <Modal.Header><h5 className='m-0'>{TranslateExp(lang, "content.adding")} {TranslateExp(lang, "cruds.country")} {TranslateExp(lang, "cruds.add")}</h5></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e=>addCountry(e)}>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "table.name")}</Form.Label>
                            <Form.Control onChange={e=>{props.setData(e.target.value)}}
                                            name={"name_uz"} type = 'text' placeholder = 'Узбекистан' required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "content.code")}</Form.Label>
                            <Form.Control onChange={e=>{setCode(e.target.value)}}
                                            name={"code"} type = 'text' placeholder = '1573899491' required/>
                        </Form.Group>
                        <div className='d-flex mb-3'>
                            <Form.Check type="switch" id="active" checked={props.isActive} label={TranslateExp(lang, "content.activeOne")} onChange={()=>props.handleActive()} className='mr-2' />
                            <Form.Check type="switch" id="delete" checked={props.isDeleted} onChange={()=>props.handleDelete()} label={TranslateExp(lang, "content.deletedOne")}/>
                            <br/>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <Button type='button' className={`btn ${st.btn__white}`} onClick={props.toggle}>{TranslateExp(lang, "content.cancel")}</Button>
                            <Button type='submit' className={`btn ${st.btn__primary}`}>{TranslateExp(lang, "content.toAdd")}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {/*    edit modal*/}
            <Modal show={props.editModal} onHide={props.editToggle}>
                <Modal.Header><h5 className='m-0'>{TranslateExp(lang, "content.editing")} {TranslateExp(lang, "cruds.country")} {TranslateExp(lang, "content.edit")}</h5></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e=>saveEditCountry(e)}>
                        <Form.Group>
                        <Form.Label>{TranslateExp(lang, "table.name")}</Form.Label>
                        <Form.Control onChange={e => props.setEditingData(e.target.value)}
                                        defaultValue={props.id===1?"":props.name} name={"name_uz"} type = 'text' placeholder = 'Узбекистан' required/>
                    </Form.Group>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "content.code")}</Form.Label>
                            <Form.Control onChange={e => setEditingCode(e.target.value)}
                                            defaultValue={props.id===1?"":code} name={"code"} type = 'text' placeholder = '158334998' required/>
                        </Form.Group>
                        <div className='d-flex justify-content-between'>
                            <Button type='button' className={`btn ${st.btn__white}`} onClick={props.editToggle}>{TranslateExp(lang, "content.cancel")}</Button>
                            <Button type='submit' className={`btn ${st.btn__primary}`}>{TranslateExp(lang, "content.save")}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <ModalDeleteCrud {...props} />
            <ModalStatus {...props} />
            <ModalSoftDelete {...props} />
        </>
    );
}
export default Countries;