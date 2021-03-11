import React, {useEffect, useState} from "react";
import Select from '../../../../components/reactSelect';
import {dfApi, dtApi} from "../../../../services/drugsService";
import {dfgApi, medApi} from "../../../../services/medService";
import {mnnApi} from '../../../../services/mnnService'
import {Button, Col, Row, Form} from "react-bootstrap";
import st from "../../crud.module.scss";
import {Link, Redirect} from "react-router-dom";
import {tpgApi} from "../../../../services/tpgService";
import ToastEx from "../../../../components/toasts";
import {NumberToStr, StrtoNumber, customFilter} from '../../../../utils';

function DrugsEdit (props) {
    const {id} = props.match.params;
    const {lang, TranslateExp} = props;
    const[status,setStatus] = useState(false);
    const[dts,setDts] = useState([]);
    const[dfs,setDfs] = useState([]);
    const[tpg,setTpg] = useState([]);
    const[mnn,setMnn] = useState([]);
    const[dfg,setDfg] = useState([]);
    const[show,setShow] = useState(false);
    const[response,setResponse] = useState('');

    const[result,setResult] = useState({
        name_uz:"",
        drug_type:"",
        drug_inn:"",
        drug_form:"",
        drug_farm_group:"",
        drug_ts_group:"",
        drug_ref_price:"",
        drug_ref_price_ccy:"",
    });
    const getAllLists = async () => {
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

    const getDrugsList=()=>{
        medApi.getList().then(res=>{
                const drug = res.data.data.find(d => d._id == id);
                setResult({
                    ...result,
                    name_uz:drug.name_uz,
                    drug_type:drug.drug_type._id,
                    drug_inn:drug.drug_inn._id,
                    drug_form:drug.drug_form._id,
                    drug_farm_group:drug.drug_farm_group._id,
                    drug_ts_group:drug.drug_ts_group._id,
                    drug_ref_price:new String(drug.drug_ref_price?.$numberDecimal),
                    drug_ref_price_ccy: drug.drug_ref_price_ccy,
                    is_active:drug.is_active,
                    is_deleted:drug.is_deleted
                });
        })
    };

    useEffect(async ()  => {
        getAllLists();
        getDrugsList();
    },[]);

    const saveEditingDrug = e => {
        e.preventDefault();
        medApi.edit(id, result).then(resp=>{
            setStatus(true);
            setResponse({
                message:resp.data.message.ru,
                status:resp.data.status
            });
            setShow(true)
        });
    };
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
            displat: 'none'
        }),
        placeholder: (provided)=>({
            ...provided,
            color: '#fff',
        }),    
        
    }
    const optionsPrice = [{value: "USD", label:"$"},{value: "EUR", label:"€"},{value: "RUB", label:"₽"},{value: "UZS", label:"SO'M"}];
    const optionsDts = dts.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));
    const optionsMnn = mnn.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));
    const optionsDfs = dfs.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));
    const optionsTpg = tpg.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));
    const optionsDfg = dfg.map(item=>({ value:item._id, label: `${item.name_uz} (${item.counter})`}));

    return(
        <div className='p-3 pb-5 pr-3 w-100 bg-light'>
            <h3>{TranslateExp(lang, "content.editing")} {TranslateExp(lang, "cruds.med")} {TranslateExp(lang, "cruds.edit")}</h3>
            <Row className='pb-5'>
                <ToastEx {...props} response={response} show={show} setShow={setShow}/>
                <Col md={9}>
                    <Form onSubmit={e=>saveEditingDrug(e)}>
                        <Form.Group>
                            <Form.Label>{TranslateExp(lang, "table.name")}</Form.Label>
                            <Form.Control
                                defaultValue={result?.name_uz}
                                onChange={e=>setResult({...result,name_uz: e.target.value})}
                                name={"name_uz"} 
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
                                            <Row className='p-0 m-0'>
                                                <Col md={8} className='p-0 m-0'>
                                                <Form.Label>{TranslateExp(lang, "cruds.refPr")}</Form.Label>
                                                <Form.Control
                                                    defaultValue={result?.drug_ref_price}
                                                    onChange={e=>setResult({...result,drug_ref_price: StrtoNumber(e.target.value)})}
                                                    value={NumberToStr(result['drug_ref_price'])}
                                                    name={"drug_ref_price"} type = 'text' 
                                                    placeholder = {TranslateExp(lang, "cruds.refPr")} 
                                                    required
                                                />
                                                </Col>
                                                <Col md={4} className='p-0 m-0 text-center'>
                                                    <Form.Label>{TranslateExp(lang, "cruds.curr")}</Form.Label>
                                                    <Select 
                                                        filterOption={customFilter}
                                                        onChange={e=>setResult({...result,drug_ref_price_ccy: e.value})} 
                                                        className={st.select} 
                                                        styles={customStyles} 
                                                        options={optionsPrice} 
                                                        value={optionsPrice.filter(option => option.value === result?.drug_ref_price_ccy)}
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
                                                filterOption={customFilter}
                                                name='drug_inn' 
                                                placeholder={TranslateExp(lang, "products.mnn")}
                                                defaultValue={"result?.drug_inn"}
                                                value={optionsMnn.filter(({value}) => value === result?.drug_inn)}                                                
                                                options={optionsMnn}
                                                onChange={e=>{setResult({...result,drug_inn: e.value})}}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.df")} </Form.Label>
                                            <Select
                                                filterOption={customFilter}
                                                name='drug_form' 
                                                placeholder={TranslateExp(lang, "products.df")}
                                                defaultValue={"result?.drug_form"}
                                                value={optionsDfs.filter(({value}) => value === result?.drug_form)}                                                
                                                options={optionsDfs}
                                                onChange={e=>{setResult({...result,drug_form: e.value})}}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.dfg")}</Form.Label>
                                            <Select 
                                                filterOption={customFilter}
                                                name='drug_farm_group' 
                                                placeholder={TranslateExp(lang, "products.dfg")}
                                                value={optionsDfg.filter(({value}) => value === result?.drug_farm_group)}
                                                options={optionsDfg}
                                                onChange={e=>{setResult({...result,drug_farm_group: e.value})}}
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
                                                name='drug_ts_group'
                                                placeholder={TranslateExp(lang, "products.tpg")}
                                                value={optionsTpg.filter(({value}) => value === result?.drug_ts_group)}
                                                options={optionsTpg} 
                                                onChange={e=>{setResult({...result,drug_ts_group: e.value})}}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label name="drug_type">{TranslateExp(lang, "products.dt")}</Form.Label>
                                            <Select
                                                filterOption={customFilter}
                                                name='drug_type' 
                                                placeholder={TranslateExp(lang, "products.dt")}
                                                value={optionsDts.filter(({value}) => value === result?.drug_type)}
                                                options={optionsDts} 
                                                onChange={e=>{setResult({...result,drug_type: e.value})}}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='my-2'>
                                    <Col><Link className='btn btn-warning w-100 text-white text-decoration-none' to='/admin/drugs'>{TranslateExp(lang, "content.cancel")}</Link></Col>
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
                <Col md={3}>

                </Col>
            </Row>
        </div>
    );
}

export default DrugsEdit;
