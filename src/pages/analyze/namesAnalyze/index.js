import React, { useState, useEffect} from 'react';
import Select from '../../../components/reactSelect';
import st from '../../../components/dataTable/dataTable.module.scss';
import DataTable from '../../../components/dataTable';
import { namesApi } from '../../../services/analyzeNames';
import {medApi} from "../../../services/medService";
import {NumberToStr, getId, GetDiffferens} from '../../../utils';
function NamesAnalyze (props) {
    const {lang, TranslateExp} = props;
    const [loading, setLoading] = useState(true);
    const [loadingSelect, setLoadingSelect] = useState(true);
    const [first, setFirst] = useState(true);
    const menu = TranslateExp(lang, "sidebar.Analyzes");
    const title = TranslateExp(lang, "analyzes.names");
    const [price, setPrice] = useState("usd");
    const optionsPrice = [{value: "usd", label:"$"},{value: "eur", label:"€"},{value: "rub", label:"₽"}];
    const [drugs, setDrugs] = useState([]);
    const [show, setShow] = useState(true);
    const [selected, setSelected] = useState([]);
    const [result, setResult] = useState([])
    const [allTotalPrice, setAllTotalPrice] = useState([]);
    const [date,setDate] = useState([{started:'', ended:''}]);
    const [totalPriceCol, setTotalPriceCol] = useState([])
    const [totalPriceSumCol, setTotalPriceSumCol] = useState([])
    const [percentagesCol, setPercentagesCol] = useState([])
    const [countsCol, setCountsCol] = useState([]);
    let selectData = [];

    async function getActiveList(obj){
        const res = await namesApi.getActiveList(obj);
        return res.data.data;
    };
    function handleSubmit(){
        setFirst(false);
        setLoading(true);
        setShow(false);
        const DATA = [];
        const Datas = {drugID:[], filterDate: []};
        selected?.map(key =>{
            Datas.drugID.push(key.value);
        })
        Datas.filterDate.push(...date);
        getActiveList(Datas).then(data => {
            data.map((elem) => {
                DATA.push(elem);
            })
            console.log(DATA);
            setResult(add(DATA));
            setLoading(false)
        })
    }
    useEffect(()=> getSelectData(),[])
    const getSelectData=()=>{
        medApi.getList().then(resp =>{
            setDrugs(resp.data.data);
            setLoadingSelect(false);
        });
    }
    useEffect(()=>{
        const totalPrice =[]; 
        const totalPriceSum =[]; 
        const percentageCol = [];
        const countCol = [];

        date.map((key,i)=>{
            const differenceTotalPrice=[];
            const differenceTotalSumPrice=[];
            const differencePercentageCol=[];
            const differenceCountCol = [];
            if((date.length % 2 == 0 && i % 2 == 1 ) || (date.length % 2 == 1 && i > 0) ){
                differenceTotalSumPrice.push({
                    HeaderVal:{
                        role:'dAllSum',
                        id: i-1
                    },
                    Header: `${TranslateExp(lang, "table.diffTurnInSum")} (${i} - ${i+1})`,
                    accessor: `differenceTotalPrice[${i-1}].uzs`,
                    Cell:(props)=>{
                        if(props.value){
                            return (
                                <div>
                                    <i className={` ${(props.value > 0)? 
                                                    `${st.green} fa-arrow-up`:`${st.red} fa-arrow-down`} fas`}/> 
                                    {NumberToStr(Number(props.value).toFixed(2))}
                                </div>
                            )
                        } else {
                            return <div>
                                <i className={`${st.blue} fas fa-equals`}/>
                                {(0).toFixed(2)}
                            </div>
                        }
                    }
                })
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
                        return (
                            <>
                                {GetDiffferens(props.value, st)} %
                            </>
                        )
                    }
                })
                differenceCountCol.push({
                    HeaderVal:{
                        role:'dCount',
                        id: i-1
                    },
                    Header: `${TranslateExp(lang, "table.diffQty")} (${i} - ${i+1})`,
                    accessor: `differenceCountCol[${i-1}]`,
                    Cell:(props)=>{
                        return GetDiffferens(props.value, st);
                    }
                })
            }
            totalPrice.push(
                {
                Header: ()=>{
                    return(
                        <span className={st.price__th}>
                            {`${TranslateExp(lang, "table.turnOverFor")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`}
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
                    per:i+1,
                    'id': i+1,
                    'role': 'price'
                },
                HeaderTitle: `${TranslateExp(lang, "table.turnOverFor")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`,
                accessor: `totalPrice[${i}].${price}`,
                Cell:(props)=>{
                    if(props.value){
                        return NumberToStr(Number(props.value).toFixed(2))
                    } else {
                        return (0).toFixed(2)
                    }
                },
            },
            ...differenceTotalPrice            
            )
            totalPriceSum.push({   
                HeaderVal:{
                    per:i+1,
                    'id': i+1,
                    'role': 'sum'
                },
                Header: `${TranslateExp(lang, "table.turnOverInSum")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`,
                accessor: `totalPrice[${i}].uzs`,
                Cell:(props)=>{
                    if(props.value){
                        return NumberToStr(Number(props.value).toFixed(2))
                    } else {
                        return (0).toFixed(2)
                    }
                }
            },
            ...differenceTotalSumPrice
            )
            percentageCol.push({
                HeaderVal:{per:i+1},
                Header: `${TranslateExp(lang, "table.percIn")} % ${i+1}-${TranslateExp(lang, "content.periodShort")}.`,
                accessor: `percentage[${i}]`,
                Cell:(props)=>{
                    if(props.value){
                        return NumberToStr(Number(props.value).toFixed(2))+' %';
                    } else {
                        return (0).toFixed(2) + ' %'
                    }
                    
                }
            },
            ...differencePercentageCol
            )
            countCol.push({
                HeaderVal:{
                    per:i+1,
                    'id': i+1,
                    'role': 'count'
                },
                Header: `${TranslateExp(lang, "table.qty")} ${i+1}-${TranslateExp(lang, "content.periodShort")}.`,
                accessor: `qty[${i}]`,
                Cell:(props)=>{
                    if(props.value){
                        return NumberToStr(props.value)
                    } else {
                        return (0)
                    }
                }
            },
            ...differenceCountCol
            )
        })
        setCountsCol(countCol);
        setPercentagesCol(percentageCol);
        setTotalPriceSumCol(totalPriceSum);
        setTotalPriceCol(totalPrice);

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
        let AllDATA = [];

        respData?.map((key, k) => {
            const TempDATA = [];    
            let sumLength = 0;
            date.forEach((elem,i) => {
                sumLength = sumLength + key[`filterBy_${i}`].length
            });
            if(sumLength > 0){
                date.map((elem,i) => {
                    if(i > 0){
                        key[`filterBy_${i}`].map((element, ll)=>{
                            let bool = true;
                            for (let index = 0; index < TempDATA.length; index++) {
                                if(TempDATA[index].id?.drug_name === element._id.drug_name &&
                                TempDATA[index].id?.sender_company === element._id.sender_company &&
                                TempDATA[index].id?.mode_40_distributor === element._id.mode_40_distributor){
                                    bool = false;
                                    let tempTotalPrice = TempDATA[index].totalPrice;
                                    tempTotalPrice[i] = element.totalPrice;
                                    let tempQty = TempDATA[index].qty;
                                    tempQty[i] = element.qty;
                                    TempDATA[index] = {
                                        ...TempDATA[index],
                                        'totalPrice':tempTotalPrice,
                                        'qty': tempQty
                                    }
                                    break;
                                }
                            }
                            if(bool){
                                if(TempDATA[0].totalPrice[0].usd || ll){
                                    let qty = [0, 0, 0, 0]; 
                                    let price =  [{usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}];
                                    price[i] = element.totalPrice;
                                    qty[i] = element.qty;
                                    TempDATA.push({
                                        'name_uz': key.name_uz,
                                        'drug_farm_group':key.drug_farm_group, 
                                        'drug_form': key.drug_form,
                                        'drug_inn': key.drug_inn,
                                        'drug_ts_group': key.drug_ts_group,
                                        'drug_type' : key.drug_type,
                                        'manufacturer': element.manufacturer,
                                        'manufacturer_country': element.manufacturer_country,
                                        'trademark': element.trademark,
                                        'qty': qty, 
                                        'totalPrice':price,
                                        'distributor40': element.distributor40,
                                        'sender_company':element.sender_company,
                                        'id':element._id
                                    });
                                } else{
                                    for (let index = 0; index < TempDATA.length; index++) {                                    
                                        let tempTotalPrice = TempDATA[index].totalPrice;
                                        tempTotalPrice[i] = element.totalPrice;
                                        let tempQty = TempDATA[index].qty;
                                        tempQty[i] = element.qty;
                                        TempDATA[index] = {
                                            ...TempDATA[index],
                                            'manufacturer': element.manufacturer,
                                            'manufacturer_country': element.manufacturer_country,
                                            'trademark': element.trademark,
                                            'totalPrice':tempTotalPrice,
                                            'qty': tempQty,
                                            'distributor40': element.distributor40,
                                            'sender_company':element.sender_company,
                                            'id':element._id,
                                            
                                        }
                                    }
                                }
                            }
                        })
                    } else {
                        let element = key[`filterBy_0`]
                        if(element.length > 0){
                            element.map(kk=>{
                                TempDATA.push({
                                    'name_uz': key.name_uz,
                                    'drug_farm_group':key.drug_farm_group, 
                                    'drug_form': key.drug_form,
                                    'drug_inn': key.drug_inn,
                                    'drug_ts_group': key.drug_ts_group,
                                    'drug_type' : key.drug_type,
                                    'manufacturer': kk.manufacturer,
                                    'manufacturer_country': kk.manufacturer_country,
                                    'trademark': kk.trademark,
                                    'qty':[kk.qty, 0, 0, 0], 
                                    'totalPrice':[kk.totalPrice, {usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}],
                                    'distributor40': kk.distributor40,
                                    'sender_company':kk.sender_company,
                                    'id':kk._id
                                });
                            })
                        } else {
                            TempDATA.push({
                                'name_uz': key.name_uz,
                                'drug_farm_group':key.drug_farm_group, 
                                'drug_form': key.drug_form,
                                'drug_inn': key.drug_inn,
                                'drug_ts_group': key.drug_ts_group,
                                'drug_type' : key.drug_type,
                                'manufacturer':TranslateExp(lang, "content.noData"),
                                'manufacturer_country':TranslateExp(lang, "content.noData"),
                                'trademark': TranslateExp(lang, "content.noData"),
                                'qty':[0, 0, 0, 0], 
                                'totalPrice':[{usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}],
                                'distributor40': TranslateExp(lang, "content.noData"),
                                'sender_company':TranslateExp(lang, "content.noData"),
                                'id':{}
                            });
                        }
                        
                        
                    }
                })
            } 
            else {
                TempDATA.push({
                    'name_uz': key.name_uz,
                    'drug_farm_group':key.drug_farm_group, 
                    'drug_form': key.drug_form,
                    'drug_inn': key.drug_inn,
                    'drug_ts_group': key.drug_ts_group,
                    'drug_type' : key.drug_type,
                    'manufacturer':TranslateExp(lang, "content.noData"),
                    'manufacturer_country':TranslateExp(lang, "content.noData"),
                    'trademark': TranslateExp(lang, "content.noData"),
                    'qty':[0, 0, 0, 0], 
                    'totalPrice':[{usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}, {usd: 0, eur: 0, uzs: 0, rub: 0}],
                    'distributor40': TranslateExp(lang, "content.noData"),
                    'sender_company':TranslateExp(lang, "content.noData"),
                    'id':{}
                });
            }
            LastDATA.push(...TempDATA);  
        })
        date.map((s,i) => {
            let ALLTotalPrice = {usd: 0, uzs: 0, eur: 0, rub: 0};
            let ALLCount = 0;
            LastDATA.map((key)=>{
                ALLTotalPrice.usd += +(key.totalPrice[i].usd);
                ALLTotalPrice.eur += +(key.totalPrice[i].eur);
                ALLTotalPrice.rub += +(key.totalPrice[i].rub);
                ALLTotalPrice.uzs += +(key.totalPrice[i].uzs);
                ALLCount += (key.qty[i]);
            })
            AllDATA.push({'allTotalPrice':ALLTotalPrice, 'allCount':ALLCount});
        });
        setAllTotalPrice(AllDATA);        
        return percentAdd(LastDATA, AllDATA);
    }
    const percentAdd = (respData, allTotalPrice) => {
        let DATA = [];
        let returnData =[];
        let rating =[];
        respData.map(element => {
            const percentage = [];
            const differenceTotalPrice =[];
            const differencePercentageCol=[];
            const differenceCountCol=[];
            for (let i = 0; i < date.length; i++) {
                if(element.totalPrice[i]?.usd){
                    percentage.push(
                        ((element.totalPrice[i].usd*100)/allTotalPrice[i].allTotalPrice.usd).toFixed(2)
                        );
                } else {
                    percentage.push(0);
                }
                if(i){
                    differenceTotalPrice.push({
                        uzs: element.totalPrice[i].uzs - element.totalPrice[i-1].uzs,
                        usd: element.totalPrice[i].usd - element.totalPrice[i-1].usd,
                        rub: element.totalPrice[i].rub - element.totalPrice[i-1].rub,
                        eur: element.totalPrice[i].eur - element.totalPrice[i-1].eur
                    });
                    differencePercentageCol.push((percentage[i] - percentage[i-1]))
                    differenceCountCol.push(element.qty[i] - element.qty[i-1]);
                }
            }
            DATA.push({...element, percentage , differenceTotalPrice, differenceCountCol, differencePercentageCol});
            
        })
        DATA.map(f => rating.push({'percentage': f.percentage, 'id': f._id}));
        rating.sort(function(b, a){return a.percentage - b.percentage});
        DATA.map(f => returnData.push({...f, 'rating': getId(rating, f._id)}))
        return returnData;
    }

    const columns = [
        {
            HeaderVal:{
                role : 'name'
            },
            Header: TranslateExp(lang, "table.name"),
            accessor: 'name_uz',
        },
        ...totalPriceCol,
        ...totalPriceSumCol,
        ...percentagesCol,
        ...countsCol,        
        // {
        //     Header: 'Рейтинг',
        //     accessor: 'rating' // рейтинг надо изменить
        // },
        {
            Header: TranslateExp(lang, "products.td"),
            accessor: 'trademark',
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "products.mnn"),
            accessor: 'drug_inn'
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "table.dt"),
            accessor: 'drug_type'
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "table.df"),
            accessor: 'drug_form'
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "table.mf"),
            accessor:'manufacturer',
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "table.mfc"),
            accessor:'manufacturer_country',
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "table.sender"),
            accessor : 'sender_company'
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "table.dist"),
            accessor : 'distributor40'
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "products.dfg"),
            accessor: 'drug_farm_group'
        },
        {
            HeaderVal:{per:0},
            Header: TranslateExp(lang, "products.tpg"),
            accessor: 'drug_ts_group'
        }
    ];

    const RebootAll=()=>{
        const val = window.confirm(`${TranslateExp(lang, "content.rebootAllTitle")}?`);
        if(val)
        {
            setDate([{started:'', ended:''}])
            setResult([]);
            setAllTotalPrice([]);
            setLoading(true);
            setFirst(true);
            setSelected([])
            selectData=[];
        }
    }
    selectData = drugs.map(item => ({value: item._id, label: item.name_uz}))

    return(
        <>
            <DataTable
                {...props}
                menu={menu} 
                RebootAll={RebootAll}
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

export default NamesAnalyze;