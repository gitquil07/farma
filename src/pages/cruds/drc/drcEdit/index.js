import React, {useEffect, useState} from 'react';
import Select from '../../../../components/reactSelect';
import st from "../../crud.module.scss";
import {Button, Col, Row, Form } from "react-bootstrap";
import {DRCApi} from "../../../../services/drcService";
import {medApi} from "../../../../services/medService";
import {mfApi} from "../../../../services/mfService";
import {countryApi} from "../../../../services/countryService";
import {sdrApi} from "../../../../services/sdrService";
import {distApi} from "../../../../services/distService";
import {tradeMarkApi} from "../../../../services/tdService";
import {NumberToStr, StrtoNumber, customFilter} from '../../../../utils';
import {Redirect} from "react-router-dom";

function DRCEdit (props) {
    const {id} = props.match.params;
    const {lang, TranslateExp} = props;
    const today = new Date();
    const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    const[status,setStatus] = useState(false);
    const[val, setVal] = useState('');

    const[countries,setCountries] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [dist, setDist] = useState([]);
    const [sdr, setSdr] = useState([]);
    const [mfs,setMfs] = useState([]);
    const [tds, setTds] = useState([]);

    const [cPrice, setCPrice] = useState({
        ccv: "",
        ccy: ""
    });

    const [price, setPrice] = useState({
        ccv: "",
        ccy: ""
    });

    const [currencyListCp, setCurrencyListCp] = useState(null);
    const [currencyListP, setCurrencyListP] = useState(null);

    const[result,setResult] = useState({
        drug_name:"",
        trademark: "",
        serial_number:"",
        shelf_life:"",
        mode_70_date:"",
        mode_70_distributor:"",
        mode_40_date:"",
        mode_40_distributor:"",
        sender_company:"",
        quantity: "",
        p_ccy_rate:0,
        cp_ccy_rate:0,
        is_active:1,
        is_deleted:0,
        manufacturer: "",
        manufacturer_country:""
    });

    const calculatePrice = ({type, body}) => {
        DRCApi.getCurrencyList({...body, ccv: +body.ccv}).then(resp => {
            if(resp.status == 200){
                if(type){
                    setCurrencyListCp(resp.data.data)
                }else{
                    setCurrencyListP(resp.data.data);
                }
              
                setResult(result);
            }
        })
        setVal(val);
    }

    useEffect(()=> {
        if(cPrice.ccy != "" && cPrice.ccv.trim() != "" && !isNaN(cPrice.ccv)){
            calculatePrice({type: 1, body: cPrice});
        }
    }, [cPrice]);

    useEffect(() => {
        if(price.ccy != "" && price.ccv.trim() != "" && !isNaN(price.ccv)){
            calculatePrice({type: 0, body: price});
        }
    }, [price]);

    const getAllLists = () => {
       
        medApi.getList().then(resp => setDrugs(resp.data.data));
        distApi.getList().then(resp => setDist(resp.data.data));
        sdrApi.getList().then(resp => setSdr(resp.data.data));
        mfApi.getList().then(res=>{
            setMfs(res.data.data);
        });
        countryApi.getList().then(res=>{
            setCountries(res.data.data)
        });
        tradeMarkApi.getList().then(res => {
            setTds(res.data.data);
        });
    };

    useEffect(async ()  =>{
        getAllLists();
    },[]);

    useEffect(() => {
        getDrc();
    }, [mfs, countries]);

    function getDrc(){
        DRCApi.getList().then(resp => {
            const res = resp.data.data.find(d => d._id == id);
            const cp_prices = {};
            const p_prices = {};
            const sm_prices = {};
            Object.keys(res.sum_price).forEach(curSmPrice => {
                sm_prices[`sm_${curSmPrice}`] = res.sum_price[curSmPrice];
            });
            Object.keys(res.price).forEach(curPrice => {
                p_prices[`p_${curPrice}`] = res.price[curPrice];
            });
            
            Object.keys(res.customs_price).forEach(curCPrice => {
                cp_prices[`cp_${curCPrice}`] = res.customs_price[curCPrice];
            });
                
            setResult({...result,
                drug_name:res.drug_name._id,
                trademark:res.trademark._id,
                serial_number:res.serial_number,
                shelf_life:res.shelf_life,
                mode_70_date:res.mode_70_date,
                mode_70_distributor:res.mode_70_distributor._id,
                mode_40_date:res.mode_40_date,
                mode_40_distributor:res.mode_40_distributor._id,
                sender_company:res.sender_company._id,
                quantity: res.quantity,
                manufacturer:res.manufacturer._id,
                manufacturer_country:res.manufacturer_country._id,
                ...cp_prices,
                ...p_prices,
                ...sm_prices
            });

            setCPrice({
                ccy:res.customs_price.ccy,
                ccv:new String(res.customs_price[res.customs_price.ccy.toLowerCase()])
            });
            setPrice({
                ccy:res.price.ccy,
                ccv:new String(res.price[res.customs_price.ccy.toLowerCase()])
            });

        });
    }

    const editDrc = e => {
        e.preventDefault();

        if(currencyListP && currencyListCp){
            if(cPrice.ccy !== result.cp_ccy || cPrice.ccv !== result[result.cp_ccy.toLowerCase()]){
                Object.keys(currencyListCp).forEach(curCp => {
                    result[`sp_${curCp}`] = currencyListCp[curCp];
                });
                result.cp_ccy = cPrice.ccy;
            }

            
            // Check if price is changed
            if(price.ccy !== result.p_ccy || price.ccv !== result[result.p_ccy.toLowerCase()]){
                Object.keys(currencyListP).forEach(curP => {
                    result[`p_${curP}`] = currencyListP[curP];
                });
                result.p_ccy = price.ccy;

                // If price is changed calculate result again with new values and change edited data results
                Object.keys(currencyListP).forEach(currency => {
                    result[`sm_${currency}`] = +(currencyListP[currency] * result.quantity).toFixed(2);
                });
            }

            DRCApi.edit(id, result).then(res=>{
                if (res.status===201){
                    setStatus(true);
                }
            })
        }

        // getList()
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
    
}
    const optionsCountries = countries.map(item=>({ value:item._id, label:  `${item.name_uz} (${item.counter?item.counter:0})`}));
    const drugsSelectOptions = drugs.map(item => ({value: item._id, label:  `${item.name_uz} (${item.counter?item.counter:0})`}));
    const distSelectOptions = dist.map(item => ({value: item._id, label:  `${item.name_uz} (${item.counter?item.counter:0})`}));
    const sdrSelectOptions = sdr.map(item => ({value: item._id, label: `${item.name_uz} (${item.counter?item.counter:0})`}));
    const optionsMfs = mfs.map(item=>({ value:item._id, label:  `${item.name_uz} (${item.counter?item.counter:0})`}));
    const optionsTds = tds.map(item => ({value: item._id, label:  `${item.name_uz} (${item.counter?item.counter:0})`}));

    return(
        <div className='p-3 pb-5 pr-3 w-100 bg-light'>
            <h3>{TranslateExp(lang, "content.editing")} {TranslateExp(lang, "cruds.drc")} {TranslateExp(lang, "cruds.edit")}</h3>
            <Row className='pb-5'>
                <Col md={9}>
                    <Form onSubmit={e=>editDrc(e)}>
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.name")}</Form.Label>
                                            <Select 
                                                name='drugs' 
                                                filterOption={customFilter}
                                                placeholder={TranslateExp(lang, "table.name")}
                                                options={drugsSelectOptions} 
                                                value={drugsSelectOptions.filter(option => option.value === result.drug_name)}
                                                onChange={e => setResult({...result, drug_name : e.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.td")}</Form.Label>
                                            <Select name='drugs' 
                                                filterOption={customFilter}
                                                placeholder={TranslateExp(lang, "products.td")} 
                                                value={optionsTds.filter(({value}) => value == result.trademark)}
                                                options={optionsTds} 
                                                onChange={e => setResult({...result, trademark : e.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.serialNum")}</Form.Label>
                                            <Form.Control 
                                                type = 'text' 
                                                placeholder = {TranslateExp(lang, "table.serialNum")} 
                                                defaultValue={result?.serial_number}
                                                onChange={e => setResult({...result, serial_number : e.target.value})} 
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.shelfLife")}</Form.Label>
                                            <Form.Control size='sm' 
                                                required 
                                                defaultValue={formatDate(result?.shelf_life)}
                                                type="date"
                                                onChange={e => setResult({...result, shelf_life : e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "cruds.data")} 40</Form.Label>
                                            <Form.Control 
                                                size='sm' 
                                                required 
                                                type="date" 
                                                defaultValue={formatDate(result?.shelf_life)}
                                                onChange={e => setResult({...result, mode_40_date : e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                   
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.dist")} 40</Form.Label>
                                            <Select 
                                                filterOption={customFilter}
                                                placeholder={`${TranslateExp(lang, "table.dist")} 40`} 
                                                options={distSelectOptions} 
                                                value={distSelectOptions.filter(option => option.value === result?.mode_40_distributor)}
                                                onChange={e => setResult({...result, mode_40_distributor : e.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "cruds.data")} 70</Form.Label>
                                            <Form.Control 
                                                size='sm'  
                                                type="date" 
                                                defaultValue={formatDate(result?.shelf_life)}
                                                onChange={e => setResult({...result, mode_70_date : e.target.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.dist")} 70</Form.Label>
                                            <Select 
                                                filterOption={customFilter}
                                                placeholder={`${TranslateExp(lang, "table.dist")} 70`} 
                                                options={distSelectOptions} 
                                                value={distSelectOptions.filter(option => option.value === result?.mode_70_distributor)}
                                                onChange={e => setResult({...result, mode_70_distributor : e.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.sender")}</Form.Label>
                                            <Select 
                                                filterOption={customFilter}
                                                placeholder={TranslateExp(lang, "table.sender")} 
                                                options={sdrSelectOptions} 
                                                value={sdrSelectOptions.filter(option => option.value === result?.sender_company)}
                                                onChange={e => setResult({...result, sender_company : e.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Row className={`p-0 m-0`}>
                                                <Col md={8} className='p-0 m-0'>
                                                <Form.Label>{TranslateExp(lang, "table.customsPr")}</Form.Label>
                                                <Form.Control
                                                    className={st.cost}
                                                    onChange={e=>setCPrice({...cPrice, ccv : StrtoNumber(e.target.value)})} 
                                                    value={NumberToStr(cPrice['ccv'])}
                                                    name={"drug_ref_price"} 
                                                    type = 'text' 
                                                    defaultValue={cPrice.ccv}
                                                    placeholder = {TranslateExp(lang, "table.customsPr")}
                                                    required
                                                />
                                                </Col>
        
                                                <Col md={4} className='p-0 m-0 text-center' style={{borderRadius: '0 5px 5px 0'}}>
                                                    <Form.Label>{TranslateExp(lang, "cruds.curr")}</Form.Label>
                                                    <Select 
                                                        filterOption={customFilter}
                                                        onChange={e => {setCPrice({...cPrice, ccy : e.value})}} 
                                                        className={st.select} styles={customStyles} 
                                                        value={optionsPrice.filter(option => option.value === cPrice.ccy)}
                                                        options={optionsPrice} 
                                                        placeholder='...'
                                                        required
                                                    />           
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        {
                                            currencyListCp && Object.keys(currencyListCp).map((key)=>{
                                                if(cPrice.ccv > 0 && key != cPrice.ccy.toLowerCase()){
                                                    return(
                                                        <div className='mt-2 d-inline-block'>
                                                            <p className='d-inline-block'>{key}</p>
                                                            <h6 disabled className={`${st.input_small} d-inline-block px-2`}>{NumberToStr(currencyListCp[key])}</h6> 
                                                        </div>
                                                    )                                            
                                                } else {
                                                    return ""
                                                }

                                            })
                                        }
                                        {
                                            (currencyListCp)?
                                            <div className='d-inline-block'>
                                                <p className='d-inline-block' style={{fontSize: '13px', fontWeight: 500}}>{TranslateExp(lang, "cruds.currVal")} : </p>
                                                <h6 disabled className={`${st.input_small} d-inline-block px-2`}>{date}</h6> 
                                            </div>
                                            : ""
                                        }

                                    </Col>
                                
                                    <Col>
                                        <Form.Group>
                                            <Row className={`p-0 m-0`}>
                                                <Col md={8} className='p-0 m-0'>
                                                <Form.Label>{TranslateExp(lang, "table.price")}  </Form.Label>
                                                <Form.Control
                                                    className={st.cost}
                                                    onChange={e=>setPrice({...price, ccv : StrtoNumber(e.target.value)})} 
                                                    value={NumberToStr(price['ccv'])}
                                                    name={"drug_ref_price"} 
                                                    type = 'text' 
                                                    defaultValue={price.ccv}
                                                    placeholder = {TranslateExp(lang, "table.price")} 
                                                    required
                                                />
                                                </Col>
        
                                                <Col md={4} className='p-0 m-0 text-center' style={{borderRadius: '0 5px 5px 0'}}>
                                                    <Form.Label>{TranslateExp(lang, "cruds.curr")}</Form.Label>
                                                    <Select 
                                                        filterOption={customFilter}
                                                        onChange={e => {setPrice({...price, ccy : e.value})}} 
                                                        className={st.select} styles={customStyles} 
                                                        value={optionsPrice.filter(option => option.value === price.ccy)}
                                                        options={optionsPrice} 
                                                        placeholder='...'
                                                        required
                                                    />           
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    
                                
                                        {
                                            currencyListP && Object.keys(currencyListP).map((key)=>{
                                                if(price.ccv > 0 && key != price.ccy.toLowerCase()){
                                                    return(
                                                        <div className='mt-2 d-inline-block'>
                                                            <p className='d-inline-block'>{key}</p>
                                                            <h6 disabled className={`${st.input_small} d-inline-block px-2`}>{NumberToStr(currencyListP[key])}</h6> 
                                                        </div>
                                                    )                                            
                                                } else {
                                                    return ""
                                                }

                                            })
                                        }
                                        {
                                            (currencyListP)?
                                            <div className='d-inline-block'>
                                                <p className='d-inline-block' style={{fontSize: '13px', fontWeight: 500}}>{TranslateExp(lang, "cruds.currVal")} : </p>
                                                <h6 disabled className={`${st.input_small} d-inline-block px-2`}>{date}</h6> 
                                            </div>
                                            : ""
                                        }
                                        
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                        <Form.Label>{TranslateExp(lang, "cruds.curr")}</Form.Label>
                                            <Form.Control 
                                                type = 'text' 
                                                placeholder = {TranslateExp(lang, "cruds.curr")} 
                                                defaultValue={result?.quantity}
                                                onChange={e => setResult({...result, quantity : e.target.value})} 
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.mf")}</Form.Label>
                                            <Select
                                                filterOption={customFilter}
                                                placeholder={TranslateExp(lang, "table.mf")} 
                                                value={optionsMfs.filter(({value}) => value == result.manufacturer)}
                                                options={optionsMfs} 
                                                onChange={e => setResult({...result, manufacturer : e.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                   
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.mfc")}</Form.Label>
                                            <Select 
                                                filterOption={customFilter}
                                                placeholder={TranslateExp(lang, "table.mfc")} 
                                                value={optionsCountries.filter(({value}) => value == result.manufacturer_country)}
                                                options={optionsCountries} 
                                                onChange={e => setResult({...result, manufacturer_country : e.value})}
                                                required
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
                {
                    status &&
                        <Redirect to={"/admin/drc"}/>
                }
                <Col md={3}></Col>
            </Row>
        </div>
    );
}

function formatDate(date){
    if(date){
        const parsedDate = new Date(date).toISOString().substr(0, 10);
        return parsedDate;
    }
}

export default DRCEdit;
