import React, { useState, useContext } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import genPass from '../../../utils/genPass'
import st from './signUp.module.scss';
import {authApi} from "../../../services/authService";
import UserContext from "../../../context/UserContext";
import Loading from '../../../components/loading';
import LangContext from "../../../context/LangContext";
import {Alert} from "react-bootstrap";
import { useEffect } from 'react';

function SignUp (props) {
        const {TranslateExp} = props;
        const [eye, setEye] = useState(false);
        const {lang, setLang} = useContext(LangContext);
        const [isStatus,setIsStatus] = useState(false);
        const [errMsg, setErrMsg] = useState("");
        const [loading, setLoading] = useState(false);
        const [lengthPasswordError, setPasswordLengthError] = useState(false);
        const [confirmationError, setConfirmationError] = useState(false);
        const [data,setData] = useState({
            first_name:"",
            last_name:"",
            middle_name:"",
            company_name:"",
            phone_number:"",
            email:"",
            password:"",
            confirm_password:"",
            user_address:"",
            user_mac: undefined,
            role:0
        });

        const {mac} = useContext(UserContext);

        const register = e => {
            e.preventDefault();
                setLoading(true);
                const user_mac = mac?.slice(mac.indexOf(":") + 1);
                authApi.register({...data, user_mac: user_mac})
                .then(res=>{
                    setIsStatus(res.data.status)
                    console.log(res.data.message);
                    window.regSuccess = res.data.message;
                })
                .catch(error => {
                    console.dir("ewr", error);
                    setErrMsg(error?.response?.data?.message?.ru);
                })
                .finally(() => setLoading(false));
        }

        const checkLength = e => {
            const {value} = e.target;
            if(value.trim().length === 0) return;
            if(value.trim().length < 8) setPasswordLengthError(true);
            else setPasswordLengthError(false);
        }

        const passwordConfirmation = e => {
            const confirmPass = e.target.value;

            (data.password !== confirmPass)? setConfirmationError(true) : setConfirmationError(false);
        }

        useEffect(() => {
            console.log("errMsg", errMsg);
        }, [errMsg]);

        const handleLangChange = (lang) => {
            setLang({
                lang
            });
        }

        return(

            <>
                {
                    loading? <Loading /> : 
                
                    <div className={st.signUp}>
                        <div className={st.signUp__card}>
                            {
                                (isStatus && mac)? <Redirect to="/login"/> : (mac === undefined)? <Alert variant="danger">{TranslateExp(lang, "content.signUpTitle")}
                            <br />
                                <Link to="/doc">{TranslateExp(lang, "content.redDoc")}</Link>{` ${TranslateExp(lang, "content.or")} `}<Link to="/download">{TranslateExp(lang, "content.downMod")}</Link></Alert> : null
                            }
                            <h2 className={st.signUp__head}>Pharm Analytics</h2>
                            <div className={st.card}>
                                <div className={st.card__body}>
                                    <div className={st.card__title}>
                                        <h4>{TranslateExp(lang, "auth.signUp")}</h4>
                                        {
                                            errMsg && <p className={st.signMessage}>{errMsg}</p>
                                        }
                                    </div>
                                    <Form onSubmit={ e => register(e) }>
                                    <Form.Group>
                                        <Form.Label for='fname' className={st.label__reg}>{TranslateExp(lang, "reg.name")}</Form.Label>
                                        <Form.Control id='fname' className={st.input__reg} onChange={e=>setData({...data,first_name: e.target.value})} name={"fname"} type = 'text' placeholder = {TranslateExp(lang, "reg.placeName")} required/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label for='last_name' className={st.label__reg}>{TranslateExp(lang, "reg.secName")}</Form.Label>
                                        <Form.Control id='last_name' className={st.input__reg} onChange={e=>setData({...data,last_name: e.target.value})} name={"last_name"} type = 'text' placeholder = {TranslateExp(lang, "reg.placeSecName")} required/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label for='middle_name' className={st.label__reg}>{TranslateExp(lang, "reg.lastName")}</Form.Label>
                                        <Form.Control id='middle_name' className={st.input__reg}onChange={e=>setData({...data,middle_name: e.target.value})} name="middle_name" type = 'text' placeholder = {TranslateExp(lang, "reg.placeLastName")} required/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label for='company_name' className={st.label__reg}>{TranslateExp(lang, "reg.compName")}</Form.Label>
                                        <Form.Control id='company_name' className={st.input__reg}onChange={e=>setData({...data,company_name: e.target.value})} name={"company_name"} type = 'text' placeholder = 'Farma Lux International' required/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label for='phone_number' className={st.label__reg}>{TranslateExp(lang, "reg.phone")}</Form.Label>
                                        <Form.Control id='phone_number' className={st.input__reg} onChange={e=>setData({...data,phone_number: e.target.value})} name={"phone_number"} type = 'text' placeholder = '+99890 777-77-77'  required/>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label for='email' className={st.label__reg}>{TranslateExp(lang, "auth.email")}</Form.Label>
                                        <Form.Control id='email' className={st.input__reg} onChange={e=>setData({...data,email: e.target.value})} name={"email"} type = 'email' placeholder = 'example@example.com' required/>
                                    </Form.Group>
                                    {/* <Form.Group>
                                        <Form.Label for='username' className={st.label__reg}>Логин</Form.Label>
                                        <Form.Control id='username' className={st.input__reg}onChange={e=>setData({...data,username: e.target.value})} name={"username"} type = 'text' placeholder = 'Farma Lux' required/>
                                    </Form.Group> */}
    
                                    <Form.Group>
                                        <div className={st.pass__reg}>
                                            <Form.Label for='password' className={st.label__reg}>{TranslateExp(lang, "auth.password")}</Form.Label>
                                            <Button type='button' 
                                                onChange={e=>setData({...data,password: e.target.value})} 
                                                className={st.gen__pass} 
                                                onClick={() => genPass(10)}
                                                >{TranslateExp(lang, "reg.genPass")}</Button>
                                        </div>
                                        <div className={st.input__pass}>
                                            {
                                                !lengthPasswordError? null : 
                                                <span className={st.validationError}>{TranslateExp(lang, "reg.passLength")}</span> 
                                            }
                                            <Form.Control 
                                                id='password' 
                                                className={`${st.input__reg} password_reg`}
                                                onChange={e=>setData({...data,password: e.target.value})}
                                                name={"password"} type = {`${(eye)? 'text' : 'password'}`}
                                                placeholder = '**********' 
                                                required
                                                onBlur={e => checkLength(e)}/>
                                            <div className={st.pass__eye}><i className={`far ${(eye)?  'fa-eye' : 'fa-eye-slash'}`} onClick={() => setEye(!eye)}></i></div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label for='confirm_password' className={st.label__reg}>{TranslateExp(lang, "reg.confirmPass")}</Form.Label>
                                        <div className={st.input__pass}>
                                            {
                                                !confirmationError? null : 
                                                <span className={st.validationError}>
                                                   {TranslateExp(lang, "content.errConfPass")}
                                                </span>
                                            }
                                            <Form.Control 
                                                id='confirm_password'
                                                className={`${st.input__reg} password_reg`}
                                                onChange={e=>setData({...data,confirm_password: e.target.value})}
                                                name={"confirm_password"} type = {`${(eye)? 'text' : 'password'}`}
                                                placeholder = '**********'
                                                required
                                                onBlur = {e => passwordConfirmation(e)}
                                            />
                                            <div className={st.pass__eye}><i className={`far ${(eye)?  'fa-eye' : 'fa-eye-slash'}`} onClick={() => setEye(!eye)}></i></div>
                                        </div>
                                    </Form.Group>
                                    {/* <Form.Group>
                                        <Form.Label className={st.label__reg}>Паспорт серия</Form.Label>
                                        <Form.Control className={st.input__reg} type = 'text' placeholder = 'AA 1234567' required/>
                                    </Form.Group> */}
                                    <Form.Group>
                                        <Form.Label for='address' className={st.label__reg}>{TranslateExp(lang, "reg.address")}</Form.Label>
                                        <Form.Control id='address' className={st.input__reg} name='user_address' onChange={e => setData({...data, user_address: e.target.value})} type = 'text' placeholder = 'г. Ташкент' required/>
                                    </Form.Group>
                                    <Button className={st.btn__reg} variant="primary" type="submit">
                                        {TranslateExp(lang, "auth.signUp")}
                                    </Button>
                                    <p id="loading"></p>
                                    {
                                        sessionStorage.getItem("token") && <Redirect to="/"/>
                                    }
                                    {
                                        isStatus &&
                                        <Redirect to={"/login"}/>
                                    }
                                </Form>
                                </div>
                             
                            </div>
                        </div>
                        <div className={st.lang}>
                            <Dropdown className='w-0'>
                                <Dropdown.Toggle  className={`${st.dropdown} nav-link dropdown-toggle p-0`} as='a' id="dropdown-basic">
                                    <span className={"text-uppercase"}>{lang}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu >
                                    <Dropdown.Item onClick={() => handleLangChange("eng")}>ENG</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleLangChange("ўзб")}>ЎЗБ</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleLangChange("рус")}>РУС</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                </div>
                }
            </>
           
        )
}




export default SignUp;