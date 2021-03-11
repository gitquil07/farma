import React, { useState, useEffect} from 'react';
import Select from '../../../components/reactSelect';
import st from '../../../components/dataTable/dataTable.module.scss';
import DataTable from '../../../components/dataTable';
import { distributorsApi } from '../../../services/analyzeDist';
import {distApi} from "../../../services/distService";
import {NumberToStr, CalculateTops, CalculatePercent, GetTops, GetDiffferens, MakeDifferenceObj, MakeObj} from '../../../utils';

function DistributorAnalyze (props) {
    
    const {lang, TranslateExp} = props; 
    const [loading, setLoading] = useState(true);
    const [loadingSelect, setLoadingSelect] = useState(true);
    const [first, setFirst] = useState(true);
    const menu = TranslateExp(lang,"sidebar.Analyzes");
    const title = TranslateExp(lang,"analyzes.dist");
    const [price, setPrice] = useState("usd");
    const optionsPrice = [{value: "usd", label:"$"},{value: "eur", label:"€"},{value: "rub", label:"₽"},{value: "uzs", label: "сум"}];
    const countTops = (props.allInfo)?1:5;
    const [dist, setDist] = useState([]);
    const [show, setShow] = useState(true);
    const [selected, setSelected] = useState([]);
    const [result, setResult] = useState([])
    const [allTotalPrice, setAllTotalPrice] = useState([]);
    const [date,setDate] = useState(props.allInfo?[...props.dateAll]:[{started:'', ended:''}]);
    const [totalPrice, setTotalPrice] = useState({usd:[], percent:[], raiting:[]});
    const [count, setCount] = useState({qty:[], percent:[], raiting:[]});
    const [mnn, setMnn] = useState({qty:[], percent:[], tops:[]});
    const [companies, setCompanies] = useState({qty:[], percent:[], tops:[]});
    const [drugs, setDrugs] = useState({qty:[], percent:[], tops:[]});
    const [df, setDF] = useState({qty:[], percent:[], tops:[]});
    const [tradeMarks, setTradeMarks] = useState({qty:[], percent:[], tops:[]});
    const [manufacturers, setManufacturers] = useState({qty:[], percent:[], tops:[]});
    let selectData = [];
    async function getActiveList(obj){
        const res = await distributorsApi.getActiveList(obj);
        return res.data.data;
    };
    function handleSubmit(){
        setFirst(false);
        setLoading(true);
        setShow(false);
        const DATA = [];
        const Datas = {dataID:[], filterDate: []};
        selected?.map(key =>{
            Datas.dataID.push(key.value);
        })
        Datas.filterDate.push(...date);

        getActiveList(Datas).then(data => {
                data.map((elem) => {
                    DATA.push(elem);
                })
                setResult(add(DATA));
                setLoading(false)
            })
    }
    useEffect(()=>{
        if(props.allInfo){
            setDate(props.dateAll)
        } else {
            getSelectData()
        }
    },[])
    const getSelectData=()=>{
        distApi.getList()
        .then(resp => {
            setDist(resp.data.data)
            setLoadingSelect(false);
        }
        );
    }
    useEffect(()=>{
        const TOTALPRICE = {usd:[], percent:[], raiting:[]}
        const COUNT = {qty:[], percent:[], raiting:[]}
        const MNN = {qty:[], percent:[], tops:[]};
        const DRUGS = {qty:[], percent:[], tops:[]};
        const COMPANIES = {qty:[], percent:[], tops:[]};
        const DF = {qty:[], percent:[], tops:[]};
        const TRADEMARK = {qty:[], percent:[], tops:[]};
        const MANUFACTURERS = {qty:[], percent:[], tops:[]};
     
        date.map((key,i)=>{
            const differenceTotalPrice=[];
            const differencePercentageCol=[];
            const difference = {
                qty:{
                    count:[],
                    mnn:[],
                    companies:[],
                    drugs:[],
                    df:[],
                    trademark:[],
                    manufacturer:[]
                },
                part:{     
                    mnn:[],
                    companies:[],
                    drugs:[],
                    df:[],
                    trademark:[],
                    manufacturer:[]
                }
            }
            if((date.length % 2 == 0 && i % 2 == 1 ) || (date.length % 2 == 1 && i > 0) ){
                differenceTotalPrice.push({
                    HeaderVal:{
                        role:'dAllPrice',
                        id: i-1
                    },
                    Header: ()=>{
                        return(
                            <span className={st.price__th}>
                                {`${TranslateExp(lang, "table.diffTurn")} (${i} - ${i+1})`}
                                <Select 
                                    options={optionsPrice}
                                    disabled={true}
                                    value={optionsPrice.filter(f=>f.value === price)}
                                    onChange={(e)=>setPrice(e.value)}
                                    styles={customStyles}
                                />
                            </span>
                        )
                    },
                    HeaderTitle: `${TranslateExp(lang, "table.diffTurn")} (${i} - ${i+1})`,
                    accessor: `differenceTotalPrice[${i-1}].${price}`,
                    Cell:(props)=>{
                        return GetDiffferens(props.value, st);
                    }
                })
                differencePercentageCol.push({
                    HeaderVal:{
                        role:'dPercent',
                        id: i-1
                    },
                    Header: `${TranslateExp(lang, "table.diffPerc")} % (${i} - ${i+1})`,
                    accessor: `differencePercentageCol[${i-1}]`,
                    Cell:(props)=>{
                        return GetDiffferens(props.value, st)+' %';
                    }
                })
                difference.qty.count.push({
                    HeaderVal:{
                        role:'dCount',
                        id: i-1
                    },
                    Header: `${TranslateExp(lang, "table.diffQty")} (${i} - ${i+1})`,
                    accessor: `difference.qty.count[${i-1}]`,
                    Cell:(props)=>{
                        return GetDiffferens(props.value, st);
                    }
                })
                difference.qty.mnn.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.qty.mnn[${i-1}]`, st))
                difference.qty.companies.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.qty.companies[${i-1}]`, st))
                difference.qty.drugs.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.qty.drugs[${i-1}]`, st))
                difference.qty.df.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.qty.df[${i-1}]`, st))
                difference.qty.trademark.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.qty.trademark[${i-1}]`, st))
                difference.qty.manufacturer.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.qty.manufacturer[${i-1}]`, st))
                difference.part.mnn.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.part.mnn[${i-1}]`, st))
                difference.part.companies.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.part.companies[${i-1}]`, st))
                difference.part.drugs.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.part.drugs[${i-1}]`, st))
                difference.part.df.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.part.df[${i-1}]`, st))
                difference.part.trademark.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.part.trademark[${i-1}]`, st))
                difference.part.manufacturer.push(MakeDifferenceObj(`(${i} - ${i+1})`, `difference.part.manufacturer[${i-1}]`, st))
            }
            
            TOTALPRICE.usd.push(
                {
                Header: ()=>{
                    return(
                        <span className={st.price__th}>
                            {`${TranslateExp(lang, "table.turnOverCompFor")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`}
                            <Select 
                                options={optionsPrice}
                                disabled={true}
                                value={optionsPrice.filter(f=>f.value === price)}
                                onChange={(e)=>setPrice(e.value)}
                                styles={customStyles}
                            />
                        </span>
                    )
                },
                HeaderVal:{
                    per: i+1,
                    role:'price',
                    id: i+1
                },
                HeaderTitle: `${TranslateExp(lang, "table.turnOverCompFor")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`,
                accessor: `totalPrice[${i}].${price}`,
                Cell:(props)=>NumberToStr(Number(props.value).toFixed(2))
                    
            },...differenceTotalPrice)
            TOTALPRICE.percent.push({...MakeObj(`${TranslateExp(lang, "table.percCompIn")} % ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `percentTotalPrice[${i}]`, 2, ' %',true), HeaderVal:{per:i+1}})
            TOTALPRICE.raiting.push({...MakeObj(`${TranslateExp(lang, "table.raiting")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `raitingUSD[${i}]`, 0, '',true),HeaderVal:{per:i+1}})
            COUNT.qty.push({
                HeaderVal:{
                    per: i+1,
                    role:'count',
                    id: i+1
                },
                Header: `${TranslateExp(lang, "table.turnOverCompPac")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`,
                accessor: `qty[${i}]`,
                Cell:(props)=> NumberToStr(props.value)
                    
            },...difference.qty.count)
            COUNT.percent.push({...MakeObj(`${TranslateExp(lang, "table.percCompPac")} % ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `percentQty[${i}]`, 2, ' %',true),'HeaderVal':{per:i+1}})
            COUNT.raiting.push({...MakeObj(`${TranslateExp(lang, "table.raitingPac")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `raitingQTY[${i}]`, 0, '',true),'HeaderVal':{per:i+1}})
            
            MNN.percent.push({...MakeObj(`${TranslateExp(lang, "table.turnOverMnn")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `percentINN[${i}]`, 2, ''),'HeaderVal':{text:TranslateExp(lang, "products.mnn"), per:i+1, group:'mnn'}},...difference.part.mnn);
            MNN.qty.push({...MakeObj(`${TranslateExp(lang, "table.qtyMnn")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `qtyINN[${i}]`, 0, ''),'HeaderVal':{per:i+1, group:'mnn'}},...difference.qty.mnn);
            MNN.tops.push({...GetTops(`${props.allInfo? TranslateExp(lang, "table.lidMnn") : TranslateExp(lang, "table.topMnn")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `topsINN[${i}]`,TranslateExp(lang, "content.noData")),'HeaderVal':{per:i+1, group:'mnn'}});
            
            DRUGS.percent.push({...MakeObj(`${TranslateExp(lang, "table.turnOverDrug")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `percentDrugs[${i}]`, 2, ''),'HeaderVal':{text:TranslateExp(lang, "products.med"),per:i+1, group:'drugs'}},...difference.part.drugs);
            DRUGS.qty.push({...MakeObj(`${TranslateExp(lang, "table.qtyDrug")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `qtyDrugs[${i}]`, 0, ''),'HeaderVal':{per:i+1, group:'drugs'}},...difference.qty.drugs);
            DRUGS.tops.push({...GetTops(`${props.allInfo? TranslateExp(lang, "table.lidDrug") : TranslateExp(lang, "table.topDrugs")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `topsDrugs[${i}]`,TranslateExp(lang, "content.noData")),'HeaderVal':{per:i+1, group:'drugs'}});

            COMPANIES.percent.push({...MakeObj(`${TranslateExp(lang, "table.turnOverComp")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `percentCompanies[${i}]`, 0, ''),'HeaderVal':{group:'companies', text:TranslateExp(lang, "products.comp"), per:i+1}},...difference.part.companies);
            COMPANIES.qty.push({...MakeObj(`${TranslateExp(lang, "home.qtyComp")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `qtyCompanies[${i}]`, 0, ''),'HeaderVal':{group:'companies', per:i+1}},...difference.qty.companies);
            COMPANIES.tops.push({...GetTops(`${props.allInfo? TranslateExp(lang, "table.lidComp") : TranslateExp(lang, "table.topComp")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `topsCompanies[${i}]`,TranslateExp(lang, "content.noData")),'HeaderVal':{group:'companies', per:i+1}});

            DF.percent.push({...MakeObj(`${TranslateExp(lang, "table.turnOverDf")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `percentDF[${i}]`, 2, ''),'HeaderVal':{text:TranslateExp(lang, "products.df"),per:i+1, group:'df'}},...difference.part.df);
            DF.qty.push({...MakeObj(`${TranslateExp(lang, "table.qtyDf")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `qtyDF[${i}]`, 0, ''),'HeaderVal':{per:i+1, group:'df'}},...difference.qty.df); 
            DF.tops.push({...GetTops(`${props.allInfo? TranslateExp(lang, "table.lidDf") : TranslateExp(lang, "table.topDf")}  ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `topsDF[${i}]`,TranslateExp(lang, "content.noData")),'HeaderVal':{per:i+1, group:'df'}});

            TRADEMARK.percent.push({...MakeObj(`${TranslateExp(lang, "table.turnOverTd")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `percentTradeMarks[${i}]`, 2, ''),'HeaderVal':{text:TranslateExp(lang, "products.td"),per:i+1, group:'trademark'}},...difference.part.trademark);
            TRADEMARK.qty.push({...MakeObj(`${TranslateExp(lang, "table.qtyTd")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `qtyTradeMarks[${i}]`, 0, ''),'HeaderVal':{per:i+1, group:'trademark'}},...difference.qty.trademark); 
            TRADEMARK.tops.push({...GetTops(`${props.allInfo? TranslateExp(lang, "table.lidTd") : TranslateExp(lang, "table.topTd")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `topsTradeMarks[${i}]`,TranslateExp(lang, "content.noData")),'HeaderVal':{per:i+1, group:'trademark'}});

            MANUFACTURERS.percent.push({...MakeObj(`${TranslateExp(lang, "table.turnOverMf")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `percentManufacturers[${i}]`, 2, ''),'HeaderVal':{text:TranslateExp(lang, "products.mf"),per:i+1, group:'manufacturer'}},...difference.part.manufacturer);
            MANUFACTURERS.qty.push({...MakeObj(`${TranslateExp(lang, "table.qtyMf")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `qtyManufacturers[${i}]`, 0, ''),'HeaderVal':{per:i+1, group:'manufacturer'}},...difference.qty.manufacturer);  
            MANUFACTURERS.tops.push({...GetTops(`${props.allInfo? TranslateExp(lang, "table.lidMf") : TranslateExp(lang, "table.topMf")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`, `topsManufacturers[${i}]`, 'manufacturer'),'HeaderVal':{per:i+1, group:'manufacturer'}});

            
        })
        setTotalPrice({usd: TOTALPRICE.usd, percent: TOTALPRICE.percent, raiting: TOTALPRICE.raiting})
        setCount({qty:COUNT.qty, percent: COUNT.percent, raiting: COUNT.raiting})
        setMnn({qty:MNN.qty, percent: MNN.percent, tops:MNN.tops});
        setCompanies({qty:COMPANIES.qty, percent: COMPANIES.percent, tops:COMPANIES.tops});
        setDrugs({qty:DRUGS.qty, percent: DRUGS.percent, tops:DRUGS.tops});
        setDF({qty:DF.qty, percent: DF.percent, tops:DF.tops});
        setTradeMarks({qty:TRADEMARK.qty, percent: TRADEMARK.percent, tops:TRADEMARK.tops});
        setManufacturers({qty:MANUFACTURERS.qty, percent: MANUFACTURERS.percent, tops:MANUFACTURERS.tops});
        
    },[price, date, lang])
    const customStyles = {
        container: (provided) => ({
            ...provided,
            width: '85px',
            marginLeft: '8px',
            fontSize: '14px',
            fontWeight: 500
        })
    };

    const add=(respData)=>{
        let LastDATA = [];

        respData?.map((key, k) => {
            let TempDATA = null;  

            date.map((elem,i) => {
                let element = key[`filterBy_${i}`];
                let TCPP = element.TotalCommonPerPrice;
                let TCP = element.TotalCommonPrice;
                

                if(i > 0){
                    if(TCP.usd){
                        setAllTotalPrice([...allTotalPrice, {'allTotalPrice':{usd: TCP.usd, uzs: TCP.uzs, eur: TCP.eur, rub: TCP.rub}, 'allCount':TCP.qty}])
                    } else {
                        setAllTotalPrice([...allTotalPrice, {'allTotalPrice':{usd: 0, uzs: 0, eur: 0, rub: 0}, 'allCount':0}])
                    }
                    if(TCPP.usd){
                        TempDATA = {
                            ...TempDATA,
                                'totalPrice': [...TempDATA.totalPrice, {usd: TCPP.usd, uzs: TCPP.uzs, eur: TCPP.eur, rub: TCPP.rub}],
                                'percentTotalPrice': [...TempDATA.percentTotalPrice, CalculatePercent(TCPP.usd, TCP.usd)],
                                'qty': [...TempDATA.qty, TCPP.qty],
                                'percentQty': [...TempDATA.percentQty, CalculatePercent(TCPP.qty,TCP.qty)],
                                'raitingUSD':[...TempDATA.raitingUSD, element.rankByUSD+1],
                                'raitingQTY':[...TempDATA.raitingQTY, element.rankByQty+1],
    
                                'qtyINN' :[ ...TempDATA.qtyINN, element.totalDrugInn.length],
                                'percentINN':[ ...TempDATA.percentINN, TCPP.usd/element.totalDrugInn.length],
                                'topsINN':[ ...TempDATA.topsINN, CalculateTops(element.totalDrugInn, TCPP.usd, countTops)],

                                'qtyCompanies' :[ ...TempDATA.qtyCompanies, element.filterByCompanies.length],
                                'percentCompanies':[ ...TempDATA.percentCompanies, TCPP.usd/element.filterByCompanies.length],
                                'topsCompanies':[ ...TempDATA.topsCompanies, CalculateTops(element.filterByCompanies, TCPP.usd, countTops)],
    
                                'qtyDrugs':[ ...TempDATA.qtyDrugs, element.totalDrugNames.length],
                                'percentDrugs':[ ...TempDATA.percentDrugs, TCPP.usd/element.totalDrugNames.length],
                                'topsDrugs':[ ...TempDATA.topsDrugs, CalculateTops(element.totalDrugNames, TCPP.usd, countTops)],
    
                                'qtyDF':[ ...TempDATA.qtyDF, element.totalDrugForms.length],
                                'percentDF':[ ...TempDATA.percentDF, TCPP.usd/element.totalDrugForms.length],
                                'topsDF':[ ...TempDATA.topsDF, CalculateTops(element.totalDrugForms, TCPP.usd, countTops)],
    
                                'qtyTradeMarks':[ ...TempDATA.qtyTradeMarks, element.totalTrademarks_.length],
                                'percentTradeMarks':[ ...TempDATA.percentTradeMarks, TCPP.usd/element.totalTrademarks_.length],
                                'topsTradeMarks':[ ...TempDATA.topsTradeMarks, CalculateTops(element.totalTrademarks_, TCPP.usd, countTops)],
    
                                'qtyManufacturers':[ ...TempDATA.qtyManufacturers, element.filterByManufacturers.length],
                                'percentManufacturers':[ ...TempDATA.percentManufacturers, TCPP.usd/element.filterByManufacturers.length],
                                'topsManufacturers':[ ...TempDATA.topsManufacturers, CalculateTops(element.filterByManufacturers, TCPP.usd, countTops)],
                        }
                    } else {
                        TempDATA = {
                            ...TempDATA,
                                'totalPrice': [...TempDATA.totalPrice, {usd: 0, uzs: 0, eur: 0, rub: 0}],
                                'percentTotalPrice': [...TempDATA.percentTotalPrice, 0],
                                'qty': [...TempDATA.qty, 0],
                                'percentQty': [...TempDATA.percentQty, 0],
                                'raitingUSD':[...TempDATA.raitingUSD, 0],
                                'raitingQTY':[...TempDATA.raitingQTY, 0],
    
                                'qtyINN' :[ ...TempDATA.qtyINN, 0],
                                'percentINN':[ ...TempDATA.percentINN, 0],
                                'topsINN':[ ...TempDATA.topsINN, ''],

                                'qtyCompanies' :[ ...TempDATA.qtyCompanies, 0],
                                'percentCompanies':[ ...TempDATA.percentCompanies, 0],
                                'topsCompanies':[ ...TempDATA.topsCompanies, ''],
    
                                'qtyDrugs':[ ...TempDATA.qtyDrugs, 0],
                                'percentDrugs':[ ...TempDATA.percentDrugs, 0],
                                'topsDrugs':[ ...TempDATA.topsDrugs, ''],
    
                                'qtyDF':[ ...TempDATA.qtyDF, 0],
                                'percentDF':[ ...TempDATA.percentDF, 0],
                                'topsDF':[ ...TempDATA.topsDF, ''],
    
                                'qtyTradeMarks':[ ...TempDATA.qtyTradeMarks, 0],
                                'percentTradeMarks':[ ...TempDATA.percentTradeMarks, 0],
                                'topsTradeMarks':[ ...TempDATA.topsTradeMarks, ''],
    
                                'qtyManufacturers':[ ...TempDATA.qtyManufacturers, 0],
                                'percentManufacturers':[ ...TempDATA.percentManufacturers, 0],
                                'topsManufacturers':[ ...TempDATA.topsManufacturers, ''],
                        }
                    }
                    
                } else {
                    if(TCP.usd){
                        setAllTotalPrice([{'allTotalPrice':{usd: TCP.usd, uzs: TCP.uzs, eur: TCP.eur, rub: TCP.rub}, 'allCount':TCP.qty}])
                    } else {
                        setAllTotalPrice([{'allTotalPrice':{usd: 0, uzs: 0, eur: 0, rub: 0}, 'allCount':0}])
                    }
                    if(TCPP.usd){
                        TempDATA = {
                            'name_uz': key.name_uz,
                            'totalPrice': [{usd: TCPP.usd, uzs: TCPP.uzs, eur: TCPP.eur, rub: TCPP.rub}],
                            'percentTotalPrice': [CalculatePercent(TCPP.usd, TCP.usd)],
                            'raitingUSD':[element.rankByUSD+1],
                            'raitingQTY':[element.rankByQty+1],
                            'qty': [TCPP.qty],
                            'percentQty': [CalculatePercent(TCPP.qty,TCP.qty)],

                            'qtyINN' :[element.totalDrugInn.length],
                            'percentINN':[TCPP.usd/element.totalDrugInn.length],
                            'topsINN':[CalculateTops(element.totalDrugInn, TCPP.usd, countTops)],

                            'qtyCompanies' :[element.filterByCompanies.length],
                            'percentCompanies':[TCPP.usd/element.filterByCompanies.length],
                            'topsCompanies':[CalculateTops(element.filterByCompanies, TCPP.usd, countTops)],

                            'qtyDrugs':[element.totalDrugNames.length],
                            'percentDrugs':[TCPP.usd/element.totalDrugNames.length],
                            'topsDrugs':[CalculateTops(element.totalDrugNames, TCPP.usd, countTops)],

                            'qtyDF':[element.totalDrugForms.length],
                            'percentDF':[TCPP.usd/element.totalDrugForms.length],
                            'topsDF':[CalculateTops(element.totalDrugForms, TCPP.usd, countTops)],

                            'qtyTradeMarks':[element.totalTrademarks_.length],
                            'percentTradeMarks':[TCPP.usd/element.totalTrademarks_.length],
                            'topsTradeMarks':[CalculateTops(element.totalTrademarks_, TCPP.usd, countTops)],

                            'qtyManufacturers':[element.filterByManufacturers.length],
                            'percentManufacturers':[TCPP.usd/element.filterByManufacturers.length],
                            'topsManufacturers':[CalculateTops(element.filterByManufacturers, TCPP.usd, countTops)],
                        };
                    } else {
                        TempDATA = {
                            'name_uz': key.name_uz,
                            'totalPrice': [{usd: 0, uzs: 0, eur: 0, rub: 0}],
                            'percentTotalPrice': [0],
                            'raitingUSD':[0],
                            'raitingQTY':[0],
                            'qty': [0],
                            'percentQty': [0],

                            'qtyINN' :[0],
                            'percentINN':[0],
                            'topsINN':[''],

                            'qtyCompanies' :[0],
                            'percentCompanies':[0],
                            'topsCompanies':[''],

                            'qtyDrugs':[0],
                            'percentDrugs':[0],
                            'topsDrugs':[''],

                            'qtyDF':[0],
                            'percentDF':[0],
                            'topsDF':[''],

                            'qtyTradeMarks':[0],
                            'percentTradeMarks':[0],
                            'topsTradeMarks':[''],

                            'qtyManufacturers':[0],
                            'percentManufacturers':[0],
                            'topsManufacturers':[''],
                        };
                    }
                        
                }
            })
            LastDATA.push(TempDATA);  
        })   
        return percentAdd(LastDATA);
    }
    const percentAdd = (respData) => {
        let DATA = [];
        respData.map(element => {
            const difference = {
                qty:{
                    count:[],
                    mnn:[],
                    companies:[],
                    drugs:[],
                    df:[],
                    trademark:[],
                    manufacturer:[]
                },
                part:{     
                    mnn:[],
                    companies:[],
                    drugs:[],
                    df:[],
                    trademark:[],
                    manufacturer:[]
                }
            }
            const differenceTotalPrice =[];
            const differencePercentageCol=[];
            for (let i = 0; i < date.length; i++) {
                
                if(i>0){
                    differenceTotalPrice.push({
                        uzs: element.totalPrice[i].uzs - element.totalPrice[i-1].uzs,
                        usd: element.totalPrice[i].usd - element.totalPrice[i-1].usd,
                        rub: element.totalPrice[i].rub - element.totalPrice[i-1].rub,
                        eur: element.totalPrice[i].eur - element.totalPrice[i-1].eur
                    });
                    difference.qty.mnn.push(element.qtyINN[i] - element.qtyINN[i-1]);
                    difference.qty.companies.push(element.qtyCompanies[i] - element.qtyCompanies[i-1]);
                    difference.qty.drugs.push(element.qtyDrugs[i] - element.qtyDrugs[i-1]);
                    difference.qty.df.push(element.qtyDF[i] - element.qtyDF[i-1]);
                    difference.qty.trademark.push(element.qtyTradeMarks[i] - element.qtyTradeMarks[i-1]);
                    difference.qty.manufacturer.push(element.qtyManufacturers[i] - element.qtyManufacturers[i-1]);
                    difference.qty.count.push(element.qty[i] - element.qty[i-1]);
                    difference.part.mnn.push(element.percentINN[i]-element.percentINN[i-1]);
                    difference.part.companies.push(element.percentCompanies[i]-element.percentCompanies[i-1]);
                    difference.part.drugs.push(element.percentDrugs[i]-element.percentDrugs[i-1]);
                    difference.part.df.push(element.percentDF[i]-element.percentDF[i-1]);
                    difference.part.trademark.push(element.percentTradeMarks[i]-element.percentTradeMarks[i-1]);
                    difference.part.manufacturer.push(element.percentManufacturers[i]-element.percentManufacturers[i-1]);
                    differencePercentageCol.push(element.percentTotalPrice[i] - element.percentTotalPrice[i-1]);
                }

            }
            DATA.push({...element , differenceTotalPrice, differencePercentageCol, difference});
            
        })
        return DATA;
    }

    const columns = [
        {
            HeaderVal:{
                role:'name'
            },
            Header: TranslateExp(lang,'table.name'),
            accessor: 'name_uz',
        },
        ...totalPrice.usd,
        ...totalPrice.percent,
        ...totalPrice.raiting,
        ...count.percent,
        ...count.qty,
        ...count.raiting,
        ...mnn.percent,
        ...mnn.qty,
        ...mnn.tops,
        ...companies.percent,
        ...companies.qty,
        ...companies.tops,
        ...drugs.percent,
        ...drugs.qty,
        ...drugs.tops,
        ...df.percent,
        ...df.qty,
        ...df.tops,
        ...tradeMarks.percent,
        ...tradeMarks.qty,
        ...tradeMarks.tops,
        ...manufacturers.percent,
        ...manufacturers.qty,
        ...manufacturers.tops,
    ];

    const RebootAll=()=>{
        const val = window.confirm(`${TranslateExp(lang, "content.rebootAllTitle")}?`);
        if(val)
        {
           if(props.allInfo)props.setFirstAll(true);
           if(props.allInfo)props.setDateAll([{started:'', ended:''}])
            setDate([{started:'', ended:''}])
            setResult([]);
            setAllTotalPrice([]);
            setLoading(true);
            setFirst(true);
            setSelected([])
            selectData=[];
        }
    }
    selectData = dist.map(item => ({value: item._id, label: item.name_uz}));

    return(
        <>
            <DataTable 
                {...props}
                RebootAll={RebootAll}
                menu={menu} 
                selected={selected}
                title={title}
                date={date}
                setDate={setDate}
                loading={loading} 
                loadingSelect={loadingSelect} 
                first={first} 
                showTable={show} 
                name={true} 
                selected={selected}
                setSelected={setSelected}
                handleSubmit={handleSubmit} 
                optionSelectedData={selectData} 
                price={price} 
                columns={columns} 
                allTotalPrice={allTotalPrice}
                data ={result} 
            />
        </>
    );
}

export default DistributorAnalyze;