import React from 'react';
import {Modal} from 'react-bootstrap';
import st from './modalStatus.module.scss';

function ModalStatus(props) {
    console.log('modal', props);

    const {changeStatus, delId, lang, TranslateExp} = props;
    const {closeStatusModal, isOpenStatus} = props;
    return (
        <>
            <Modal show={isOpenStatus} onHide={closeStatusModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {TranslateExp(lang, "content.modalStatTitle")}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {TranslateExp(lang, "content.modalStatText")}
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={closeStatusModal} className={`btn ${st.btn__white}`}>{TranslateExp(lang, "content.cancel")}</button>
                    <button onClick={()=> changeStatus(delId)} className='btn btn-primary'>{TranslateExp(lang, "content.change")}</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default ModalStatus;