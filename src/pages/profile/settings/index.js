import React, {useEffect, useState, useContext} from "react";
import {Button, Card, Col, Form, Row, Toast, File} from "react-bootstrap";
import {Redirect, useHistory} from "react-router-dom";
import EditSettings from "./editSettings/EditSettings";
import {settingsApi} from "../../../services/settingService";
import UserContext from "../../../context/UserContext";

function Settings(props) {
    const {lang, TranslateExp} = props;
    const [status,setStatus]=useState(false);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState('');
    const[data,setData]=useState({
        app_name:"",
        app_email:"",
        app_description:"",
        app_version:"",
        contact_number:"",
        contact_email:"",
        contact_fax:"",
        contact_address:"",
        is_blocked:true,
    });

    const {setStateValue, fileUploadedFlag} = useContext(UserContext);
    
    console.log("setState", setStateValue);
    console.log("file", fileUploadedFlag);

    const [fileProgress, setFileProgress] = useState({
        file_1: {
            progress : false,
            success : false,
            error : false
        },
        file_2: {
            progress : false,
            success : false,
            error : false
        },
        file_3: {
            progress : false,
            success : false,
            error : false
        }
    });
    const [filename, setFilename] = useState({
        filename_1: "",
        filename_2: "",
        filename_3: ""
    });

    const translations = {
        filename_1 : "content.uploadReferentPrices",
        filename_2 : "content.uploadRegisteredGls",
        filename_3 : "content.uploadValueAddedTax"
    }

    // const editToggle = () => {
    //     let x = document.getElementById("edit");
    //     if (x.style.display === "none") {
    //         x.style.display = "block";
    //     } else {
    //         x.style.display = "none";
    //     }
    // };
    useEffect(()=>{
        getSettingsList();
    },[]);
    const  getSettingsList = () =>{
        settingsApi.getList().then(res=>{
            console.log("settings",res.data);
            // setList(res.data.data);
            setData(res.data.data);
        })
    };
    const editSetting = (e) =>{
        e.preventDefault();


        settingsApi.edit(data).then(res=>{
            setTimeout(function () {
                setStatus(true);
            },1500);
            setShow(true);
            setMsg(res.data.message.ru)

        })
    };


    const uploadFile = (e, type) => {

        const formData = new FormData();

        formData.append("file", e.target.files[0]);
        formData.append("file_type", type);

        setFileProgress({
            ...fileProgress,
            [`file_${type}`] : {
                ...fileProgress[`file_${type}`], progress : true
            }
        });
        settingsApi.upload(formData)
                    .then(resp => {
                        setFileProgress({
                            ...fileProgress,
                            [`file_${type}`] : {
                                ...fileProgress[`file_${type}`], progress : false, success : true
                            }
                        });
                        setStateValue({
                            fileUploadedFlag : !fileUploadedFlag
                        });
                    })
                    .catch(error => {
                        setFileProgress({
                            ...fileProgress,
                            [`file_${type}`] : {
                                ...fileProgress[`file_${type}`], progress : false, error : true
                            }
                        });
                    });
    }

    return(
        <>
            <div className='px-3 pb-5 bg-light'>
                 <Row>
                     <Col md={12}>
                         {/*<Table striped bordered hover size={"sm"} responsive>*/}
                         {/*    <thead>*/}
                         {/*    <tr>*/}
                         {/*        <th>#</th>*/}
                         {/*        <th>App Name</th>*/}
                         {/*        <th>App E-mail</th>*/}
                         {/*        <th>App description</th>*/}
                         {/*        <th>App version</th>*/}
                         {/*        <th>Contact Number</th>*/}
                         {/*        <th>Contact E-mail</th>*/}
                         {/*        <th>Contact Fax</th>*/}
                         {/*        <th>Contact Address</th>*/}
                         {/*        <th>Actions</th>*/}
                         {/*    </tr>*/}
                         {/*    </thead>*/}
                         {/*    <tbody>*/}
                         {/*    {*/}
                         {/*        <tr>*/}
                         {/*            <td>1</td>*/}
                         {/*            <td>{list.app_name}</td>*/}
                         {/*            <td>{list.app_email}</td>*/}
                         {/*            <td>{list.app_description}</td>*/}
                         {/*            <td>{list.app_version}</td>*/}
                         {/*            <td>{list.contact_number}</td>*/}
                         {/*            <td>{list.contact_email}</td>*/}
                         {/*            <td>{list.contact_fax}</td>*/}
                         {/*            <td>{list.contact_address}</td>*/}
                         {/*            <td>*/}
                         {/*                <Button onClick={editToggle} className={"btn-warning"}><i className={"fa fa-edit"}></i></Button>*/}
                         {/*            </td>*/}
                         {/*        </tr>*/}
                         {/*    }*/}
                         {/*    </tbody>*/}
                         {/*</Table>*/}
                     </Col>
                     <Col md={10}></Col>
                     <Col md={2}>
                         {/*this is toast notification*/}
                         <Toast style={{background:"lime"}} onClose={() => setShow(false)} show={show} delay={1500} autohide>
                             <Toast.Header>
                                 <strong className="mr-auto">{TranslateExp(lang, "content.messageEdited")}</strong>
                             </Toast.Header>
                             <Toast.Body>{msg?msg:"Error"}</Toast.Body>
                         </Toast>
                     </Col>
                 </Row>
                <Row id={"edit"} className={"mt-5"} style={{"display":"block"}}>
                    <Col md={12}>
                       <Card>
                           <Card.Header>
                               <h3 className={"text-center"}>{TranslateExp(lang, "content.settingsEditing")}</h3>
                           </Card.Header>
                           <Card.Body>
                                  <Form onSubmit={e=>editSetting(e)}>
                                   <Row>
                                       <Col>
                                           <Form.Group>
                                               <Form.Label>{TranslateExp(lang, "reg.name")}</Form.Label>
                                               <Form.Control
                                                   defaultValue={data?.app_name}
                                                   onChange={e=>setData({...data,app_name:e.target.value})}
                                                   name={"app_name"} type = 'text' placeholder = {TranslateExp(lang, "reg.name")} required/>
                                           </Form.Group>
                                       </Col>
                                       <Col>
                                           <Form.Group>
                                               <Form.Label>{TranslateExp(lang, "auth.email")}</Form.Label>
                                               <Form.Control
                                                   defaultValue={data?.app_email}
                                                   onChange={e=>setData({...data,app_email:e.target.value})}
                                                   name={"app_email"} type = 'text' placeholder = {TranslateExp(lang, "auth.email")} required/>
                                           </Form.Group>
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col>
                                           <Form.Group>
                                               <Form.Label>{TranslateExp(lang, "table.text")}</Form.Label>
                                               <Form.Control
                                                   defaultValue={data?.app_description}
                                                   onChange={e=>setData({...data,app_description:e.target.value})}
                                                   name={"app_description"} type = 'text' placeholder = {TranslateExp(lang, "table.text")} required/>
                                           </Form.Group>
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col>
                                           <Form.Group>
                                               <Form.Label>{TranslateExp(lang, "reg.phone")}</Form.Label>
                                               <Form.Control
                                                   defaultValue={data?.contact_number}
                                                   onChange={e=>setData({...data,contact_number:e.target.value})}
                                                   name={"contact_number"} type = 'text' placeholder = {TranslateExp(lang, "reg.phone")} required/>
                                           </Form.Group>
                                       </Col>
                                       <Col>
                                           <Form.Group>
                                               <Form.Label>{TranslateExp(lang, "auth.email")}</Form.Label>
                                               <Form.Control
                                                   defaultValue={data?.contact_email}
                                                   onChange={e=>setData({...data,contact_email:e.target.value})}
                                                   name={"contact_email"} type = 'text' placeholder = {TranslateExp(lang, "auth.email")} required/>
                                           </Form.Group>
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col>
                                           <Form.Group>
                                               <Form.Label>{TranslateExp(lang, "reg.fax")}</Form.Label>
                                               <Form.Control
                                                   defaultValue={data?.contact_fax}
                                                   onChange={e=>setData({...data,contact_fax:e.target.value})}
                                                   name={"contact_fax"} type = 'text' placeholder = {TranslateExp(lang, "reg.fax")} required/>
                                           </Form.Group>
                                       </Col>
                                       <Col>
                                           <Form.Group>
                                               <Form.Label>{TranslateExp(lang, "reg.address")}</Form.Label>
                                               <Form.Control
                                                   defaultValue={data?.contact_address}
                                                   onChange={e=>setData({...data,contact_address:e.target.value})}
                                                   name={"contact_address"} type = 'text' placeholder = {TranslateExp(lang, "reg.address")} required/>
                                           </Form.Group>
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col>
                                           <Form.Group>
                                               <Form.Label>{TranslateExp(lang, "reg.appVer")}</Form.Label>
                                               <Form.Control
                                                   defaultValue={data?.app_version}
                                                   onChange={e=>setData({...data,app_version:e.target.value})}
                                                   name={"app_version"} type = 'text' placeholder = {TranslateExp(lang, "reg.appVer")} />
                                           </Form.Group>
                                       </Col>
                                   </Row>
                                   <Row className="mt-2">
                                       {
                                          Object.keys(filename).map((fName, index) => {
                                              return (
                                                <Col>
                                                <Form.Label>
                                                    {
                                                        TranslateExp(lang, translations[fName])
                                                    }
                                                </Form.Label>
                                                {
                                                    fileProgress[Object.keys(fileProgress)[index]].progress? <p><b>идёт загрузка файла...</b></p> : 
                                                    <Form.File 
                                                        id="custom-file-translate-scss"
                                                        label={!filename[fName].trim().length? TranslateExp(lang, "content.uploadInstructionFile") : filename[fName]}
                                                        custom
                                                        lang="en"
                                                        data-browse={TranslateExp(lang, "content.select")}
                                                        accept=".xlsx, .xls, .pdf, .docx"
                                                        onChange={e => {
                                                            setFilename({...filename, [fName]: e.target.files[0].name})
                                                            uploadFile(e, index+1);
                                                        }}
                                                    />
                                                }
                                                {
                                                      fileProgress[Object.keys(fileProgress)[index]].success? <span style={{color:"green"}}>Файл успешно загружен</span> : null
                                                }
                                                {
                                                      fileProgress[Object.keys(fileProgress)[index]].error? <span style={{color:"red"}}>Ошибка, файл не загружен</span> : null
                                                }
                                              
                                           </Col>
                                              );
                                          })
                                       }
                                  
                                   </Row>

                                   <Row className='my-3'>
                                       <Col><Button type="reset" className={"btn btn-block btn-warning"}>{TranslateExp(lang, "content.resetAll")}</Button></Col>
                                       <Col><Button type='submit' className={"btn btn-block btn-success"}>{TranslateExp(lang, "content.save")}</Button></Col>
                                   </Row>
                               </Form>
                           </Card.Body>
                       </Card>
                    </Col>

                    {
                        status &&
                            <Redirect to={"/"}/>
                    }
                </Row>
            </div>


        </>
    )
}
export default Settings
