import React, {useState, useEffect, useContext} from "react";
import {Button, Col, Container, Row, Form, Card, Toast} from "react-bootstrap";
import {userApi} from "../../../../services/userService";
import Select from "react-select";
import {Redirect} from "react-router-dom";
import UserContext from "../../../../context/UserContext";
import {authApi} from "../../../../services/authService";
import st from "../../../../components/dataTable/dataTable.module.scss";
import ToastEx from "../../../../components/toasts";


const roles = [
    {
        value:2,
        label: "админ"
    },
    {
        value:3,
        label: "пользователь",
    },
    {
        value:4,
        label: "покупатель"
    },
    {
        value:10,
        label: "DEMO",
    }
]

function UserForm(props){
    const {userId, lang, TranslateExp, id} = props;
    console.log('getProps = ',props);
    // console.log('sdsd', props?.id);
    let {currentRole}=useContext(UserContext);
    const[isActive,setIsActive] = useState(false);
    const[isConfirmed,setIsConfirmed] = useState(false);
    const requestBodyTemplate = {
    last_name: "",
    first_name: "",
    middle_name: "",
    email: "",
    role: undefined,
    password: "",
    confirmed: isConfirmed,
    company_name: "",
    company_inn: "",
    phone_number: "",
    user_mac: "",
    um_created_at: "",
    um_expired_at: "",
    otm_created_at: "",
    otm_expired_at: "",
    one_time_mac: undefined,
    passport_info: "",
    user_address: "",
    is_blocked: isActive
    // avatar: null
}
    const [requestBody, setRequestBody] = useState(requestBodyTemplate);
    const [validationMsg, setValidationMsg] = useState("");
    const [response,setResponse] = useState('');
    const [status, setStatus] = useState(false);
    const [show, setShow] = useState(false);
    const [status2, setStatus2] = useState(false);
    const [password, setPassword] = useState({password:''});
    useEffect(() => {
        if(userId !== undefined){
            delete requestBody.password;
            try{
                userApi.getList().then(({data: {data} }) => {
                    const forEdit = data.find(user => user._id === userId);
                    delete requestBody.otm_expired_at;
                    delete requestBody.password;
                    setRequestBody({
                        ...requestBody,
                        last_name: forEdit.last_name,
                        first_name: forEdit.first_name,
                        middle_name: forEdit.middle_name,
                        email: forEdit.email,
                        role: forEdit.role,
                        confirmed: forEdit.confirmed,
                        company_name: forEdit.company_name,
                        company_inn: forEdit.company_inn,
                        phone_number: forEdit.phone_number,
                        user_mac: forEdit.user_mac,
                        um_created_at: forEdit.um_created_at,
                        um_expired_at: forEdit.um_expired_at,
                        one_time_mac: forEdit.one_time_mac,
                        otm_created_at: forEdit.otm_created_at,
                        // otm_expired_at: forEdit.otm_expired_at,
                        passport_info: forEdit.passport_info,
                        user_address: forEdit.user_address,
                        is_blocked: forEdit.is_blocked,
                        avatar: forEdit.avatar,
                    })
                });
            }catch(err){
                console.log(err);
            }
        }

    }, [userId]);
    useEffect(()=>{
        if (requestBody.role!==0||requestBody.role!==undefined){
            setIsConfirmed(true)
        }else {
            setIsConfirmed(false);
        }
    },[]);


    const addUser =(e)=>{
        const names = Object.keys(requestBody);
        let failedField;
        // for(let name of names){
        //     if (requestBody[name]==="password"){
        //         delete requestBody.password;
        //     }else if(requestBody[name] === "" || requestBody[name] === undefined){
        //         failedField = name;
        //         console.log("name",name)
        //         break;
        //     }
        // }
        // setValidationMsg(`Поле ${failedField} должно быть заполнено`);
        try{
            if(userId){
                console.log("ktt",requestBody);
                userApi.edit(userId,requestBody).then(res=>{
                    // console.log("updatingData",res);
                    setShow(true);
                    setResponse({
                        message:res.data.message.ru,
                        status:res.data.status
                    });
                    setTimeout(function () {
                        setStatus(true);
                    },1000)
                });

            }else{
                userApi.save(requestBody).then(resp => {
                    // console.log("resp:",resp)
                    setShow(true);
                    setResponse({
                        message:resp.data.message.ru,
                        status:resp.data.status
                    })
                    setTimeout(function () {
                        setStatus(true)
                    },1000)
                })
            }

        }catch(err){
            console.log(err);
        }
        e.preventDefault();
    }
    function handleActive(){
        if(requestBody.is_blocked){
            setIsActive(false);
            requestBody.is_blocked=false;
        } else {
            setIsActive(true);
            requestBody.is_blocked=true;
        }
    }


    return (
    <>
            <div className='p-3 bg-light'>
            <h3>{id? TranslateExp(lang, "content.editing") : TranslateExp(lang, "content.adding")} {TranslateExp(lang, "cruds.user")} {TranslateExp(lang, "cruds.add")}</h3>
            <p className='text-danger'>
                {
                    // validationMsg? validationMsg : ""
                }
            </p>
                <Row>
                    <Col md={9}></Col>
                    <Col md={3}>
                        <Toast style={{background:"lime"}} onClose={() => setShow(false)} show={show} delay={1500} autohide>
                            <Toast.Header>
                                <strong className="mr-auto">{TranslateExp(lang, "content.messageEdited")}</strong>
                            </Toast.Header>
                            <Toast.Body>{response.message?response.message:"Error"}</Toast.Body>
                        </Toast>
                    </Col>
                </Row>
                <Row className='pb-5'>
                <Col md={8}>
                    <Form onSubmit={e=>addUser(e)}>
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "reg.name")}</Form.Label>
                                            <Form.Control 
                                                 type = 'text'
                                                 name={"first_name"}
                                                 placeholder = {TranslateExp(lang, "reg.placeName")}
                                                 defaultValue = {userId? requestBody.first_name : ""}
                                                 onChange={e => setRequestBody({...requestBody, first_name: e.target.value})} required/>
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "reg.secName")}</Form.Label>
                                            <Form.Control
                                                type = 'text'
                                                placeholder = {TranslateExp(lang, "reg.placeSecName")}
                                                name="last_name"
                                                defaultValue = {userId? requestBody.last_name : ""}
                                                onChange={e => setRequestBody({...requestBody, last_name: e.target.value})}
                                                required/>
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "reg.lastName")}</Form.Label>
                                            <Form.Control
                                                type = 'text'
                                                placeholder = {TranslateExp(lang, "reg.placeLastName")}
                                                name="middle_name"
                                                defaultValue = {userId? requestBody.middle_name : ""}
                                                onChange={e => setRequestBody({...requestBody, middle_name: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "auth.email")}</Form.Label>
                                            <Form.Control
                                                type = 'email'
                                                name="email"
                                                placeholder = {TranslateExp(lang, "auth.email")}
                                                defaultValue = {userId? requestBody.email : ""}
                                                onChange={e => setRequestBody({...requestBody, email: e.target.value})}
                                                required/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "cruds.userMac")}</Form.Label>
                                            <Form.Control
                                                type = 'text'
                                                name="user_mac"
                                                placeholder = {TranslateExp(lang, "cruds.userMac")}
                                                defaultValue = {userId? requestBody.user_mac : ""}
                                                onChange={e => setRequestBody({...requestBody, user_mac: e.target.value})} required/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "cruds.disMac")}</Form.Label>
                                            <Form.Control
                                                type = 'text'
                                                name="one_time_mac"
                                                placeholder = {TranslateExp(lang, "cruds.disMac")}
                                                defaultValue = {userId? requestBody.one_time_mac: ""}
                                                onChange={e => setRequestBody({...requestBody, one_time_mac: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group className={!userId?"d-none":""}>
                                            <Form.Label>{TranslateExp(lang, "content.role")}</Form.Label>
                                            <Select
                                                placeholder={TranslateExp(lang, "content.role")}
                                                name="role"
                                                options={roles}
                                                value = {userId?roles.filter(item=>item.value == requestBody.role):[]}
                                                onChange={e =>{ setRequestBody({...requestBody, role:e.value })} }/>
                                        </Form.Group>
                                        <Form.Group className={userId?"d-none":""}>
                                            <Form.Label>{TranslateExp(lang, "content.role")}</Form.Label>
                                            <Select
                                                placeholder={TranslateExp(lang, "content.role")}
                                                options={roles}
                                                name={"role"}
                                                onChange={e =>{setRequestBody({...requestBody,role:e.value,confirmed: true}); setIsConfirmed(true) }} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/*setRequestBody({...requestBody, role : e.value})*/}
                                {/*className={!userId?"":"d-none"}*/}
                                <Row className={userId?"d-none":""}>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "auth.password")}</Form.Label>
                                            <Form.Control
                                                 type = 'password'
                                                 name={"password"}
                                                 placeholder = {TranslateExp(lang, "auth.password")}
                                                 onChange={e => {setRequestBody({...requestBody,password:e.target.value})} }/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* onChange={e => setRequestBody({...requestBody, confirmed: e.target.value})} */}
                                {/*setPassword({password:e.target.value});*/}
                                <Row>
                                    <Col>
                                        <Form.Label>{TranslateExp(lang, "cruds.UMCreated")}</Form.Label>
                                        <Form.Control
                                            className={`mr-2 mb-2 ${st.dates_container__input}`}
                                            id={`um_created_at`}
                                            name={`um_created_at`}
                                            onChange={(e)=>setRequestBody({...requestBody,um_created_at:e.target.value})}
                                            defaultValue = {formatDate(requestBody?.um_created_at)}
                                            type='date'
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label>{TranslateExp(lang, "cruds.UMExp")}</Form.Label>
                                        <Form.Control
                                            className={`mr-2 mb-2 ${st.dates_container__input}`}
                                            name={`um_expired_at`}
                                            onChange={(e)=>setRequestBody({...requestBody,um_expired_at:e.target.value})}
                                            defaultValue = {formatDate(requestBody?.um_expired_at)}
                                            type='date'
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Label>{TranslateExp(lang, "cruds.OTMCreated")}</Form.Label>
                                        <Form.Control
                                            className={`mr-2 mb-2 ${st.dates_container__input}`}
                                            // id={`date${index}started`}
                                            // value={key.started}
                                            name={`otm_created_at`}
                                            onChange={(e)=>setRequestBody({...requestBody,otm_created_at:e.target.value})}
                                            defaultValue = {formatDate(requestBody?.otm_created_at)}
                                            type='date'
                                        />
                                    </Col>
                                    <Col className={userId?"d-none":""}>
                                        <Form.Label>{TranslateExp(lang, "cruds.OTMExp")}</Form.Label>
                                        <Form.Control
                                            type='date'
                                            name="otm_expired_at"
                                            className={`mr-2 mb-2 ${st.dates_container__input}`}
                                            onChange={(e)=>setRequestBody({...requestBody,otm_expired_at:e.target.value})}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "reg.compName")}</Form.Label>
                                            <Form.Control
                                                 type = 'text'
                                                 placeholder = {TranslateExp(lang, "reg.placeCompName")}
                                                 name={"company_name"}
                                                 defaultValue = {userId? requestBody.company_name : ""}
                                                 onChange={e => setRequestBody({...requestBody, company_name: e.target.value})}
                                                 required/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.mnn")}</Form.Label>
                                            <Form.Control
                                                 type = 'text'
                                                 name={"company_inn"}
                                                 placeholder = {TranslateExp(lang, "products.mnn")}
                                                 defaultValue = {userId? requestBody.company_inn : ""}
                                                 onChange={e => setRequestBody({...requestBody, company_inn: e.target.value})} required/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "reg.phone")}</Form.Label>
                                            <Form.Control
                                                 type = 'text'
                                                 name={"phone_number"}
                                                 placeholder = {TranslateExp(lang, "reg.phone")}
                                                 defaultValue = {userId? requestBody.phone_number : ""}
                                                 onChange={e => setRequestBody({...requestBody, phone_number: e.target.value})}
                                                 required/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "content.serPass")}</Form.Label>
                                            <Form.Control
                                                 type = 'text'
                                                 name={"passport_info"}
                                                 placeholder = {TranslateExp(lang, "content.serPass")}
                                                 defaultValue = {userId? requestBody.passport_info : ""}
                                                 onChange={e => setRequestBody({...requestBody, passport_info: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "reg.address")}</Form.Label>
                                            <Form.Control
                                                 type = 'text'
                                                 name={"user_address"}
                                                 placeholder = {TranslateExp(lang, "reg.address")}
                                                 defaultValue = {userId? requestBody.user_address : ""}
                                                 onChange={e => setRequestBody({...requestBody, user_address: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col className="mt-4 pt-1">
                                        <Form.Group>
                                            <Form.Check
                                                 type = "switch"
                                                 label={TranslateExp(lang, "content.block")}
                                                 id="active"
                                                 checked={userId?requestBody.is_blocked:isActive}
                                                 onChange={()=>handleActive()}
                                                 // onChange={e => setRequestBody({...requestBody, is_blocked: e.target.value})}
                                                />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='my-2'>
                                    <Col><Button type="reset" className={"btn btn-block btn-warning"}>{TranslateExp(lang, "content.resetAll")}</Button></Col>
                                    <Col><Button type='submit' className={"btn btn-block btn-success"}>{TranslateExp(lang, "content.save")}</Button></Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                    </Col>
                <Col></Col>
                <Col md={3} className={userId?"mt-5 d-block":"mt-5 d-none"}>
                        {/*<Card>*/}
                        {/*    <Card.Header>*/}
                        {/*        <h4>change user`s password</h4>*/}
                        {/*    </Card.Header>*/}
                        {/*    <Form onSubmit={e=>changePassword(e)}>*/}
                        {/*        <Card.Body>*/}
                        {/*            <Form.Group>*/}
                        {/*                <Form.Label>Password</Form.Label>*/}
                        {/*                <Form.Control onChange={e => {setPassword({password:e.target.value})}}*/}
                        {/*                              name={"password"} type='password' placeholder='password' required/>*/}
                        {/*            </Form.Group>*/}
                        {/*        </Card.Body>*/}
                        {/*        <Card.Footer>*/}
                        {/*            <Button type={"submit"} className={"btn btn-block"} color={"info"}>Change</Button>*/}
                        {/*        </Card.Footer>*/}
                        {/*    </Form>*/}
                        {/*</Card>*/}

                    </Col>
                {
                    (status || status2) &&
                        <Redirect to={"/admin/users"}/>
                }
            </Row>
        </div>
    </>
  );
    function formatDate(date){
        if(date){
            const parsedDate = new Date(date).toISOString().substr(0, 10);
            return parsedDate;
        }
    }
}

export default UserForm;
