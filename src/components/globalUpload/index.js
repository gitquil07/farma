import react, {useState, useRef} from "react";
import {Row, Modal, Form, Button} from "react-bootstrap";
import {medApi} from "../../services/medService";
 

function GlobalUpload(props){
    const {uploadGlobal, hideGlobalUpload, lang, TranslateExp} = props;
    const {setShow, setResponse} = props;
    const [filename, setFilename] = useState("");
    const [msg, setMsg] = useState("");
    const fileName = useRef();

    const styles = {
        marginBottom: 0,
        marginTop: "10px",
        color: "#999"
    };

    const uploadExcel = (e, callback, removeFilename, handleBlank) => {
        console.log("here");
        e.preventDefault();
        const file = e.target.elements[0].files?.[0];

        if(!file) handleBlank(TranslateExp(lang, "content.selectFile"));

        const formData = new FormData();
        formData.append("file", file);
        medApi.uploadExcel(formData).then(res => {
            console.log("res", res);
            if(res.data.data.length === 0){
                console.log("fdg");
                setResponse({
                    message: TranslateExp(lang, "content.importExcelErr"),
                    status: 500
                });
            }else{
                setResponse({
                    message: res.data.message.ru,
                    status: res.status
                });
            }
            setShow(true);
            
            removeFilename("");
            callback();

        }).catch(error => {
            setResponse({
                message: error.response.data.message.ru,
                status: error.response.status
            });
            setShow(true);
            handleBlank("");
            removeFilename("");
            callback();
        })
    }

    return (
        <Modal show={uploadGlobal} onHide={hideGlobalUpload} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>{TranslateExp(lang,"content.import")} excel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {msg && <span style={{color: "red"}}>{msg}</span>}
            <Form onSubmit={e => uploadExcel(e, hideGlobalUpload, setFilename, setMsg)}>
              <Form.File 
                id="custom-file-translate-scss"
                label={TranslateExp(lang, "content.excelFile")}
                custom
                lang="en"
                data-browse={TranslateExp(lang, "content.select")}
                accept=".xlsx, .xls, .pdf, .doc"
                onChange={e => setFilename(e.target?.files[0]?.name)}
                required
              />
              <p  style={styles} ref={fileName}>{TranslateExp(lang, "content.file")}: {filename? filename : TranslateExp(lang, "content.notSelected")}</p>
              <Button 
                className="float-right" 
                variant="success" 
                type="submit">
                {TranslateExp(lang, "content.uploadFile")}
              </Button>
            </Form>
            </Modal.Body>
          </Modal>
      );

}

export default GlobalUpload;