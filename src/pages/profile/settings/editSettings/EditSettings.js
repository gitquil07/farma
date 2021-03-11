import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import st from "../../../cruds/crud.module.scss";
import {NumberToStr, StrtoNumber} from "../../../../utils";
import Select from "react-select";

function EditSettings(props) {
    return(
        <>
            <div className='container ml-0 pb-5'>
                <h3>Edit settings</h3>
                <Row className='pb-5'>
                    <Col md={9}>
                        <Form>
                            <Form.Group>
                                <Form.Label>Наименование</Form.Label>
                                <Form.Control name={"name_uz"} type = 'text' placeholder = 'Наименование' required/>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Row className={`p-0 m-0`}>
                                                    <Col md={8} className='p-0 m-0'>
                                                        <Form.Label>Цена референдума </Form.Label>
                                                        <Form.Control
                                                            className={st.cost}
                                                            placeholder = 'Цена референдума'
                                                            required
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='my-2'>
                                        <Col><Button type="reset" className={"btn btn-block btn-warning"}>Сбросить все</Button></Col>
                                        <Col><Button type='submit' className={"btn btn-block btn-success"}>Сохранить</Button></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col md={3}></Col>
                </Row>
            </div>
        </>
    )
}
export default EditSettings
