import React from "react";
import st from '../modalDeleteCrud/modalDeleteCrud.module.scss';
import {Modal} from 'react-bootstrap';

const ModalSoftDelete = (props) => {

    // Argument - id and function to soft delete element
    const {softDelete, sfDeletedId, lang, TranslateExp} = props;
    const {closeSoftDeleteModal, isOpenSoftDelete} = props;

    return (
        <>
            <Modal show={isOpenSoftDelete} onHide={closeSoftDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{TranslateExp(lang, "content.modalSoftTitle")}</Modal.Title>
                </Modal.Header>
        
                <Modal.Body>
                    {TranslateExp(lang, "content.modalSoftText")}
                </Modal.Body>
        
                <Modal.Footer>
                    <button onClick={closeSoftDeleteModal} className={`btn ${st.btn__white}`}>{TranslateExp(lang, "content.cancel")}</button>
                    <button onClick={()=> softDelete(sfDeletedId)} className={`btn btn-danger`}>{TranslateExp(lang, "content.toDelete")}</button>
                </Modal.Footer>
            </Modal>
        </>
      );
}

export default ModalSoftDelete;