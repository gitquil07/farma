import React, {useState, useContext, useEffect, useRef} from 'react'
import st from "./login.module.scss"
import {Link, Redirect} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import {authApi} from "../../../services/authService";
import UserContext from "../../../context/UserContext";
import LangContext from "../../../context/LangContext";
import jwt_decode from "jwt-decode";
import Loading from '../../../components/loading';
import {Alert, Button, Toast} from "react-bootstrap";

function Login(props){
    const {TranslateExp} = props;
    const {lang, setLang} = useContext(LangContext);
    const [eye, setEye] = useState(false);
    const [isStatus,setIsStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [regSuccess, setRegSuccess] = useState(window?.regSuccess);

    console.log("reg success", window.regSuccess);

    const [data,setData] = useState({
        email:"",
        password:"",
        user_mac:""
    });
    const [errMsg, setErrMsg] = useState("");

    const {setStateValue, mac, getMac} = useContext(UserContext);
    console.log("mac", mac);
    const login = e => {
        console.log("login");
        e.preventDefault();
        setLoading(true);
        const user_mac = mac?.slice(mac.indexOf(":") + 1);
        authApi.login({...data, user_mac: user_mac}).then(resp=>{
            if (resp.status===201){
               
                setIsStatus(true);

                // if(mac !== undefined){
                    sessionStorage.setItem("token",resp.data.token);

                    // Decode token to take role value of authenticated user
                    const decoded = jwt_decode(resp.data.token);


                    setStateValue({
                        token:resp.data.token,
                        role:decoded.data?.role
                    });
                // }
            }

        }).catch(error => {
            setErrMsg(error?.response?.data?.message?.ru);
        }).finally(() => setLoading(false));
       
    };

    useEffect(()=> {
        setTimeout(() => {
            if(regSuccess !== undefined){
                delete window.regSuccess;
                setRegSuccess(undefined);
            }
        }, 4000);
    }, [])
  
    const handleLangChange = (lang) => {
        setLang({
            lang
        });
    }

    return (
        <>
            {
                console.log("reg success var", window.regSuccess)
            }
            {
                (regSuccess === undefined)? null : 
               <div className={st.successReg}>
                   {
                       regSuccess.ru
                   }
               </div>
            }
           {
               loading? <Loading /> :
            <div className={st.login_body}>
                <div className={st.login_card}>
                    {
                        // Check mac address before authentication
                        // (isStatus && mac)? <Redirect to="/" /> : (mac === undefined)? <Alert variant="danger">Включите расширение Pharm Analytics или загрузите этот модуль!

                        // Don't check mac address authenticate user even without mac
                        // Just show notification that user should install our app
                        isStatus? <Redirect to="/" /> : (mac === undefined)? <Alert variant="danger">{TranslateExp(lang, "content.signUpTitle")}
                        <br />
                        <Link to="/doc">{TranslateExp(lang, "content.redDoc")}</Link>{` ${TranslateExp(lang, "content.or")} `}<Link to="/download">{TranslateExp(lang, "content.downMod")}</Link>
                        <hr />
                        {TranslateExp(lang, "content.tryAg")} :{"   "}
                        <Button variant="info" onClick={getMac} size="sm"><i className="fa fa-refresh"></i></Button>
                        </Alert> : null
                    }
                    <div className={st.login_cardHeader}>
                        <h1>{TranslateExp(lang, "auth.login")}</h1>
                        <h6>{TranslateExp(lang, "login.title")}</h6>
                    </div>
                    {
                        errMsg && <p className={st.authMessage}>{errMsg}</p>
                    }
                    <form className={st.login_cardBody} onSubmit={event => login(event)}>
                        <div className={st.login_formGroup}>
                            <label className={st.login_formLabel}>{TranslateExp(lang, "auth.email")}</label>
                            <input className={st.login_formControl} onChange={e=>setData({...data,email: e.target.value})} name={"email"} type='email' placeholder='example@email.com' required/>
                        </div>
                        <div className={st.login_formGroup}>
                            <label className={st.login_formLabel}>{TranslateExp(lang, "auth.password")}</label>
                            <div className={st.password_box}>
                                <input className={st.login_formControl} name={"password"} onChange={e=>setData({...data,password: e.target.value})} type={`${(eye)?'text':'password'}`} placeholder='*********' required/>
                                <div className={st.password_eye}>
                                    <i className={`far ${(eye)? 'fa-eye':'fa-eye-slash'}`} onClick={()=>setEye(!eye)}></i>
                                    </div>
                            </div>
                        </div>
                        <button type='submit' className={st.login_formButton}>
                            {TranslateExp(lang, "auth.signIn")}
                        </button>
                    </form>
        
                    <p className={st.login_forgotPassword}>
                        <Link className={st.login_forgotPasswordLink} to='/signUp'>{TranslateExp(lang, "auth.signUp")}</Link>
                        <Link className={st.login_forgotPasswordLink} to='/reset'>{TranslateExp(lang, "login.forgotPass")}?</Link>
                    </p>
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
export default Login;