import react, {useState, useRef} from "react";
import {Row, Modal, Form, Button} from "react-bootstrap";
 
function UploadModal(props){

  const {showUpload, handleUploadClose, lang, TranslateExp} = props;
  const {uploadExcel} = props;
  const [filename, setFilename] = useState("");
  const [msg, setMsg] = useState("");
  const fileName = useRef();


  const styles = {
    marginBottom: 0,
    marginTop: "10px",
    color: "#999"
  }

  const onclose = () => {
    handleUploadClose();
    setFilename("");
  }
  
  return (
    <Modal show={showUpload} onHide={onclose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{TranslateExp(lang,"content.import")} excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {msg && <span style={{color: "red"}}>{msg}</span>}
        <Form onSubmit={e => uploadExcel(e, handleUploadClose, setFilename, setMsg)}>
          <Form.File 
            id="custom-file-translate-scss"
            label={TranslateExp(lang, "content.excelFile")}
            custom
            lang="en"
            data-browse={TranslateExp(lang, "content.select")}
            accept=".xlsx, .xls"
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

export default UploadModal;