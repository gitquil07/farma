import React from 'react'
import st from "../../auth/signUp/signUp.module.scss";
import {Button, Col, Form, Row} from "react-bootstrap";

function AddUserForm(props) {
    const {lang, TranslateExp} = props;
    return(
        <div>
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-md-2"}></div>
                    <div className={"col-md-6"}>
                        <h2>{TranslateExp(lang, "content.adding")} {TranslateExp(lang, "cruds.user")}</h2>
                        {/*<div className={st.card__title}>*/}
                        {/*    <h3>Регистрация</h3>*/}
                        {/*</div>*/}
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={`${st.label__reg}`}>{TranslateExp(lang, "reg.name")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'text' placeholder = 'Тимур' required/>
                                    </Form.Group>
                                </Col>
                               <Col>
                                   <Form.Group>
                                       <Form.Label className={st.label__reg}>{TranslateExp(lang, "reg.secName")}</Form.Label>
                                       <Form.Control className={`${st.input__reg} btn-sm`} type = 'text' placeholder = 'Кушкаров' required/>
                                   </Form.Group>
                               </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label className={st.label__reg}>{TranslateExp(lang, "reg.compName")}</Form.Label>
                                <Form.Control className={`${st.input__reg} btn-sm`} type = 'text' placeholder = 'Farma Lux International' required/>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={st.label__reg}>{TranslateExp(lang, "products.mnn")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'text' placeholder = 'ИНН' required/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={st.label__reg}>{TranslateExp(lang, "reg.phone")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'tel' placeholder = 'Телефон номер' pattern="[+][0-9]{5} [0-9]{3}-[0-9]{2}-[0-9]{2}" required/>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group>
                                <Form.Label className={st.label__reg}>{TranslateExp(lang, "auth.email")}</Form.Label>
                                <Form.Control className={`${st.input__reg} btn-sm`} type = 'email' placeholder = 'example@gmailcom' required/>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={st.label__reg}>{TranslateExp(lang, "auth.login")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'text' placeholder = 'Логин' required/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={st.label__reg}>{TranslateExp(lang, "auth.password")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'text' placeholder = 'Парол' required/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={st.label__reg}>{TranslateExp(lang, "cruds.disMac")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'text' placeholder = 'Одноразовый Мак аддресс' required/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={st.label__reg}>{TranslateExp(lang, "cruds.unicMac")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'text' placeholder = 'Уникальный Мак аддресс' required/>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={st.label__reg}>{TranslateExp(lang, "cruds.shelf")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'date' placeholder = 'Истекший срок' required/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label className={st.label__reg}>{TranslateExp(lang, "content.selectFile")}</Form.Label>
                                        <Form.Control className={`${st.input__reg} btn-sm`} type = 'file'/>
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Button className={`${st.btn__reg} btn-block btn-sm`} variant="primary" type="submit">
                                {TranslateExp(lang, "content.save")}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddUserForm;