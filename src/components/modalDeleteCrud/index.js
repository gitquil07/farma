import React from 'react';
import {Modal} from 'react-bootstrap';
import st from './modalDeleteCrud.module.scss';

function ModalDeleteCrud(props) {

  const {del, delId, lang, TranslateExp} = props;
  const {id, is_deleted} = delId || {id:undefined, is_deleted: undefined};
  const {closeDelModal, isOpenDelete} = props;

  let option = {};

  if(is_deleted && is_deleted !== undefined){
    option.title = TranslateExp(lang, "content.repairing");
    option.text = TranslateExp(lang, "content.repair");
    option.btnColor = "primary";
  }else{
    option.title = `${TranslateExp(lang, "content.deleting")}`;
    option.text = TranslateExp(lang, "content.toDelete");
    option.btnColor = "danger";
  }

    return (
      <>
      <Modal show={isOpenDelete} onHide={closeDelModal}>
        <Modal.Header closeButton>
          <Modal.Title>{option.title} {TranslateExp(lang, "content.listOne")} {TranslateExp(lang, "content.list")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {TranslateExp(lang, "content.modalQuestOne")} {option.text.toLowerCase()}{TranslateExp(lang, "content.modalQuestLast")}
        </Modal.Body>

        <Modal.Footer>
          <button onClick={closeDelModal} className={`btn ${st.btn__white}`}>{TranslateExp(lang, "content.cancel")}</button>
          <button onClick={()=> del(id)} className={`btn btn-${option.btnColor}`}>{option.text}</button>
        </Modal.Footer>
      </Modal>
      </>
    );
  }
  
  
  export default ModalDeleteCrud;