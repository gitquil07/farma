import React from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import st from './modalEdit.module.scss';
function ModalEdit(props) {

  const {editModal, editToggle, saveEdit, setEditingData, id, editTitle, name, lang, TranslateExp} = props;

    return (
      <>
        <Modal show={editModal} onHide={editToggle}>
            <Modal.Header><h5 className='m-0'>{TranslateExp(lang, "content.editing")} {editTitle}</h5></Modal.Header>
            <Modal.Body>
                <Form onSubmit={e=>saveEdit(e)}>
                    <Form.Group>
                        <Form.Label>{TranslateExp(lang, "table.name")}</Form.Label>
                        <Form.Control onChange={e => setEditingData(e.target.value)}
                                        defaultValue={id===1?"":name} name={"name_uz"} type = 'text' placeholder = {editTitle} required/>
                    </Form.Group>
                    <div className='d-flex justify-content-between'>
                        <Button type='button' className={`btn ${st.btn__white}`} onClick={editToggle}>{TranslateExp(lang, "content.cancel")}</Button>
                        <Button type='submit' className={`btn ${st.btn__primary}`}>{TranslateExp(lang, "content.save")}</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
      </>
    );
  }
  
  
  export default ModalEdit;