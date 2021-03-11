import React, {useEffect, useState} from 'react';
import st from "../../crud.module.scss";
import {Button, Col, Row, Form} from "react-bootstrap";
import Select from "../../../../components/reactSelect";
import {DRCApi} from "../../../../services/drcService";
import {mfApi} from "../../../../services/mfService";
import {countryApi} from "../../../../services/countryService";
import {medApi} from "../../../../services/medService";
import {sdrApi} from "../../../../services/sdrService";
import {distApi} from "../../../../services/distService";
import {tradeMarkApi} from "../../../../services/tdService";
import {Redirect} from "react-router-dom";
import {NumberToStr, StrtoNumber, customFilter} from '../../../../utils';


function DRCAdd (props) {
    const today = new Date();
    const date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    const [status,setStatus] = useState(false);
    const [val, setVal] = useState('');
    const [countries,setCountries] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [dist, setDist] = useState([]);
    const [sdr, setSdr] = useState([]);
    const [mfs,setMfs] = useState([]);
    const [tds, setTds] = useState([]);
    const {lang, TranslateExp} = props;
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

    const[data,setData] = useState({
        drug_name:"",
        trademark:"",
        serial_number:"",
        shelf_life:"",
        mode_70_date:"",
        mode_70_distributor:"",
        mode_40_date:"",
        mode_40_distributor:"",
        sender_company:"",
        quantity:"",
        manufacturer:"",
        manufacturer_country:"",
    });

    const calculatePrice = ({type, body}) => {
        DRCApi.getCurrencyList({...body, ccv: +body.ccv}).then(resp => {
            if(resp.status == 200){
                const cur = {};
                const keys = Object.keys(resp.data.data);
                if(type){
                    setCurrencyListCp(resp.data.data)
                    cur.cp_ccy = body.ccy;
                    keys.forEach(key => {
                        cur["cp_" + key] = +resp.data.data[key]
                    });
                }else{
                    setCurrencyListP(resp.data.data);
                    cur.p_ccy = body.ccy;
                    keys.forEach(key => {
                        cur["p_" + key] = +resp.data.data[key];
                    })
                }
              
                setData({...data,  ...cur});
            }
        })
        setVal(val);
    }

    useEffect(()=> {
        setCurrencyListCp(null);
        if(cPrice.ccy != "" && cPrice.ccv != "" && !isNaN(cPrice.ccv)){
            calculatePrice({type: 1, body: cPrice});
        }
    }, [cPrice]);

    useEffect(() => {
        setCurrencyListP(null);
        if(price.ccy != "" && price.ccv != "" &&!isNaN(price.ccv)){
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
    useEffect(()=>{
        getAllLists();
    },[])

    
    const addDrc = e => {
        e.preventDefault();
        const res = {};

        Object.keys(currencyListP).forEach(currency => {
            res[`sm_${currency}`] = +(currencyListP[currency] * data.quantity).toFixed(2);
        });

        DRCApi.save({...data, ...res}).then(resp=>{
            if (resp.status===200){
                setStatus(true);
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
    
    }
    function resetAll(){
        setData({
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
            manufacturer: "",
            manufacturer_country:""
        })
        setPrice({ccv: "",ccy: ""});
        setCPrice({ccv: "",ccy: ""});
        setCurrencyListCp(null);
        setCurrencyListP(null);
    }
    
    const optionsCountries = countries.map(item=>({ "value":item._id, label: `${item.name_uz} (${item.counter?item.counter:0})`}));
    const drugsSelectOptions = drugs.map(item => ({value: item._id, label: `${item.name_uz} (${item.counter?item.counter:0})`}));
    const distSelectOptions = dist.map(item => ({value: item._id, label: `${item.name_uz} (${item.counter?item.counter:0})`}));
    const sdrSelectOptions =  sdr.map(item => ({value: item._id, label:`${item.name_uz} (${item.counter?item.counter:0})`}));
    const optionsMfs = mfs.map(item =>({ "value":item._id, label: `${item.name_uz} (${item.counter?item.counter:0})`}));
    const optionsTds = tds.map(item =>({value: item._id, label: `${item.name_uz} (${item.counter?item.counter:0})`}));

    return(
        <div className='p-3 pb-5 pr-3 w-100 bg-light'>
            <h3>{TranslateExp(lang, "content.adding")} {TranslateExp(lang, "cruds.drc")} {TranslateExp(lang, "cruds.add")}</h3>
            <Row className='pb-5'>
                <Col md={9}>
                    <Form onSubmit={e=>addDrc(e)}>
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.name")}</Form.Label>
                                            <Select 
                                                id='drug_name' 
                                                filterOption={customFilter}
                                                placeholder={TranslateExp(lang, "table.name")} 
                                                options={drugsSelectOptions} 
                                                onChange={e => setData({...data, drug_name : e.value})}
                                                value={drugsSelectOptions.filter(key=>key.value===data.drug_name)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "products.td")}</Form.Label>
                                            <Select 
                                                id='trademark' 
                                                filterOption={customFilter}
                                                placeholder={TranslateExp(lang, "products.td")} 
                                                options={optionsTds} 
                                                onChange={e => setData({...data, trademark : e.value})}
                                                value={optionsTds.filter(key=>key.value===data.trademark)}
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
                                                id="serial_number"
                                                type = 'text' 
                                                placeholder = {TranslateExp(lang, "table.serialNum")} 
                                                onChange={e => setData({...data, serial_number : e.target.value})} 
                                                value={data.serial_number}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.shelfLife")}</Form.Label>
                                            <Form.Control 
                                                id="shelf_life"
                                                type="date" 
                                                onChange={e => setData({...data, shelf_life : e.target.value})}
                                                value={data.shelf_life}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "cruds.data")} 70</Form.Label>
                                            <Form.Control 
                                                id="mode_70_date"
                                                type="date" 
                                                onChange={e => setData({...data, mode_70_date : e.target.value})}
                                                value={data.mode_70_date}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.dist")} 70</Form.Label>
                                            <Select 
                                                id="mode_70_distributor"
                                                placeholder={`${TranslateExp(lang, "table.dist")} 70`} 
                                                filterOption={customFilter}
                                                options={distSelectOptions} 
                                                onChange={e => setData({...data, mode_70_distributor : e.value})}
                                                value={distSelectOptions.filter(key=>key.value===data.mode_70_distributor)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "cruds.data")} 40</Form.Label>
                                            <Form.Control 
                                                id="mode_40_date"
                                                type="date" 
                                                onChange={e => setData({...data, mode_40_date : e.target.value})}
                                                value={data.mode_40_date}
                                            />
                                        </Form.Group>
                                    </Col>
                                   
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.dist")} 40</Form.Label>
                                            <Select 
                                                id="mode_40_distributor"
                                                filterOption={customFilter} 
                                                placeholder={`${TranslateExp(lang, "table.dist")} 40`} 
                                                options={distSelectOptions} 
                                                onChange={e => setData({...data, mode_40_distributor : e.value})}
                                                value={distSelectOptions.filter(key=>key.value===data.mode_40_distributor)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.sender")}</Form.Label>
                                            <Select 
                                                id="sender_company"
                                                filterOption={customFilter} 
                                                placeholder={TranslateExp(lang, "table.sender")} 
                                                options={sdrSelectOptions} 
                                                onChange={e => setData({...data, sender_company : e.value})}
                                                value={sdrSelectOptions.filter(key=>key.value===data.sender_company)}
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
                                                    id='cPriceccv'
                                                    lassName={st.cost}
                                                    onChange={e=>setCPrice({...cPrice, ccv : StrtoNumber(e.target.value)})} 
                                                    value = {NumberToStr(cPrice['ccv'])}
                                                    placeholder = {TranslateExp(lang, "table.customsPr")}
                                                    required
                                                />
                                                </Col>
        
                                                <Col md={4} className='p-0 m-0 text-center' style={{borderRadius: '0 5px 5px 0'}}>
                                                    <Form.Label>{TranslateExp(lang, "cruds.curr")}</Form.Label>
                                                    <Select 
                                                        id='cPriceccy'
                                                        filterOption={customFilter} 
                                                        onChange={e => {setCPrice({...cPrice, ccy : e.value})}} 
                                                        className={st.select} 
                                                        styles={customStyles} 
                                                        options={optionsPrice}
                                                        value={optionsPrice.filter(key=>key.value===cPrice.ccy)}
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
                                                <Form.Label>{TranslateExp(lang, "table.price")} </Form.Label>
                                                <Form.Control
                                                    id='priceccv'
                                                    type = 'text' 
                                                    className={st.cost}
                                                    onChange={e=>setPrice({...price, ccv : StrtoNumber(e.target.value)})} 
                                                    value={NumberToStr(price['ccv'])}
                                                    placeholder = {TranslateExp(lang, "table.price")}
                                                    required
                                                />
                                                </Col>
        
                                                <Col md={4} className='p-0 m-0 text-center' style={{borderRadius: '0 5px 5px 0'}}>
                                                    <Form.Label>{TranslateExp(lang, "cruds.curr")}</Form.Label>
                                                    <Select 
                                                        id='priceccy'
                                                        filterOption={customFilter} 
                                                        onChange={e => {setPrice({...price, ccy : e.value})}} 
                                                        value={optionsPrice.filter(key=>key.value===price.ccy)}
                                                        className={st.select} 
                                                        styles={customStyles} 
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
                                        <Form.Label>{TranslateExp(lang, "table.qty")}</Form.Label>
                                            <Form.Control 
                                                id='quantity'
                                                type = 'text' 
                                                placeholder = {TranslateExp(lang, "table.qty")} 
                                                onChange={e => setData({...data, quantity : e.target.value})} 
                                                value={data.quantity} 
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
                                                id="manufacturer"
                                                filterOption={customFilter}
                                                placeholder={TranslateExp(lang, "table.mf")} 
                                                options={optionsMfs} 
                                                onChange={e => setData({...data, manufacturer : e.value})}
                                                value={optionsMfs.filter(key=>key.value === data.manufacturer)}
                                                required
                                                />
                                        </Form.Group>
                                    </Col>
                                   
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>{TranslateExp(lang, "table.mfc")}</Form.Label>
                                            <Select 
                                                id="manufacturer_country"
                                                placeholder={TranslateExp(lang, "table.mfc")} 
                                                options={optionsCountries} 
                                                onChange={e => setData({...data, manufacturer_country : e.value})}
                                                value={optionsCountries.filter(key=>key.value===data.manufacturer_country)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='my-2'>
                                    <Col><Button onClick={()=>resetAll()} className={"btn btn-block btn-warning"}>{TranslateExp(lang, "content.resetAll")}</Button></Col>
                                    <Col><Button type='submit' disabled={!(currencyListP && currencyListCp)} className={"btn btn-block btn-success"}>{TranslateExp(lang, "content.save")}</Button></Col>
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

export default DRCAdd;