import React from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import st from './modalAdd.module.scss';
function ModalAdd(props) {

  const {isMOpen, toggle, handleActive,handleDelete, isDeleted, isActive, add, setData, addTitle, lang, TranslateExp} = props;

    return (
      <>
      <Modal show={isMOpen} onHide={toggle}>
                <Modal.Header><h5 className='m-0'>{TranslateExp(lang, "content.adding")} {addTitle}</h5></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={e=>add(e)}>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "table.name")}</Form.Label>
                            <Form.Control onChange={e=>setData(e.target.value)}
                                            name={"name_uz"} type = 'text' required/>
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
      </>
    );
  }
  
  
  export default ModalAdd;