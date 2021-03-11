import React, {useEffect, useState} from 'react';
import Select from '../../../../components/reactSelect';
import st from "../../crud.module.scss";
import {Button, Col, Container, Row, Form} from "react-bootstrap";
import {dfgApi, medApi} from "../../../../services/medService";
import {dtApi,dfApi} from "../../../../services/drugsService";
import {mnnApi} from "../../../../services/mnnService";
import {Redirect} from "react-router-dom";
import {tpgApi} from "../../../../services/tpgService";
import {NumberToStr, StrtoNumber, customFilter} from '../../../../utils';
function DrugsAdd (props) {

    const{lang, TranslateExp} = props;
    const[status,setStatus] = useState(false);
    const[dts,setDts] = useState([]);
    const[dfs,setDfs] = useState([]);
    const[mnn, setMnn] = useState([])
    const[tpg,setTpg] = useState([]);
    const[dfg,setDfg] = useState([]);
    const[data,setData] = useState({
        name_uz:"",
        drug_ref_price:"",
        drug_ref_price_ccy:"",
        drug_inn:"",
        drug_form:"",
        drug_farm_group:"",
        drug_ts_group:"",
        drug_type:""
    });
    const getAllLists = () => {
        dtApi.getList().then(res=>{
            setDts(res.data.data)
        });
        dfApi.getList().then(res=>{
            setDfs(res.data.data)
        });
        mnnApi.getList().then(res=>{
            setMnn(res.data.data)            
        })
        dfgApi.getList().then(res=>{
            setDfg(res.data.data)
        });
        tpgApi.getList().then(res=>{
            setTpg(res.data.data)
        });

    };
    useEffect(()=>{
        getAllLists();
    },[])

    const addDrug = e => {
        e.preventDefault();

        medApi.save(data).then(res=>{
            if (res.status===200){
                setStatus(res.status)
            }
        })
    };
    const optionsPrice = [{value: "USD", label:"$"},{value: "EUR", label:"€"},{value: "RUB", label:"₽"},{value: "UZS", label:"SO'M"},];
    const customStyles = {

    control: (provided) => ({
        ...provided,
        borderRadius: '0 5px 5px 0 !important',
        backgroundColor: '#999',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'no-wrap'
    }),
    singleValue : (provided) =>({
        ...provided,
        color: '#fff'
    }),
    indicatorSeparator: (provided)=>({
        ...provided,
        display: 'none'
    }),
    placeholder: (provided)=>({
            ...provided,
            color: '#fff',
        }),
    menu: (provided)=>({
        ...provided,
        zIndex: 10
    })
}
function resetAll(){
    setData({
        name_uz:"",
        drug_ref_price:"",
        drug_ref_price_ccy:"",
        drug_inn:"",
        drug_form:"",
        drug_farm_group:"",
        drug_ts_group:"",
        drug_type:"",
    })
}
const optionsDts = dts.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));
const optionsDfs = dfs.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));
const optionsMnn = mnn.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));
const optionsTpg = tpg.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));
const optionsDfg = dfg.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));

useEffect(()=>console.log(data),[data])
    return(
        <div className='p-3 pb-5 pr-5 bg-light w-100'>
            <h3>{TranslateExp(lang, "content.adding")} {TranslateExp(lang, "cruds.med")} {TranslateExp(lang, "cruds.add")}</h3>
            <Row className='pb-5'>
                <Col md={9}>
                    <Form onSubmit={e=>addDrug(e)}>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "table.name")}</Form.Label>
                            <Form.Control 
                                onChange={e=>setData({...data,name_uz: e.target.value})}
                                id="name_uz" 
                                value={data.name_uz}
                                type = 'text' 
                                placeholder = {TranslateExp(lang, "table.name")}
                                required 
                                />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Row className={`p-0 m-0`}>
                                                <Col md={8} className='p-0 m-0'>
                                                <Form.Label>{TranslateExp(lang, "cruds.refPr")} </Form.Label>
                                                <Form.Control
                                                    className={st.cost}
                                                    onChange={e=>setData({...data, drug_ref_price: StrtoNumber(e.target.value)})} 
                                                    value={NumberToStr(data['drug_ref_price'])}
                                                    id="drug_ref_price" 
                                                    type = 'text' 
                                                    placeholder = {TranslateExp(lang, "cruds.refPr")} 
                                                    required
                                                />
                                                </Col>
        
                                                <Col md={4} className='p-0 m-0 text-center' style={{borderRadius: '0 5px 5px 0'}}>
                                                    <Form.Label>{TranslateExp(lang, "cruds.curr")}</Form.Label>
                                                    <Select 
                                                        id="drug_ref_price_ccy"
                                                        filterOption={customFilter} 
                                                        onChange={e=>setData({...data,drug_ref_price_ccy: e.value})} 
                                                        value={optionsPrice.filter(key=> key.value === data.drug_ref_price_ccy)}
                                                        className={st.select} 
                                                        styles={customStyles} 
                                                        options={optionsPrice} 
                                                        placeholder='...'
                                                        required
                                                        />           
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.mnn")}</Form.Label>
                                            <Select
                                                id='drug_inn'
                                                placeholder={TranslateExp(lang, "products.mnn")}
                                                filterOption={customFilter}
                                                options={optionsMnn}
                                                onChange={e=>{setData({...data,drug_inn: e.value})}}
                                                value={optionsMnn.filter(key=> key.value === data.drug_inn)}
                                                required
                                            />
                                         </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.df")}</Form.Label>
                                            <Select 
                                                filterOption={customFilter} 
                                                id='drug_form' 
                                                placeholder={TranslateExp(lang, "products.df")} 
                                                options={optionsDfs} 
                                                onChange={e=>{setData({...data,drug_form: e.value})}}
                                                value={optionsDfs.filter(key=> key.value === data.drug_form)}
                                                required
                                                />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.dfg")}</Form.Label>
                                            <Select 
                                                filterOption={customFilter} 
                                                id='drug_farm_group' 
                                                placeholder={TranslateExp(lang, "products.dfg")} 
                                                options={optionsDfg} 
                                                onChange={e=>{setData({...data,drug_farm_group: e.value})}}
                                                value={optionsDfg.filter(key=> key.value === data.drug_farm_group)}
                                                required
                                                />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.tpg")}</Form.Label>
                                            <Select 
                                                filterOption={customFilter} 
                                                id='drug_ts_group' 
                                                placeholder={TranslateExp(lang, "products.tpg")} 
                                                options={optionsTpg} 
                                                onChange={e=>{setData({...data,drug_ts_group: e.value})}}
                                                value={optionsTpg.filter(key=> key.value === data.drug_ts_group)}
                                                required
                                                />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group>
                                        <Form.Label>{TranslateExp(lang, "products.dt")}</Form.Label>
                                        <Select 
                                            filterOption={customFilter} 
                                            id='drug_type' 
                                            placeholder={TranslateExp(lang, "products.dt")} 
                                            options={optionsDts} 
                                            onChange={e=>{setData({...data,drug_type: e.value})}}
                                            value={optionsDts.filter(key=> key.value === data.drug_type)}
                                            required
                                            />
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='my-2'>
                                    <Col><Button onClick={()=>resetAll()} className={"btn btn-block btn-warning"}>{TranslateExp(lang, "content.resetAll")}</Button></Col>
                                    <Col><Button type='submit' className={"btn btn-block btn-success"}>{TranslateExp(lang, "content.save")}</Button></Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                    </Col>
                {
                    status &&
                        <Redirect to={"/admin/drugs"}/>
                }
                <Col md={3}></Col>
            </Row>
        </div>
    );
}

export default DrugsAdd;