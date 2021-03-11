import React from 'react';
import st from './toast.module.scss';
import { Toast } from 'react-bootstrap';

function ToastEx(props) {
    const {response} = props;
    const {lang, TranslateExp} = props;
    const {show,setShow} = props;

    const {message, status} = response;

    let color;

    if(status === "Success"){
        color = st.toast__suc;
    }

    if(color === "Error"){
        color = st.toast__err;
    }
    return (
      <div className={`${st.toast__block} ${color}`}>
          <Toast onClose={() => setShow(false)} show={show} delay={2000} autohide>
            <Toast.Header className={st.toast__head}>
              <strong className="mr-2">{TranslateExp(lang, "content.status")}</strong>
              {/* <small>1 мин. назад</small> */}
            </Toast.Header>
            <Toast.Body className={st.toast__message}>{message}</Toast.Body>
          </Toast>
      </div>
    );
  }
  
  export default ToastEx;