import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Form, Row, Toast} from "react-bootstrap";
import {authApi} from "../../../services/authService";
import jwt_decode from "jwt-decode";
import {Link, Redirect} from "react-router-dom";

function Changer(props) {
    const {lang, TranslateExp} = props;
    const [password, setPassword] = useState({password:''});
    const [confirmPassword,setConfirmPassword] = useState({confirmPassword:''});
    const [id,setId] = useState('');
    const [failed,setFailed] = useState('');
    const [msg,setMsg] = useState('');
    const [status,setStatus] = useState(false);
    const [show, setShow] = useState(false);

    const changePassword = (e) =>{
        e.preventDefault();
        if (password.password===confirmPassword.confirmPassword){
            authApi.changePassword(password,id)
                .then(res=>{
                    console.log("changed",res)
                    setMsg(res.data.message.ru);
                    setTimeout(function () {
                        localStorage.removeItem("token");
                        setStatus(true)
                    },1500);
                    setShow(true);
                })
        } else {
            console.log("not confirmed");
            setFailed("not confirmed")
        }
    };
    function checkTokenExpiration(){
        const token = localStorage.getItem("token");
        if(token === ""){
            localStorage.removeItem("token");
        }
        if(token){
            try{
                const decoded = jwt_decode(token);
                // console.log("uId",decoded)
                setId(decoded.data.userID);
            }catch(err){
                console.log("Error",err);
            }
        }
    }
    useEffect(()=>{
        checkTokenExpiration()
    },[failed]);

    useEffect(()=>{
        checkTokenExpiration()
    },[]);


    return(
        <>
          <div className="bg-light pb-5">
              <Row>
                  <Col md={3}></Col>
                  <Col md={3}></Col>
                  <Col md={6}>
                      {/*this is toast for response*/}
                      <Row>
                          <Col xs={6}>
                              <Toast style={{background:"lime"}} onClose={() => setShow(false)} show={show} delay={1500} autohide>
                                  <Toast.Header>
                                      <strong className="mr-auto">{TranslateExp(lang, "content.messageEdited")}</strong>
                                  </Toast.Header>
                                  <Toast.Body>{msg?msg:"Error"}</Toast.Body>
                              </Toast>
                          </Col>
                      </Row>
                  </Col>
              </Row>
              <Row className=' mt-5 pb-5'>
                  <Col md={3}></Col>
                  <Col md={6}>
                      <Card>
                          <Card.Header>
                              <h3 className={"text-center"}>{TranslateExp(lang, "auth.changePass")}</h3>
                              <p className={"text-center mb-0 pb-0 mt-0"} style={{color:"red"}}>{failed?failed:""}</p>
                          </Card.Header>
                          <Form onSubmit={e => changePassword(e)}>

                              <Card.Body>
                                  <Form.Group>
                                      <Form.Label>{TranslateExp(lang, "auth.password")}</Form.Label>
                                      <Form.Control onChange={e => {setPassword({password:e.target.value})}}
                                                    name={"password"} type='text' placeholder={TranslateExp(lang, "auth.password")} required/>
                                  </Form.Group>
                                  <Form.Group>
                                      <Form.Label>{TranslateExp(lang, "reg.confirmPass")}</Form.Label>
                                      <Form.Control onChange={e => {setConfirmPassword({confirmPassword:e.target.value})}}
                                                    type='text' placeholder={TranslateExp(lang, "reg.confirmPass")} required/>
                                  </Form.Group>
                              </Card.Body>
                              <Card.Footer>
                                  <Link to ='/' className='btn w-50'>{TranslateExp(lang, "content.cancel")}</Link>
                                  <Button type="submit" className={"btn w-50 btn-info"}>{TranslateExp(lang, "content.save")}</Button>
                              </Card.Footer>
                          </Form>

                      </Card>
                  </Col>
                  <Col md={3}></Col>
              </Row>
              {
                  status &&
                      <Redirect to={"/login"}/>
              }
          </div>
        </>
    )
};
export default Changer;
