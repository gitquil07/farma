import React,{useEffect, useState} from 'react';
import st from './home.module.scss';
import ft from '../cruds/crud.module.scss';
import {NumberToStr} from '../../utils';
import {homeApi} from '../../services/homeService';
import {Bar} from 'react-chartjs-2';
import {Tabs, Tab} from 'react-bootstrap';
import Loading from '../../components/loading';
import { NewsApi } from '../../services/newsService';
import axiosInstance from "../../services/api";

function Home(props) {

    const  {lang, TranslateExp} = props, 
          [loading, setLoading] = useState(true),
          [label, setLabel] = useState([]),
          dateToday = new Date(),
          [allData, setAllData] = useState([]),
          [data3, setData3] = useState([]),
          [data6, setData6] = useState([]),
          [data12, setData12] = useState([]),
          [loadNews, setLoadNews] = useState(true),
          [page, setPage] = useState(1),
          [totalPages, setTotalPages] = useState(1),
          [limit, setLimit] = useState(10),
          [newsData, setNewsData] = useState([]),
          [imag,setImag] = useState([]),
          [totals, setTotals] = useState(null);


    let date = {},
        date3 = {},
        date6 = {},
        date12 = {};

    async function getAllList(){
        const res = await homeApi.getAllList();
        return res.data.data;
    };

    async function getParams (obj) {
        const res = await homeApi.getList(obj);
        return res.data.data;
    };

    async function getNews (obj) {
        console.log('getnews');
        const res = await NewsApi.getList(obj);
        setTotalPages(res.data.totalPages);
        return res.data.data;
    };

    useEffect(() => {

        const startFirstDate = "2010-11-10",
              Data3 = new Date(),
              Data6 = new Date(),
              Data12 = new Date();

        Data3.setMonth(-2);
        Data6.setMonth(-5);
        Data12.setMonth(-11);

        getAllList().then(res=>{
            setTotals(res)
        })

        date = {
            "started": startFirstDate, 
            "ended": `${dateToday.getFullYear()}-${(dateToday.getMonth()<10)? '0' + (dateToday.getMonth()+1) : dateToday.getMonth()}-${(dateToday.getDate()<10)? '0' + dateToday.getDate() : dateToday.getDate()}`
        };

        date3 = {
            "started": `${Data3.getFullYear()}-${(Data3.getMonth()<10)? '0' + (Data3.getMonth()+1) : Data3.getMonth()}-${(Data3.getDate()<10)? '0' + Data3.getDate() : Data3.getDate()}`, 
            "ended": `${dateToday.getFullYear()}-${(dateToday.getMonth()<10)? '0' + (dateToday.getMonth()+1) : dateToday.getMonth()}-${(dateToday.getDate()<10)? '0' + dateToday.getDate() : dateToday.getDate()}`
        };
        
        date6 = {
            "started": `${Data6.getFullYear()}-${(Data6.getMonth()<10)? '0' + (Data6.getMonth()+1) : Data6.getMonth()}-${(Data6.getDate()<10)? '0' + Data6.getDate() : Data6.getDate()}`, 
            "ended": `${dateToday.getFullYear()}-${(dateToday.getMonth()<10)? '0' + (dateToday.getMonth()+1) : dateToday.getMonth()}-${(dateToday.getDate()<10)? '0' + dateToday.getDate() : dateToday.getDate()}`
        };

        date12 = {
            "started": `${Data12.getFullYear()}-${(Data12.getMonth()<10)? '0' + (Data12.getMonth()+1) : Data12.getMonth()}-${(Data12.getDate()<10)? '0' + Data12.getDate() : Data12.getDate()}`, 
            "ended": `${dateToday.getFullYear()}-${(dateToday.getMonth()<10)? '0' + (dateToday.getMonth()+1) : dateToday.getMonth()}-${(dateToday.getDate()<10)? '0' + dateToday.getDate() : dateToday.getDate()}`
        };

        setLabel([`${date3.started} \u2013 ${date3.ended}`, `${date6.started} \u2013 ${date6.ended}`, `${date12.started} \u2013 ${date12.ended}`]);

        getParams(date).then(
            date => {
                const DATA = [];
                date.forEach(elem => DATA.push(elem))
                setAllData(DATA);
            }
        );

        getParams(date3).then(
            date => {
                const DATA = [];
                date.forEach(elem => DATA.push(elem))
                setData3(DATA);
            }
            
        );

        getParams(date6).then(
            date => {
                const DATA = [];
                date.forEach(elem => DATA.push(elem))
                setData6(DATA);
            }
        );

        getParams(date12).then(
            date => {
                const DATA = [];
                date.forEach(elem => DATA.push(elem))
                setData12(DATA);
                setLoading(false);
            }
        );

        getNews({
            page: 1,
            limit: limit
        }).then(data => {
            setNewsData(data);
            setLoadNews(false);

        });

    }, []);

    useEffect(() => {
        const ids = newsData.map(nD => nD._id);
        console.dir(axiosInstance);
        Promise.all(ids.map(id => NewsApi.getImg(id))).then(blobs => blobs.map(blob => URL.createObjectURL(blob.data))).then(urls => setImag(urls));
    }, [newsData]);


    const state3 = {
        labels: [`${label[0]}`],
        datasets: [
            {
                label: TranslateExp(lang, "home.qtyDrugs"),
                backgroundColor: '#3A7AFE',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 0,
                data: [data3[0]?.totalDrugs]
            },
            {
                label: TranslateExp(lang, "home.qtyMf"),
                backgroundColor: '#6fb61b',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data3[0]?.totalManufacturer]
            },
            {
                label: TranslateExp(lang, "home.qtyDist"),
                backgroundColor: '#db8c00',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data3[0]?.totalDistributor]
            },
            {
                label: TranslateExp(lang, "home.qtyTd"),
                backgroundColor: '#ffe000',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data3[0]?.totalTrademark]
            },
            {
                label: TranslateExp(lang, "home.qtyComp"),
                backgroundColor: '#ff1717',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data3[0]?.totalCompanies]
            }
        ]
    };

    const state6 = {
        labels: [`${label[1]}`],
        datasets: [
            {
                label: TranslateExp(lang, "home.qtyDrugs"),
                backgroundColor: '#3A7AFE',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 0,
                data: [data6[0]?.totalDrugs]
            },
            {
                label: TranslateExp(lang, "home.qtyMf"),
                backgroundColor: '#6fb61b',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data6[0]?.totalManufacturer]
            },
            {
                label: TranslateExp(lang, "home.qtyDist"),
                backgroundColor: '#db8c00',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data6[0]?.totalDistributor]
            },
            {
                label: TranslateExp(lang, "home.qtyTd"),
                backgroundColor: '#ffe000',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data6[0]?.totalTrademark]
            },
            {
                label: TranslateExp(lang, "home.qtyComp"),
                backgroundColor: '#ff1717',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data6[0]?.totalCompanies]
            }
        ]
    };
    
    const state12 = {
        labels: [`${label[2]}`],
        datasets: [
            {
                label: TranslateExp(lang, "home.qtyDrugs"),
                backgroundColor: '#3A7AFE',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 0,
                data: [data12[0]?.totalDrugs]
            },
            {
                label: TranslateExp(lang, "home.qtyMf"),
                backgroundColor: '#6fb61b',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data12[0]?.totalManufacturer]
            },
            {
                label: TranslateExp(lang, "home.qtyDist"),
                backgroundColor: '#db8c00',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data12[0]?.totalDistributor]
            },
            {
                label: TranslateExp(lang, "home.qtyTd"),
                backgroundColor: '#ffe000',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data12[0]?.totalTrademark]
            },
            {
                label: TranslateExp(lang, "home.qtyComp"),
                backgroundColor: '#ff1717',
                borderColor: 'rgba(220,2,0,1)',
                borderWidth: 0,
                data: [data12[0]?.totalCompanies]
            }
        ]
    };

    function setPageContent (e) {
        console.log(123);
        setPage(e);
        setLoadNews(true);
        getNews({
            page: e,
            limit: limit
        }).then(data => {
            setNewsData(data);
            setLoadNews(false);
        });
    };

    const btns = () => {
        const btnsBlock = [];
        for(let i=1; i<=totalPages; i++) {
            btnsBlock.push(<button className={`btn btn-sm mx-1 ${ft.btn__white}`} disabled={(page==i)? true: false} onClick={() => setPageContent(i)}>{i}</button>)
        }
        return btnsBlock;
    };

    return (
        <div className={st.home__page}>

            {loading? <Loading /> :
            <div>
                <div className='my-2'>
                    <h4>{TranslateExp(lang, "home.statistics")}</h4>
                    <hr />
                    <div className={`${st.cards__block} mb-2`}>
                        <div className={st.card}>
                            <div className='w-100 d-flex flex-column justify-content-between'>
                                <h5 className='mb-0 pr-4'>{TranslateExp(lang, "home.qtyDrugs")}</h5>
                                <h3 className={st.numbs}>{NumberToStr(totals?.totalDrugs)}</h3>
                            </div>
                            <div className={st.card__icon} style={{padding: '1px 4px 1px 6px'}}>
                                <i className='fas fa-pills'></i>
                            </div>
                        </div>

                        <div className={st.card}>
                            <div className='w-100 d-flex flex-column justify-content-between'>
                                <h5 className='mb-0 pr-3'>{TranslateExp(lang, "home.qtyMf")}</h5>
                                <h3 className={st.numbs}>{NumberToStr(totals?.totalManufacturers)}</h3>
                            </div>
                            <div className={st.card__icon} style ={{padding: '1px 5px'}}>
                                <i className="fas fa-briefcase"></i>
                            </div>
                        </div>

                        <div className={st.card}>
                            <div className='w-100 d-flex flex-column justify-content-between'>
                                <h5 className='mb-0 pr-3'>{TranslateExp(lang, "home.qtyDist")}</h5>
                                <h3 className={st.numbs}>{NumberToStr(totals?.totalDistributors)}</h3>
                            </div>
                            <div className={st.card__icon} style ={{padding: '1px 6px'}}>
                                <i className="fas fa-address-book"></i>
                            </div>
                        </div>

                        <div className={st.card}>
                            <div className='w-100 d-flex flex-column justify-content-between'>
                                <h5 className='mb-0 pr-3'>{TranslateExp(lang, "home.qtyTd")}</h5>
                                <h3 className={st.numbs}>{NumberToStr(totals?.totalTrademarks)}</h3>
                            </div>
                            <div className={st.card__icon} style ={{padding: '1.1px 3.5px 0'}}>
                                <i className="fas fa-trademark"></i>
                            </div>
                        </div>
                    
                        <div className={st.card}>
                            <div className='w-100 d-flex flex-column justify-content-between'>
                                <h5 className='mb-0 pr-2'>{TranslateExp(lang, "home.qtyComp")}</h5>
                                <h3 className={st.numbs}>{NumberToStr(totals?.TotalCompanies)}</h3>
                            </div>
                            <div className={st.card__icon} style ={{padding: '1px 6px'}}>
                                <i className="fas fa-building"></i>
                            </div>
                        </div>

                    </div>
                </div>
            
                <div className='my-3'>
                    <h4>{TranslateExp(lang, "home.graf")}</h4>
                    <hr />
                    <Tabs defaultActiveKey="3">
                        <Tab eventKey="3" title={TranslateExp(lang, "home.month3")}>
                            <div className={st.static__chart}>
                                <Bar
                                    id = "bar"
                                    data={state3}
                                    options={{
                                        title:{
                                            display:true,
                                            text:`${label[0]}`,
                                            fontSize: 18
                                        },
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true,
                                                }
                                            }]
                                        },
                                        legend:{
                                            display:true,
                                            position:'right'
                                        }
                                    }}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="6" title={TranslateExp(lang, "home.month6")}>
                            <div className={st.static__chart}>
                                <Bar
                                    data={state6}
                                    options={{
                                        title:{
                                            display:true,
                                            text:`${label[1]}`,
                                            fontSize:18
                                        },
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true,
                                                }
                                            }]
                                        },
                                        legend:{
                                            display:true,
                                            position:'right'
                                        }
                                    }}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="12" title={TranslateExp(lang, "home.month12")}>
                            <div className={st.static__chart}>
                                <Bar
                                    data={state12}
                                    options={{
                                        title:{
                                            display:true,
                                            text:`${label[2]}`,
                                            fontSize:18
                                        },
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true,
                                                }
                                            }]
                                        },
                                        legend:{
                                            display:true,
                                            position:'right'
                                        }
                                    }}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            
                <div className={`pb-2 ${loadNews? 'pb-5 mb-5': ''}`}>
                    <h4>{TranslateExp(lang, "home.news")}</h4>
                    <hr />

                    <div className={st.news}>
                        { loadNews? <Loading style={{marginTop: '-30px'}}/> :
                            <div>
                                <div className={st.news__block}>
                                    {
                                        newsData.map((elem,i) =>
                                            <div className={`${st.news__item} my-2`}>
                                                <div className='mb-2'>
                                                    <img 
                                                        className={st.news__img}
                                                        src={imag[i]}
                                                        alt='news'
                                                        width='100%'
                                                    />
                                                </div>
                                                <div>
                                                    <h5 className='mb-1'>{elem.title}</h5>
                                                    <p className='m-0'>{elem.description}</p>
                                                    <p className={`m-0 text-right ${st.news__item__date}`}>{`${elem.updatedAt.slice(11,16)} ${elem.updatedAt.slice(0,10)}`}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className={`${st.news__pagin} my-2`}>
                                    <button className={`btn btn-sm mx-1 ${ft.btn__white}`} onClick={() => setPageContent(page-1)} disabled={(page==1)? true : false}>{TranslateExp(lang, "pagin.prev")}</button>
                                    { btns() }
                                    <button className={`btn btn-sm mx-1 ${ft.btn__white}`} onClick={() => {setPageContent(page+1)}} disabled={(page==totalPages)? true: false}>{TranslateExp(lang, "pagin.next")}</button>
                                    <p className='mt-1'>{TranslateExp(lang, "pagin.page")} {page} {TranslateExp(lang, "pagin.of")} {totalPages}</p>
                                </div>
                            </div>
                        }
                    </div>

                </div>
            </div>
            }
        </div>
    )
}
export default Home;